<?php

namespace Capco\AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Section
 *
 * @ORM\Table(name="section")
 * @ORM\Entity(repositoryClass="Capco\AppBundle\Repository\SectionRepository")
 */
class Section
{
    public static $fieldsForType = [
        'introduction' => [
            'title' => true,
            'teaser' => true,
            'body' => true,
            'nbObjects' => false,
        ],
        'videos' => [
            'title' => true,
            'teaser' => true,
            'body' => false,
            'nbObjects' => true,
        ],
        'consultations' => [
            'title' => false,
            'teaser' => true,
            'body' => false,
            'nbObjects' => true,
        ],
        'themes' => [
            'title' => false,
            'teaser' => true,
            'body' => false,
            'nbObjects' => true,
        ],
        'ideas' => [
            'title' => false,
            'teaser' => true,
            'body' => false,
            'nbObjects' => true,
        ],
        'news' => [
            'title' => false,
            'teaser' => true,
            'body' => false,
            'nbObjects' => true,
        ],
        'events' => [
            'title' => false,
            'teaser' => true,
            'body' => false,
            'nbObjects' => true,
        ],
        'newsletter' => [
            'title' => true,
            'teaser' => true,
            'body' => false,
            'nbObjects' => false,
        ],
        'social-networks' => [
            'title' => true,
            'teaser' => true,
            'body' => false,
            'nbObjects' => false,
        ],
        'figures' => [
            'title' => true,
            'teaser' => true,
            'body' => false,
            'nbObjects' => false,
        ],
        'custom' => [
            'title' => true,
            'teaser' => true,
            'body' => true,
            'nbObjects' => false,
        ],
    ];

    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="type", type="string", length=255)
     * @Assert\NotBlank()
     */
    private $type = 'custom';

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=100)
     * @Assert\NotBlank()
     */
    private $title;

    /**
     * @var integer
     * @Gedmo\SortablePosition
     * @ORM\Column(name="position", type="integer")
     * @Assert\NotNull()
     */
    private $position;

    /**
     * @var string
     *
     * @ORM\Column(name="teaser", type="text", nullable=true)
     */
    private $teaser;

    /**
     * @var string
     *
     * @ORM\Column(name="body", type="text", nullable=true)
     */
    private $body;

    /**
     * @var integer
     * @ORM\Column(name="nb_objects", type="integer", nullable=true)
     */
    private $nbObjects;

    /**
     * @var boolean
     *
     * @ORM\Column(name="enabled", type="boolean")
     * @Assert\NotNull()
     */
    private $enabled;

    /**
     * @var \DateTime
     *
     * @Gedmo\Timestampable(on="create")
     * @ORM\Column(name="created_at", type="datetime")
     */
    private $createdAt;

    /**
     * @var \DateTime
     *
     * @Gedmo\Timestampable(on="change", field={"title", "position"})
     * @ORM\Column(name="updated_at", type="datetime")
     */
    private $updatedAt;

    /**
     * @var
     * @ORM\Column(name="associated_features", type="simple_array", nullable=true)
     */
    private $associatedFeatures;


    function __construct()
    {
        $this->updatedAt = new \Datetime;
    }

    public function __toString()
    {
        if ($this->id) {
            return $this->getTitle();
        } else {
            return "New section";
        }
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param int $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @param string $title
     */
    public function setTitle($title)
    {
        $this->title = $title;
    }

    /**
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @return int
     */
    public function getPosition()
    {
        return $this->position;
    }

    /**
     * @param int $position
     */
    public function setPosition($position)
    {
        $this->position = $position;
    }

    /**
     * @return string
     */
    public function getTeaser()
    {
        return $this->teaser;
    }

    /**
     * @param string $teaser
     */
    public function setTeaser($teaser)
    {
        $this->teaser = $teaser;
    }

    /**
     * @return string
     */
    public function getBody()
    {
        return $this->body;
    }

    /**
     * @param string $body
     */
    public function setBody($body)
    {
        $this->body = $body;
    }

    /**
     * @return mixed
     */
    public function getNbObjects()
    {
        return $this->nbObjects;
    }

    /**
     * @param mixed $nbObjects
     */
    public function setNbObjects($nbObjects)
    {
        $this->nbObjects = $nbObjects;
    }

    /**
     * @return boolean
     */
    public function isEnabled()
    {
        return $this->enabled;
    }

    /**
     * @param boolean $enabled
     */
    public function setEnabled($enabled)
    {
        $this->enabled = $enabled;
    }

    /**
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    /**
     * @return mixed
     */
    public function getAssociatedFeatures()
    {
        return $this->associatedFeatures;
    }

    /**
     * @param mixed $associatedFeatures
     */
    public function setAssociatedFeatures($associatedFeatures)
    {
        $this->associatedFeatures = $associatedFeatures;
    }

    // ************************* Custom methods ***********************************

    public function isCustom()
    {
        return $this->type == 'custom';
    }



}

