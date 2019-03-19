<?php

namespace Capco\AppBundle\Controller\Site;

use Box\Spout\Common\Type;
use Box\Spout\Writer\WriterFactory;
use Capco\AppBundle\Entity\Event;
use Capco\AppBundle\Entity\Project;
use Capco\AppBundle\Entity\Steps\AbstractStep;
use Overblog\GraphQLBundle\Relay\Node\GlobalId;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\HttpFoundation\Session\Flash\FlashBagInterface;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Capco\AppBundle\EventListener\GraphQlAclListener;
use Capco\AppBundle\GraphQL\ConnectionTraversor;
use Symfony\Component\Translation\TranslatorInterface;

const USER_FRAGMENT = '
    id
    email
    username
    userType {
      name
    }
    createdAt
    updatedAt
    lastLogin
    rolesText
    consentExternalCommunication
    enabled
    isEmailConfirmed
    locked
    phoneConfirmed
    gender
    dateOfBirth
    website
    biography
    address
    zipCode
    city
    phone
    url
';

const USER_HEADERS = [
    'user_id',
    'user_email',
    'user_userName',
    'user_TypeName',
    'user_createdAt',
    'user_updatedAt',
    'user_lastLogin',
    'user_rolesText',
    'user_consentExternalCommunication',
    'user_enabled',
    'user_isEmailConfirmed',
    'user_locked',
    'user_phoneConfirmed',
    'user_gender',
    'user_dateOfBirth',
    'user_websiteUrl',
    'user_biography',
    'user_address',
    'user_zipCode',
    'user_city',
    'user_phone',
    'user_profileUrl',
];

const USER_HEADERS_EVENTS = [
    'user_id',
    'user_email',
    'user_userName',
    'user_TypeName',
    'event_RegisteredOn',
    'event_privateRegistration',
    'user_createdAt',
    'user_updatedAt',
    'user_lastLogin',
    'user_rolesText',
    'user_consentExternalCommunication',
    'user_enabled',
    'user_isEmailConfirmed',
    'user_locked',
    'user_phoneConfirmed',
    'user_gender',
    'user_dateOfBirth',
    'user_websiteUrl',
    'user_biography',
    'user_address',
    'user_zipCode',
    'user_city',
    'user_phone',
    'user_profileUrl',
];

class ExportController extends Controller
{
    private $flashBag;
    private $translator;
    private $exportDir;

    public function __construct(
        TranslatorInterface $translator,
        FlashBagInterface $flashBag,
        string $exportDir
    ) {
        $this->flashBag = $flashBag;
        $this->translator = $translator;
        $this->exportDir = $exportDir;
    }

    /**
     * @Route("/export-event-participants/{eventId}", name="app_export_event_participants")
     * @ParamConverter("event", options={"mapping": {"eventId": "id"}})
     * @Security("has_role('ROLE_ADMIN')")
     */
    public function downloadEventParticipantsAction(Event $event): StreamedResponse
    {
        $this->get(GraphQlAclListener::class)->disableAcl();
        $executor = $this->get('overblog_graphql.request_executor');
        $connectionTraversor = $this->get(ConnectionTraversor::class);

        $data = $executor
            ->execute('internal', [
                'query' => $this->getEventContributorsGraphQLQuery($event->getId()),
                'variables' => [],
            ])
            ->toArray();

        if (!isset($data['data'])) {
            $this->get('logger')->error('GraphQL Query Error: ' . $data['errors']);
            $this->get('logger')->info('GraphQL query: ' . json_encode($data));
        }
        $fileName =
            (new \DateTime())->format('Y-m-d') .
            '-registeredAttendees-' .
            $event->getSlug() .
            '.csv';
        $writer = WriterFactory::create(Type::CSV);
        $response = new StreamedResponse(function () use (
            $writer,
            $data,
            $event,
            $connectionTraversor
        ) {
            $writer->openToFile('php://output');
            $writer->addRow(USER_HEADERS_EVENTS);
            $connectionTraversor->traverse(
                $data,
                'participants',
                function ($edge) use ($writer) {
                    $contributor = $edge['node'];
                    if (isset($contributor['id'])) {
                        $writer->addRow([
                            $contributor['id'],
                            $contributor['email'],
                            $contributor['username'],
                            $contributor['userType'] ? $contributor['userType']['name'] : null,
                            $edge['registeredAt'],
                            $edge['registeredAnonymously'] ? 'yes' : 'no',
                            $contributor['createdAt'],
                            $contributor['updatedAt'],
                            $contributor['lastLogin'],
                            $contributor['rolesText'],
                            $contributor['consentExternalCommunication'],
                            $contributor['enabled'],
                            $contributor['isEmailConfirmed'],
                            $contributor['locked'],
                            $contributor['phoneConfirmed'],
                            $contributor['gender'],
                            $contributor['dateOfBirth'],
                            $contributor['website'],
                            $contributor['biography'],
                            $contributor['address'],
                            $contributor['zipCode'],
                            $contributor['city'],
                            $contributor['phone'],
                            $contributor['url'],
                        ]);
                    } else {
                        $writer->addRow([
                            null,
                            $contributor['notRegisteredEmail'],
                            $contributor['username'],
                            null,
                            $edge['registeredAt'],
                            $edge['registeredAnonymously'] ? 'yes' : 'no',
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                        ]);
                    }
                },
                function ($pageInfo) use ($event) {
                    return $this->getEventContributorsGraphQLQuery(
                        $event->getId(),
                        $pageInfo['endCursor']
                    );
                }
            );
            $writer->close();
        });

        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename="' . $fileName . '"');

        return $response;
    }

    /**
     * @Route("/export-project-contributors/{projectId}", name="app_export_project_contributors")
     * @ParamConverter("project", options={"mapping": {"projectId": "id"}})
     * @Security("has_role('ROLE_ADMIN')")
     */
    public function downloadProjectContributorsAction(Request $request, Project $project)
    {
        $fileName = 'participants_' . $project->getSlug() . '.csv';

        if (!file_exists($this->exportDir . $fileName)) {
            $this->flashBag->add(
                'danger',
                $this->translator->trans('project.download.not_yet_generated', [], 'CapcoAppBundle')
            );

            return $this->redirect($request->headers->get('referer'));
        }

        $contentType = 'text/csv';

        $request->headers->set('X-Sendfile-Type', 'X-Accel-Redirect');
        $response = new BinaryFileResponse($this->exportDir . $fileName);
        $response->headers->set('X-Accel-Redirect', '/export/' . $fileName);
        $response->setContentDisposition(ResponseHeaderBag::DISPOSITION_ATTACHMENT, $fileName);
        $response->headers->set('Content-Type', $contentType . '; charset=utf-8');
        $response->headers->set('Pragma', 'public');
        $response->headers->set('Cache-Control', 'maxage=1');

        return $response;
    }

    /**
     * @Route("/export-step-contributors/{stepId}", name="app_export_step_contributors")
     * @ParamConverter("step", options={"mapping": {"stepId": "id"}})
     * @Security("has_role('ROLE_ADMIN')")
     */
    public function downloadStepContributorsAction(AbstractStep $step): StreamedResponse
    {
        $this->get(GraphQlAclListener::class)->disableAcl();
        $executor = $this->get('overblog_graphql.request_executor');
        $connectionTraversor = $this->get(ConnectionTraversor::class);

        $data = $executor
            ->execute('internal', [
                'query' => $this->getStepContributorsGraphQLQuery($step->getId()),
                'variables' => [],
            ])
            ->toArray();

        if (!isset($data['data'])) {
            $this->get('logger')->error('GraphQL Query Error: ' . $data['error']);
            $this->get('logger')->info('GraphQL query: ' . json_encode($data));
        }
        $fileName =
            (new \DateTime())->format('Y-m-d') . '_participants_' . $step->getSlug() . '.csv';
        $writer = WriterFactory::create(Type::CSV);

        $response = new StreamedResponse(function () use (
            $writer,
            $data,
            $connectionTraversor,
            $step
        ) {
            $writer->openToFile('php://output');
            $writer->addRow(USER_HEADERS);
            $connectionTraversor->traverse(
                $data,
                'contributors',
                function ($edge) use ($writer) {
                    $contributor = $edge['node'];
                    $writer->addRow([
                        $contributor['id'],
                        $contributor['email'],
                        $contributor['username'],
                        $contributor['userType'] ? $contributor['userType']['name'] : null,
                        $contributor['createdAt'],
                        $contributor['updatedAt'],
                        $contributor['lastLogin'],
                        $contributor['rolesText'],
                        $contributor['consentExternalCommunication'],
                        $contributor['enabled'],
                        $contributor['isEmailConfirmed'],
                        $contributor['locked'],
                        $contributor['phoneConfirmed'],
                        $contributor['gender'],
                        $contributor['dateOfBirth'],
                        $contributor['website'],
                        $contributor['biography'],
                        $contributor['address'],
                        $contributor['zipCode'],
                        $contributor['city'],
                        $contributor['phone'],
                        $contributor['url'],
                    ]);
                },
                function ($pageInfo) use ($step) {
                    return $this->getStepContributorsGraphQLQuery(
                        $step->getId(),
                        $pageInfo['endCursor']
                    );
                }
            );
            $writer->close();
        });

        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename="' . $fileName . '"');

        return $response;
    }

    private function getEventContributorsGraphQLQuery(
        string $eventId,
        ?string $userCursor = null
    ): string {
        if ($userCursor) {
            $userCursor = sprintf(', after: "%s"', $userCursor);
        }

        $eventId = GlobalId::toGlobalId('Event', $eventId);
        $USER_FRAGMENT = USER_FRAGMENT;

        return <<<EOF
        query {
          node(id: "${eventId}") {
            ... on Event {
              participants(first: 50 ${userCursor}) {
                edges {
                  cursor
                  registeredAt
                  registeredAnonymously
                  node { 
                    ... on User {
                        ${USER_FRAGMENT}
                    }
                    ... on NotRegistered {
                      username
                      notRegisteredEmail: email
                    }
                  }
                }
                pageInfo {
                  startCursor
                  endCursor
                  hasNextPage
                }
              }
            }
          }
        }
EOF;
    }

    private function getStepContributorsGraphQLQuery(
        string $stepId,
        ?string $userCursor = null
    ): string {
        if ($userCursor) {
            $userCursor = sprintf(', after: "%s"', $userCursor);
        }
        $USER_FRAGMENT = USER_FRAGMENT;

        return <<<EOF
        query {
          node(id: "${stepId}") {
            ... on Consultation {
              contributors(first: 50 ${userCursor}) {
                edges {
                  cursor
                  node {
                    ${USER_FRAGMENT}
                  }
                }
                pageInfo {
                  startCursor
                  endCursor
                  hasNextPage
                }
              }
            }
            ... on CollectStep {
              contributors(first: 50 ${userCursor}) {
                edges {
                  cursor   
                  node {
                    ${USER_FRAGMENT}
                  }              
                }
                pageInfo {
                  startCursor
                  endCursor
                  hasNextPage
                }                
              }
            }
            ... on SelectionStep {
              contributors(first: 50 ${userCursor}) {
                edges {
                  cursor
                  node {
                    ${USER_FRAGMENT}
                  }               
                }
                pageInfo {
                  startCursor
                  endCursor
                  hasNextPage
                }                
              }
            }
            ... on QuestionnaireStep {
              contributors(first: 50 ${userCursor}) {
                edges {
                  cursor
                  node {
                    ${USER_FRAGMENT}
                  }              
                }
                pageInfo {
                  startCursor
                  endCursor
                  hasNextPage
                }                
              }
            }
          }
        }
EOF;
    }
}
