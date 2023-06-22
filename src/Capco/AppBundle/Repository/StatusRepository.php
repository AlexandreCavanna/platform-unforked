<?php

namespace Capco\AppBundle\Repository;

use Capco\AppBundle\Entity\Project;
use Capco\AppBundle\Entity\Steps\AbstractStep;
use Capco\AppBundle\Entity\Steps\CollectStep;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\QueryBuilder;

/**
 * StatusRepository.
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class StatusRepository extends EntityRepository
{
    public function getByCollectStep(CollectStep $step)
    {
        $qb = $this->createQueryBuilder('s')
            ->where('s.step = :step')
            ->setParameter('step', $step)
            ->orderBy('s.position', 'ASC');

        return $qb->getQuery()->getResult();
    }

    public function getByProject(Project $project)
    {
        $qb = $this->createQueryBuilder('s')
            ->leftJoin('s.step', 'step')
            ->leftJoin('step.projectAbstractStep', 'pas')
            ->where('pas.project = :project')
            ->setParameter('project', $project)
            ->orderBy('s.position', 'ASC');

        return $qb->getQuery()->getResult();
    }

    public function getByProjectAndStepAndStatusTitle(
        Project $project,
        AbstractStep $step,
        array $statusesTitle
    ): array {
        $qb = $this->getByProjectAndStepQueryBuilder($project, $step);
        $qb->andWhere('s.name IN (:statusesTitle)');
        $qb->setParameter('statusesTitle', $statusesTitle);

        return $qb->getQuery()->getResult();
    }

    private function getByProjectAndStepQueryBuilder(
        Project $project,
        AbstractStep $step
    ): QueryBuilder {
        return $this->createQueryBuilder('s')
            ->leftJoin('s.step', 'step')
            ->leftJoin('step.projectAbstractStep', 'pas')
            ->where('pas.project = :project')
            ->andWhere('step = :step')
            ->setParameter('project', $project)
            ->setParameter('step', $step)
            ->orderBy('s.position', 'ASC');
    }
}
