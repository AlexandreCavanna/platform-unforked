<?php

namespace Capco\AppBundle\GraphQL\Resolver\Consultation;

use Capco\AppBundle\Entity\Consultation;
use Capco\AppBundle\Search\UserSearch;
use Overblog\GraphQLBundle\Definition\Argument as Arg;
use Overblog\GraphQLBundle\Definition\Resolver\ResolverInterface;
use Overblog\GraphQLBundle\Relay\Connection\ConnectionInterface;
use Overblog\GraphQLBundle\Relay\Connection\Paginator;
use Psr\Log\LoggerInterface;

class ConsultationContributorsResolver implements ResolverInterface
{
    private $userSearch;
    private $logger;

    public function __construct(
        UserSearch $userSearch,
        LoggerInterface $logger
    ) {
        $this->userSearch = $userSearch;
        $this->logger = $logger;
    }

    public function __invoke(Consultation $consultation, Arg $args): ConnectionInterface
    {
        $totalCount = 0;

        $paginator = new Paginator(function (int $offset, int $limit) use (
            &$totalCount,
            $consultation
        ) {
            try {
                $value = $this->userSearch->getContributorsByConsultation(
                    $consultation,
                    $offset,
                    $limit
                );
                $contributors = $value['results'];
                $totalCount = $value['totalCount'];

                return $contributors;
            } catch (\RuntimeException $exception) {
                $this->logger->error(__METHOD__ . ' : ' . $exception->getMessage());

                throw new \RuntimeException('Find contributors failed.');
            }
        });

        $connection = $paginator->auto($args, $totalCount);
        $connection->setTotalCount($totalCount);

        return $connection;
    }
}