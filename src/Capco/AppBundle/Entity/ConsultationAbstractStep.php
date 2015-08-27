<?php

namespace Capco\AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Validator\Constraints as Assert;
use Capco\AppBundle\Traits\PositionableTrait;

/**
 * Class ConsultationAbstractStep
 * Association between consltation and steps.
 *
 * @ORM\Entity()
 * @ORM\Table(name="consultation_abstractstep")
 */
class ConsultationAbstractStep
{
    use PositionableTrait;

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @Gedmo\SortableGroup
     * @ORM\ManyToOne(targetEntity="Capco\AppBundle\Entity\Consultation", inversedBy="steps", cascade={"persist"})
     * @ORM\JoinColumn(name="consultation_id", referencedColumnName="id", nullable=false, onDelete="CASCADE")
     * @Assert\NotNull()
     **/
    protected $consultation;

    /**
     * @ORM\OneToOne(targetEntity="Capco\AppBundle\Entity\AbstractStep", inversedBy="consultationAbstractStep", cascade={"persist", "remove"})
     * @ORM\JoinColumn(name="step_id", referencedColumnName="id", nullable=false, onDelete="CASCADE")
     * @Assert\NotNull()
     **/
    protected $step;

    /**
     * Get id.
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    public function __toString()
    {
        if ($this->step) {
            return $this->step->__toString();
        }

        return 'undefined step';
    }

    /**
     * Set consultation.
     *
     * @param \Capco\AppBundle\Entity\Consultation $consultation
     *
     * @return ConsultationAbstractStep
     */
    public function setConsultation(Consultation $consultation)
    {
        $this->consultation = $consultation;

        return $this;
    }

    /**
     * Get consultation.
     *
     * @return \Capco\AppBundle\Entity\Consultation
     */
    public function getConsultation()
    {
        return $this->consultation;
    }

    /**
     * Set step.
     *
     * @param \Capco\AppBundle\Entity\AbstractStep $step
     *
     * @return ConsultationAbstractStep
     */
    public function setStep(AbstractStep $step)
    {
        $this->step = $step;

        return $this;
    }

    /**
     * Get step.
     *
     * @return \Capco\AppBundle\Entity\AbstractStep
     */
    public function getStep()
    {
        return $this->step;
    }
}
