<?php

namespace Capco\AppBundle\Entity;

use Capco\AppBundle\Traits\UuidTrait;
use Capco\UserBundle\Entity\User;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Table(name="user_archive")
 * @ORM\Entity(repositoryClass="Capco\AppBundle\Repository\UserArchiveRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class UserArchive
{
    use UuidTrait;

    /**
     * @Gedmo\Timestampable(on="create")
     * @ORM\Column(name="requested_at",type="datetime", nullable=false)
     */
    protected $requestedAt;

    /**
     * @ORM\Column(name="is_generated", type="boolean", nullable=false)
     */
    protected $isGenerated = false;

    /**
     * @ORM\Column(name="path", type="text", nullable=true)
     */
    protected $path;

    /**
     * @ORM\ManyToOne(targetEntity="Capco\UserBundle\Entity\User", inversedBy="archives")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", nullable=false)
     */
    protected $user;

    public function getRequestedAt(): \DateTime
    {
        return $this->requestedAt;
    }

    public function setRequestedAt(\DateTime $requestedAt): self
    {
        $this->requestedAt = $requestedAt;

        return $this;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function setUser(User $user)
    {
        $this->user = $user;

        return $this;
    }

    public function getIsGenerated(): bool
    {
        return $this->isGenerated;
    }

    public function setIsGenerated(bool $isGenerated): self
    {
        $this->isGenerated = $isGenerated;

        return $this;
    }

    public function getPath(): string
    {
        return $this->path;
    }

    public function setPath(string $path): self
    {
        $this->path = $path;

        return $this;
    }
}
