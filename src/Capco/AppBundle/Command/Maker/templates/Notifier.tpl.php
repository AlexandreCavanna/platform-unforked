<?php echo "<?php\n"; ?>

namespace Capco\AppBundle\Notifier;

use Capco\AppBundle\GraphQL\Resolver\UserResolver;
use Capco\AppBundle\Mailer\MailerService;
use Capco\AppBundle\SiteParameter\Resolver;

final class <?php echo $command_class_name; ?> extends <?php echo $command_notifier_type; ?><?php echo PHP_EOL; ?>
{
    public function __construct(MailerService $mailer, Resolver $siteParams, UserResolver $userResolver)
    {
        parent::__construct($mailer, $siteParams, $userResolver);
        // Add here any services / resolver... you need
    }
}

