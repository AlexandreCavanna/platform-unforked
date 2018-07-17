<?php
namespace Capco\AppBundle\GraphQL\__GENERATED__;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Overblog\GraphQLBundle\Definition\ConfigProcessor;
use Overblog\GraphQLBundle\Definition\LazyConfig;
use Overblog\GraphQLBundle\Definition\GlobalVariables;
use Overblog\GraphQLBundle\Definition\Type\GeneratedTypeInterface;

/**
 * THIS FILE WAS GENERATED AND SHOULD NOT BE MODIFIED!
 */
final class UserConnectionType extends ObjectType implements GeneratedTypeInterface
{

    public function __construct(ConfigProcessor $configProcessor, GlobalVariables $globalVariables = null)
    {
        $configLoader = function(GlobalVariables $globalVariable) {
            return [
            'name' => 'UserConnection',
            'description' => 'A connection to a list of items.',
            'fields' => function () use ($globalVariable) {
                return [
                'totalCount' => [
                    'type' => Type::nonNull(Type::int()),
                    'args' => [
                    ],
                    'resolve' => null,
                    'description' => 'Identifies the total count of items in the connection.',
                    'deprecationReason' => null,
                    'complexity' => null,
                    # public and access are custom options managed only by the bundle
                    'public' => null,
                    'access' => null,
                ],
                'anonymousCount' => [
                    'type' => Type::nonNull(Type::int()),
                    'args' => [
                    ],
                    'resolve' => null,
                    'description' => 'Identifies the total count of anonymous items in the connection. (Not fetched from connection)',
                    'deprecationReason' => null,
                    'complexity' => null,
                    # public and access are custom options managed only by the bundle
                    'public' => null,
                    'access' => null,
                ],
                'pageInfo' => [
                    'type' => Type::nonNull($globalVariable->get('typeResolver')->resolve('PageInfo')),
                    'args' => [
                    ],
                    'resolve' => null,
                    'description' => 'Information to aid in pagination.',
                    'deprecationReason' => null,
                    'complexity' => null,
                    # public and access are custom options managed only by the bundle
                    'public' => null,
                    'access' => null,
                ],
                'edges' => [
                    'type' => Type::listOf($globalVariable->get('typeResolver')->resolve('UserEdge')),
                    'args' => [
                    ],
                    'resolve' => null,
                    'description' => 'Information to aid in pagination.',
                    'deprecationReason' => null,
                    'complexity' => null,
                    # public and access are custom options managed only by the bundle
                    'public' => null,
                    'access' => null,
                ],
            ];
            },
            'interfaces' => function () use ($globalVariable) {
                return [];
            },
            'isTypeOf' => null,
            'resolveField' => null,
        ];
        };
        $config = $configProcessor->process(LazyConfig::create($configLoader, $globalVariables))->load();
        parent::__construct($config);
    }
}
