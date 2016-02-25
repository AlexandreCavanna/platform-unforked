<?php

namespace Capco\AppBundle\EventListener;

use Capco\AppBundle\Resolver\ProposalVotesResolver;
use JMS\Serializer\EventDispatcher\ObjectEvent;
use JMS\Serializer\Serializer;
use JMS\Serializer\SerializationContext;
use Symfony\Bundle\FrameworkBundle\Routing\Router;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class SelectionStepSerializationListener extends AbstractSerializationListener
{
    private $tokenStorage;
    private $proposalVotesResolver;
    protected $serializer;
    protected $router;

    public function __construct(TokenStorageInterface $tokenStorage, ProposalVotesResolver $proposalVotesResolver, Serializer $serializer, RouterInterface $router)
    {
        $this->tokenStorage = $tokenStorage;
        $this->proposalVotesResolver = $proposalVotesResolver;
        $this->serializer = $serializer;
        $this->router = $router;
    }

    public static function getSubscribedEvents()
    {
        return [
            [
                'event' => 'serializer.post_serialize',
                'class' => 'Capco\AppBundle\Entity\Steps\SelectionStep',
                'method' => 'onPostSelectionStep',
            ],
        ];
    }

    public function onPostSelectionStep(ObjectEvent $event)
    {
        $step = $event->getObject();
        $project = $step->getProjectAbstractStep()->getProject();
        $token = $this->tokenStorage->getToken();
        $user = $token ? $token->getUser() : 'anon.';

        if ($user !== 'anon.' && $this->eventHasGroup($event, 'UserVotes')) {
            $event->getVisitor()->addData(
                'creditsLeft', $this->proposalVotesResolver->getCreditsLeftForUser($user, $step)
            );
            $event->getVisitor()->addData(
                'userVotesCount', $this->proposalVotesResolver->getVotesCountForUserInSelectionStep($user, $step)
            );

            $userVotes = $this->serializer->serialize([
                'data' => $this
                    ->proposalVotesResolver
                    ->getVotesForUserInSelectionStep($user, $step),
            ], 'json', SerializationContext::create()->setGroups(['ProposalVotes', 'Proposals', 'Steps', 'UsersInfos']));
            $event->getVisitor()->addData('userVotes', json_decode($userVotes, true)['data']);
        }

        $counters = [];
        $counters['proposals'] = count($step->getProposals());
        if ($step->isVotable()) {
            $counters['votes'] = $step->getVotesCount();
            $counters['contributors'] = $step->getContributorsCount();
        }
        if (!$step->isFuture()) {
            $counters['remainingDays'] = intval($step->getRemainingDays());
        }

        $event->getVisitor()->addData('counters', $counters);

        $event->getVisitor()->addData(
            '_links', [
                'show' => $this->router->generate('app_project_show_selection', [
                    'projectSlug' => $project->getSlug(),
                    'stepSlug' => $step->getSlug(),
                ], true),
            ]
        );
    }
}
