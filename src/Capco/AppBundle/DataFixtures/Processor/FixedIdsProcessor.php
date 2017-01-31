<?php

namespace Capco\AppBundle\DataFixtures\Processor;

use Nelmio\Alice\ProcessorInterface;
use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\Id\AssignedGenerator;
use Capco\ClassificationBundle\Entity\Context;
use Doctrine\ORM\EntityManager;

class FixedIdsProcessor implements ProcessorInterface
{
    protected $em;

    public function __construct(EntityManager $em)
    {
        $this->em = $em;
    }

    public function preProcess($object)
    {
        if (!($object instanceof Context) && $object->getId()) {
            $metadata = $this->em->getClassMetadata(get_class($object));
            $metadata->setIdGeneratorType(ClassMetadata::GENERATOR_TYPE_NONE);
            $metadata->setIdGenerator(new AssignedGenerator());
        }
    }

    /**
     * {@inheritdoc}
     */
    public function postProcess($object)
    {
    }
}
