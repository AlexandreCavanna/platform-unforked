<?php

namespace Capco\AppBundle\GraphQL\Resolver\Query\APIEnterprise;

use Capco\AppBundle\Cache\RedisCache;
use Exception;
use RuntimeException;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

class APIEnterpriseAutoCompleteUtils
{
    public const TIMEOUT = 15;
    private $cache;

    public const HEADERS = [
        'Content-Type' => 'application/json'
    ];

    public const BODY = [
        'context' => 'aides publiques',
        'recipient' => '23750007900312',
        'object' => 'budgetparticipatif'
    ];

    public function __construct(RedisCache $cache)
    {
        $this->cache = $cache;
    }

    public function accessRequestObjectSafely(?ResponseInterface $request): ?array
    {
        if (!isset($request)) {
            return null;
        }
        try {
            return $request->toArray();
        } catch (\Exception $e) {
            return null;
        }
    }

    public function makeGetRequest(HttpClientInterface $client, string $url): ?ResponseInterface
    {
        try {
            return $client->request('GET', $url, [
                'headers' => self::HEADERS,
                'query' => self::BODY,
                'timeout' => self::TIMEOUT
            ]);
        } catch (RuntimeException $e) {
            return null;
        }
    }

    public function formatAddressFromJSON(array $jsonAddress): string{
        $name = isset($jsonAddress['l1']) ? $jsonAddress['l1'] . ' ' : '';
        $street = isset($jsonAddress['l4']) ? $jsonAddress['l4'] . ' ' : '';
        $postalCode = isset($jsonAddress['l6']) ? $jsonAddress['l6'] . ' ' : '';
        $country = $jsonAddress['l7'] ?? '';
        return $name . $street . $postalCode . $country;
    }

    public function saveInCache(string $key, array $data, int $duration = RedisCache::ONE_DAY): void
    {
        $cachedItem = $this->cache->getItem($key);
        $cachedItem->set($data)->expiresAfter($duration);
        $this->cache->save($cachedItem);
    }
}