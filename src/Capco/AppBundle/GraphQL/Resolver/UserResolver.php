<?php

namespace Capco\AppBundle\GraphQL\Resolver;

use Capco\UserBundle\Entity\User;
use Overblog\GraphQLBundle\Definition\Argument as Arg;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerAwareTrait;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class UserResolver implements ContainerAwareInterface
{
    use ContainerAwareTrait;

    public function resolveUserType()
    {
        $typeResolver = $this->container->get('overblog_graphql.type_resolver');

        return $typeResolver->resolve('user');
    }

    public function resolve(Arg $args)
    {
        $repo = $this->container->get('capco.user.repository');
        if (isset($args['id'])) {
            return [$repo->find($args['id'])];
        }

        if (isset($args['superAdmin']) && $args['superAdmin'] === true) {
            return [$repo->getAllUsersWithoutSuperAdmin()];
        }

        return $repo->findAll();
    }

    public function resolveEmail($object): string
    {
        if (strpos($object->getEmail(), 'twitter_') === 0) {
            return '';
        }

        return $object->getEmail();
    }

    public function resolveCreatedAt($object): string
    {
        return $object->getCreatedAt() ? $object->getCreatedAt()->format(\DateTime::ATOM) : '';
    }

    public function resolveUrl(User $user)
    {
        $manager = $this->container->get('capco.toggle.manager');
        $router = $this->container->get('router');
        if ($manager->isActive('profiles')) {
            return $router->generate('capco_user_profile_show_all', ['slug' => $user->getSlug()], UrlGeneratorInterface::ABSOLUTE_URL);
        }

        return null;
    }

    public function resolveUpdatedAt($object): string
    {
        return $object->getUpdatedAt() ? $object->getUpdatedAt()->format(\DateTime::ATOM) : '';
    }

    public function resolveDateOfBirth($object): string
    {
        return $object->getDateOfBirth() ? $object->getDateOfBirth()->format(\DateTime::ATOM) : '';
    }

    public function resolvePhoneConfirmationSentAt($object): string
    {
        return $object->getSmsConfirmationSentAt() ? $object->getSmsConfirmationSentAt()->format(\DateTime::ATOM) : '';
    }

    public function resolveLastLogin($object): string
    {
        return $object->getLastLogin() ? $object->getLastLogin()->format(\DateTime::ATOM) : '';
    }

    public function resolveType($object): string
    {
        $convertedRoles = array_map(function ($role) {
            return str_replace(
                ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN'],
                ['Utilisateur', 'Administrateur', 'Super Admin'],
                $role
            );
        }, $object->getRoles());

        return implode('|', $convertedRoles);
    }

    public function resolveGender($object): string
    {
        if ($object->getGender() === 'u') {
            return 'Non communiqué';
        }
        if ($object->getGender() === 'm') {
            return 'Homme';
        }

        return 'Femme';
    }
}
