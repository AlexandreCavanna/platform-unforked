<?php

namespace Capco\AppBundle\Controller\Site;

use Capco\AppBundle\Entity\Idea;
use Capco\AppBundle\Entity\Theme;
use Capco\AppBundle\Form\IdeaType;
use Capco\AppBundle\Form\IdeaUpdateType;
use Capco\AppBundle\Form\IdeaVoteType;
use Capco\AppBundle\Form\IdeaSearchType;
use Capco\AppBundle\Entity\IdeaComment;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Cache;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Capco\AppBundle\Event\AbstractVoteChangedEvent;
use Capco\AppBundle\CapcoAppBundleEvents;
use Capco\AppBundle\Event\CommentChangedEvent;

class IdeaController extends Controller
{
    /**
     * @Route("/ideas/add", name="app_idea_create", defaults={"_feature_flags" = "ideas,idea_creation"})
     * @Template("CapcoAppBundle:Idea:create.html.twig")
     */
    public function createAction(Request $request)
    {
        if (!$this->get('security.authorization_checker')->isGranted('ROLE_USER')) {
            throw new AccessDeniedException($this->get('translator')->trans('error.access_restricted', [], 'CapcoAppBundle'));
        }

        $idea = new Idea();

        if ($this->getUser()) {
            $idea->setAuthor($this->getUser());
        }

        $form = $this->createForm(new IdeaType($this->get('capco.toggle.manager')), $idea);

        if ($request->getMethod() == 'POST') {
            $form->handleRequest($request);

            if ($form->isValid()) {
                $em = $this->getDoctrine()->getManager();
                $em->persist($idea);
                $em->flush();
                $this->get('session')->getFlashBag()->add('success', $this->get('translator')->trans('idea.create.success'));

                return $this->redirect($this->generateUrl('app_idea_show', ['slug' => $idea->getSlug()]));
            } else {
                $this->get('session')->getFlashBag()->add('danger', $this->get('translator')->trans('idea.create.error'));
            }
        }

        return ['form' => $form->createView()];
    }

    /**
     * @Route("/ideas/{slug}/delete", name="app_idea_delete", defaults={"_feature_flags" = "ideas"})
     * @Template("CapcoAppBundle:Idea:delete.html.twig")
     *
     * @param $request
     * @param $idea
     *
     * @return array
     */
    public function deleteAction(Idea $idea, Request $request)
    {
        if (false == $idea->canContribute()) {
            throw new AccessDeniedException($this->get('translator')->trans('idea.error.no_contribute', [], 'CapcoAppBundle'));
        }

        if (!$this->get('security.context')->isGranted('ROLE_USER')) {
            throw new AccessDeniedException($this->get('translator')->trans('error.access_restricted', [], 'CapcoAppBundle'));
        }

        $userCurrent = $this->getUser()->getId();
        $userPostIdea = $idea->getAuthor()->getId();

        if ($userCurrent !== $userPostIdea) {
            throw new AccessDeniedException($this->get('translator')->trans('idea.error.not_author', [], 'CapcoAppBundle'));
        }

        //Champ CSRF
        $form = $this->createFormBuilder()->getForm();

        if ($request->getMethod() == 'POST') {
            $form->handleRequest($request);

            if ($form->isValid()) {
                $em = $this->getDoctrine()->getManager();
                $em->remove($idea);
                $em->flush();
                $this->get('session')->getFlashBag()->add('info', $this->get('translator')->trans('idea.delete.success'));

                return $this->redirect($this->generateUrl('app_idea', []));
            } else {
                $this->get('session')->getFlashBag()->add('danger', $this->get('translator')->trans('idea.delete.error'));
            }
        }

        return [
            'idea' => $idea,
            'form' => $form->createView(),
        ];
    }

    /**
     * @Route("/ideas/trashed/{page}", name="app_idea_trashed", requirements={"page" = "\d+"}, defaults={"_feature_flags" = "ideas,idea_trash", "page" = 1} )
     * @Template("CapcoAppBundle:Idea:show_trashed.html.twig")
     *
     * @param $page
     *
     * @return array
     */
    public function showTrashedAction($page)
    {
        if (false === $this->get('security.authorization_checker')->isGranted('ROLE_USER')) {
            throw new AccessDeniedException($this->get('translator')->trans('error.access_restricted', [], 'CapcoAppBundle'));
        }

        $em = $this->getDoctrine()->getManager();

        $pagination = $this->get('capco.site_parameter.resolver')->getValue('ideas.pagination');

        $ideas = $em->getRepository('CapcoAppBundle:Idea')->getTrashed($pagination, $page);
        $publishedIdeasNb = $em->getRepository('CapcoAppBundle:Idea')->countPublished();

        //Avoid division by 0 in nbPage calculation
        $nbPage = 1;
        if ($pagination !== null && $pagination !== 0) {
            $nbPage = ceil(count($ideas) / $pagination);
        }

        return [
            'ideas' => $ideas,
            'publishedIdeasNb' => $publishedIdeasNb,
            'page' => $page,
            'nbPage' => $nbPage,
        ];
    }

    /**
     * @Cache(expires="+1 minutes", maxage="60", smaxage="60", public="true")
     *
     * @param $max
     * @param $offset
     *
     * @return array
     * @Template("CapcoAppBundle:Idea:create.html.twig")
     */
    public function lastIdeasAction($max = 4, $offset = 0)
    {
        $ideas = $this->getDoctrine()->getRepository('CapcoAppBundle:Idea')->getLast($max, $offset);

        return ['ideas' => $ideas];
    }

    /**
     * @Route("/ideas/{slug}/edit", name="app_idea_update", defaults={"_feature_flags" = "ideas"})
     * @Template("CapcoAppBundle:Idea:update.html.twig")
     *
     * @param $request
     * @param $idea
     *
     * @return array
     */
    public function updateAction(Idea $idea,  Request $request)
    {
        if (!$this->get('security.context')->isGranted('ROLE_USER')) {
            throw new AccessDeniedException($this->get('translator')->trans('error.access_restricted', [], 'CapcoAppBundle'));
        }

        if (false == $idea->canContribute()) {
            throw new AccessDeniedException($this->get('translator')->trans('idea.error.no_contribute', [], 'CapcoAppBundle'));
        }

        $userCurrent = $this->getUser()->getId();
        $userPostIdea = $idea->getAuthor()->getId();

        if ($userCurrent !== $userPostIdea) {
            throw new AccessDeniedException($this->get('translator')->trans('idea.error.not_author', [], 'CapcoAppBundle'));
        }

        $form = $this->createForm(new IdeaUpdateType($this->get('capco.toggle.manager')), $idea);
        if ($request->getMethod() == 'POST') {
            $form->handleRequest($request);

            if ($form->isValid()) {
                $em = $this->getDoctrine()->getManager();
                $idea->resetVotes();
                $em->persist($idea);
                $em->flush();

                $this->get('session')->getFlashBag()->add('success', $this->get('translator')->trans('idea.update.success'));

                return $this->redirect($this->generateUrl('app_idea_show', ['slug' => $idea->getSlug()]));
            } else {
                $this->get('session')->getFlashBag()->add('danger', $this->get('translator')->trans('idea.update.error'));
            }
        }

        return [
            'form' => $form->createView(),
            'idea' => $idea,
        ];
    }

    /**
     * @Route("/ideas/{page}", name="app_idea", requirements={"page" = "\d+"}, defaults={"page" = 1, "_feature_flags" = "ideas"} )
     * @Route("/ideas/filter/{theme}/{sort}/{page}", name="app_idea_search", requirements={"page" = "\d+"}, defaults={"page" = 1, "theme" = "all", "sort" = "date", "_feature_flags" = "ideas"} )
     * @Route("/ideas/filter/{theme}/{sort}/{term}/{page}", name="app_idea_search_term", requirements={"page" = "\d+"}, defaults={"page" = 1, "theme" = "all", "sort" = "date", "_feature_flags" = "ideas"} )
     * @Template("CapcoAppBundle:Idea:index.html.twig")
     * @Cache(smaxage="60", public=true)
     */
    public function indexAction(Request $request, $page, $theme = null, $sort = 'last', $term = null)
    {
        $em = $this->getDoctrine()->getManager();
        $currentUrl = $this->generateUrl('app_idea');

        $form = $this->createForm(new IdeaSearchType($this->get('capco.toggle.manager')), null, [
            'action' => $currentUrl,
            'method' => 'POST',
        ]);

        if ($request->getMethod() == 'POST') {
            $form->handleRequest($request);

            if ($form->isValid()) {
                // redirect to the results page (avoids reload alerts)
                $data = $form->getData();

                return $this->redirect($this->generateUrl('app_idea_search_term', [
                    'theme' => array_key_exists('theme', $data) && $data['theme'] ? $data['theme']->getSlug() : Theme::FILTER_ALL,
                    'sort' => $data['sort'],
                    'term' => $data['term'],
                ]));
            }
        } else {
            $form->setData([
                'theme' => $em->getRepository('CapcoAppBundle:Theme')->findOneBySlug($theme),
                'sort' => $sort,
                'term' => $term,
            ]);
        }

        $pagination = $this->get('capco.site_parameter.resolver')->getValue('ideas.pagination');

        $ideas = $em->getRepository('CapcoAppBundle:Idea')->getSearchResults($pagination, $page, $theme, $sort, $term);
        $trashedIdeasNb = $em->getRepository('CapcoAppBundle:Idea')->countTrashed();

        //Avoid division by 0 in nbPage calculation
        $nbPage = 1;
        if ($pagination !== null && $pagination !== 0) {
            $nbPage = ceil(count($ideas) / $pagination);
        }

        return [
            'ideas' => $ideas,
            'form' => $form->createView(),
            'page' => $page,
            'nbPage' => $nbPage,
            'trashedIdeasNb' => $trashedIdeasNb,
        ];
    }

    /**
     * @Route("/ideas/{slug}", name="app_idea_show", defaults={"_feature_flags" = "ideas"})
     * @Template("CapcoAppBundle:Idea:show.html.twig")
     *
     * @param string  $slug
     * @param Request $request
     *
     * @return array
     */
    public function showAction(Request $request, $slug)
    {
        $em = $this->getDoctrine()->getManager();
        $translator = $this->get('translator');

        $idea = $em->getRepository('CapcoAppBundle:Idea')->getOneJoinUserReports($slug, $this->getUser());

        if (!$idea || false === $idea->canDisplay()) {
            throw $this->createNotFoundException($translator->trans('idea.error.not_found', [], 'CapcoAppBundle'));
        }

        $votes = $em->getRepository('CapcoAppBundle:IdeaVote')->findAllByIdea($idea);

        $ideaHelper = $this->get('capco.idea.helper');

        $vote = $ideaHelper->findUserVoteOrCreate($idea, $this->getUser());
        $vote
            ->setUser($this->getUser())
            ->setIpAddress($request->getClientIp())
        ;

        $form = $this->createForm(new IdeaVoteType($this->getUser(), $vote->isConfirmed(), $idea->getIsCommentable()), $vote);

        if ($request->getMethod() == 'POST') {
            if (false == $idea->canContribute()) {
                throw new AccessDeniedException($translator->trans('idea.error.no_contribute', [], 'CapcoAppBundle'));
            }

            $form->handleRequest($request);

            if ($form->isValid()) {
                $vote->setConfirmed(!$vote->isConfirmed());
                $em->persist($vote);
                $em->flush();

                if ($vote->isConfirmed()) {
                    if ($form->has('message') && null != ($message = $form->get('message')->getData())) {
                        $comment = new IdeaComment();

                        $comment
                            ->setAuthor($vote->getUser())
                            ->setAuthorName($vote->getUsername())
                            ->setAuthorEmail($vote->getEmail())
                            ->setBody($message)
                            ->setIdea($idea)
                        ;
                        $em->persist($comment);
                        $this->get('event_dispatcher')->dispatch(
                            CapcoAppBundleEvents::COMMENT_CHANGED,
                            new CommentChangedEvent($comment, 'add')
                        );
                        $em->flush();
                    }

                    $this->get('event_dispatcher')->dispatch(
                        CapcoAppBundleEvents::ABSTRACT_VOTE_CHANGED,
                        new AbstractVoteChangedEvent($vote, 'add')
                    );
                    $em->flush();

                    $this->get('session')->getFlashBag()->add('success', $this->get('translator')->trans('idea.vote.add_success'));
                } else {
                    $this->get('event_dispatcher')->dispatch(
                        CapcoAppBundleEvents::ABSTRACT_VOTE_CHANGED,
                        new AbstractVoteChangedEvent($vote, 'remove')
                    );
                    $em->flush();
                    $this->get('session')->getFlashBag()->add('info', $this->get('translator')->trans('idea.vote.delete_success'));
                }

                return $this->redirect($this->generateUrl('app_idea_show', ['slug' => $idea->getSlug()]));
            }
        }

        return [
            'idea' => $idea,
            'votes' => $votes,
            'form' => $form->createView(),
        ];
    }
}
