<?php

namespace Capco\AppBundle\Notifier;

use Capco\AppBundle\Entity\Event;
use Capco\AppBundle\GraphQL\Resolver\Event\EventUrlResolver;
use Capco\AppBundle\Mailer\MailerService;
use Capco\AppBundle\Mailer\Message\Event\EventCreateAdminMessage;
use Capco\AppBundle\Mailer\Message\Event\EventDeleteAdminMessage;
use Capco\AppBundle\Mailer\Message\Event\EventDeleteMessage;
use Capco\AppBundle\Mailer\Message\Event\EventEditAdminMessage;
use Capco\AppBundle\Mailer\Message\Event\EventReviewMessage;
use Capco\AppBundle\Repository\EventRegistrationRepository;
use Capco\AppBundle\Repository\EventRepository;
use Capco\AppBundle\SiteParameter\SiteParameterResolver;
use Capco\UserBundle\Entity\User;
use Capco\UserBundle\Repository\UserRepository;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\RouterInterface;

class EventNotifier extends BaseNotifier
{
    private $eventUrlResolver;
    private $userRepository;
    private $logger;
    private $eventRegistrationRepository;
    private $eventRepository;

    public function __construct(
        MailerService $mailer,
        SiteParameterResolver $siteParams,
        EventUrlResolver $eventUrlResolver,
        UserRepository $userRepository,
        RouterInterface $router,
        LoggerInterface $logger,
        EventRepository $eventRepository,
        EventRegistrationRepository $eventRegistrationRepository
    ) {
        parent::__construct($mailer, $siteParams, $router);
        $this->eventUrlResolver = $eventUrlResolver;
        $this->userRepository = $userRepository;
        $this->logger = $logger;
        $this->siteParams = $siteParams;
        $this->eventRepository = $eventRepository;
        $this->eventRegistrationRepository = $eventRegistrationRepository;
    }

    public function onCreate(Event $event): bool
    {
        return $this->mailer->sendMessage(
            EventCreateAdminMessage::create(
                $event,
                $this->eventUrlResolver->__invoke($event, true),
                $this->siteParams->getValue('admin.mail.notifications.receive_address'),
                $this->baseUrl,
                $this->siteName,
                '' !== $this->siteUrl ? $this->siteUrl : $this->baseUrl,
                'admin'
            )
        );
    }

    public function onUpdate(Event $event): bool
    {
        return $this->mailer->sendMessage(
            EventEditAdminMessage::create(
                $event,
                $this->eventUrlResolver->__invoke($event, true),
                $this->siteParams->getValue('admin.mail.notifications.receive_address'),
                $this->baseUrl,
                $this->siteName,
                '' !== $this->siteUrl ? $this->siteUrl : $this->baseUrl,
                'admin'
            )
        );
    }

    public function onDelete(array $event): array
    {
        $eventParticipants = $event['eventParticipants'] ?? null;
        /** @var Event $event */
        $event = $this->eventRepository->find($event['eventId']);

        if (!$event) {
            throw new NotFoundHttpException('event not found');
        }

        $this->mailer->sendMessage(
            EventDeleteAdminMessage::create(
                $event,
                $this->siteParams->getValue('admin.mail.notifications.receive_address'),
                $this->baseUrl,
                $this->siteName,
                '' !== $this->siteUrl ? $this->siteUrl : $this->baseUrl,
                'admin'
            )
        );
        $messages = [];

        if (!empty($eventParticipants)) {
            foreach ($eventParticipants as $participant) {
                if (isset($participant['username']) && !empty($participant['username'])) {
                    $messages[$participant['username']] = $this->mailer->sendMessage(
                        EventDeleteMessage::create(
                            $event,
                            $participant['email'],
                            $this->baseUrl,
                            $this->siteName,
                            '' !== $this->siteUrl ? $this->siteUrl : $this->baseUrl,
                            $participant['username']
                        )
                    );
                }
            }
            if (isset($participant['u_username']) && !empty($participant['u_username'])) {
                $messages[$participant['u_username']] = $this->mailer->sendMessage(
                    EventDeleteMessage::create(
                        $event,
                        $participant['u_email'],
                        $this->baseUrl,
                        $this->siteName,
                        '' !== $this->siteUrl ? $this->siteUrl : $this->baseUrl,
                        $participant['u_username']
                    )
                );
            }
        }

        return $messages;
    }

    public function onReview(Event $event): bool
    {
        if (!$event->getAuthor()) {
            throw new \RuntimeException('Event author cant be empty');
        }
        if (!$event->getReview()) {
            throw new \RuntimeException('Event review cant be empty');
        }

        // @var User $admin
        return $this->mailer->sendMessage(
            EventReviewMessage::create(
                $event,
                $this->baseUrl,
                $this->siteName,
                '' !== $this->siteUrl ? $this->siteUrl : $this->baseUrl,
                $event->getAuthor()->getUsername()
            )
        );
    }
}
