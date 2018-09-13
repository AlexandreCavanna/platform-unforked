<?php
namespace Capco\AppBundle\GraphQL\__GENERATED__;

use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;
use Overblog\GraphQLBundle\Definition\ConfigProcessor;
use Overblog\GraphQLBundle\Definition\LazyConfig;
use Overblog\GraphQLBundle\Definition\GlobalVariables;
use Overblog\GraphQLBundle\Definition\Type\GeneratedTypeInterface;

/**
 * THIS FILE WAS GENERATED AND SHOULD NOT BE MODIFIED!
 */
final class FollowerOrderType extends InputObjectType implements GeneratedTypeInterface
{

    public function __construct(ConfigProcessor $configProcessor, GlobalVariables $globalVariables = null)
    {
        $configLoader = function(GlobalVariables $globalVariable) {
            return [
            'name' => 'FollowerOrder',
            'description' => 'Ways in which follower connections can be ordered.',
            'fields' => function () use ($globalVariable) {
                return [
                'field' => [
                    'type' => Type::nonNull($globalVariable->get('typeResolver')->resolve('FollowerOrderField')),
                    'description' => 'The field in which to order nodes by.',
                ],
                'direction' => [
                    'type' => Type::nonNull($globalVariable->get('typeResolver')->resolve('OrderDirection')),
                    'description' => 'The direction in which to order nodes.',
                    'defaultValue' => 'ASC',
                ],
            ];
            },
        ];
        };
        $config = $configProcessor->process(LazyConfig::create($configLoader, $globalVariables))->load();
        parent::__construct($config);
    }
}
