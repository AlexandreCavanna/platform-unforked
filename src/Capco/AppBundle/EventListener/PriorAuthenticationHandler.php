<?php

namespace Capco\AppBundle\EventListener;

use Capco\AppBundle\Toggle\Manager;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Capco\AppBundle\Repository\UserConnectionRepository;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Capco\AppBundle\Utils\RequestGuesser;
use Capco\AppBundle\Security\CaptchaChecker;

class PriorAuthenticationHandler
{
    public const MAX_FAILED_LOGIN_ATTEMPT = 5;

    private UserConnectionRepository $userConnectionRepository;
    private Manager $toggleManager;
    private LoggerInterface $logger;
    private CaptchaChecker $captchaChecker;

    public function __construct(
        UserConnectionRepository $userConnectionRepository,
        Manager $toggleManager,
        LoggerInterface $logger,
        CaptchaChecker $captchaChecker
    ) {
        $this->userConnectionRepository = $userConnectionRepository;
        $this->toggleManager = $toggleManager;
        $this->logger = $logger;
        $this->captchaChecker = $captchaChecker;
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();

        if ('login_check' === $request->get('_route')) {
            if ($this->toggleManager->isActive('restrict_connection')) {
                $data = json_decode($request->getContent(), true);

                $email = $data['username'];
                if (!$email) {
                    $event->setResponse(
                        new JsonResponse(['reason' => 'Username must be provided.'], 401)
                    );
                }

                $ip = RequestGuesser::getClientIpFromRequest($request);
                $failedAttempts = $this->userConnectionRepository->countFailedAttemptByEmailAndIPInLastHour(
                    $email,
                    $ip
                );

                if ($failedAttempts >= self::MAX_FAILED_LOGIN_ATTEMPT) {
                    if (!isset($data['captcha'])) {
                        $this->logger->warning(
                            'Someone is certainly trying to bruteforce an email',
                            ['email' => $email]
                        );

                        $event->setResponse(
                            new JsonResponse(
                                ['reason' => 'You must provide a captcha to login.'],
                                401
                            )
                        );
                    } else {
                        $success = $this->captchaChecker->__invoke($data['captcha'], $ip);
                        if (!$success) {
                            $event->setResponse(
                                new JsonResponse(['reason' => 'Invalid captcha.'], 401)
                            );
                        }
                    }
                }
            }
        }
    }
}
