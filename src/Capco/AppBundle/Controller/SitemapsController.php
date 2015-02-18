<?php

namespace Capco\AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class SitemapsController extends Controller
{
    /**
     * @Route("/sitemap.{_format}", name="app_sitemap", requirements={"_format" = "xml"})
     * @Template("CapcoAppBundle:Sitemaps:sitemap.xml.twig")
     *
     * @return array
     */
    public function sitemapAction()
    {
        $toggleManager = $this->get('capco.toggle.manager');
        $em = $this->get('doctrine.orm.entity_manager');
        $urls = array();
        $hostname = $this->get('request_stack')->getCurrentRequest()->getHost();

        // Homepage
        $urls[] = array(
            'loc' => $this->get('router')->generate('app_homepage'),
            'changefreq' => 'weekly',
            'priority' => '1.0',
        );

        // Contact
        $urls[] = array(
            'loc' => $this->get('router')->generate('app_contact'),
            'changefreq' => 'yearly',
            'priority' => '0.1',
        );

        // Pages
        foreach ($em->getRepository('CapcoAppBundle:Page')->findBy(array(
            'isEnabled'=>true,
        )) as $page) {
            $urls[] = array(
                'loc' => $this->get('router')->generate('app_page_show', array('slug' => $page->getSlug())),
                'lastmod' => $page->getUpdatedAt()->format(\DateTime::W3C),
                'changefreq' => 'monthly',
                'priority' => '0.1',
            );
        }

        // Themes
        if ($toggleManager->isActive('themes')) {
            $urls[] = array(
                'loc' => $this->get('router')->generate('app_theme'),
                'changefreq' => 'weekly',
                'priority' => '0.5',
            );
            foreach ($em->getRepository('CapcoAppBundle:Theme')->findBy(array(
                'isEnabled'=>true,
            )) as $theme) {
                $urls[] = array(
                    'loc' => $this->get('router')->generate('app_theme_show', array('slug' => $theme->getSlug())),
                    'lastmod' => $theme->getUpdatedAt()->format(\DateTime::W3C),
                    'changefreq' => 'weekly',
                    'priority' => '0.5',
                );
            }
        }

        // Blog
        if ($toggleManager->isActive('blog')) {
            $urls[] = array(
                'loc' => $this->get('router')->generate('app_blog'),
                'changefreq' => 'daily',
                'priority' => '1.0',
            );
            foreach ($em->getRepository('CapcoAppBundle:Post')->findBy(array(
                'isPublished'=>true,
            )) as $post) {
                $urls[] = array(
                    'loc' => $this->get('router')->generate('app_blog_show', array('slug' => $post->getSlug())),
                    'lastmod' => $post->getUpdatedAt()->format(\DateTime::W3C),
                    'changefreq' => 'daily',
                    'priority' => '1.0',
                );
            }
        }

        // Events
        if ($toggleManager->isActive('calendar')) {
            $urls[] = array(
                'loc' => $this->get('router')->generate('app_event'),
                'changefreq' => 'daily',
                'priority' => '1.0',
            );
            foreach ($em->getRepository('CapcoAppBundle:Event')->findBy(array(
                'isEnabled'=>true,
            )) as $event) {
                $urls[] = array(
                    'loc' => $this->get('router')->generate('app_event_show', array('slug' => $event->getSlug())),
                    'priority' => '1.0',
                    'lastmod' => $post->getUpdatedAt()->format(\DateTime::W3C),
                    'changefreq' => 'daily',
                );
            }
        }

        // Ideas
        if ($toggleManager->isActive('ideas')) {
            $urls[] = array(
                'loc' => $this->get('router')->generate('app_idea'),
                'changefreq' => 'daily',
                'priority' => '1.0',
            );
            foreach ($em->getRepository('CapcoAppBundle:Idea')->findBy(array(
                'isEnabled'=>true,
            )) as $idea) {
                $urls[] = array(
                    'loc' => $this->get('router')->generate('app_idea_show', array('slug' => $idea->getSlug())),
                    'lastmod' => $idea->getUpdatedAt()->format(\DateTime::W3C),
                    'changefreq' => 'daily',
                    'priority' => '1.0',
                );
            }
        }

        // Consultations
        $urls[] = array(
            'loc' => $this->get('router')->generate('app_consultation'),
            'changefreq' => 'weekly',
            'priority' => '0.5',
        );
        foreach ($em->getRepository('CapcoAppBundle:Consultation')->findBy(array(
            'isEnabled'=>true,
        )) as $consultation) {
            $urls[] = array(
                'loc' => $this->get('router')->generate('app_consultation_show', array('slug' => $consultation->getSlug())),
                'priority' => '0.5',
                'lastmod' => $consultation->getUpdatedAt()->format(\DateTime::W3C),
                'changefreq' => 'weekly',
            );
        }

        // Steps
        foreach ($em->getRepository('CapcoAppBundle:Step')->findBy(array(
            'isEnabled'=>true,
        )) as $step) {
            if ($step->getConsultation()->canDisplay()) {
                $urls[] = array(
                    'loc' => $this->get('router')->generate('app_consultation_show_step', array('consultation_slug' => $step->getConsultation()->getSlug(), 'step_slug' => $step->getSlug())),
                    'priority' => '0.5',
                    'lastmod' => $step->getUpdatedAt()->format(\DateTime::W3C),
                    'changefreq' => 'weekly',
                );
            }
        }

        // Opinions
        foreach ($em->getRepository('CapcoAppBundle:Opinion')->findBy(array(
            'isEnabled'=>true,
        )) as $opinion) {
            if ($opinion->canDisplay()) {
                $urls[] = array(
                    'loc' => $this->get('router')->generate('app_consultation_show_opinion', array('consultationSlug' => $opinion->getConsultation()->getSlug(), 'opinionTypeSlug' => $opinion->getOpinionType()->getSlug(), 'opinionSlug' => $opinion->getSlug())),
                    'priority' => '2.0',
                    'lastmod' => $opinion->getUpdatedAt()->format(\DateTime::W3C),
                    'changefreq' => 'hourly',
                );
            }
        }

        return array(
            'urls' => $urls,
            'hostname' => $hostname,
        );

    }
}