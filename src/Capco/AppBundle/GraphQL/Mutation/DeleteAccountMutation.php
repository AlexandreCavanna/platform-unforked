<?php

namespace Capco\AppBundle\GraphQL\Mutation;

use Capco\AppBundle\Entity\Event;
use Capco\AppBundle\Entity\Reply;
use Capco\AppBundle\Enum\DeleteAccountType;
use Capco\AppBundle\EventListener\SoftDeleteEventListener;
use Capco\AppBundle\GraphQL\DataLoader\Proposal\ProposalAuthorDataLoader;
use Capco\UserBundle\Entity\User;
use Capco\AppBundle\Entity\Source;
use Capco\AppBundle\Entity\Comment;
use Capco\AppBundle\Entity\Opinion;
use Capco\MediaBundle\Entity\Media;
use Capco\AppBundle\Entity\Argument;
use Capco\AppBundle\Entity\Proposal;
use Capco\AppBundle\Entity\Reporting;
use Capco\AppBundle\Entity\CommentVote;
use Capco\AppBundle\Entity\AbstractVote;
use Doctrine\ORM\EntityManagerInterface;
use Capco\UserBundle\Doctrine\UserManager;
use Overblog\GraphQLBundle\Error\UserError;
use Capco\AppBundle\Helper\RedisStorageHelper;
use Sonata\MediaBundle\Provider\ImageProvider;
use Capco\UserBundle\Repository\UserRepository;
use Overblog\GraphQLBundle\Relay\Node\GlobalId;
use Capco\AppBundle\Entity\NewsletterSubscription;
use Capco\AppBundle\Repository\UserGroupRepository;
use Overblog\GraphQLBundle\Definition\Argument as Arg;
use Symfony\Component\Process\Process;
use Symfony\Component\Translation\TranslatorInterface;
use Overblog\GraphQLBundle\Definition\Resolver\MutationInterface;

class DeleteAccountMutation implements MutationInterface
{
    private $em;
    private $translator;
    private $userRepository;
    private $groupRepository;
    private $userManager;
    private $redisStorageHelper;
    private $mediaProvider;
    private $proposalAuthorDataLoader;
    private $originalEventListeners = [];

    public function __construct(
        EntityManagerInterface $em,
        TranslatorInterface $translator,
        UserRepository $userRepository,
        UserGroupRepository $groupRepository,
        UserManager $userManager,
        RedisStorageHelper $redisStorageHelper,
        ImageProvider $mediaProvider,
        ProposalAuthorDataLoader $proposalAuthorDataLoader
    ) {
        $this->em = $em;
        $this->translator = $translator;
        $this->userRepository = $userRepository;
        $this->groupRepository = $groupRepository;
        $this->userManager = $userManager;
        $this->redisStorageHelper = $redisStorageHelper;
        $this->mediaProvider = $mediaProvider;
        $this->proposalAuthorDataLoader = $proposalAuthorDataLoader;
    }

    public function __invoke(Arg $input, User $viewer): array
    {
        $deleteType = $input['type'];
        $user = $viewer;

        if ($viewer->isSuperAdmin() && isset($input['userId'])) {
            $userId = GlobalId::fromGlobalId($input['userId'])['id'];
            $user = $this->userRepository->find($userId);
            if (!$user) {
                throw new UserError('Can not find this userId !');
            }
        }
        if (DeleteAccountType::HARD === $deleteType && $user) {
            $this->hardDeleteUserContributionsInActiveSteps($user);
            //in order not to reference dead relationships between entities
            $this->em->refresh($user);
        }
        $this->anonymizeUser($user);
        $this->em->refresh($user);
        $this->softDelete($user);

        $this->em->flush();
        new Process('bin/console capco:compute:counters --force');

        return ['userId' => GlobalId::toGlobalId('User', $user->getId())];
    }

    public function anonymizeUser(User $user): void
    {
        $usernameDeleted = $this->translator->trans('deleted-user', [], 'CapcoAppBundle');
        $newsletter = $this->em->getRepository(NewsletterSubscription::class)->findOneBy([
            'email' => $user->getEmail()
        ]);
        $userGroups = $this->groupRepository->findBy(['user' => $user]);

        if ($newsletter) {
            $this->em->remove($newsletter);
        }

        if ($userGroups) {
            foreach ($userGroups as $userGroup) {
                $this->em->remove($userGroup);
            }
        }

        $user->setEmail(null);
        $user->setEmailCanonical(null);
        $user->setUsername($usernameDeleted);
        $user->setDeletedAccountAt(new \DateTime());
        $user->setPlainPassword(null);
        $user->clearLastLogin();

        $user->setFacebookId(null);
        $user->setFacebookUrl(null);
        $user->setFacebookData(null);
        $user->setFacebookName(null);
        $user->setFacebookAccessToken(null);

        $user->setTwitterId(null);
        $user->setTwitterUrl(null);
        $user->setTwitterData(null);
        $user->setTwitterName(null);
        $user->setTwitterAccessToken(null);

        $user->setGoogleId(null);
        $user->setGplusData(null);
        $user->setGplusName(null);
        $user->setGoogleAccessToken(null);
        $user->setGplusData(null);

        $user->setAddress(null);
        $user->setAddress2(null);
        $user->setZipCode(null);
        $user->setNeighborhood(null);
        $user->setPhone(null);
        $user->setCity(null);
        $user->setBiography(null);
        $user->setDateOfBirth(null);
        $user->setFirstname(null);
        $user->setLastname(null);
        $user->setWebsite(null);
        $user->setGender(null);
        $user->setLocale(null);
        $user->setTimezone(null);
        $user->setLocked(true);
        if ($user->getMedia()) {
            $this->removeContributionMedia($user);
        }

        $contributions = $user->getContributions();
        foreach ($contributions as $contribution) {
            if ($contribution instanceof Proposal) {
                $this->proposalAuthorDataLoader->invalidate($contribution);
            }
        }

        $this->userManager->updateUser($user);
    }

    public function hardDeleteUserContributionsInActiveSteps(User $user, bool $dryRun = false): int
    {
        // Disable the built-in softdelete
        $filters = $this->em->getFilters();
        if ($filters->isEnabled('softdeleted')) {
            $filters->disable('softdeleted');
        }
        $this->disableListeners();

        $deletedBodyText = $this->translator->trans(
            'deleted-content-by-author',
            [],
            'CapcoAppBundle'
        );
        $contributions = $user->getContributions();
        $toDeleteList = [];

        foreach ($contributions as $contribution) {
            if ($contribution instanceof AbstractVote) {
                if ($contribution instanceof CommentVote) {
                    $toDeleteList[] = $contribution;
                } elseif (
                    method_exists($contribution->getRelated(), 'getStep') &&
                    $contribution->getRelated() &&
                    $contribution
                        ->getRelated()
                        ->getStep()
                        ->canContribute($user)
                ) {
                    $toDeleteList[] = $contribution;
                }
            }

            if ($contribution instanceof Comment) {
                $hasChild = $this->em->getRepository('CapcoAppBundle:Comment')->findOneBy([
                    'parent' => $contribution->getId()
                ]);
                if ($hasChild) {
                    $contribution->setBody($deletedBodyText);
                } else {
                    $toDeleteList[] = $contribution;
                }
            }
            if (
                ($contribution instanceof Proposal ||
                    $contribution instanceof Opinion ||
                    $contribution instanceof Source ||
                    $contribution instanceof Argument) &&
                $contribution->getStep() &&
                $contribution->getStep()->canContribute($user)
            ) {
                $toDeleteList[] = $contribution;
            }

            if (!$dryRun && method_exists($contribution, 'getMedia') && $contribution->getMedia()) {
                $this->removeContributionMedia($contribution);
            }
        }

        $count = \count($toDeleteList);
        if (!$dryRun) {
            foreach ($toDeleteList as $toDelete) {
                $this->em->remove($toDelete);
            }
        }
        $this->em->flush();
        $this->enableListeners();

        $this->redisStorageHelper->recomputeUserCounters($user);

        return $count;
    }

    public function removeMedia(Media $media): void
    {
        $this->mediaProvider->removeThumbnails($media);
        $this->em->remove($media);
    }

    private function disableListeners(): void
    {
        foreach ($this->em->getEventManager()->getListeners() as $eventName => $listeners) {
            foreach ($listeners as $listener) {
                if ($listener instanceof SoftDeleteEventListener) {
                    // store the event listener, that gets removed
                    $this->originalEventListeners[$eventName] = $listener;

                    // remove the SoftDeletableSubscriber event listener
                    $this->em->getEventManager()->removeEventListener($eventName, $listener);
                }
            }
        }
    }

    private function enableListeners(): void
    {
        foreach ($this->originalEventListeners as $eventName => $listener) {
            $this->em->getEventManager()->addEventListener($eventName, $listener);
        }
    }

    private function removeContributionMedia($contribution)
    {
        $media = $this->em
            ->getRepository('CapcoMediaBundle:Media')
            ->find($contribution->getMedia()->getId());
        $this->removeMedia($media);
        $contribution->setMedia(null);
    }

    private function softDelete(User $user): void
    {
        $contributions = $user->getContributions();
        $deletedBodyText = $this->translator->trans(
            'deleted-content-by-author',
            [],
            'CapcoAppBundle'
        );
        $deletedTitleText = $this->translator->trans('deleted-title', [], 'CapcoAppBundle');

        $reports = $this->em->getRepository(Reporting::class)->findBy(['Reporter' => $user]);
        $events = $this->em->getRepository(Event::class)->findBy(['author' => $user]);

        foreach ($contributions as $contribution) {
            if (method_exists($contribution, 'setTitle')) {
                $contribution->setTitle($deletedTitleText);
            }
            if (method_exists($contribution, 'setBody')) {
                $contribution->setBody($deletedBodyText);
            }
            if (method_exists($contribution, 'setSummary')) {
                $contribution->setSummary(null);
            }
            if (method_exists($contribution, 'getMedia') && $contribution->getMedia()) {
                $this->removeContributionMedia($contribution);
            }
            if ($contribution instanceof Proposal) {
                $this->deleteResponsesContent($contribution, $deletedBodyText);
                $contribution->setAddress(null);
                $contribution->setEstimation(null);
                $contribution->setCategory(null);
                $contribution->setTheme(null);
                $contribution->setDistrict(null);
            }
        }

        foreach ($reports as $report) {
            $report->setBody($deletedBodyText);
        }

        foreach ($events as $event) {
            $this->em->remove($event);
        }

        $this->redisStorageHelper->recomputeUserCounters($user);
    }

    private function deleteResponsesContent(Proposal $proposal, string $deletedBodyText): void
    {
        $valueResponses = $this->em
            ->getRepository('CapcoAppBundle:Responses\ValueResponse')
            ->findBy(['proposal' => $proposal]);
        $mediaResponses = $this->em
            ->getRepository('CapcoAppBundle:Responses\MediaResponse')
            ->findBy(['proposal' => $proposal]);
        /** @var Reply $reply */
        foreach ($valueResponses as $reply) {
            $reply->setValue($deletedBodyText);
        }
        foreach ($mediaResponses as $response) {
            $response->getMedias()->clear();
        }
        foreach ($mediaResponses as $response) {
            $medias = $response->getMedias();
            foreach ($medias as $media) {
                $this->removeMedia($media);
            }
        }
    }
}
