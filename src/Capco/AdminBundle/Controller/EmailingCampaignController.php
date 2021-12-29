<?php

namespace Capco\AdminBundle\Controller;

use Capco\AppBundle\Entity\EmailingCampaign;
use Capco\AppBundle\Toggle\Manager;
use Capco\UserBundle\Entity\User;
use Overblog\GraphQLBundle\Relay\Node\GlobalId;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;

class EmailingCampaignController extends \Sonata\AdminBundle\Controller\CRUDController
{
    public function listAction()
    {
        return $this->isFeatureActivated()
            ? $this->renderWithExtraParams('CapcoAdminBundle:Emailing:emailingCampaign.html.twig')
            : $this->redirectToHome();
    }

    public function editParametersAction(string $id): Response
    {
        if (!$this->isFeatureActivated()) {
            $this->redirectToHome();
        }

        $emailingCampaign = $this->getEmailingCampaignFromGlobalId($id);

        return $emailingCampaign ? $this->renderEdit($emailingCampaign) : $this->redirectToList();
    }

    public function editContentAction(string $id): Response
    {
        if (!$this->isFeatureActivated()) {
            $this->redirectToHome();
        }

        $emailingCampaign = $this->getEmailingCampaignFromGlobalId($id);

        return $emailingCampaign ? $this->renderEdit($emailingCampaign) : $this->redirectToList();
    }

    public function editSendingAction(string $id): Response
    {
        if (!$this->isFeatureActivated()) {
            $this->redirectToHome();
        }

        $emailingCampaign = $this->getEmailingCampaignFromGlobalId($id);

        return $emailingCampaign ? $this->renderEdit($emailingCampaign) : $this->redirectToList();
    }

    private function getEmailingCampaignFromGlobalId(string $globalId): ?EmailingCampaign
    {
        $campaign = $this->admin->getObject(GlobalId::fromGlobalId($globalId)['id']);

        $viewer = $this->getUser();
        if (
            !($viewer instanceof User) ||
            (!$viewer->isAdmin() && $campaign->getOwner() !== $viewer)
        ) {
            throw $this->createAccessDeniedException();
        }

        return $campaign;
    }

    private function renderEdit(EmailingCampaign $emailingCampaign): Response
    {
        return $this->renderWithExtraParams(
            'CapcoAdminBundle:Emailing:emailingCampaignEdit.html.twig',
            [
                'object' => $emailingCampaign,
                'form' => $this->admin->getForm()->createView(),
                'action' => 'edit',
            ]
        );
    }

    private function isFeatureActivated(): bool
    {
        return $this->get(Manager::class)->isActive(Manager::beta__emailing);
    }

    private function redirectToHome(): RedirectResponse
    {
        return new RedirectResponse($this->generateUrl('app_homepage'));
    }
}
