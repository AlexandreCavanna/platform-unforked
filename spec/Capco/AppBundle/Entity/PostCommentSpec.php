<?php

namespace spec\Capco\AppBundle\Entity;

use PhpSpec\ObjectBehavior;
use Capco\AppBundle\Model\Publishable;
use Capco\AppBundle\Entity\PostComment;
use Capco\AppBundle\Entity\Interfaces\Trashable;

class PostCommentSpec extends ObjectBehavior
{
    public function it_is_initializable()
    {
        $this->shouldHaveType(PostComment::class);
    }

    public function it_is_a_publishable()
    {
        $this->shouldImplement(Publishable::class);
    }

    public function it_is_a_trashable()
    {
        $this->shouldImplement(Trashable::class);
    }
}
