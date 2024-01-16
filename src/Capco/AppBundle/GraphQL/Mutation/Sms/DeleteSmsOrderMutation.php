<?php

namespace Capco\AppBundle\GraphQL\Mutation\Sms;

use Capco\AppBundle\GraphQL\Resolver\GlobalIdResolver;
use Capco\AppBundle\GraphQL\Resolver\Traits\MutationTrait;
use Capco\UserBundle\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Overblog\GraphQLBundle\Definition\Argument;
use Overblog\GraphQLBundle\Definition\Resolver\MutationInterface;

class DeleteSmsOrderMutation implements MutationInterface
{
    use MutationTrait;

    public const SMS_ORDER_NOT_FOUND = 'SMS_ORDER_NOT_FOUND';

    private EntityManagerInterface $em;
    private GlobalIdResolver $globalIdResolver;

    public function __construct(EntityManagerInterface $em, GlobalIdResolver $globalIdResolver)
    {
        $this->em = $em;
        $this->globalIdResolver = $globalIdResolver;
    }

    public function __invoke(Argument $input, User $viewer): array
    {
        $this->formatInput($input);
        $id = $input->offsetGet('id');

        $smsOrder = $this->globalIdResolver->resolve($id, $viewer);

        if (!$smsOrder) {
            return ['errorCode' => self::SMS_ORDER_NOT_FOUND, 'deletedSmsOrderId' => $id];
        }

        $this->em->remove($smsOrder);
        $this->em->flush();

        return ['errorCode' => null, 'deletedSmsOrderId' => $id];
    }
}
