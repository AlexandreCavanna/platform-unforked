<?php

namespace spec\Capco\UserBundle\Security;

use Capco\UserBundle\Security\SessionWithJsonHandler;
use PhpSpec\ObjectBehavior;
use Predis\ClientInterface;
use Capco\UserBundle\Entity\User;
use Symfony\Component\Security\Core\Security as SymfonySecurity;

class SessionWithJsonHandlerSpec extends ObjectBehavior
{
    private static $symfonySession = '_sf2_attributes|a:2:{s:8:"theToken";s:617:"a:3:{i:0;N;i:1;s:4:"main";i:2;a:5:{i:0;C:28:"Capco\UserBundle\Entity\User":196:{a:8:{i:0;s:60:"$2y$12$PNJXUUnSzW8wpqLTHVloH.u2icbevOD1Mn73TlYORRnSJQsRddm6.";i:1;N;i:2;s:5:"admin";i:3;s:5:"admin";i:4;b:1;i:5;s:9:"userAdmin";i:6;s:14:"admin@test.com";i:7;s:14:"admin@test.com";}}i:1;b:1;i:2;a:2:{i:0;O:41:"Symfony\Component\Security\Core\Role\Role":1:{s:47:"Symfony\Component\Security\Core\Role\Rolerole";s:10:"ROLE_ADMIN";}i:1;O:41:"Symfony\Component\Security\Core\Role\Role":1:{s:47:"Symfony\Component\Security\Core\Role\Rolerole";s:9:"ROLE_USER";}}i:3;a:0:{}i:4;a:2:{i:0;s:10:"ROLE_ADMIN";i:1;s:9:"ROLE_USER";}}}";s:14:"_security_main";s:697:"O:74:"Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken":3:{i:0;N;i:1;s:4:"main";i:2;a:5:{i:0;C:28:"Capco\UserBundle\Entity\User":196:{a:8:{i:0;s:60:"$2y$12$PNJXUUnSzW8wpqLTHVloH.u2icbevOD1Mn73TlYORRnSJQsRddm6.";i:1;N;i:2;s:5:"admin";i:3;s:5:"admin";i:4;b:1;i:5;s:9:"userAdmin";i:6;s:14:"admin@test.com";i:7;s:14:"admin@test.com";}}i:1;b:1;i:2;a:2:{i:0;O:41:"Symfony\Component\Security\Core\Role\Role":1:{s:47:"Symfony\Component\Security\Core\Role\Rolerole";s:10:"ROLE_ADMIN";}i:1;O:41:"Symfony\Component\Security\Core\Role\Role":1:{s:47:"Symfony\Component\Security\Core\Role\Rolerole";s:9:"ROLE_USER";}}i:3;a:0:{}i:4;a:2:{i:0;s:10:"ROLE_ADMIN";i:1;s:9:"ROLE_USER";}}}";}_sf2_meta|a:3:{s:1:"u";i:1627579277;s:1:"c";i:1627579277;s:1:"l";s:7:"1209600";}';

    public function it_is_initializable(): void
    {
        $this->shouldHaveType(SessionWithJsonHandler::class);
    }

    public function let(ClientInterface $redis, SymfonySecurity $security)
    {
        $this->beConstructedWith($redis, $security, [], '', true);
    }

    public function it_match_symfony_session_after_decode(User $viewer)
    {
        $this->mockViewerJsonSessionData($viewer);
        $encoded = $this->encode(self::$symfonySession, $viewer);
        $this->decode($encoded)->shouldBe(self::$symfonySession);
    }

    public function it_encode_correctly_with_json_separator(User $viewer)
    {
        $this->mockViewerJsonSessionData($viewer);
        $this->encode(self::$symfonySession, $viewer)->shouldBe(
            self::$symfonySession .
                '___JSON_SESSION_SEPARATOR__' .
                '{"viewer":{"email":"user@email.com","username":"user","id":"VXNlcjoxMjM0","isAdmin":true,"isSuperAdmin":true,"isProjectAdmin":true,"isAdminOrganization":true}}'
        );
    }

    public function it_can_decode_a_legacy_session_without_json_separator()
    {
        $this->decode(self::$symfonySession)->shouldBe(self::$symfonySession);
    }

    private function mockViewerJsonSessionData(User $viewer)
    {
        $viewer->getEmail()->willReturn('user@email.com');
        $viewer->getUsername()->willReturn('user');
        $viewer->getId()->willReturn('1234');
        $viewer->isAdmin()->willReturn(true);
        $viewer->isSuperAdmin()->willReturn(true);
        $viewer->isProjectAdmin()->willReturn(true);
        $viewer->isAdminOrganization()->willReturn(true);
    }
}
