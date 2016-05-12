<?php

namespace Capco\AppBundle\Repository;

use Capco\AppBundle\Entity\Project;
use Capco\AppBundle\Entity\Steps\ConsultationStep;
use Capco\AppBundle\Entity\OpinionType;
use Capco\AppBundle\Entity\Opinion;
use Capco\UserBundle\Entity\User;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Query;
use Doctrine\ORM\Tools\Pagination\Paginator;

class OpinionRepository extends EntityRepository
{
    public function getRecentOrdered()
    {
        $qb = $this->createQueryBuilder('o')
            ->select('o.id', 'o.title', 'o.createdAt', 'o.updatedAt', 'a.username as author', 'o.isEnabled as published', 'o.isTrashed as trashed', 'c.title as project')
            ->where('o.validated = :validated')
            ->leftJoin('o.Author', 'a')
            ->leftJoin('o.step', 's')
            ->leftJoin('s.projectAbstractStep', 'cas')
            ->leftJoin('cas.project', 'c')
            ->setParameter('validated', false)
        ;

        return $qb->getQuery()
            ->getArrayResult()
        ;
    }

    public function getArrayById($id)
    {
        $qb = $this->createQueryBuilder('o')
            ->select('o.id', 'o.title', 'o.createdAt', 'o.updatedAt', 'a.username as author', 'o.isEnabled as published', 'o.isTrashed as trashed', 'o.body as body', 'c.title as project')
            ->leftJoin('o.Author', 'a')
            ->leftJoin('o.step', 's')
            ->leftJoin('s.projectAbstractStep', 'cas')
            ->leftJoin('cas.project', 'c')
            ->where('o.id = :id')
            ->setParameter('id', $id)
        ;

        return $qb->getQuery()
            ->getOneOrNullResult(Query::HYDRATE_ARRAY)
        ;
    }

    public function getOne($id)
    {
        $qb = $this->getIsEnabledQueryBuilder()
            ->addSelect('a', 'm', 'ot', 's', 'appendix', 'childConnections', 'parentConnections')
            ->leftJoin('o.Author', 'a')
            ->leftJoin('a.Media', 'm')
            ->leftJoin('o.OpinionType', 'ot')
            ->leftJoin('o.step', 's')
            ->leftJoin('o.appendices', 'appendix')
            ->leftJoin('o.childConnections', 'childConnections')
            ->leftJoin('o.parentConnections', 'parentConnections')
            ->andWhere('o.id = :id')
            ->setParameter('id', $id)
        ;

        return $qb->getQuery()->getOneOrNullResult();
    }

    public function getWithArguments($id)
    {
        $qb = $this->getIsEnabledQueryBuilder()
            ->addSelect('argument')
            ->innerJoin('o.arguments', 'argument', 'WITH', 'argument.isTrashed = false')
            ->andWhere('o.id = :id')
            ->setParameter('id', $id)
        ;

        return $qb->getQuery()->getOneOrNullResult();
    }

    public function getWithSources($id)
    {
        $qb = $this->getIsEnabledQueryBuilder()
            ->addSelect('source')
            ->innerJoin('o.Sources', 'source', 'WITH', 'source.isTrashed = false')
            ->andWhere('o.id = :id')
            ->setParameter('id', $id)
        ;

        return $qb->getQuery()->getOneOrNullResult();
    }

    public function getWithVotes($id, $limit = null)
    {
        $qb = $this->getIsEnabledQueryBuilder()
            ->addSelect('vote')
            ->innerJoin('o.votes', 'vote')
            ->andWhere('o.id = :id')
            ->setParameter('id', $id)
        ;

        if (null !== $limit) {
            $qb->setMaxResults($limit);
        }

        return $qb->getQuery()->getOneOrNullResult();
    }

    /**
     * Get one opinion by slug.
     *
     * @param $opinion
     *
     * @return mixed
     *
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function getOneBySlug($opinion)
    {
        $qb = $this->getIsEnabledQueryBuilder()
            ->addSelect('a', 'm', 'ot', 's')
            ->leftJoin('o.Author', 'a')
            ->leftJoin('a.Media', 'm')
            ->leftJoin('o.OpinionType', 'ot')
            ->leftJoin('o.step', 's')
            ->andWhere('o.slug = :opinion')
            ->setParameter('opinion', $opinion)
        ;

        return $qb->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Get one opinion by slug with user reports.
     *
     * @param $opinion
     * @param $user
     *
     * @return mixed
     *
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function getOneBySlugJoinUserReports($opinion, $user)
    {
        $qb = $this->getIsEnabledQueryBuilder()
            ->addSelect('a', 'm', 'ot', 's', 'r')
            ->leftJoin('o.Author', 'a')
            ->leftJoin('a.Media', 'm')
            ->leftJoin('o.OpinionType', 'ot')
            ->leftJoin('o.step', 's')
            ->leftJoin('o.Reports', 'r', 'WITH', 'r.Reporter =  :user')
            ->andWhere('o.slug = :opinion')
            ->setParameter('opinion', $opinion)
            ->setParameter('user', $user);

        return $qb->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Get all opinions in a project.
     *
     * @param $project
     * @param $excludedAuthor
     * @param $orderByRanking
     * @param $limit
     * @param $page
     *
     * @return mixed
     */
    public function getEnabledByProject($project, $excludedAuthor = null, $orderByRanking = false, $limit = null, $page = 1)
    {
        $qb = $this->getIsEnabledQueryBuilder()
            ->addSelect('ot', 's', 'aut', 'm')
            ->leftJoin('o.OpinionType', 'ot')
            ->leftJoin('o.Author', 'aut')
            ->leftJoin('aut.Media', 'm')
            ->leftJoin('o.step', 's')
            ->leftJoin('s.projectAbstractStep', 'cas')
            ->andWhere('cas.project = :project')
            ->andWhere('o.isTrashed = :trashed')
            ->setParameter('project', $project)
            ->setParameter('trashed', false)
        ;

        if ($excludedAuthor !== null) {
            $qb
                ->andWhere('aut.id != :author')
                ->setParameter('author', $excludedAuthor)
            ;
        }

        if ($orderByRanking) {
            $qb
                ->orderBy('o.ranking', 'ASC')
                ->addOrderBy('o.votesCountOk', 'DESC')
                ->addOrderBy('o.votesCountNok', 'ASC')
                ->addOrderBy('o.updatedAt', 'DESC')
            ;
        }

        $qb->addOrderBy('o.updatedAt', 'DESC');

        if ($limit !== null && is_int($limit) && 0 < $limit) {
            $query = $qb->getQuery()
                ->setFirstResult(($page - 1) * $limit)
                ->setMaxResults($limit)
            ;

            return new Paginator($query);
        }

        return $qb->getQuery()->getResult();
    }

    /**
     * Get all trashed or unpublished opinions.
     *
     * @param $project
     *
     * @return array
     */
    public function getTrashedOrUnpublishedByProject(Project $project)
    {
        $qb = $this->createQueryBuilder('o')
            ->addSelect('ot', 's', 'aut', 'm')
            ->leftJoin('o.OpinionType', 'ot')
            ->leftJoin('o.Author', 'aut')
            ->leftJoin('aut.Media', 'm')
            ->leftJoin('o.step', 's')
            ->leftJoin('s.projectAbstractStep', 'pas')
            ->andWhere('pas.project = :project')
            ->andWhere('o.isTrashed = true')
            ->setParameter('project', $project)
            ->orderBy('o.trashedAt', 'DESC');

        return $qb->getQuery()->getResult();
    }

    /**
     * Get all opinions by user.
     *
     * @param $user
     *
     * @return array
     */
    public function getByUser($user)
    {
        $qb = $this->getIsEnabledQueryBuilder()
            ->addSelect('ot', 's', 'c', 'aut', 'm')
            ->leftJoin('o.OpinionType', 'ot')
            ->leftJoin('o.step', 's')
            ->leftJoin('s.project', 'c')
            ->leftJoin('o.Author', 'aut')
            ->leftJoin('aut.Media', 'm')
            ->andWhere('c.isEnabled = :enabled')
            ->andWhere('s.isEnabled = :enabled')
            ->andWhere('o.Author = :author')
            ->setParameter('enabled', true)
            ->setParameter('author', $user)
            ->orderBy('o.createdAt', 'DESC');

        return $qb->getQuery()->getResult();
    }

    /**
     * Count opinions by user.
     *
     * @param $user
     *
     * @return mixed
     */
    public function countByUser($user)
    {
        $qb = $this->getIsEnabledQueryBuilder()
            ->select('COUNT(o) as totalOpinions')
            ->leftJoin('o.step', 's')
            ->leftJoin('s.project', 'c')
            ->andWhere('s.isEnabled = :enabled')
            ->andWhere('c.isEnabled = :enabled')
            ->andWhere('o.isEnabled = :enabled')
            ->andWhere('o.Author = :author')
            ->setParameter('enabled', true)
            ->setParameter('author', $user);

        return $qb
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Get opinions by opinionType and consultation step.
     *
     * @param ConsultationStep $step
     * @param $opinionTypeId
     * @param int    $nbByPage
     * @param int    $page
     * @param string $opinionsSort
     *
     * @return Paginator
     */
    public function getByOpinionTypeAndConsultationStepOrdered(ConsultationStep $step, $opinionTypeId, $nbByPage = 10, $page = 1, $opinionsSort = 'positions')
    {
        if ((int) $page < 1) {
            throw new \InvalidArgumentException(sprintf(
                'The argument "page" cannot be lower than 1 (current value: "%s")',
                $page
            ));
        }

        $qb = $this->getIsEnabledQueryBuilder()
            ->addSelect('ot', 'aut', 'm', '(o.votesCountMitige + o.votesCountOk + o.votesCountNok) as HIDDEN vnb')
            ->leftJoin('o.OpinionType', 'ot')
            ->leftJoin('o.Author', 'aut')
            ->leftJoin('aut.Media', 'm')
            ->andWhere('o.step = :step')
            ->andWhere('ot.id = :opinionType')
            ->andWhere('o.isTrashed = :notTrashed')
            ->setParameter('step', $step)
            ->setParameter('opinionType', $opinionTypeId)
            ->setParameter('notTrashed', false)
            ->addOrderBy('o.pinned', 'DESC')
        ;

        if ($opinionsSort) {
            if ($opinionsSort == 'last') {
                $qb
                    ->addOrderBy('o.createdAt', 'DESC')
                    ->addOrderBy('o.votesCountOk', 'DESC')
                ;
            } elseif ($opinionsSort == 'old') {
                $qb
                    ->addOrderBy('o.createdAt', 'ASC')
                    ->addOrderBy('o.votesCountOk', 'DESC')
                ;
            } elseif ($opinionsSort == 'favorable') {
                $qb
                    ->addOrderBy('o.votesCountOk', 'DESC')
                    ->addOrderBy('o.votesCountNok', 'ASC')
                    ->addOrderBy('o.createdAt', 'DESC')
                ;
            } elseif ($opinionsSort == 'votes') {
                $qb
                    ->addOrderBy('vnb', 'DESC')
                    ->addOrderBy('o.createdAt', 'DESC')
                ;
            } elseif ($opinionsSort == 'comments') {
                $qb
                    ->addOrderBy('o.argumentsCount', 'DESC')
                    ->addOrderBy('o.createdAt', 'DESC')
                ;
            } elseif ($opinionsSort == 'positions') {
                $qb
                    // trick in DQL to order NULL values last
                    ->addSelect('-o.position as HIDDEN inversePosition')
                    ->addOrderBy('inversePosition', 'DESC')
                    //
                    ->addSelect('RAND() as HIDDEN rand')
                    ->addOrderBy('rand')
                ;
            } elseif ($opinionsSort == 'random') {
                $qb
                    ->addSelect('RAND() as HIDDEN rand')
                    ->addOrderBy('rand')
                ;
            }
        }

        $query = $qb
                    ->getQuery()
                    ->setFirstResult(($page - 1) * $nbByPage)
                    ->setMaxResults($nbByPage)
        ;

        return new Paginator($query);
    }

    /**
     * Get enabled opinions by consultation step.
     *
     * @param $step
     *
     * @return mixed
     */
    public function getEnabledByConsultationStep($step)
    {
        $qb = $this->getIsEnabledQueryBuilder('o')
            ->addSelect('ot', 'aut', 'ut', 'app', 'args', 'argsAuthor')
            ->leftJoin('o.OpinionType', 'ot')
            ->leftJoin('o.Author', 'aut')
            ->leftJoin('aut.userType', 'ut')
            ->leftJoin('o.appendices', 'app')
            ->leftJoin('o.arguments', 'args')
            ->leftJoin('args.Author', 'argsAuthor')
            ->andWhere('o.step = :step')
            ->setParameter('step', $step)
            ->addOrderBy('o.updatedAt', 'DESC')
        ;

        return $qb
            ->getQuery()
            ->getResult();
    }

    /**
     * Get all opinions by project ordered by votesCountOk.
     *
     * @param $project
     * @param $excludedAuthor
     *
     * @return mixed
     */
    public function getEnabledByProjectsOrderedByVotes(Project $project, $excludedAuthor = null)
    {
        $qb = $this->getIsEnabledQueryBuilder()
            ->innerJoin('o.step', 's')
            ->innerJoin('s.projectAbstractStep', 'cas')
            ->innerJoin('cas.project', 'c')
            ->andWhere('o.isTrashed = :trashed')
            ->andWhere('cas.project = :project')
            ->setParameter('trashed', false)
            ->setParameter('project', $project)
        ;

        if ($excludedAuthor !== null) {
            $qb
                ->innerJoin('o.Author', 'a')
                ->andWhere('a.id != :author')
                ->setParameter('author', $excludedAuthor)
            ;
        }

        $qb
            ->orderBy('o.votesCountOk', 'DESC')
        ;

        return $qb->getQuery()->getResult();
    }

    protected function getIsEnabledQueryBuilder($alias = 'o')
    {
        return $this->createQueryBuilder($alias)
            ->andWhere($alias.'.isEnabled = :isEnabled')
            ->setParameter('isEnabled', true);
    }
}
