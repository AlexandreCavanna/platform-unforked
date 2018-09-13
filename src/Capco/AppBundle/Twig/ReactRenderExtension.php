<?php

namespace Capco\AppBundle\Twig;

use Capco\AppBundle\Toggle\Manager;
use Limenius\ReactRenderer\Twig\ReactRenderExtension as BaseExtension;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ReactRenderExtension extends \Twig_Extension
{
    private $extension;
    private $toggleManager;
    private $tokenStorage;

    public function __construct(
        BaseExtension $extension,
        Manager $toggleManager,
        TokenStorageInterface $tokenStorage
    ) {
        $this->extension = $extension;
        $this->toggleManager = $toggleManager;
        $this->tokenStorage = $tokenStorage;
    }

    public function getFunctions()
    {
        return [
            new \Twig_SimpleFunction(
                'react_render_component',
                [$this, 'reactRenderIntlComponent'],
                ['is_safe' => ['html']]
            ),
        ];
    }

    public function reactRenderIntlComponent($componentName, array $options = [])
    {
        if ($this->tokenStorage->getToken() && $this->tokenStorage->getToken()->getUser()) {
            $options['rendering'] = 'client_side';
        }

        if (!$this->toggleManager->isActive('server_side_rendering')) {
            $options['rendering'] = 'client_side';
        }

        return $this->extension->reactRenderComponent($componentName, $options);
    }
}
