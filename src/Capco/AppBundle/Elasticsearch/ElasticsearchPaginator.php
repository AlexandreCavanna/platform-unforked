<?php

namespace Capco\AppBundle\Elasticsearch;

use Overblog\GraphQLBundle\Definition\ArgumentInterface;
use Overblog\GraphQLBundle\Relay\Connection\ConnectionInterface;

class ElasticsearchPaginator
{
    public const MODE_REGULAR = false;
    public const MODE_PROMISE = true;

    /** @var callable */
    private $fetcher;

    /** @var bool */
    private $promise;

    /** @var int */
    private $totalCount;

    /** @var ConnectionBuilder */
    private $connectionBuilder;

    /**
     * @param callable                       $fetcher
     * @param bool                           $promise
     * @param ElasticsearchConnectionBuilder $connectionBuilder
     */
    public function __construct(
        callable $fetcher,
        bool $promise = self::MODE_REGULAR,
        ElasticsearchConnectionBuilder $connectionBuilder = null
    ) {
        $this->fetcher = $fetcher;
        $this->promise = $promise;
        $this->connectionBuilder = $connectionBuilder ?: new ElasticsearchConnectionBuilder();
    }

    /**
     * @param ArgumentInterface $args
     * @param int|callable      $total
     * @param array             $callableArgs
     *
     * @return ConnectionInterface|object A connection or a promise
     */
    public function backward(ArgumentInterface $args, $total, array $callableArgs = [])
    {
        $total = $this->computeTotalCount($total, $callableArgs);
        $limit = $args['last'] ?? null;
        $before = $args['before'] ?? null;
        $offset = max(0, $this->connectionBuilder->getOffsetWithDefault($before, $total) - $limit);

        $entities = \call_user_func($this->fetcher, $offset, $limit);

        return $this->handleEntities($entities, function ($entities) use ($args, $offset, $total) {
            return $this->connectionBuilder->connectionFromArraySlice($entities, $args, [
                'sliceStart' => $offset,
                'arrayLength' => $total
            ]);
        });
    }

    /**
     * @param ArgumentInterface $args
     *
     * @return ConnectionInterface|object A connection or a promise
     */
    public function forward(ArgumentInterface $args)
    {
        $limit = $args['first'] ?? null;
        $after = $args['after'] ?? null;
        $cursor = $after;
        $results = \call_user_func($this->fetcher, $cursor, $limit ? $limit + 2 : $limit);

        return $this->handleEntities($results['entities'], function ($entities) use (
            $args,
            $results
        ) {
            return $this->connectionBuilder->connectionFromArraySlice($entities, $args, [
                'sliceStart' => 0,
                'arrayLength' => 0 + \count($results['entities']),
                'cursors' => $results['cursors']
            ]);
        });
    }

    /**
     * @param ArgumentInterface $args
     * @param int|callable      $total
     * @param array             $callableArgs
     *
     * @return ConnectionInterface|object A connection or a promise
     */
    public function auto(ArgumentInterface $args, $total, array $callableArgs = [])
    {
        if (isset($args['last'])) {
            $connection = $this->backward($args, $total, $callableArgs);
        } else {
            $connection = $this->forward($args);
        }

        if ($this->promise) {
            return $connection->then(function (ConnectionInterface $connection) use (
                $total,
                $callableArgs
            ) {
                $connection->setTotalCount($this->computeTotalCount($total, $callableArgs));

                return $connection;
            });
        } else {
            $connection->setTotalCount($this->computeTotalCount($total, $callableArgs));

            return $connection;
        }
    }

    /**
     * @param array|object $entities An array of entities to paginate or a promise
     * @param callable     $callback
     *
     * @return ConnectionInterface|object A connection or a promise
     */
    private function handleEntities($entities, callable $callback)
    {
        if ($this->promise) {
            return $entities->then($callback);
        }

        return \call_user_func($callback, $entities);
    }

    /**
     * @param int|callable $total
     * @param array        $callableArgs
     *
     * @return int|mixed
     */
    private function computeTotalCount($total, array $callableArgs = [])
    {
        if (null !== $this->totalCount) {
            return $this->totalCount;
        }

        $this->totalCount = \is_callable($total)
            ? \call_user_func_array($total, $callableArgs)
            : $total;

        return $this->totalCount;
    }
}
