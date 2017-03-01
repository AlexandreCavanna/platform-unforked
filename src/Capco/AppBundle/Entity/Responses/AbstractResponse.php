<?php

namespace Capco\AppBundle\Entity\Responses;

use Capco\AppBundle\Entity\Proposal;
use Capco\AppBundle\Entity\Questions\AbstractQuestion;
use Capco\AppBundle\Entity\Reply;
use Capco\AppBundle\Traits\TimestampableTrait;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Validator\Constraints as Assert;
use Capco\AppBundle\Validator\Constraints as CapcoAssert;
use Capco\AppBundle\Traits\IdTrait;

/**
 * Response.
 *
 * @ORM\Table(name="response")
 * @ORM\Entity(repositoryClass="Capco\AppBundle\Repository\AbstractResponseRepository")
 * @ORM\HasLifecycleCallbacks()
 * @CapcoAssert\HasRequiredNumberOfChoices()
 * @ORM\InheritanceType("SINGLE_TABLE")
 * @ORM\DiscriminatorColumn(name = "response_type", type = "string")
 * @ORM\DiscriminatorMap({
 *      "value"  = "ValueResponse",
 *      "media"  = "MediaResponse",
 * })
 */
abstract class AbstractResponse
{
    use IdTrait;
    use TimestampableTrait;

    abstract public function getType();

    /**
     * @var Proposal
     *
     * @ORM\ManyToOne(targetEntity="Capco\AppBundle\Entity\Proposal", inversedBy="responses", cascade={"persist"})
     * @ORM\JoinColumn(name="proposal_id", referencedColumnName="id", onDelete="CASCADE", nullable=true)
     */
    private $proposal;

    /**
     * @var Reply
     *
     * @ORM\ManyToOne(targetEntity="Capco\AppBundle\Entity\Reply", inversedBy="responses", cascade={"persist"})
     * @ORM\JoinColumn(name="reply_id", referencedColumnName="id", onDelete="CASCADE", nullable=true)
     */
    private $reply;

    /**
     * @var AbstractQuestion
     *
     * @Assert\NotNull()
     * @ORM\ManyToOne(targetEntity="Capco\AppBundle\Entity\Questions\AbstractQuestion", inversedBy="responses",
     *                                                                                  cascade={"persist"})
     * @ORM\JoinColumn(name="question_id", referencedColumnName="id", onDelete="CASCADE", nullable=false)
     */
    private $question;

    /**
     * @var \DateTime
     * @Gedmo\Timestampable(on="change", field={"value"})
     * @ORM\Column(name="updated_at", type="datetime")
     */
    protected $updatedAt;

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->updatedAt = new \Datetime();
    }

    /**
     * @return Proposal
     */
    public function getProposal()
    {
        return $this->proposal;
    }

    /**
     * @param Proposal $proposal
     *
     * @return $this
     */
    public function setProposal(Proposal $proposal)
    {
        $this->proposal = $proposal;

        return $this;
    }

    /**
     * @return AbstractQuestion
     */
    public function getQuestion()
    {
        return $this->question;
    }

    /**
     * @param AbstractQuestion $question
     *
     * @return $this
     */
    public function setQuestion(AbstractQuestion $question)
    {
        $this->question = $question;

        return $this;
    }

    /**
     * @return Reply
     */
    public function getReply()
    {
        return $this->reply;
    }

    /**
     * @param Reply $reply
     *
     * @return $this
     */
    public function setReply($reply)
    {
        $this->reply = $reply;

        return $this;
    }

    /**
     * @ORM\PreFlush()
     */
    public function updateProposalTimestamp()
    {
        if ($this->getUpdatedAt() && $this->getProposal()) {
            $this->getProposal()->setUpdatedAt(new \DateTime());
        }
    }
}
