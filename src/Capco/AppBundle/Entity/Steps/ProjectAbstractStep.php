<?php

namespace Capco\AppBundle\Entity\Steps;

use Capco\AppBundle\Entity\Project;
use Capco\AppBundle\Traits\PositionableTrait;
use Capco\AppBundle\Traits\UuidTrait;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Class ProjectAbstractStep
 * Association between project and steps.
 *
 * @ORM\Entity(repositoryClass="Capco\AppBundle\Repository\ProjectAbstractStepRepository")
 * @ORM\Table(name="project_abstractstep")
 */
class ProjectAbstractStep
{
    use PositionableTrait;
    use UuidTrait;

    /**
     * @Gedmo\SortableGroup
     * @ORM\ManyToOne(targetEntity="Capco\AppBundle\Entity\Project", inversedBy="steps", cascade={"persist"})
     * @ORM\JoinColumn(name="project_id", referencedColumnName="id", nullable=false, onDelete="CASCADE")
     * @Assert\NotNull()
     */
    protected $project;

    /**
     * @ORM\OneToOne(targetEntity="Capco\AppBundle\Entity\Steps\AbstractStep", inversedBy="projectAbstractStep", cascade={"persist", "remove"})
     * @ORM\JoinColumn(name="step_id", referencedColumnName="id", nullable=false, onDelete="CASCADE")
     * @Assert\NotNull()
     */
    protected $step;

    public function __toString()
    {
        if ($this->step) {
            return $this->step->__toString();
        }

        return 'undefined step';
    }

    public function setProject(Project $project): self
    {
        $this->project = $project;

        return $this;
    }

    public function getProject(): ?Project
    {
        return $this->project;
    }

    public function setStep(AbstractStep $step): self
    {
        $this->step = $step;

        return $this;
    }

    public function getStep(): ?AbstractStep
    {
        return $this->step;
    }
}
