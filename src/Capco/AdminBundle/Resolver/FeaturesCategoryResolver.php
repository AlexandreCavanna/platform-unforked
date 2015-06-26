<?php

namespace Capco\AdminBundle\Resolver;

use Capco\AppBundle\Toggle\Manager;

class FeaturesCategoryResolver
{
    protected static $categories = array(
        'pages.blog' => [
            'conditions' => ['blog'],
            'features' => [],
        ],
        'pages.events' => [
            'conditions' => ['calendar'],
            'features' => [],
        ],
        'pages.ideas' => [
            'conditions' => ['ideas'],
            'features' => ['idea_creation'],
        ],
        'pages.themes' => [
            'conditions' => ['themes'],
            'features' => [],
        ],
        'pages.consultations' => [
            'conditions' => [],
            'features' => ['consultations_form'],
        ],
        'pages.registration' => [
            'conditions' => ['registration'],
            'features' => ['user_type'],
        ],
        'pages.members' => [
            'conditions' => ['members_list'],
            'features' => [],
        ],
        'pages.login' => [
            'conditions' => [],
            'features' => ['login_facebook', 'login_gplus', 'login_twitter'],
        ],
        'settings.global' => [
            'conditions' => [],
            'features' => [],
        ],
        'settings.modules' => [
            'conditions' => [],
            'features' => ['blog', 'calendar', 'ideas', 'themes', 'registration', 'members_list', 'reporting', 'newsletter', 'share_buttons'],
        ],
        'settings.shield_mode' => [
            'conditions' => [],
            'features' => ['shield_mode'],
        ]
    );

    protected $manager;

    public function __construct(Manager $manager)
    {
        $this->manager = $manager;
    }

    public function isCategoryEnabled($category)
    {
        if (!array_key_exists($category, $this::$categories)) {
            return false;
        }
        return $this->manager->hasOneActive($this::$categories[$category]['conditions']);
    }

    public function isAdminEnabled($admin)
    {
        if (method_exists($admin, 'getFeatures')) {
            return $this->manager->hasOneActive($admin->getFeatures());
        }
        return true;
    }

    public function getTogglesByCategory($category)
    {
        $toggles = [];
        if (array_key_exists($category, $this::$categories)) {
            foreach ($this::$categories[$category]['features'] as $feature) {
                $toggles[$feature] = $this->manager->isActive($feature);
            }
        }

        return $toggles;
    }

    public function findCategoryForToggle ($toggle)
    {
        foreach (self::$categories as $name => $category) {
            if (in_array($toggle, $category['features'])) {
                return $name;
            }
        }

        return null;
    }

    public function getEnabledPagesCategories() {

        $categories = [];
        foreach ($this::$categories as $name => $cat) {
            if (strrpos($name, 'pages.') === 0 && $this->manager->hasOneActive($cat['conditions'])) {
                $categories[] = $name;
            }
        }

        return $categories;
    }

    public function getEnabledSettingsCategories() {

        $categories = [];
        foreach ($this::$categories as $name => $cat) {
            if (strrpos($name, 'settings.') === 0 && $this->manager->hasOneActive($cat['conditions'])) {
                $categories[] = $name;
            }
        }

        return $categories;
    }

    public function getGroupNameForCategory($category)
    {
        if (strrpos($category, 'settings.') === 0) {
            return 'admin.group.parameters';
        } elseif(strrpos($category, 'pages.') === 0) {
            return 'admin.group.pages';
        }
        return null;
    }
}
