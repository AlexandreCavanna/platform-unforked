<?php

namespace Capco\AdminBundle\Resolver;

use Capco\AppBundle\Helper\EnvHelper;
use Capco\AppBundle\Toggle\Manager;
use Symfony\Component\Security\Core\Authorization\AuthorizationChecker;

class FeaturesCategoryResolver
{
    protected static $categories = [
        'pages.homepage' => ['conditions' => [], 'features' => []],
        'pages.blog' => ['conditions' => ['blog'], 'features' => []],
        'pages.events' => ['conditions' => ['calendar'], 'features' => []],
        'pages.themes' => ['conditions' => ['themes'], 'features' => []],
        'pages.projects' => ['conditions' => [], 'features' => ['projects_form', 'project_trash']],
        'pages.registration' => [
            'conditions' => [],
            'features' => ['user_type', 'zipcode_at_register'],
        ],
        'pages.members' => ['conditions' => ['members_list'], 'features' => []],
        'pages.login' => ['conditions' => [], 'features' => []],
        'pages.contact' => ['conditions' => [], 'features' => []],
        'pages.footer' => ['conditions' => [], 'features' => []],
        'pages.charter' => ['conditions' => [], 'features' => []],
        'pages.shield' => ['conditions' => [], 'features' => ['shield_mode']],
        'settings.global' => ['conditions' => [], 'features' => []],
        'settings.performance' => ['conditions' => [], 'features' => []],
        'settings.modules' => [
            'conditions' => [],
            'features' => [
                'blog',
                'calendar',
                'consultation_plan',
                'display_map',
                'versions',
                'themes',
                'districts',
                'members_list',
                'profiles',
                'reporting',
                'newsletter',
                'share_buttons',
                'search',
                'votes_evolution',
                'server_side_rendering',
                'export',
                'indexation',
                'developer_documentation',
            ],
        ],
        'settings.notifications' => ['conditions' => [], 'features' => []],
        'settings.appearance' => ['conditions' => [], 'features' => []],
    ];

    protected $manager;
    protected $authorizationChecker;

    public function __construct(Manager $manager, AuthorizationChecker $authorizationChecker)
    {
        $this->manager = $manager;
        $this->authorizationChecker = $authorizationChecker;
    }

    public function isCategoryEnabled(string $category): bool
    {
        if (!isset(self::$categories[$category])) {
            return false;
        }

        return $this->manager->hasOneActive(self::$categories[$category]['conditions']);
    }

    /**
     * @param User $admin
     */
    public function isAdminEnabled($admin): bool
    {
        if (method_exists($admin, 'getFeatures')) {
            return $this->manager->hasOneActive($admin->getFeatures());
        }

        return true;
    }

    public function getTogglesByCategory(string $category): array
    {
        $toggles = [];
        if (isset(self::$categories[$category])) {
            foreach (self::$categories[$category]['features'] as $feature) {
                if (
                    'display_map' === $feature &&
                    $this->authorizationChecker->isGranted('ROLE_SUPER_ADMIN')
                ) {
                    $toggles[$feature] = $this->manager->isActive($feature);

                    continue;
                }
                if ('display_map' !== $feature) {
                    $toggles[$feature] = $this->manager->isActive($feature);

                    continue;
                }
            }
        }

        if ('settings.modules' === $category && EnvHelper::get('SYMFONY_LOGIN_SAML_ALLOWED')) {
            $toggles['login_saml'] = $this->manager->isActive('login_saml');
        }

        if ('settings.modules' === $category && EnvHelper::get('SYMFONY_LOGIN_PARIS_ALLOWED')) {
            $toggles['login_paris'] = $this->manager->isActive('login_paris');
        }

        if ('settings.modules' === $category && EnvHelper::get('SYMFONY_LOGIN_OPENID_ALLOWED')) {
            $toggles['login_openid'] = $this->manager->isActive('login_openid');
        }

        return $toggles;
    }

    public function findCategoryForToggle(string $toggle): ?string
    {
        foreach (self::$categories as $name => $category) {
            if (\in_array($toggle, $category['features'], true)) {
                return $name;
            }
        }

        return null;
    }

    public function getEnabledPagesCategories(): array
    {
        $categories = [];
        foreach (self::$categories as $name => $cat) {
            if (
                0 === strrpos($name, 'pages.') &&
                $this->manager->hasOneActive($cat['conditions'])
            ) {
                $categories[] = $name;
            }
        }

        return $categories;
    }

    public function getEnabledSettingsCategories(): array
    {
        $categories = [];
        foreach (self::$categories as $name => $cat) {
            if (
                0 === strrpos($name, 'settings.') &&
                $this->manager->hasOneActive($cat['conditions'])
            ) {
                $categories[] = $name;
            }
        }

        return $categories;
    }

    public function getGroupNameForCategory(string $category): ?string
    {
        if (0 === strrpos($category, 'settings.')) {
            return 'admin.group.parameters';
        }
        if (0 === strrpos($category, 'pages.')) {
            return 'admin.group.pages';
        }
    }
}
