<?php

namespace Capco\AppBundle\Command;

use Box\Spout\Common\Exception\SpoutException;
use Box\Spout\Common\Type;
use Box\Spout\Writer\CSV\Writer;
use Box\Spout\Writer\WriterFactory;
use Box\Spout\Writer\WriterInterface;
use Capco\AppBundle\Notifier\UserNotifier;
use Capco\UserBundle\Entity\User;
use Capco\UserBundle\Repository\UserRepository;
use Capco\AppBundle\Helper\ConvertCsvToArray;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Capco\AppBundle\Entity\Responses\ValueResponse;
use Capco\AppBundle\Repository\RegistrationFormRepository;
use Symfony\Component\Console\Helper\ProgressBar;

class CreateUserAccountsFromCSVCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this->setName('capco:create-users-account-from-csv')
            ->addArgument(
                'input',
                InputArgument::REQUIRED,
                'Please provide the path of the file you want to use.'
            )
            ->addArgument(
                'output',
                InputArgument::REQUIRED,
                'Please provide the path of the export.'
            );
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();
        $sendEmail = false; // Not used for now
        $inputFilePath = $input->getArgument('input');
        $outputFilePath = $input->getArgument('output');
        $rows = $container->get(ConvertCsvToArray::class)->convert($inputFilePath);
        $userManager = $container->get('fos_user.user_manager');
        $tokenGenerator = $container->get('fos_user.util.token_generator');
        $router = $container->get('router');

        $createdCount = 0;

        try {
            /** @var Writer $writer */
            $writer = WriterFactory::create(Type::CSV);
            $writer->setShouldAddBOM(false);
            $writer->openToFile($outputFilePath);
            $writer->addRow(['email', 'confirmation_link']);
        } catch (SpoutException $spoutException) {
            throw new \RuntimeException(__METHOD__ . $spoutException->getMessage());
        }

        $deduplicatedRows = [];

        $registrationForm = $container->get(RegistrationFormRepository::class)->findCurrent();
        $questions = $registrationForm->getRealQuestions();

        $userRepo = $container->get(UserRepository::class);

        // We deduplicate rows by email
        foreach ($rows as $row) {
            $niddle = $row['email'];
            if (isset($deduplicatedRows[$niddle])) {
                continue;
            }
            $deduplicatedRows[$niddle] = $row;
        }
        if (\count($rows) > \count($deduplicatedRows)) {
            $output->write(
                'Skipping ' . (\count($rows) - \count($deduplicatedRows)) . ' duplicated email(s).'
            );
        }

        $progressBar = new ProgressBar($output, \count($deduplicatedRows));
        $progressBar->start();
        foreach ($deduplicatedRows as $row) {
            $progressBar->advance();
            $email = filter_var($row['email'], FILTER_SANITIZE_EMAIL);

            try {
                $previousUser = $userRepo->findOneByEmail($email);
                if ($previousUser) {
                    $output->write('Skipping existing user: ' . $email);

                    continue;
                }

                /** @var User $user */
                $user = $userManager->createUser();
                $user->setUsername($row['username']);
                $user->setEmail($email);
                $user->setConfirmationToken($tokenGenerator->generateToken());
                $user->setResetPasswordToken($tokenGenerator->generateToken());
                $user->setEnabled(false);

                // Handle custom questions
                if ($questions->count() > 0) {
                    foreach ($questions as $question) {
                        if (isset($row[$question->getTitle()])) {
                            $value = $row[$question->getTitle()];
                            $response = new ValueResponse();
                            $response->setValue($value);
                            $response->setQuestion($question);
                            $user->addResponse($response);
                        }
                    }
                }
                $userManager->updateUser($user);
                $confirmationUrl = $router->generate(
                    'account_confirm_email',
                    [
                        'token' => $user->getConfirmationToken()
                    ],
                    true
                );
                if ($sendEmail) {
                    $this->getContainer()
                        ->get(UserNotifier::class)
                        ->emailConfirmation($user);
                }
                $writer->addRow([$user->getEmail(), $confirmationUrl]);
                ++$createdCount;
            } catch (\Exception $e) {
                $output->write($e->getMessage());
                $output->write('Failed to create user : ' . $email);
            }
        }
        if ($writer instanceof WriterInterface) {
            $writer->close();
        }
        $progressBar->finish();
        $output->write($createdCount . ' users created.');
    }
}
