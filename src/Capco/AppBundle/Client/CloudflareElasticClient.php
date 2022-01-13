<?php

namespace Capco\AppBundle\Client;

use Capco\AppBundle\Enum\PlatformAnalyticsTrafficSourceType;
use Elastica\Aggregation\Cardinality;
use DateTimeInterface;
use Elastica\Aggregation\DateHistogram;
use Elastica\Aggregation\Terms;
use Elastica\Client;
use Elastica\Connection;
use Elastica\Exception\ClientException;
use Elastica\Exception\Connection\HttpException;
use Elastica\Multi\ResultSet;
use Elastica\Query;
use Elastica\Query\Range;
use Elastica\Multi\Search;
use Psr\Log\LoggerInterface;

class CloudflareElasticClient
{
    private Client $esClient;
    private LoggerInterface $logger;
    private string $hostname;
    private string $index;

    public function __construct(
        LoggerInterface $logger,
        string $hostname,
        string $clientId,
        string $username,
        string $password,
        string $environment,
        string $elasticsearchHost
    ) {
        $this->hostname = $hostname;
        $this->logger = $logger;
        $this->esClient = $this->createEsClient(
            $clientId,
            $username,
            $password,
            $environment,
            $elasticsearchHost,
            $logger
        );
    }

    public function getTrafficSourcesAnalyticsResultSet(
        DateTimeInterface $start,
        DateTimeInterface $end,
        ?string $projectSlug = null
    ): ?ResultSet {
        $multisearchQuery = new Search($this->esClient);
        $multisearchQuery->addSearches([
            PlatformAnalyticsTrafficSourceType::SEARCH_ENGINE => $this->createSearchEngineEntriesQuery(
                $start,
                $end,
                $projectSlug
            ),
            PlatformAnalyticsTrafficSourceType::SOCIAL_NETWORK => $this->createSocialNetworksEntriesQuery(
                $start,
                $end,
                $projectSlug
            ),
            PlatformAnalyticsTrafficSourceType::DIRECT => $this->createDirectEntriesQuery(
                $start,
                $end,
                $projectSlug
            ),
            PlatformAnalyticsTrafficSourceType::EXTERNAL_LINK => $this->createExternalEntriesQuery(
                $start,
                $end,
                $projectSlug
            ),
        ]);

        try {
            $searchResult = $multisearchQuery->search();
        } catch (ClientException $clientException) {
            $this->esClient->addConnection(new Connection($this->esClient->getConfig()));
            $searchResult = $multisearchQuery->search();
        } catch (HttpException $exception) {
            $searchResult = null;
            $this->logger->error('Traffic source multi search query timed out.', [
                'project_slug' => $projectSlug,
                'date_interval' => compact($start, $end),
            ]);
        }

        return $searchResult;
    }

    public function getExternalAnalyticsResultSet(
        DateTimeInterface $start,
        DateTimeInterface $end,
        array $requestedFields,
        ?string $projectSlug = null
    ): ?ResultSet {
        $multisearchQuery = new Search($this->esClient);
        $searchQueries = [
            'visitors' => $this->createUniqueVisitorsQuery($start, $end, $projectSlug),
            'pageViews' => $this->createPageViewsQuery($start, $end, $projectSlug),
            'mostVisitedPages' => $this->createMostVisitedPagesQuery($start, $end, $projectSlug),
        ];

        $multisearchQuery->addSearches(
            $this->unsetNonRequestedSearchQueries($searchQueries, $requestedFields)
        );

        try {
            $searchResult = $multisearchQuery->search();
        } catch (ClientException $clientException) {
            $this->esClient->addConnection(new Connection($this->esClient->getConfig()));
            $searchResult = $multisearchQuery->search();
        } catch (HttpException $exception) {
            $searchResult = null;
            $this->logger->error('External analytic multi search query timed out.', [
                'requested_fields' => $requestedFields,
                'project_slug' => $projectSlug,
                'date_interval' => compact($start, $end),
            ]);
        }

        return $searchResult;
    }

    private function createUniqueVisitorsQuery(
        DateTimeInterface $start,
        DateTimeInterface $end,
        ?string $projectSlug = null
    ): \Elastica\Search {
        $boolQuery = new Query\BoolQuery();
        $boolQuery
            ->addFilter(new Query\MatchPhrase('ClientRequestHost', $this->hostname))
            ->addFilter(
                new Range('@timestamp', [
                    'gte' => $start->format(DateTimeInterface::ATOM),
                    'lte' => $end->format(DateTimeInterface::ATOM),
                ])
            );
        foreach ($this->getClientRequestURIFilters() as $filter) {
            $boolQuery->addMustNot($filter);
        }

        $query = new Query($this->filterClientRequestURIByProject($boolQuery, $projectSlug));
        $query
            ->setTrackTotalHits(true)
            ->setSize(0)
            ->addAggregation((new Cardinality('unique_visitors'))->setField('ClientIP.ip'))
            ->addAggregation(
                (new DateHistogram(
                    'visitors_per_interval',
                    '@timestamp',
                    $this->getDateHistogramInterval($start, $end)
                ))->addAggregation(
                    (new Cardinality('unique_visitors_per_interval'))->setField('ClientIP.ip')
                )
            );

        return $this->createSearchQuery($query, $start, $end);
    }

    private function createPageViewsQuery(
        DateTimeInterface $start,
        DateTimeInterface $end,
        ?string $projectSlug = null
    ): \Elastica\Search {
        $boolQuery = new Query\BoolQuery();
        $boolQuery
            ->addFilter(new Query\MatchPhrase('ClientRequestHost', $this->hostname))
            ->addFilter(
                new Range('@timestamp', [
                    'gte' => $start->format(DateTimeInterface::ATOM),
                    'lte' => $end->format(DateTimeInterface::ATOM),
                ])
            );
        foreach ($this->getClientRequestURIFilters() as $filter) {
            $boolQuery->addMustNot($filter);
        }

        $query = new Query($this->filterClientRequestURIByProject($boolQuery, $projectSlug));
        $query
            ->setTrackTotalHits(true)
            ->setSize(0)
            ->addAggregation(
                new DateHistogram(
                    'page_view_per_interval',
                    '@timestamp',
                    $this->getDateHistogramInterval($start, $end)
                )
            );

        return $this->createSearchQuery($query, $start, $end);
    }

    private function createMostVisitedPagesQuery(
        DateTimeInterface $start,
        DateTimeInterface $end,
        ?string $projectSlug = null
    ): \Elastica\Search {
        $boolQuery = new Query\BoolQuery();
        $boolQuery
            ->addFilter(
                new Range('@timestamp', [
                    'gte' => $start->format(DateTimeInterface::ATOM),
                    'lte' => $end->format(DateTimeInterface::ATOM),
                ])
            )
            ->addFilter(new Query\MatchPhrase('ClientRequestHost', $this->hostname));
        foreach ($this->getClientRequestURIFilters() as $filter) {
            $boolQuery->addMustNot($filter);
        }

        $query = new Query($this->filterClientRequestURIByProject($boolQuery, $projectSlug));
        $query
            ->setTrackTotalHits(true)
            ->setSize(0)
            ->addAggregation(
                (new Terms('most_seen_pages'))
                    ->setScript(
                        "def indexOfQP = _value.indexOf('?'); if (indexOfQP > 0) { return _value.substring(0, indexOfQP); } return _value;"
                    )
                    ->setField('ClientRequestURI.keyword')
                    ->setOrder('_count', 'desc')
                    ->setSize(10)
            );

        return $this->createSearchQuery($query, $start, $end);
    }

    private function createSearchEngineEntriesQuery(
        DateTimeInterface $start,
        DateTimeInterface $end,
        ?string $projectSlug = null
    ): \Elastica\Search {
        $boolQuery = new Query\BoolQuery();
        $boolQuery
            ->addFilter(
                (new Query\BoolQuery())
                    ->addShould(
                        (new Query\BoolQuery())
                            ->addFilter(new Query\Exists('ClientRequestReferer'))
                            ->addFilter(
                                new Query\Regexp(
                                    'ClientRequestReferer.keyword',
                                    '(http|https)(://|://www.)(bing|qwant|google|ecosia|duckduckgo).*'
                                )
                            )
                    )
                    ->addShould(
                        (new Query\BoolQuery())
                            ->addFilter(new Query\Exists('ClientIPClass'))
                            ->addFilter(new Query\Term(['ClientIPClass' => 'searchEngine']))
                    )
            )
            ->addFilter(
                new Range('@timestamp', [
                    'gte' => $start->format(DateTimeInterface::ATOM),
                    'lte' => $end->format(DateTimeInterface::ATOM),
                ])
            )
            ->addFilter(new Query\MatchPhrase('ClientRequestHost', $this->hostname));

        foreach ($this->getClientRequestURIFilters() as $filter) {
            $boolQuery->addMustNot($filter);
        }
        foreach ($this->getSocialNetworksURIPatternFilter() as $filter) {
            $boolQuery->addMustNot($filter);
        }

        $query = new Query($this->filterClientRequestURIByProject($boolQuery, $projectSlug));
        $query
            ->addAggregation((new Cardinality('search_engine_entries'))->setField('ClientIP.ip'))
            ->setSize(0)
            ->setTrackTotalHits(true);

        return $this->createSearchQuery($query, $start, $end);
    }

    private function createSocialNetworksEntriesQuery(
        DateTimeInterface $start,
        DateTimeInterface $end,
        ?string $projectSlug = null
    ): \Elastica\Search {
        $subBoolQuery = new Query\BoolQuery();
        foreach ($this->getSocialNetworksURIPatternFilter() as $filter) {
            $subBoolQuery->addShould($filter);
        }
        $boolQuery = new Query\BoolQuery();
        $boolQuery
            ->addFilter(
                new Range('@timestamp', [
                    'gte' => $start->format(DateTimeInterface::ATOM),
                    'lte' => $end->format(DateTimeInterface::ATOM),
                ])
            )
            ->addFilter(
                $subBoolQuery->addShould(
                    (new Query\BoolQuery())
                        ->addFilter(new Query\Exists('ClientRequestReferer'))
                        ->addFilter(
                            new Query\Regexp(
                                'ClientRequestReferer.keyword',
                                '(http|https)(://|://www.)(instagram|linkedin|twitter|facebook).(fr|com|uk|ca).*'
                            )
                        )
                )
            )
            ->addFilter(new Query\MatchPhrase('ClientRequestHost', $this->hostname));

        $query = new Query($this->filterClientRequestURIByProject($boolQuery, $projectSlug));
        $query->setSize(0)->setTrackTotalHits(true);

        return $this->createSearchQuery($query, $start, $end);
    }

    private function createDirectEntriesQuery(
        DateTimeInterface $start,
        DateTimeInterface $end,
        ?string $projectSlug = null
    ): \Elastica\Search {
        $boolQuery = new Query\BoolQuery();
        $boolQuery
            ->addFilter(
                new Range('@timestamp', [
                    'gte' => $start->format(DateTimeInterface::ATOM),
                    'lte' => $end->format(DateTimeInterface::ATOM),
                ])
            )
            ->addFilter(new Query\MatchPhrase('ClientRequestHost', $this->hostname))
            ->addMustNot(new Query\Exists('ClientRequestReferer'));

        foreach ($this->getClientRequestURIFilters() as $filter) {
            $boolQuery->addMustNot($filter);
        }
        foreach ($this->getSocialNetworksURIPatternFilter() as $filter) {
            $boolQuery->addMustNot($filter);
        }

        $query = new Query($this->filterClientRequestURIByProject($boolQuery, $projectSlug));
        $query->setSize(0)->setTrackTotalHits(true);

        return $this->createSearchQuery($query, $start, $end);
    }

    private function createExternalEntriesQuery(
        DateTimeInterface $start,
        DateTimeInterface $end,
        ?string $projectSlug = null
    ): \Elastica\Search {
        $boolQuery = new Query\BoolQuery();
        $boolQuery
            ->addFilter(
                new Range('@timestamp', [
                    'gte' => $start->format(DateTimeInterface::ATOM),
                    'lte' => $end->format(DateTimeInterface::ATOM),
                ])
            )
            ->addFilter(new Query\Exists('ClientRequestReferer'))
            ->addMustNot(
                new Query\Regexp(
                    'ClientRequestReferer.keyword',
                    '(http|https)(://|://www.)(instagram|linkedin|twitter|facebook).(fr|com|uk|ca).*'
                )
            )
            ->addMustNot(
                new Query\Regexp(
                    'ClientRequestReferer.keyword',
                    '(http|https)(://|://www.)(bing|qwant|google|ecosia|duckduckgo).*'
                )
            )
            ->addFilter(new Query\MatchPhrase('ClientRequestHost', $this->hostname));

        foreach ($this->getClientRequestURIFilters() as $filter) {
            $boolQuery->addMustNot($filter);
        }

        $query = new Query($this->filterClientRequestURIByProject($boolQuery, $projectSlug));
        $query->setSize(0)->setTrackTotalHits(true);

        return $this->createSearchQuery($query, $start, $end);
    }

    private function filterClientRequestURIByProject(
        Query\BoolQuery $boolQuery,
        ?string $projectSlug = null
    ): Query\BoolQuery {
        if ($projectSlug) {
            $boolQuery->addFilter(
                new Query\Wildcard('ClientRequestURI.keyword', '*' . $projectSlug . '*')
            );
        }

        return $boolQuery;
    }

    /**
     * Provide a list of queries to filter with the client
     * request URI to avoid getting useless logs in analytics.
     */
    private function getClientRequestURIFilters(): array
    {
        return [
            new Query\Prefix(['ClientRequestURI.keyword' => '/graphql']),
            new Query\Prefix(['ClientRequestURI.keyword' => '/admin']),
            new Query\Prefix(['ClientRequestURI.keyword' => '/sso']),
            new Query\Prefix(['ClientRequestURI.keyword' => '/cdn-cgi']),
            new Query\Prefix(['ClientRequestURI.keyword' => '/widget_debate']),
            new Query\Prefix(['ClientRequestURI.keyword' => '/login_check']),
            new Query\Prefix(['ClientRequestURI.keyword' => '/logout']),
            new Query\Wildcard('ClientRequestURI.keyword', '/*.*'),
            // Cloudflare provide a ClientIPClass field that match a certain type of third party service
            // with the IP value, we use it to exclude useless entries.
            (new Query\BoolQuery())
                ->addShould(
                    (new Query\BoolQuery())
                        ->addFilter(new Query\Exists('ClientIPClass'))
                        ->addFilter(new Query\Term(['ClientIPClass' => 'monitoringService']))
                )
                ->addShould($this->getUpTimeRobotIPFilterQuery()),
        ];
    }

    /**
     * Return a new Bool query with filter on the list of
     * the main ip range provided by UpTimeRobot.
     */
    private function getUpTimeRobotIPFilterQuery(): Query\BoolQuery
    {
        return (new Query\BoolQuery())
            ->addShould(
                (new Query\BoolQuery())->addFilter(
                    new Range('ClientIP.ip', [
                        'gte' => '69.162.124.226',
                        'lte' => '69.162.124.237',
                    ])
                )
            )
            ->addShould(
                (new Query\BoolQuery())->addFilter(
                    new Range('ClientIP.ip', [
                        'gte' => '63.143.42.242',
                        'lte' => '63.143.42.253',
                    ])
                )
            )
            ->addShould(
                (new Query\BoolQuery())->addFilter(
                    new Range('ClientIP.ip', [
                        'gte' => '216.245.221.82',
                        'lte' => '216.245.221.93',
                    ])
                )
            )
            ->addShould(
                (new Query\BoolQuery())->addFilter(
                    new Range('ClientIP.ip', [
                        'gte' => '208.115.199.18',
                        'lte' => '208.115.199.30',
                    ])
                )
            );
    }

    private function createEsClient(
        string $clientId,
        string $username,
        string $password,
        string $environment,
        string $elasticsearchHost,
        LoggerInterface $logger
    ): Client {
        $devOrTest = \in_array($environment, ['dev', 'test'], true);
        $this->index = $devOrTest ? 'analytics_test' : 'cloudflare-*';
        $cloudUrl = explode('$', base64_decode(explode(':', $clientId)[1]));
        $formattedUrl = $cloudUrl[1] . '.' . $cloudUrl[0];

        return new Client(
            [
                'host' => $devOrTest ? $elasticsearchHost : $formattedUrl,
                'port' => $devOrTest ? '9200' : '9243',
                'username' => $username,
                'password' => $password,
                'transport' => $devOrTest ? 'http' : 'https',
                'connect_timeout' => '5s',
                'log' => true,
                'persistent' => false,
            ],
            null,
            $logger
        );
    }

    /**
     * Redefine the pitch of the date histogram to years if the difference
     * between its start date and its end date is greater than 1 year.
     *
     * It avoid getting too much data on a low pitch.
     */
    private function getDateHistogramInterval(
        DateTimeInterface $start,
        DateTimeInterface $end
    ): string {
        $daysDiff = $start->diff($end)->days;
        $dateHistogramInterval = 'day';
        if ($daysDiff > 365) {
            $dateHistogramInterval = 'month';
        }

        return $dateHistogramInterval;
    }

    private function createSearchQuery(
        Query $query,
        DateTimeInterface $start,
        DateTimeInterface $end
    ): \Elastica\Search {
        return (new \Elastica\Search($this->esClient))
            ->setQuery($query)
            ->addIndices($this->getIndexRange($start, $end));
    }

    /**
     * Provide a list of queries to filter with the client
     * request URI to get entries from social networks.
     */
    private function getSocialNetworksURIPatternFilter(): array
    {
        return [
            new Query\Wildcard(
                'ClientRequestURI.keyword',
                '*source_utm=facebook-instagram-messenger*'
            ),
            new Query\Wildcard('ClientRequestURI.keyword', '*fbclid*'),
        ];
    }

    private function getIndexRange(DateTimeInterface $start, DateTimeInterface $end): array
    {
        $startYear = $start->format('Y');
        $endYear = $end->format('Y');
        if ('cloudflare-*' === $this->index) {
            if ($startYear !== $endYear) {
                return ['cloudflare-' . $startYear . '-*', 'cloudflare-' . $endYear . '-*'];
            }

            return ['cloudflare-' . $startYear . '-*'];
        }

        return [$this->index];
    }

    private function unsetNonRequestedSearchQueries(
        array $searchQueries,
        array $requestedFields
    ): array {
        // We unset the non-requested fields before starting the request.
        $requestedFieldsDiff = array_diff(array_keys($searchQueries), $requestedFields);
        if (!empty($requestedFieldsDiff)) {
            foreach ($requestedFieldsDiff as $field) {
                unset($searchQueries[$field]);
            }
        }

        return $searchQueries;
    }
}
