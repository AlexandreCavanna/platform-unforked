<?php

namespace Capco\AppBundle\GraphQL\Mutation;

use Capco\AppBundle\Elasticsearch\Indexer;
use Capco\AppBundle\Entity\CommentVote;
use Capco\AppBundle\GraphQL\ConnectionBuilder;
use Capco\AppBundle\GraphQL\Resolver\Traits\MutationTrait;
use Capco\AppBundle\Helper\RedisStorageHelper;
use Capco\AppBundle\Repository\CommentRepository;
use Capco\AppBundle\Repository\CommentVoteRepository;
use Capco\UserBundle\Entity\User;
use Doctrine\Common\Util\ClassUtils;
use Doctrine\DBAL\Exception\DriverException;
use Doctrine\ORM\EntityManagerInterface;
use Overblog\GraphQLBundle\Definition\Argument;
use Overblog\GraphQLBundle\Definition\Resolver\MutationInterface;
use Overblog\GraphQLBundle\Error\UserError;
use Overblog\GraphQLBundle\Relay\Connection\Output\Edge;
use Overblog\GraphQLBundle\Relay\Node\GlobalId;

class AddCommentVoteMutation implements MutationInterface
{
    use MutationTrait;
    private EntityManagerInterface $em;
    private CommentRepository $commentRepo;
    private CommentVoteRepository $commentVoteRepo;
    private RedisStorageHelper $redisStorageHelper;
    private Indexer $indexer;

    public function __construct(
        EntityManagerInterface $em,
        CommentRepository $commentRepo,
        CommentVoteRepository $commentVoteRepo,
        RedisStorageHelper $redisStorageHelper,
        Indexer $indexer
    ) {
        $this->em = $em;
        $this->commentRepo = $commentRepo;
        $this->commentVoteRepo = $commentVoteRepo;
        $this->redisStorageHelper = $redisStorageHelper;
        $this->indexer = $indexer;
    }

    public function __invoke(Argument $input, User $viewer): array
    {
        $this->formatInput($input);
        $contributionId = $input->offsetGet('commentId');
        $comment = $this->commentRepo->find(GlobalId::fromGlobalId($contributionId)['id']);

        if (!$comment) {
            throw new UserError('Unknown comment with id: ' . $contributionId);
        }

        if (!$comment->canVote()) {
            throw new UserError('can not vote for : ' . $contributionId);
        }

        $previousVote = $this->commentVoteRepo->findOneBy([
            'user' => $viewer,
            'comment' => $comment,
        ]);

        if ($previousVote) {
            throw new UserError('Already voted.');
        }

        $vote = (new CommentVote())->setComment($comment)->setUser($viewer);

        try {
            $this->em->persist($vote);
            $this->em->flush();
        } catch (DriverException $e) {
            // Updating comments votes count failed
            throw new UserError($e->getMessage());
        }
        $this->redisStorageHelper->recomputeUserCounters($viewer);
        $this->indexer->index(ClassUtils::getClass($vote), $vote->getId());
        $this->indexer->finishBulk();

        $edge = new Edge(ConnectionBuilder::offsetToCursor(0), $vote);

        return [
            'voteEdge' => $edge,
            'viewer' => $viewer,
        ];
    }
}
