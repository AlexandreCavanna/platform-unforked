<?php

namespace Capco\AppBundle\GraphQL\Resolver\Sms;

use Capco\AppBundle\GraphQL\Resolver\Traits\ResolverTrait;
use Capco\AppBundle\Repository\SmsOrderRepository;
use Overblog\GraphQLBundle\Definition\Argument;
use Overblog\GraphQLBundle\Definition\Resolver\ResolverInterface;
use Overblog\GraphQLBundle\Relay\Connection\ConnectionInterface;
use Overblog\GraphQLBundle\Relay\Connection\Paginator;

class SmsOrdersResolver implements ResolverInterface
{
    use ResolverTrait;

    private SmsOrderRepository $repository;

    public function __construct(SmsOrderRepository $repository)
    {
        $this->repository = $repository;
    }

    public function __invoke(Argument $args): ConnectionInterface
    {

        $paginator = new Paginator(function (int $offset, int $limit) {
            return $this->repository->findNotProcessedPaginated(
                $offset,
                $limit,
            );
        });

        return $paginator->auto($args, $this->repository->countAll());
    }
}