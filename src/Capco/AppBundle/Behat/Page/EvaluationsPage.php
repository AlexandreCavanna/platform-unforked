<?php

namespace Capco\AppBundle\Behat\Page;

use Capco\AppBundle\Behat\PageTrait;
use SensioLabs\Behat\PageObjectExtension\PageObject\Page;

class EvaluationsPage extends Page
{
    use PageTrait;

    protected $path = '/evaluations';
}
