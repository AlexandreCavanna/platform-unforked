<?php

namespace Capco\AppBundle\DTO;

class MapboxStyle implements MapTokenStyleInterface
{

    protected $id;
    protected $name;
    protected $publicToken;
    protected $owner;
    protected $version;
    protected $createdAt;
    protected $updatedAt;
    protected $visibility;

    private const PREVIEW_URL = 'https://api.mapbox.com/styles/v1/{owner}/{style_id}/tiles/256/14/8114/5686?access_token=';

    public static function fromMapboxApi(array $response, string $publicToken): self
    {
        $instance = new self();

        $instance
            ->setCreatedAt(new \DateTime($response['created']))
            ->setUpdatedAt(new \DateTime($response['modified']))
            ->setPublicToken($publicToken)
            ->setVersion((int)$response['version'])
            ->setName($response['name'])
            ->setOwner($response['owner'])
            ->setVisibility($response['visibility'])
            ->setId($response['id']);

        return $instance;
    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function setId(string $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getPreviewUrl(): ?string
    {
        $uri = str_replace(['{owner}', '{style_id}'], [$this->owner, $this->id], self::PREVIEW_URL);
        $uri .= $this->publicToken;

        return $uri;
    }

    public function getVisibility(): ?string
    {
        return $this->visibility;
    }

    public function setVisibility(string $visibility): self
    {
        $this->visibility = $visibility;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getVersion(): ?int
    {
        return $this->version;
    }

    public function setVersion(int $version): self
    {
        $this->version = $version;

        return $this;
    }

    public function getOwner(): ?string
    {
        return $this->owner;
    }

    public function setOwner(string $owner): self
    {
        $this->owner = $owner;

        return $this;
    }

    public function getPublicToken(): ?string
    {
        return $this->publicToken;
    }

    public function setPublicToken(string $publicToken): self
    {
        $this->publicToken = $publicToken;

        return $this;
    }

}
