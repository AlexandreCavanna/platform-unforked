<?php

namespace Capco\AppBundle\Entity;

use Capco\AppBundle\Entity\Responses\AbstractResponse;
use Capco\AppBundle\Enum\ProposalStatementState;
use Capco\AppBundle\Traits\HasResponsesTrait;
use Capco\AppBundle\Traits\TimestampableTrait;
use Capco\AppBundle\Traits\UuidTrait;
use Capco\UserBundle\Entity\User;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Gedmo\Timestampable\Timestampable;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Validator\Constraints as Assert;
use Capco\AppBundle\Validator\Constraints as CapcoAssert;

/**
 * @ORM\Entity(repositoryClass="Capco\AppBundle\Repository\ProposalAnalysisRepository")
 * @ORM\Table(name="proposal_analysis")
 * @CapcoAssert\HasResponsesToRequiredQuestions(message="reply.missing_required_responses", formField="evaluationForm")
 */
class ProposalAnalysis implements Timestampable
{
    use TimestampableTrait;
    use UuidTrait;
    use HasResponsesTrait;

    /**
     * @ORM\ManyToOne(targetEntity="Capco\AppBundle\Entity\Proposal", inversedBy="analyses")
     * @ORM\JoinColumn(nullable=false, referencedColumnName="id")
     */
    private $proposal;

    /**
     * @ORM\Column(type="string", nullable=false)
     * @Assert\Choice(choices = {"IN_PROGRESS", "TOO_LATE", "FAVOURABLE", "UNFAVOURABLE", "NONE"})
     */
    private $state = ProposalStatementState::IN_PROGRESS;

    /**
     * @ORM\OneToMany(targetEntity="Capco\AppBundle\Entity\Responses\AbstractResponse", mappedBy="analysis", cascade={"persist"})
     */
    private $responses;

    /**
     * @ORM\Column(type="text", nullable=true, name="comment")
     */
    private $comment;

    /**
     * @ORM\ManyToOne(targetEntity="Capco\UserBundle\Entity\User")
     * @ORM\JoinColumn(name="updated_by", nullable=true, referencedColumnName="id")
     */
    private $updatedBy;

    /**
     * @Gedmo\Timestampable(on="update")
     * @ORM\Column(type="datetime", name="updated_at")
     */
    private $updatedAt;

    public function __construct()
    {
        $this->responses = new ArrayCollection();
    }

    public function getResponsesQuestions(): Collection
    {
        $proposalForm = $this->getProposal()->getProposalForm();

        return $proposalForm->getEvaluationForm()
            ? $proposalForm->getEvaluationForm()->getRealQuestions()
            : new ArrayCollection();
    }

    public function setResponseOn(AbstractResponse $response): void
    {
        $response->setAnalysis($this);
    }

    public function getProposal(): Proposal
    {
        return $this->proposal;
    }

    public function setProposal(Proposal $proposal): self
    {
        $this->proposal = $proposal;

        return $this;
    }

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function setComment(?string $comment = null): self
    {
        $this->comment = $comment;

        return $this;
    }

    public function getState(): string
    {
        return $this->state;
    }

    public function setState(string $state): self
    {
        $this->state = $state;

        return $this;
    }

    public function getUpdatedBy(): ?User
    {
        return $this->updatedBy;
    }

    public function setUpdatedBy(?User $updatedBy): self
    {
        $this->updatedBy = $updatedBy;

        return $this;
    }

    public function getEvaluationForm(): Questionnaire
    {
        return $this->getProposal()
            ->getProposalForm()
            ->getEvaluationForm();
    }
}