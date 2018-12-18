<?php

namespace Capco\AppBundle\Entity;

use Capco\AppBundle\Enum\MapProviderEnum;
use Doctrine\ORM\Mapping as ORM;
use Capco\AppBundle\Traits\UuidTrait;
use Capco\AppBundle\Traits\TimestampableTrait;

/**
 * @ORM\Entity(repositoryClass="Capco\AppBundle\Repository\MapTokenRepository")
 * @ORM\Table(name="map_token")
 */
class MapToken
{
    use UuidTrait;
    use TimestampableTrait;

    /**
     * @ORM\Column(name="public_token", type="string", nullable=false)
     */
    protected $publicToken;

    /**
     * @ORM\Column(name="secret_token", type="string", nullable=true)
     */
    protected $secretToken;

    /**
     * @ORM\Column(name="provider", type="string", columnDefinition="ENUM('mapbox')", nullable=false)
     */
    protected $provider = MapProviderEnum::MAPBOX;

    public function getPublicToken(): ?string
    {
        return $this->publicToken;
    }

    public function setPublicToken(string $publicToken): self
    {
        $this->publicToken = $publicToken;

        return $this;
    }

    public function getSecretToken(): ?string
    {
        return $this->secretToken;
    }

    public function setSecretToken(?string $secretToken): self
    {
        $this->secretToken = $secretToken ?
            $secretToken !== "" ?
                $secretToken : null
            : null;

        return $this;
    }

    public function getProvider(): ?string
    {
        return $this->provider;
    }

    public function setProvider(string $provider): self
    {
        if (!MapProviderEnum::isProviderValid($provider)) {
            throw new \InvalidArgumentException(
                sprintf(
                    "Invalid provider '%s'. Available providers : %s",
                    $provider,
                    implode(', ', MapProviderEnum::getAvailableProviders())
                )
            );
        }

        $this->provider = $provider;

        return $this;
    }
}
