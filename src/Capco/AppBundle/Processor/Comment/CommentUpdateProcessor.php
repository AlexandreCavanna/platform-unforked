<?php

namespace Capco\AppBundle\Processor\Proposal;

use Capco\AppBundle\Manager\Notify;
use Capco\AppBundle\Repository\CommentRepository;
use Swarrot\Broker\Message;
use Swarrot\Processor\ProcessorInterface;

class CommentUpdateProcessor implements ProcessorInterface
{
    private $commentRepository;
    private $notifier;

    public function __construct(CommentRepository $commentRepository, Notify $notifier)
    {
        $this->commentRepository = $commentRepository;
        $this->notifier = $notifier;
    }

    public function process(Message $message, array $options)
    {
        $json = json_decode($message->getBody(), true);
        $comment = $this->commentRepository->find($json['commentId']);
        $this->notifier->notifyComment($comment, 'update');

        return true;
    }
}
