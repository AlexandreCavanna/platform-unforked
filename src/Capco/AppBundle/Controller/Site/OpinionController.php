<?php

namespace Capco\AppBundle\Controller\Site;

use Capco\AppBundle\Entity\Opinion;
use Capco\AppBundle\Entity\Project;
use Capco\AppBundle\Entity\Steps\ConsultationStep;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Cache;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class OpinionController extends Controller
{
    /**
     * @Route("/projects/{projectSlug}/consultation/{stepSlug}/types/{opinionTypeSlug}/page/{page}", name="app_project_show_opinions", requirements={"page" = "\d+", "opinionTypeSlug" = ".+"}, defaults={"page" = 1})
     * @Route("/projects/{projectSlug}/consultation/{stepSlug}/types/{opinionTypeSlug}/page/{page}/sort/{opinionsSort}/", name="app_project_show_opinions_sorted", requirements={"page" = "\d+","opinionsSort" = "last|old|comments|favorable|votes|positions|random", "opinionTypeSlug" = ".+"}, defaults={"page" = 1})
     * @Route("/project/{projectSlug}/consultation/{stepSlug}/types/{opinionTypeSlug}/page/{page}", name="app_consultation_show_opinions", requirements={"page" = "\d+", "opinionTypeSlug" = ".+"}, defaults={"page" = 1})
     * @Route("/project/{projectSlug}/consultation/{stepSlug}/types/{opinionTypeSlug}/page/{page}/sort/{opinionsSort}", name="app_consultation_show_opinions_sorted", requirements={"page" = "\d+","opinionsSort" = "last|old|comments|favorable|votes|positions|random", "opinionTypeSlug" = ".+"}, defaults={"page" = 1})
     * @ParamConverter("project", class="CapcoAppBundle:Project", options={"mapping": {"projectSlug": "slug"}})
     * @ParamConverter("currentStep", class="CapcoAppBundle:Steps\ConsultationStep", options={"mapping": {"stepSlug": "slug"}})
     * @Template("CapcoAppBundle:Consultation:show_by_type.html.twig")
     * @Cache(smaxage=60, public=true)
     */
    public function showByTypeAction(Project $project, ConsultationStep $currentStep, string $opinionTypeSlug, int $page, Request $request, string $opinionsSort = null)
    {
        if (!$currentStep->canDisplay()) {
            throw $this->createNotFoundException($this->get('translator')->trans('project.error.not_found', [], 'CapcoAppBundle'));
        }

        $opinionTypesResolver = $this->get('capco.opinion_types.resolver');
        $opinionType = $opinionTypesResolver->findByStepAndSlug($currentStep, $opinionTypeSlug);

        $filter = $opinionsSort ?: $opinionType->getDefaultFilter();
        $currentUrl = $this
            ->generateUrl('app_consultation_show_opinions', [
                'projectSlug' => $project->getSlug(),
                'stepSlug' => $currentStep->getSlug(),
                'opinionTypeSlug' => $opinionType->getSlug(),
                'page' => $page,
            ]);
        $opinions = $this->get('capco.opinion.repository')->getByOpinionTypeOrdered($opinionType->getId(), 10, $page, $filter);

        return [
            'currentUrl' => $currentUrl,
            'project' => $project,
            'opinionType' => $opinionType,
            'opinions' => $opinions,
            'page' => $page,
            'nbPage' => ceil(\count($opinions) / 10),
            'opinionsSort' => $filter,
            'opinionSortOrders' => Opinion::$sortCriterias,
            'currentStep' => $currentStep,
            'currentRoute' => $request->get('_route'),
        ];
    }

    /**
     * @Route("/projects/{projectSlug}/consultation/{stepSlug}/opinions/{opinionTypeSlug}/{opinionSlug}/versions/{versionSlug}", name="app_project_show_opinion_version", requirements={"opinionTypeSlug" = ".+"})
     * @Route("/consultations/{projectSlug}/consultation/{stepSlug}/opinions/{opinionTypeSlug}/{opinionSlug}/versions/{versionSlug}", name="app_consultation_show_opinion_version", requirements={"opinionTypeSlug" = ".+"})
     * @Template("CapcoAppBundle:Opinion:show_version.html.twig")
     * @Cache(smaxage=60, public=true)
     */
    public function showOpinionVersionAction(string $projectSlug, string $stepSlug, string $opinionTypeSlug, string $opinionSlug, string $versionSlug)
    {
        $opinion = $this->get('capco.opinion.repository')->getOneBySlugJoinUserReports($opinionSlug, $this->getUser());
        $version = $this->get('capco.opinion_version.repository')->findOneBySlug($versionSlug);

        if (!$opinion || !$version || !$version->canDisplay()) {
            throw $this->createNotFoundException($this->get('translator')->trans('opinion.error.not_found', [], 'CapcoAppBundle'));
        }

        $currentStep = $opinion->getStep();
        $sources = $this->get('capco.source.repository')->getByOpinionJoinUserReports($opinion, $this->getUser());
        $backLink = $this->generateUrl('app_project_show_opinion', [
          'projectSlug' => $projectSlug,
          'stepSlug' => $stepSlug,
          'opinionTypeSlug' => $opinionTypeSlug,
          'opinionSlug' => $opinionSlug,
        ]);

        return [
            'version' => $version,
            'currentStep' => $currentStep,
            'project' => $currentStep->getProject(),
            'opinion' => $opinion,
            'backLink' => $backLink,
            'sources' => $sources,
            'opinionType' => $opinion->getOpinionType(),
            'votes' => $opinion->getVotes(),
        ];
    }

    /**
     * @Route("/projects/{projectSlug}/consultation/{stepSlug}/opinions/{opinionTypeSlug}/{opinionSlug}", name="app_project_show_opinion", requirements={"opinionTypeSlug" = ".+"})
     * @Route("/consultations/{projectSlug}/consultation/{stepSlug}/opinions/{opinionTypeSlug}/{opinionSlug}", name="app_consultation_show_opinion", requirements={"opinionTypeSlug" = ".+"})
     * @Route("/projects/{projectSlug}/consultation/{stepSlug}/opinions/{opinionTypeSlug}/{opinionSlug}/sort_arguments/{argumentSort}", name="app_project_show_opinion_sortarguments", requirements={"argumentsSort" = "popularity|date", "opinionTypeSlug" = ".+"})
     * @Route("/consultations/{projectSlug}/consultation/{stepSlug}/opinions/{opinionTypeSlug}/{opinionSlug}/sort_arguments/{argumentSort}", name="app_consultation_show_opinion_sortarguments", requirements={"argumentsSort" = "popularity|date", "opinionTypeSlug" = ".+"})
     * @Template("CapcoAppBundle:Opinion:show.html.twig")
     * @Cache(smaxage=60, public=true)
     */
    public function showOpinionAction(string $projectSlug, string $stepSlug, string $opinionTypeSlug, string $opinionSlug)
    {
        $opinion = $this->get('capco.opinion.repository')->getOneBySlugJoinUserReports($opinionSlug, $this->getUser());

        if (!$opinion || !$opinion->canDisplay()) {
            throw $this->createNotFoundException($this->get('translator')->trans('opinion.error.not_found', [], 'CapcoAppBundle'));
        }

        $currentUrl = $this->generateUrl('app_project_show_opinion', ['projectSlug' => $projectSlug, 'stepSlug' => $stepSlug, 'opinionTypeSlug' => $opinionTypeSlug, 'opinionSlug' => $opinionSlug]);
        $currentStep = $opinion->getStep();

        $steps = $this->get('capco.abstract_step.repository')->getByProjectSlug($projectSlug);

        $urlResolver = $this->get('capco.url.resolver');

        // Very bad for performances, because per user
        //
        // $referer = $request->headers->get('referer');
        // $availableRoutes = [
        //     'app_project_show_opinions',
        //     'app_project_show_opinions_sorted',
        //     'app_project_show_consultation',
        //     'app_consultation_show_opinions',
        //     'app_consultation_show_opinions_sorted',
        // ];
        // $baseUrl = $request->getHost();
        // $pathinfos = substr($referer, strpos($referer, $baseUrl) + strlen($baseUrl));
        // $currentRoute = '';
        // try {
        //     $currentRoute = $this->get('router')->match($pathinfos)['_route'];
        // } catch (\Exception $e) {
        // }
        // $backLink = $referer &&
        //     filter_var($referer, FILTER_VALIDATE_URL) !== false &&
        //     in_array($currentRoute, $availableRoutes, true)
        //         ? $referer
        //         : $urlResolver->getStepUrl($currentStep, UrlGeneratorInterface::ABSOLUTE_URL)
        // ;
        $backLink = $urlResolver->getStepUrl($currentStep, UrlGeneratorInterface::ABSOLUTE_URL);

        return [
            'currentUrl' => $currentUrl,
            'currentStep' => $currentStep,
            'project' => $currentStep->getProject(),
            'opinion' => $opinion,
            'backLink' => $backLink,
            'opinionType' => $opinion->getOpinionType(),
            'project_steps' => $steps,
        ];
    }
}
