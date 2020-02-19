<?php

namespace Capco\AppBundle\GraphQL\Mutation;

use Capco\AppBundle\Enum\DeleteAccountByEmailErrorCode;
use Capco\AppBundle\GraphQL\DataLoader\Proposal\ProposalAuthorDataLoader;
use Capco\UserBundle\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Capco\UserBundle\Doctrine\UserManager;
use Capco\AppBundle\Helper\RedisStorageHelper;
use Exception;
use GraphQL\Error\UserError;
use Psr\Log\LoggerInterface;
use Sonata\MediaBundle\Provider\ImageProvider;
use Capco\UserBundle\Repository\UserRepository;
use Capco\AppBundle\Repository\UserGroupRepository;
use Overblog\GraphQLBundle\Definition\Argument as Arg;
use Symfony\Component\Translation\TranslatorInterface;

class DeleteAccountByEmailMutation extends BaseDeleteUserMutation
{
    private $userRepository;
    private $logger;

    public function __construct(
        EntityManagerInterface $em,
        TranslatorInterface $translator,
        UserRepository $userRepository,
        UserGroupRepository $groupRepository,
        UserManager $userManager,
        RedisStorageHelper $redisStorageHelper,
        ImageProvider $mediaProvider,
        ProposalAuthorDataLoader $proposalAuthorDataLoader,
        LoggerInterface $logger
    ) {
        parent::__construct(
            $em,
            $mediaProvider,
            $translator,
            $redisStorageHelper,
            $groupRepository,
            $userManager,
            $proposalAuthorDataLoader
        );
        $this->userRepository = $userRepository;
        $this->logger = $logger;
    }

    public function __invoke(Arg $input, User $viewer): array
    {
        $user = $viewer;
        $email = $input->offsetGet('email');

        if (isset($email)) {
            $user = $this->userRepository->findOneByEmail($email);
            if (!$user) {
                return ['errorCode' => DeleteAccountByEmailErrorCode::NON_EXISTING_EMAIL];
            }
            if ($user->hasRole(User::ROLE_SUPER_ADMIN)) {
                return ['errorCode' => DeleteAccountByEmailErrorCode::DELETION_DENIED];
            }
            $email = $user->getEmail();
        }

        try {
            $this->hardDeleteUserContributionsInActiveSteps($user);
        } catch (Exception $e) {
            $this->logger->error($e->getMessage(), ['context' => 'delete_user_account_by_email']);

            throw new UserError("An error occured during user's contributions deletion");
        }
        //in order not to reference dead relationships between entities
        $this->em->refresh($user);

        try {
            $this->anonymizeUser($user);
            $this->em->refresh($user);
            $this->softDelete($user);
            $this->em->flush();
        } catch (Exception $e) {
            $this->logger->error($e->getMessage(), ['context' => 'delete_user_account_by_email']);

            throw new UserError("An error occured during the user's anonymization");
        }

        return ['email' => $email];
    }
}