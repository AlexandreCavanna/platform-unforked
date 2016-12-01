<?php

namespace Capco\AppBundle\Repository;

use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Capco\AppBundle\Entity\Theme;
use Capco\AppBundle\Entity\Project;
use Capco\AppBundle\Entity\Proposal;

/**
 * PostRepository.
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class PostRepository extends EntityRepository
{
    private function createPublishedPostsByProposalQB(Proposal $proposal)
    {
        return $this->getIsPublishedQueryBuilder()
          ->leftJoin('p.proposals', 'proposal')
          ->andWhere('proposal.id = :id')
          ->setParameter('id', $proposal->getId())
        ;
    }
    public function getPublishedPostsByProposal(Proposal $proposal)
    {
        return $this->createPublishedPostsByProposalQB($proposal)
          ->addSelect('a', 'm', 't')
          ->leftJoin('p.Authors', 'a')
          ->leftJoin('p.Media', 'm')
          ->leftJoin('p.themes', 't')
          ->addOrderBy('p.publishedAt', 'DESC')
          ->setParameter('id', $proposal->getId())
          ->getQuery()
          ->getResult()
        ;
    }

    public function countPublishedPostsByProposal(Proposal $proposal) : int
    {
        return (int) $this->createPublishedPostsByProposalQB($proposal)
          ->select('count(p.id)')
          ->getQuery()
          ->getSingleScalarResult()
        ;
    }

    /**
     * Get posts depending on theme and project.
     *
     * @param $nbByPage
     * @param $page
     * @param null $themeSlug
     * @param null $projectSlug
     *
     * @return array
     */
    public function getSearchResults($nbByPage = 8, $page = 1, $themeSlug = null, $projectSlug = null)
    {
        if ((int) $page < 1) {
            throw new \InvalidArgumentException(sprintf(
                'The argument "page" cannot be lower than 1 (current value: "%s")',
                $page
            ));
        }

        $qb = $this->getIsPublishedQueryBuilder('p')
            ->addSelect('a', 'm', 't', 'c', 'proposal')
            ->leftJoin('p.Authors', 'a')
            ->leftJoin('p.Media', 'm')
            ->leftJoin('p.themes', 't', 'WITH', 't.isEnabled = true')
            ->leftJoin('p.projects', 'c', 'WITH', 'c.isEnabled = true')
            ->leftJoin('p.proposals', 'proposal')
            ->andWhere('p.displayedOnBlog = true')
            ->orderBy('p.publishedAt', 'DESC')
        ;

        if ($themeSlug !== null && $themeSlug !== Theme::FILTER_ALL) {
            $qb->andWhere('t.slug = :theme')
                ->setParameter('theme', $themeSlug)
            ;
        }

        if ($projectSlug !== null && $projectSlug !== Project::FILTER_ALL) {
            $qb->andWhere('c.slug = :project')
                ->setParameter('project', $projectSlug)
            ;
        }

        $query = $qb->getQuery();

        if ($nbByPage > 0) {
            $query
                ->setFirstResult(($page - 1) * $nbByPage)
                ->setMaxResults($nbByPage);
        }

        return new Paginator($query);
    }

    /**
     * Count posts depending on theme and project.
     *
     * @param null $themeSlug
     * @param null $projectSlug
     *
     * @return array
     */
    public function countSearchResults($themeSlug = null, $projectSlug = null)
    {
        $qb = $this->getIsPublishedQueryBuilder('p')
            ->select('COUNT(p.id)')
        ;

        if ($themeSlug !== null && $themeSlug !== Theme::FILTER_ALL) {
            $qb->innerJoin('p.themes', 't', 'WITH', 't.isEnabled = true')
                ->andWhere('t.slug = :theme')
                ->setParameter('theme', $themeSlug)
            ;
        }

        if ($projectSlug !== null && $projectSlug !== Project::FILTER_ALL) {
            $qb->innerJoin('p.projects', 'c', 'WITH', 'c.isEnabled = true')
                ->andWhere('c.slug = :project')
                ->setParameter('project', $projectSlug)
            ;
        }

        return $qb
            ->getQuery()
            ->getSingleScalarResult()
        ;
    }

    /**
     * Get last posts.
     *
     * @param int $limit
     * @param int $offset
     *
     * @return mixed
     */
    public function getLast($limit = 1, $offset = 0)
    {
        $qb = $this->getIsPublishedQueryBuilder()
            ->addSelect('a', 'm', 'c', 't')
            ->leftJoin('p.Authors', 'a')
            ->leftJoin('p.Media', 'm')
            ->leftJoin('p.projects', 'c')
            ->leftJoin('p.themes', 't')
            ->andWhere('p.displayedOnBlog = true')
            ->addOrderBy('p.publishedAt', 'DESC')
        ;

        if ($limit) {
            $qb->setMaxResults($limit);
        }

        if ($offset) {
            $qb->setFirstResult($offset);
        }

        return new Paginator($qb->getQuery(), true);
    }

    /**
     * Get last posts by project.
     *
     * @param $projectSlug
     * @param int $limit
     * @param int $offset
     *
     * @return mixed
     */
    public function getLastPublishedByProject($projectSlug, $limit = 1, $offset = 0)
    {
        $qb = $this->getIsPublishedQueryBuilder()
            ->addSelect('a', 'm', 'c', 't')
            ->leftJoin('p.Authors', 'a')
            ->leftJoin('p.Media', 'm')
            ->leftJoin('p.projects', 'c')
            ->leftJoin('p.themes', 't')
            ->andWhere('c.slug = :project')
            ->setParameter('project', $projectSlug)
            ->addOrderBy('p.publishedAt', 'DESC')
        ;

        if ($limit) {
            $qb->setMaxResults($limit);
        }

        if ($offset) {
            $qb->setFirstResult($offset);
        }

        return $qb
            ->getQuery()
            ->execute();
    }

    /**
     * @param $slug
     *
     * @return mixed
     */
    public function getPublishedBySlug($slug)
    {
        $qb = $this->getIsPublishedQueryBuilder('p')
            ->addSelect('a', 'am', 'm', 'c', 't')
            ->leftJoin('p.Authors', 'a')
            ->leftJoin('a.Media', 'am')
            ->leftJoin('p.Media', 'm')
            ->leftJoin('p.themes', 't', 'WITH', 't.isEnabled = true')
            ->leftJoin('p.projects', 'c', 'WITH', 'c.isEnabled = true')
            ->andWhere('p.slug = :slug')
            ->setParameter('slug', $slug)
            ->orderBy('p.publishedAt', 'DESC')
        ;

        return $qb->getQuery()->getOneOrNullResult();
    }

    public function getRecentPosts($count = 5)
    {
        $qb = $this->createQueryBuilder('p')
            ->addSelect('a', 'm', 'c', 't')
            ->leftJoin('p.Authors', 'a')
            ->leftJoin('p.Media', 'm')
            ->leftJoin('p.themes', 't')
            ->leftJoin('p.projects', 'c')
            ->orderBy('p.createdAt', 'DESC')
            ->addOrderBy('p.publishedAt', 'DESC')
            ->setMaxResults($count);

        return $qb->getQuery()->getResult();
    }

    /**
     * @param string $alias
     *
     * @return \Doctrine\ORM\QueryBuilder
     */
    protected function getIsPublishedQueryBuilder($alias = 'p')
    {
        return $this->createQueryBuilder($alias)
            ->andWhere($alias.'.isPublished = true')
            ->andWhere($alias.'.publishedAt <= :now')
            ->setParameter('now', new \DateTime());
    }
}
