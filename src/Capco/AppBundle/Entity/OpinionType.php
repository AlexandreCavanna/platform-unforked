<?php

namespace Capco\AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

use Capco\AppBundle\Entity\ViewModel\OpinionTypeViewModel;

/**
 * OpinionType.
 *
 * @Gedmo\Tree(type="nested")
 * @ORM\Table(name="opinion_type")
 * @ORM\Entity(repositoryClass="Capco\AppBundle\Repository\OpinionTypeRepository")
 */
class OpinionType
{
    public static $colorsType = [
        'red' => 'opinion_type.colors.red',
        'green' => 'opinion_type.colors.green',
        'blue' => 'opinion_type.colors.blue',
        'orange' => 'opinion_type.colors.orange',
        'bluedark' => 'opinion_type.colors.bluedark',
        'white' => 'opinion_type.colors.white',
        'default' => 'opinion_type.colors.default',
    ];

    const VOTE_WIDGET_DISABLED = 0;
    const VOTE_WIDGET_OK = 1;
    const VOTE_WIDGET_BOTH = 2;

    public static $voteWidgetLabels = [
        self::VOTE_WIDGET_DISABLED => 'opinion_type.widget_type.disabled',
        self::VOTE_WIDGET_OK => 'opinion_type.widget_type.ok',
        self::VOTE_WIDGET_BOTH => 'opinion_type.widget_type.both',
    ];

    const COMMENT_SYSTEM_DISABLED = 0;
    const COMMENT_SYSTEM_OK = 1;
    const COMMENT_SYSTEM_BOTH = 2;

    public static $commentSystemLabels = [
        self::COMMENT_SYSTEM_DISABLED => 'opinion_type.comment_system.disabled',
        self::COMMENT_SYSTEM_OK => 'opinion_type.comment_system.ok',
        self::COMMENT_SYSTEM_BOTH => 'opinion_type.comment_system.both',
    ];

    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=255)
     */
    private $title;

    /**
     * @var string
     *
     * @ORM\Column(name="subtitle", type="string", length=255, nullable=true)
     */
    private $subtitle;

    /**
     * @Gedmo\Slug(fields={"title", "subtitle"}, updatable=false)
     * @ORM\Column(length=255)
     */
    private $slug;

    /**
     * @var int
     *
     * @ORM\Column(name="position", type="integer")
     */
    private $position;

    /**
     * @var int
     *
     * @ORM\Column(name="vote_widget_type", type="integer")
     */
    private $voteWidgetType = self::VOTE_WIDGET_BOTH;

    /**
     * @var string
     *
     * @ORM\Column(name="help_text", type="string", length=255, nullable=true)
     */
    private $votesHelpText = null;

    /**
     * @var int
     *
     * @ORM\Column(name="comment_system", type="integer")
     */
    private $commentSystem = self::COMMENT_SYSTEM_BOTH;

    /**
     * @var \DateTime
     * @Gedmo\Timestampable(on="create")
     * @ORM\Column(name="created_at", type="datetime")
     */
    private $createdAt;

    /**
     * @var \DateTime
     * @Gedmo\Timestampable(on="change", field={"title", "subtitle", "position", "voteWidgetType", "color"})
     * @ORM\Column(name="updated_at", type="datetime")
     */
    private $updatedAt;

    /**
     * @var
     *
     * @ORM\OneToMany(targetEntity="Capco\AppBundle\Entity\Opinion", mappedBy="OpinionType", cascade={"persist", "remove"}, orphanRemoval=true)
     */
    private $Opinions;

    /**
     * @var string
     *
     * @ORM\Column(name="color", type="string", length=50)
     */
    private $color;

    /**
     * @var string
     *
     * @ORM\Column(name="default_filter", type="string", length=50)
     */
    private $defaultFilter;

    /**
     * @var bool
     *
     * @ORM\Column(name="is_enabled", type="boolean")
     */
    private $isEnabled;

    /**
     * @var bool
     *
     * @ORM\Column(name="versionable", type="boolean")
     */
    private $versionable = false;

    /**
     * @var bool
     *
     * @ORM\Column(name="linkable", type="boolean")
     */
    private $linkable = false;

    /**
     * @var bool
     *
     * @ORM\Column(name="sourceable", type="boolean")
     */
    private $sourceable = true;

    /**
     * @var int
     *
     * @ORM\Column(name="votes_threshold", type="integer", nullable=true)
     */
    private $votesThreshold = null;

    /**
     * @var string
     *
     * @ORM\Column(name="threshold_help_text", type="string", length=255, nullable=true)
     */
    private $votesThresholdHelpText = null;

    /**
     * @ORM\OneToMany(targetEntity="Capco\AppBundle\Entity\OpinionTypeAppendixType", mappedBy="opinionType",  cascade={"persist", "remove"})
     * @ORM\OrderBy({"position" = "ASC"})
     */
    protected $appendixTypes;

    /**
     * @Gedmo\TreeParent
     * @ORM\ManyToOne(targetEntity="Capco\AppBundle\Entity\OpinionType", inversedBy="children", cascade={"persist"})
     * @ORM\JoinColumn(name="parent_id", referencedColumnName="id", onDelete="CASCADE", nullable=true)
     */
    protected $parent = null;

    /**
     * @Gedmo\TreeLeft
     * @ORM\Column(type="integer")
     */
    private $lft;
    /**
     * @Gedmo\TreeRight
     * @ORM\Column(type="integer")
     */
    private $rgt;

    /**
     * @Gedmo\TreeRoot
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $root;

    /**
     * @Gedmo\TreeLevel
     * @ORM\Column(name="lvl", type="integer")
     */
    protected $level;

    /**
     * @ORM\OneToMany(targetEntity="Capco\AppBundle\Entity\OpinionType", mappedBy="parent", cascade={"persist"})
     */
    protected $children;

    /**
     * @ORM\ManyToOne(targetEntity="Capco\AppBundle\Entity\ConsultationType", inversedBy="opinionTypes", cascade={"persist"})
     * @ORM\JoinColumn(name="consultation_type_id", nullable=true, onDelete="CASCADE")
     */
    protected $consultationType;

    public function __construct()
    {
        $this->voteWidgetType = self::VOTE_WIDGET_BOTH;
        $this->Opinions = new ArrayCollection();
        $this->updatedAt = new \Datetime();
        $this->appendixTypes = new ArrayCollection();
        $this->children = new ArrayCollection();
    }

    public function __toString()
    {
        if ($this->id) {
            return $this->getTitle();
        }

        return 'New opinion type';
    }

    /**
     * Get id.
     *
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
     * Get title.
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set title.
     *
     * @param string $title
     *
     * @return OpinionType
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return string
     */
    public function getSubtitle()
    {
        return $this->subtitle;
    }

    /**
     * @param string $subtitle
     */
    public function setSubtitle($subtitle)
    {
        $this->subtitle = $subtitle;
    }

    /**
     * Get slug.
     *
     * @return string
     */
    public function getSlug()
    {
        return $this->slug;
    }

    /**
     * Set slug.
     *
     * @param string $slug
     *
     * @return OpinionType
     */
    public function setSlug($slug)
    {
        $this->slug = $slug;

        return $this;
    }

    /**
     * Get position.
     *
     * @return int
     */
    public function getPosition()
    {
        return $this->position;
    }

    /**
     * Set position.
     *
     * @param int $position
     *
     * @return OpinionType
     */
    public function setPosition($position)
    {
        $this->position = $position;

        return $this;
    }

    /**
     * Get defaultFilter.
     *
     * @return int
     */
    public function getDefaultFilter()
    {
        return $this->defaultFilter;
    }

    /**
     * Set defaultFilter.
     *
     * @param int $defaultFilter
     *
     * @return OpinionType
     */
    public function setDefaultFilter($defaultFilter)
    {
        $this->defaultFilter = $defaultFilter;

        return $this;
    }

    /**
     * Get voteWidgetType.
     *
     * @return int
     */
    public function getVoteWidgetType()
    {
        return $this->voteWidgetType;
    }

    /**
     * Set voteWidgetType.
     *
     * @param int $voteWidgetType
     *
     * @return OpinionType
     */
    public function setVoteWidgetType($voteWidgetType)
    {
        $this->voteWidgetType = $voteWidgetType;

        return $this;
    }

    /**
     * @return int
     */
    public function getCommentSystem()
    {
        return $this->commentSystem;
    }

    /**
     * @param int $commentSystem
     */
    public function setCommentSystem($commentSystem)
    {
        $this->commentSystem = $commentSystem;
    }

    /**
     * @return int
     */
    public function getVotesThreshold()
    {
        return $this->votesThreshold;
    }

    /**
     * @param int $votesThreshold
     */
    public function setVotesThreshold($votesThreshold)
    {
        $this->votesThreshold = $votesThreshold;
    }

    /**
     * Get createdAt.
     *
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Get updatedAt.
     *
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    /**
     * @return mixed
     */
    public function getOpinions()
    {
        return $this->Opinions;
    }

    /**
     * @param \Capco\AppBundle\Entity\Opinion $opinion
     *
     * @return $this
     */
    public function addOpinion(Opinion $opinion)
    {
        if (!$this->Opinions->contains($opinion)) {
            $this->Opinions->add($opinion);
        }

        return $this;
    }

    /**
     * @param \Capco\AppBundle\Entity\Opinion $opinion
     *
     * @return $this
     */
    public function removeOpinion(Opinion $opinion)
    {
        $this->Opinions->removeElement($opinion);

        return $this;
    }

    public function getAppendixTypes()
    {
        return $this->appendixTypes;
    }

    public function addAppendixType(OpinionTypeAppendixType $appendixType)
    {
        if (!$this->appendixTypes->contains($appendixType)) {
            $this->appendixTypes->add($appendixType);
            $appendixType->setOpinionType($this);
        }

        return $this;
    }

    public function removeAppendixType(OpinionTypeAppendixType $appendixType)
    {
        $this->appendixTypes->removeElement($appendixType);

        return $this;
    }

    /**
     * @return string
     */
    public function getColor()
    {
        return $this->color;
    }

    /**
     * @param string $color
     */
    public function setColor($color)
    {
        $this->color = $color;
    }

    /**
     * @return bool
     */
    public function getIsEnabled()
    {
        return $this->isEnabled;
    }

    /**
     * @param bool $isEnabled
     */
    public function setIsEnabled($isEnabled)
    {
        $this->isEnabled = $isEnabled;
    }

    public function isVersionable()
    {
        return $this->versionable;
    }

    public function setVersionable($versionable)
    {
        $this->versionable = $versionable;

        return $this;
    }

    public function isLinkable()
    {
        return $this->linkable;
    }

    public function setLinkable($linkable)
    {
        $this->linkable = $linkable;

        return $this;
    }

    /**
     * @return bool
     */
    public function isSourceable()
    {
        return $this->sourceable;
    }

    /**
     * @param bool $sourceable
     */
    public function setSourceable($sourceable)
    {
        $this->sourceable = $sourceable;
    }

    /**
     * @return string
     */
    public function getVotesHelpText()
    {
        return $this->votesHelpText;
    }

    /**
     * @param string $votesHelpText
     */
    public function setVotesHelpText($votesHelpText)
    {
        $this->votesHelpText = $votesHelpText;
    }

    /**
     * @return string
     */
    public function getVotesThresholdHelpText()
    {
        return $this->votesThresholdHelpText;
    }

    /**
     * @param string $votesThresholdHelpText
     */
    public function setVotesThresholdHelpText($votesThresholdHelpText)
    {
        $this->votesThresholdHelpText = $votesThresholdHelpText;
    }

    /**
     * @return mixed
     */
    public function getParent()
    {
        return $this->parent;
    }

    /**
     * @param mixed $parent
     */
    public function setParent($parent)
    {
        $this->parent = $parent;
    }

    /**
     * @return mixed
     */
    public function getLft()
    {
        return $this->lft;
    }

    /**
     * @return mixed
     */
    public function getRgt()
    {
        return $this->rgt;
    }

    /**
     * @return mixed
     */
    public function getRoot()
    {
        return $this->root;
    }

    /**
     * @return mixed
     */
    public function getLevel()
    {
        return $this->level;
    }

    /**
     * @return mixed
     */
    public function getChildren()
    {
        return $this->children;
    }

    /**
     * @param mixed $child
     */
    public function addChild($child)
    {
        if ($this->children->contains($child)) {
            $this->children->add($child);
        }
        $child->setParent($this);
    }

    /**
     * @param mixed $child
     */
    public function removeChild($child)
    {
        if ($this->children->contains($child)) {
            $this->children->removeElement($child);
        }
        $child->setParent(null);
    }

    /**
     * @return mixed
     */
    public function getConsultationType()
    {
        return $this->consultationType;
    }

    /**
     * @param mixed $consultationType
     */
    public function setConsultationType($consultationType)
    {
        $this->consultationType = $consultationType;

        return $this;
    }

    public function getAllAppendixTypes()
    {
        $types = new ArrayCollection();
        foreach ($this->appendixTypes as $otat) {
            $types->add($otat->getAppendixType());
        }

        return $types;
    }

    public function getAvailableOpinionTypesToCreateLink()
    {
        $parent = $this->getParent();
        if ($parent) {
            return $parent->getChildren(true);
        }
        return $this->getConsultationType()->getOpinionTypes();
    }

    // serializer seems to convert virtual_properties to an object
    // so we force it as an array using this method...
    public function getAvailableOpinionTypesToCreateLinkAsArray()
    {
        $data = [];
        foreach ($this->getAvailableOpinionTypesToCreateLink() as $opinionType) {
            $opinionTypeViewModel = new OpinionTypeViewModel();
            $opinionTypeViewModel->id = $opinionType->getId();
            $opinionTypeViewModel->label = $opinionType->getTitle();
            $data[] = $opinionTypeViewModel;
        }
        return $data;
    }
}
