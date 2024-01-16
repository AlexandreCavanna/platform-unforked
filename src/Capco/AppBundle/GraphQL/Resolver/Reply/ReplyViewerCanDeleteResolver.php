<?php

namespace Capco\AppBundle\GraphQL\Resolver\Reply;

use Capco\AppBundle\Entity\Reply;
use Capco\AppBundle\GraphQL\Resolver\Traits\ResolverTrait;
use Overblog\GraphQLBundle\Definition\Resolver\QueryInterface;

class ReplyViewerCanDeleteResolver implements QueryInterface
{
    use ResolverTrait;

    public function __invoke(Reply $reply, $viewer): bool
    {
        $viewer = $this->preventNullableViewer($viewer);

        return $reply->getAuthor() === $viewer
            && $reply->getQuestionnaire()->canContribute($viewer);
    }
}
