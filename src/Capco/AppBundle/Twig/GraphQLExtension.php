<?php

namespace Capco\AppBundle\Twig;

use Capco\AppBundle\Entity\Consultation;
use Capco\AppBundle\Entity\Questionnaire;
use Capco\AppBundle\Entity\Steps\CollectStep;
use Capco\AppBundle\Repository\ConsultationRepository;
use Overblog\GraphQLBundle\Relay\Node\GlobalId;
use Capco\AppBundle\Repository\CollectStepRepository;
use Capco\AppBundle\Repository\QuestionnaireRepository;
use Capco\AppBundle\GraphQL\ConnectionBuilder;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class GraphQLExtension extends AbstractExtension
{
    private $collectStepRepo;
    private $questionnaireRepo;
    private $consultationRepository;

    public function __construct(
        CollectStepRepository $collectStepRepo,
        QuestionnaireRepository $questionnaireRepo,
        ConsultationRepository $consultationRepository
    ) {
        $this->collectStepRepo = $collectStepRepo;
        $this->questionnaireRepo = $questionnaireRepo;
        $this->consultationRepository = $consultationRepository;
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('graphql_offset_to_cursor', [$this, 'getOffsetToCursor']),
            new TwigFunction('graphql_list_collect_steps', [$this, 'getCollectSteps']),
            new TwigFunction('graphql_list_questionnaires', [$this, 'getQuestionnaires']),
            new TwigFunction('graphql_list_consultations', [$this, 'getConsultations'])
        ];
    }

    public function getOffsetToCursor(int $key): string
    {
        return ConnectionBuilder::offsetToCursor($key);
    }

    public function getCollectSteps(): array
    {
        $steps = $this->collectStepRepo->findAll();

        return array_map(static function (CollectStep $step) {
            return [
                'id' => GlobalId::toGlobalId('CollectStep', $step->getId()),
                'label' => (string) $step
            ];
        }, $steps);
    }

    public function getQuestionnaires(): array
    {
        $questionnaires = $this->questionnaireRepo->findAll();

        return array_map(static function (Questionnaire $questionnaire) {
            return [
                'id' => GlobalId::toGlobalId('Questionnaire', $questionnaire->getId()),
                'label' => (string) $questionnaire
            ];
        }, $questionnaires);
    }

    public function getConsultations(): array
    {
        $consultations = $this->consultationRepository->findAll();

        return array_map(static function (Consultation $consultation) {
            return [
                'id' => GlobalId::toGlobalId('Consultation', $consultation->getId()),
                'label' => (string) $consultation
            ];
        }, $consultations);
    }
}
