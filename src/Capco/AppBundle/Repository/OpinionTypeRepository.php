<?php

namespace Capco\AppBundle\Repository;

use Capco\AppBundle\Entity\Steps\ConsultationStep;
use Gedmo\Tree\Entity\Repository\NestedTreeRepository;

/**
 * OpinionTypeRepository.
 */
class OpinionTypeRepository extends NestedTreeRepository
{
    /**
     * Get all opinionTypes with opinions for user.
     *
     * @param $user
     *
     * @return array
     */
    public function getByUser($user)
    {
        $qb = $this->createQueryBuilder('ot')
            ->addSelect('o', 's', 'pas', 'p')
            ->leftJoin('ot.Opinions', 'o')
            ->leftJoin('o.step', 's')
            ->leftJoin('s.projectAbstractStep', 'pas')
            ->leftJoin('pas.project', 'p')
            ->andWhere('p.isEnabled = :enabled')
            ->andWhere('s.isEnabled = :enabled')
            ->andWhere('o.isEnabled = :enabled')
            ->andWhere('o.Author = :author')
            ->setParameter('enabled', true)
            ->setParameter('author', $user)
            ->orderBy('ot.position', 'ASC')
            ->addOrderBy('o.createdAt', 'DESC');

        return $qb
            ->getQuery()
            ->getResult();
    }

    /**
     * Count all opinionTypes with opinions for user.
     *
     * @param $user
     *
     * @return array
     */
    public function countByUser($user)
    {
        $qb = $this->createQueryBuilder('ot')
            ->addSelect('o', 's', 'cas', 'p')
            ->Join('ot.Opinions', 'o')
            ->leftJoin('o.step', 's')
            ->leftJoin('s.projectAbstractStep', 'pas')
            ->leftJoin('pas.project', 'p')
            ->addGroupBy('ot.id')
            ->andWhere('o.Author = :author')
            ->andWhere('o.isEnabled = :enabled')
            ->andWhere('s.isEnabled = :enabled')
            ->andWhere('p.isEnabled = :enabled')
            ->setParameter('enabled', true)
            ->setParameter('author', $user)
            ->orderBy('ot.position', 'ASC')
            ->addOrderBy('o.createdAt', 'DESC');

        return $qb
            ->getQuery()
            ->getScalarResult();
    }

    /**
     * Get all opinionTypes with opinions count for consultation step.
     *
     * @param $step
     * @param $allowedTypes
     *
     * @return array
     */
    public function getAllowedTypesWithOpinionCount(ConsultationStep $step, $allowedTypes)
    {
        $qb = $this->createQueryBuilder('ot')
            ->select('ot.id', 'ot.title', 'ot.color', 'ot.isEnabled',  'ot.slug', 'ot.defaultFilter', 'count(o.id) as total_opinions_count')
            ->leftJoin('ot.Opinions', 'o', 'WITH', 'o.isEnabled = :enabled AND o.step = :step AND o.isTrashed = :notTrashed')
            ->andWhere('ot IN (:allowedTypes)')
            ->setParameter('step', $step)
            ->setParameter('enabled', true)
            ->setParameter('notTrashed', false)
            ->setParameter('allowedTypes', $allowedTypes)
            ->addGroupBy('ot')
            ->orderBy('ot.position', 'ASC')
        ;

        return $qb
            ->getQuery()
            ->getArrayResult();
    }

    /**
     * Get all opinionTypes.
     *
     * @return array
     */
    public function getOrderedByPosition()
    {
        $qb = $this->createQueryBuilder('ot')
            ->orderBy('ot.position', 'ASC');

        return $qb
            ->getQuery()
            ->getResult();
    }

    public function getRootOpinionTypes()
    {
        $qb = $this->createQueryBuilder('ot')
            ->where('ot.parent IS NULL')
            ->orderBy('ot.position', 'ASC')
        ;

        return $qb->getQuery()->getResult();
    }
}
