<?php

namespace Capco\AppBundle\Mailer\Message\Proposal;

use Capco\AppBundle\Entity\Proposal;
use Capco\AppBundle\Mailer\Message\AbstractExternalMessage;

final class ContactProposalAuthorMessage extends AbstractExternalMessage
{
    public const SUBJECT = 'proposal-notifier-contact';
    public const TEMPLATE = '@CapcoMail/Proposal/contactProposalAuthor.html.twig';

    public static function getMySubjectVars(Proposal $proposal, array $params): array
    {
        return [
            '{senderName}' => $params['sender']['name']
        ];
    }

    public static function getMyTemplateVars(Proposal $proposal, array $params): array
    {
        return [
            'senderName' => $params['sender']['name'],
            'senderMessage' => $params['senderMessage'],
            'senderEmail' => $params['sender']['email'],
            'projectTitle' => $proposal->getProject()->getTitle(),
            'proposalTitle' => $proposal->getTitle(),
            'baseUrl' => $params['baseURL'],
            'siteName' => $params['siteName'],
            'siteUrl' => $params['siteURL'],
            'titleLayout' => '@CapcoMail/Proposal/titleLayout.html.twig',
            'tableStyle' => 'background-color:rgba(0,0,0, 0.6); border-radius: 4px 4px 0 0;',
        ];
    }

    public function getBcc(): array
    {
        return parent::getBcc(); // TODO: Change the autogenerated stub
    }
}