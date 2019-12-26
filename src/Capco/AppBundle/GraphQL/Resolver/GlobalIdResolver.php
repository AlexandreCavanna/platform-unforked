<?php

namespace Capco\AppBundle\GraphQL\Resolver;

use Capco\AppBundle\Repository\ConsultationRepository;
use Capco\AppBundle\Repository\FranceConnectSSOConfigurationRepository;
use Capco\AppBundle\Repository\Oauth2SSOConfigurationRepository;
use Capco\AppBundle\Repository\QuestionChoiceRepository;
use Capco\AppBundle\Repository\SourceRepository;
use Psr\Log\LoggerInterface;
use Capco\AppBundle\Entity\Post;
use Capco\AppBundle\Entity\Event;
use Capco\UserBundle\Entity\User;
use Capco\AppBundle\Entity\Source;
use Capco\AppBundle\Entity\Comment;
use Capco\AppBundle\Entity\Project;
use Capco\AppBundle\Entity\Argument;
use Capco\AppBundle\Entity\Proposal;
use Capco\AppBundle\Entity\ProposalForm;
use Capco\AppBundle\Model\ModerableInterface;
use Capco\AppBundle\Entity\Steps\AbstractStep;
use Capco\AppBundle\Repository\PostRepository;
use Capco\AppBundle\Repository\EventRepository;
use Capco\AppBundle\Repository\GroupRepository;
use Capco\AppBundle\Repository\ReplyRepository;
use Capco\UserBundle\Repository\UserRepository;
use Overblog\GraphQLBundle\Relay\Node\GlobalId;
use Capco\AppBundle\Repository\CommentRepository;
use Capco\AppBundle\Repository\OpinionRepository;
use Capco\AppBundle\Repository\ProjectRepository;
use Capco\AppBundle\Repository\ArgumentRepository;
use Capco\AppBundle\Repository\FollowerRepository;
use Capco\AppBundle\Repository\MapTokenRepository;
use Capco\AppBundle\Repository\ProposalRepository;
use Capco\AppBundle\Repository\CollectStepRepository;
use Capco\AppBundle\Repository\ContactFormRepository;
use Capco\AppBundle\Repository\OpinionTypeRepository;
use Capco\AppBundle\Repository\RequirementRepository;
use Capco\AppBundle\Repository\AbstractStepRepository;
use Capco\AppBundle\Repository\ProposalFormRepository;
use Capco\AppBundle\Repository\QuestionnaireRepository;
use Capco\AppBundle\Repository\SelectionStepRepository;
use Capco\AppBundle\Repository\SynthesisStepRepository;
use Capco\AppBundle\Repository\OpinionVersionRepository;
use Capco\AppBundle\Repository\AbstractQuestionRepository;
use Capco\AppBundle\Repository\ConsultationStepRepository;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class GlobalIdResolver
{
    private $container;
    private $logger;

    public function __construct(ContainerInterface $container, LoggerInterface $logger)
    {
        $this->container = $container;
        $this->logger = $logger;
    }

    public function resolve(string $uuidOrGlobalId, $userOrAnon, ?\ArrayObject $context = null)
    {
        $skipVerification =
            $context &&
            $context->offsetExists('disable_acl') &&
            true === $context->offsetGet('disable_acl');

        $user = null;
        if (empty($uuidOrGlobalId)) {
            return null;
        }

        if ($userOrAnon instanceof User) {
            $user = $userOrAnon;
        }

        if ($user && $user->isAdmin()) {
            $em = $this->container->get('doctrine.orm.default_entity_manager');
            // If user is an admin, we allow to retrieve softdeleted nodes
            if ($em->getFilters()->isEnabled('softdeleted')) {
                $em->getFilters()->disable('softdeleted');
            }
        }

        // We try to decode the global id
        $decodeGlobalId = self::getDecodedId($uuidOrGlobalId);

        if (\is_array($decodeGlobalId)) {
            // Good news, it's a GraphQL Global id !
            $uuid = $decodeGlobalId['id'];
            $node = null;

            switch ($decodeGlobalId['type']) {
                case 'Post':
                    $node = $this->container->get(PostRepository::class)->find($uuid);

                    break;
                case 'Event':
                    $node = $this->container->get(EventRepository::class)->find($uuid);

                    break;
                case 'User':
                    $node = $this->container->get(UserRepository::class)->find($uuid);

                    break;
                case 'Questionnaire':
                    $node = $this->container->get(QuestionnaireRepository::class)->find($uuid);

                    break;
                case 'Consultation':
                    $node = $this->container->get(ConsultationRepository::class)->find($uuid);

                    break;
                case 'ConsultationStep':
                    $node = $this->container->get(ConsultationStepRepository::class)->find($uuid);

                    break;
                case 'MapToken':
                    $node = $this->container->get(MapTokenRepository::class)->find($uuid);

                    break;
                case 'Requirement':
                    $node = $this->container->get(RequirementRepository::class)->find($uuid);

                    break;
                case 'CollectStep':
                    $node = $this->container->get(CollectStepRepository::class)->find($uuid);

                    break;
                case 'SelectionStep':
                    $node = $this->container->get(SelectionStepRepository::class)->find($uuid);

                    break;
                case 'SynthesisStep':
                    $node = $this->container->get(SynthesisStepRepository::class)->find($uuid);

                    break;
                case 'Proposal':
                    $node = $this->container->get(ProposalRepository::class)->find($uuid);

                    break;
                case 'Question':
                    $node = $this->container->get(AbstractQuestionRepository::class)->find($uuid);

                    break;
                case 'QuestionChoice':
                    $node = $this->container->get(QuestionChoiceRepository::class)->find($uuid);

                    break;
                case 'Reply':
                    $node = $this->container->get(ReplyRepository::class)->find($uuid);

                    break;
                case 'ContactForm':
                    $node = $this->container->get(ContactFormRepository::class)->find($uuid);

                    break;
                case 'Project':
                    $node = $this->container->get(ProjectRepository::class)->find($uuid);

                    break;
                case 'Oauth2SSOConfiguration':
                    $node = $this->container
                        ->get(Oauth2SSOConfigurationRepository::class)
                        ->find($uuid);

                    break;
                case 'FranceConnectSSOConfiguration':
                    $node = $this->container
                        ->get(FranceConnectSSOConfigurationRepository::class)
                        ->find($uuid);

                    break;
                case 'Comment':
                    $node = $this->container->get(CommentRepository::class)->find($uuid);

                    break;
                case 'Source':
                    $node = $this->container->get(SourceRepository::class)->find($uuid);

                    break;
                default:
                    break;
            }

            if (!$node) {
                $error = 'Could not resolve node with globalId ' . $uuid;
                $this->logger->warning($error);

                return null;
            }

            return $this->viewerCanSee($node, $user, $skipVerification) ? $node : null;
        }

        // Arf we could not decode, it's a legacy UUID
        $uuid = $uuidOrGlobalId;

        $node = null;
        $node = $this->container->get(OpinionRepository::class)->find($uuid);

        if (!$node) {
            $node = $this->container->get(OpinionVersionRepository::class)->find($uuid);
        }

        if (!$node) {
            $node = $this->container->get(OpinionTypeRepository::class)->find($uuid);
        }

        if (!$node) {
            $node = $this->container->get(GroupRepository::class)->find($uuid);
        }

        if (!$node) {
            $node = $this->container->get(ProposalFormRepository::class)->find($uuid);
        }

        if (!$node) {
            $node = $this->container->get(AbstractStepRepository::class)->find($uuid);
        }

        if (!$node) {
            $node = $this->container->get(ArgumentRepository::class)->find($uuid);
        }

        if (!$node) {
            $node = $this->container->get(FollowerRepository::class)->find($uuid);
        }

        // TODO remove me.
        if (!$node) {
            $node = $this->container->get(ProposalRepository::class)->find($uuid);
        }
        // TODO remove me.
        if (!$node) {
            $node = $this->container->get(AbstractQuestionRepository::class)->find($uuid);
        }
        // TODO remove me.
        if (!$node) {
            $node = $this->container->get(ReplyRepository::class)->find($uuid);
        }

        if (!$node) {
            $error = "Could not resolve node with uuid ${uuid}";
            $this->logger->warning($error);

            return null;
        }

        return $this->viewerCanSee($node, $user, $skipVerification) ? $node : null;
    }

    public static function getDecodedId(string $uuidOrGlobalId)
    {
        // We try to decode the global id
        $decodeGlobalId = GlobalId::fromGlobalId($uuidOrGlobalId);
        if (
            isset($decodeGlobalId['type'], $decodeGlobalId['id']) &&
            null !== $decodeGlobalId['id']
        ) {
            return $decodeGlobalId;
        }

        return $uuidOrGlobalId;
    }

    public function resolveByModerationToken(string $token): ModerableInterface
    {
        $node = $this->container->get(OpinionRepository::class)->findOneByModerationToken($token);

        if (!$node) {
            $node = $this->container
                ->get(OpinionVersionRepository::class)
                ->findOneByModerationToken($token);
        }

        if (!$node) {
            $node = $this->container
                ->get(ArgumentRepository::class)
                ->findOneByModerationToken($token);
        }

        if (!$node) {
            $node = $this->container
                ->get(CommentRepository::class)
                ->findOneByModerationToken($token);
        }

        if (!$node) {
            $node = $this->container
                ->get(ProposalRepository::class)
                ->findOneByModerationToken($token);
        }
        if (!$node) {
            $node = $this->container
                ->get(SourceRepository::class)
                ->findOneByModerationToken($token);
        }

        if (!$node) {
            $this->container
                ->get('logger')
                ->warning(__METHOD__ . ' : Unknown moderation_token: ' . $token);

            throw new NotFoundHttpException();
        }

        return $node;
    }

    private function viewerCanSee($node, User $user = null, bool $skipVerification): bool
    {
        $projectContributionClass = [
            Project::class,
            Proposal::class,
            Comment::class,
            Argument::class,
            Source::class,
            Post::class,
            ProposalForm::class,
            Event::class,
            AbstractStep::class
        ];

        foreach ($projectContributionClass as $object) {
            if ($skipVerification) {
                return true;
            }
            if ($node instanceof Proposal) {
                return $node->viewerCanSee($user);
            }
            if ($node instanceof $object) {
                return $node->canDisplay($user);
            }
        }

        return true;
    }
}
