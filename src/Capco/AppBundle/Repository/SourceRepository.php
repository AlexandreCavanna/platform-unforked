<?php

namespace Capco\AppBundle\Repository;

use Capco\AppBundle\Entity\ConsultationStep;
use Capco\AppBundle\Entity\Opinion;
use Doctrine\ORM\EntityRepository;

/**
 * SourceRepository.
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class SourceRepository extends EntityRepository
{

    public function getOneByOpinion(Opinion $opinion, $offset, $limit, $filter)
    {
        $qb = $this->getIsEnabledQueryBuilder()
            ->addSelect('ca', 'o', 'aut', 'm', 'media')
            ->leftJoin('s.Category', 'ca')
            ->leftJoin('s.Media', 'media')
            ->leftJoin('s.Opinion', 'o')
            ->leftJoin('s.Author', 'aut')
            ->leftJoin('aut.Media', 'm')
            ->andWhere('s.isTrashed = false')
            ->andWhere('s.Opinion = :opinion')
            ->setParameter('opinion', $opinion)
            ->orderBy('s.updatedAt', 'DESC');

        return $qb->getQuery()->getResult();
    }


    /**
     * Get one source by slug.
     *
     * @param $source
     *
     * @return mixed
     *
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function getOneBySlug($source)
    {
        return $this->getIsEnabledQueryBuilder()
            ->addSelect('a', 'm', 'v', 'o', 'cat', 'media')
            ->leftJoin('s.Author', 'a')
            ->leftJoin('s.Media', 'media')
            ->leftJoin('s.Category', 'cat')
            ->leftJoin('a.Media', 'm')
            ->leftJoin('s.votes', 'v')
            ->leftJoin('s.Opinion', 'o')
            ->andWhere('s.slug = :source')
            ->setParameter('source', $source)

            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Get all trashed sources for consultation.
     *
     * @param $step
     *
     * @return mixed
     */
    public function getTrashedByConsultation($consultation)
    {
        $qb = $this->getIsEnabledQueryBuilder()
            ->addSelect('ca', 'o', 'aut', 'm', 'media')
            ->leftJoin('s.Category', 'ca')
            ->leftJoin('s.Media', 'media')
            ->leftJoin('s.Author', 'aut')
            ->leftJoin('aut.Media', 'm')
            ->leftJoin('s.Opinion', 'o')
            ->leftJoin('o.step', 'step')
            ->leftJoin('step.consultationAbstractStep', 'cas')
            ->andWhere('cas.consultation = :consultation')
            ->andWhere('s.isTrashed = :trashed')
            ->setParameter('consultation', $consultation)
            ->setParameter('trashed', true)
            ->orderBy('s.trashedAt', 'DESC');

        return $qb->getQuery()->getResult();
    }

    /**
     * Get sources by opinion with user reports.
     *
     * @param $opinion
     * @param $user
     *
     * @return mixed
     */
    public function getByOpinionJoinUserReports($opinion, $user = null)
    {
        $qb = $this->getIsEnabledQueryBuilder()
            ->addSelect('ca', 'o', 'aut', 'm', 'media', 'r')
            ->leftJoin('s.Category', 'ca')
            ->leftJoin('s.Media', 'media')
            ->leftJoin('s.Opinion', 'o')
            ->leftJoin('s.Author', 'aut')
            ->leftJoin('aut.Media', 'm')
            ->leftJoin('s.Reports', 'r', 'WITH', 'r.Reporter =  :user')
            ->andWhere('s.isTrashed = :notTrashed')
            ->andWhere('s.Opinion = :opinion')
            ->setParameter('notTrashed', false)
            ->setParameter('opinion', $opinion)
            ->setParameter('user', $user)
            ->orderBy('s.updatedAt', 'DESC');

        return $qb->getQuery()->getResult();
    }

    /**
     * Get enabled sources by consultation step.
     *
     * @param $step
     *
     * @return mixed
     */
    public function getEnabledByConsultationStep(ConsultationStep $step)
    {
        $qb = $this->getIsEnabledQueryBuilder()
            ->addSelect('ca', 'o', 'ot', 'aut')
            ->leftJoin('s.Category', 'ca')
            ->leftJoin('s.Opinion', 'o')
            ->leftJoin('o.OpinionType', 'ot')
            ->leftJoin('s.Author', 'aut')
            ->andWhere('o.isEnabled = :oEnabled')
            ->setParameter('oEnabled', true)
            ->andWhere('o.step = :step')
            ->setParameter('step', $step)
            ->orderBy('s.updatedAt', 'DESC');

        return $qb->getQuery()->getResult();
    }

    /**
     * Get sources by user.
     *
     * @param $user
     *
     * @return mixed
     */
    public function getByUser($user)
    {
        $qb = $this->getIsEnabledQueryBuilder()
            ->addSelect('ca', 'o', 'cs', 'cas', 'c', 'aut', 'm', 'media')
            ->leftJoin('s.Category', 'ca')
            ->leftJoin('s.Media', 'media')
            ->leftJoin('s.Opinion', 'o')
            ->leftJoin('o.step', 'cs')
            ->leftJoin('cs.consultationAbstractStep', 'cas')
            ->leftJoin('cas.consultation', 'c')
            ->leftJoin('s.Author', 'aut')
            ->leftJoin('aut.Media', 'm')
            ->andWhere('s.Author = :author')
            ->andWhere('o.isEnabled = :enabled')
            ->andWhere('cs.isEnabled = :enabled')
            ->andWhere('c.isEnabled = :enabled')
            ->setParameter('author', $user)
            ->setParameter('enabled', true)
            ->orderBy('s.createdAt', 'DESC');

        return $qb->getQuery()->getResult();
    }

    /**
     * Count by user.
     *
     * @param $user
     *
     * @return mixed
     */
    public function countByUser($user)
    {
        $qb = $this->getIsEnabledQueryBuilder()
            ->select('COUNT(s) as TotalSources')
            ->leftJoin('s.Opinion', 'o')
            ->leftJoin('o.step', 'cs')
            ->leftJoin('cs.consultationAbstractStep', 'cas')
            ->leftJoin('cas.consultation', 'c')
            ->andWhere('o.isEnabled = :enabled')
            ->andWhere('cs.isEnabled = :enabled')
            ->andWhere('c.isEnabled = :enabled')
            ->andWhere('s.Author = :author')
            ->setParameter('enabled', true)
            ->setParameter('author', $user);

        return $qb
            ->getQuery()
            ->getSingleScalarResult();
    }

    protected function getIsEnabledQueryBuilder()
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.isEnabled = :isEnabled')
            ->setParameter('isEnabled', true);
    }
}
