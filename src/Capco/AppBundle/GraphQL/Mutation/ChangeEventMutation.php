<?php

namespace Capco\AppBundle\GraphQL\Mutation;

use Capco\AppBundle\Elasticsearch\Indexer;
use Capco\AppBundle\Entity\EventReview;
use Capco\AppBundle\DBAL\Enum\EventReviewStatusType;
use Capco\AppBundle\Security\EventVoter;
use Psr\Log\LoggerInterface;
use Capco\AppBundle\Entity\Event;
use Capco\UserBundle\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Capco\AppBundle\GraphQL\Resolver\GlobalIdResolver;
use Overblog\GraphQLBundle\Definition\Argument as Arg;
use Overblog\GraphQLBundle\Definition\Resolver\MutationInterface;
use Swarrot\Broker\Message;
use Swarrot\SwarrotBundle\Broker\Publisher;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class ChangeEventMutation implements MutationInterface
{
    private $em;
    private $globalIdResolver;
    private $formFactory;
    private $logger;
    private $indexer;
    private $publisher;
    private $authorizationChecker;

    public function __construct(
        GlobalIdResolver $globalIdResolver,
        EntityManagerInterface $em,
        FormFactoryInterface $formFactory,
        LoggerInterface $logger,
        Indexer $indexer,
        Publisher $publisher,
        AuthorizationCheckerInterface $authorizationChecker
    ) {
        $this->globalIdResolver = $globalIdResolver;
        $this->em = $em;
        $this->formFactory = $formFactory;
        $this->logger = $logger;
        $this->indexer = $indexer;
        $this->publisher = $publisher;
        $this->authorizationChecker = $authorizationChecker;
    }

    public function __invoke(Arg $input, User $viewer): array
    {
        $values = $input->getArrayCopy();


        if (isset($values['customCode']) && !empty($values['customCode']) && !$viewer->isAdmin()) {
            return [
                'event' => null,
                'userErrors' => [['message' => 'You are not authorized to add customCode field.']],
            ];
        }

        /** @var Event $event */
        $event = $this->globalIdResolver->resolve($values['id'], $viewer);
        if (!$event) {
            return [
                'event' => null,
                'userErrors' => [['message' => 'Could not find your event.']],
            ];
        }

        if (!$this->authorizationChecker->isGranted(EventVoter::EDIT, $event)) {
            return [
                'event' => null,
                'userErrors' => [['message' => 'Access denied']],
            ];
        }

        unset($values['id']);
        /** @var User $newAuthor */
        $newAuthor = isset($values['author'])
            ? $this->globalIdResolver->resolve($values['author'], $viewer)
            : null;

        // admin and superAdmin can change the event's author
        if ($newAuthor && $viewer->isAdmin() && $newAuthor !== $event->getAuthor()) {
            $event->setAuthor($newAuthor);
        }

        AddEventMutation::initEvent($event, $values, $this->formFactory);

        $this->em->flush();

        $this->indexer->index(\get_class($event), $event->getId());
        $this->indexer->finishBulk();

        if (!$viewer->isAdmin()) {
            $this->publisher->publish(
                'event.update',
                new Message(
                    json_encode(
                        [
                            'eventId' => $event->getId(),
                        ]
                    )
                )
            );
        }

        return ['event' => $event, 'userErrors' => []];
    }
}
