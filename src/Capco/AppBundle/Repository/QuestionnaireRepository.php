<?php

namespace Capco\AppBundle\Repository;

use Capco\AppBundle\Entity\ProposalForm;
use Doctrine\ORM\EntityRepository;

/**
 * QuestionnaireRepository.
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class QuestionnaireRepository extends EntityRepository
{
    /**
     * @param $id
     *
     * @throws \Doctrine\ORM\NonUniqueResultException
     *
     * @return mixed
     */
    public function getOne($id)
    {
        $qb = $this->createQueryBuilder('q')
            ->addSelect('q', 'qaq', 'qt')
            ->leftJoin('q.questions', 'qaq')
            ->leftJoin('qaq.question', 'qt')
            ->andWhere('q.id = :id')
            ->setParameter('id', $id)
        ;

        return $qb->getQuery()->getOneOrNullResult();
    }

    public function getAvailableQuestionnaires()
    {
        $qb = $this->createQueryBuilder('q')
            ->leftJoin('q.proposalForm', 'pf')
            ->where('q.step IS NULL')
            ->andWhere('pf.id IS NULL');

        return $qb->getQuery()->execute();
    }
}
