import React, { useEffect } from 'react'
import { Accordion, Box, Button, CapUIAccordionColor, Flex, FormLabel, Text, toast } from '@cap-collectif/ui'
import { useIntl } from 'react-intl'
import { FormProvider, useForm } from 'react-hook-form'
import { FieldInput, FormControl } from '@cap-collectif/form'
import UpdateQuestionnaireStepMutation from '@mutations/UpdateQuestionnaireStepMutation'
import TextEditor from '../../Form/TextEditor/TextEditor'
import { graphql, useLazyLoadQuery } from 'react-relay'
import { QuestionnaireStepFormQuery } from '@relay/QuestionnaireStepFormQuery.graphql'
import { UpdateQuestionnaireStepInput } from '@relay/UpdateQuestionnaireStepMutation.graphql'
import { mutationErrorToast } from '@utils/mutation-error-toast'
import { useNavBarContext } from '@components/NavBar/NavBar.context'
import { StepDurationTypeEnum, EnabledEnum } from '../DebateStep/DebateStepForm'
import QuestionnaireStepRequirementsTabs from '@components/Requirements/QuestionnaireStepRequirementsTabs'
import { getRequirementsInput, RequirementsFormValues } from '@components/Requirements/Requirements'
import QuestionnaireStepOptionalParameters from './QuestionnaireStepFormOptionalParameters'
import QuestionnaireStepFormQuestionnaireTab from './QuestionnaireStepFormQuestionnaireTab'
import { formatQuestionsInput, getDefaultValues } from './utils'
import UpdateQuestionnaireMutation from '@mutations/UpdateQuestionnaireMutation'
import { QuestionInput } from '@relay/UpdateQuestionnaireMutation.graphql'
import { onBack } from '@components/Steps/utils'
import useUrlState from '@hooks/useUrlState'

type Props = {
  stepId: string
  setHelpMessage: React.Dispatch<React.SetStateAction<string | null>>
}

type Questionnaire = {
  questionnaireId: string
  title: string
  description: string
  questions: Array<QuestionInput>
  questionsWithJumps: Array<any>
}

export type FormValues = {
  stepId: string
  label: string
  body: string | null
  startAt: string | null
  endAt: string | null
  timeless: boolean
  isEnabled: {
    labels: Array<string>
  }
  isAnonymousParticipationAllowed: boolean
  metaDescription: string | null
  customCode: string | null
  stepDurationType?: {
    labels: Array<string>
  }
  questionnaire: Questionnaire
  MODELquestionnaire?: Questionnaire
  temporaryQuestion?: QuestionInput | null
  temporaryJump?: any
  isUsingModel?: boolean
  questionnaireModel?: { label: string; value: string }
  __typename?: string
} & RequirementsFormValues

const QUESTIONNAIRE_STEP_QUERY = graphql`
  query QuestionnaireStepFormQuery($stepId: ID!) {
    step: node(id: $stepId) {
      id
      ... on QuestionnaireStep {
        ...Requirements_requirementStep @relay(mask: false)
        title
        label
        body
        timeRange {
          startAt
          endAt
        }
        enabled
        timeless
        isAnonymousParticipationAllowed
        metaDescription
        customCode
        footer
        project {
          id
          title
          canEdit
          adminAlphaUrl
        }
        questionnaire {
          id
          title
          description
          questions {
            id
            ...responsesHelper_adminQuestion @relay(mask: false)
          }
          questionsWithJumps: questions(filter: JUMPS_ONLY) {
            id
            title
            jumps(orderBy: { field: POSITION, direction: ASC }) {
              id
              origin {
                id
                title
              }
              destination {
                id
                title
                number
              }
              conditions {
                id
                operator
                question {
                  id
                  title
                  type
                }
                ... on MultipleChoiceQuestionLogicJumpCondition {
                  value {
                    id
                    title
                  }
                }
              }
            }
            # unused for now, will be usefull when we'll add error and warning messages
            destinationJumps {
              id
              origin {
                id
                title
              }
            }

            alwaysJumpDestinationQuestion {
              id
              title
              number
            }
          }
        }
        ...QuestionnaireStepRequirementsTabs_questionnaireStep
      }
    }
    availableLocales(includeDisabled: false) {
      code
      isDefault
    }
  }
`

const QuestionnaireStepForm: React.FC<Props> = ({ stepId, setHelpMessage }) => {
  const intl = useIntl()
  const query = useLazyLoadQuery<QuestionnaireStepFormQuery>(QUESTIONNAIRE_STEP_QUERY, {
    stepId,
  })

  const { setBreadCrumbItems } = useNavBarContext()

  const [operationType, setOperationType] = useUrlState('operationType', 'EDIT')
  const isEditing = operationType === 'EDIT'

  const { step, availableLocales } = query
  const project = step?.project

  if (!step) return null

  const defaultLocale = availableLocales.find(locale => locale.isDefault)?.code?.toLowerCase() ?? 'fr'

  const getBreadCrumbItems = () => {
    const breadCrumbItems = [
      {
        title: project?.title ?? '',
        href: project?.adminAlphaUrl ?? '',
      },
      {
        title: intl.formatMessage({ id: 'add-step' }),
        href: `/admin-next/project/${project?.id}/create-step`,
      },
      {
        title: intl.formatMessage({ id: 'questionnaire-step' }),
        href: '',
      },
    ]
    if (isEditing) {
      return breadCrumbItems.filter(item => item.title !== intl.formatMessage({ id: 'add-step' }))
    }
    return breadCrumbItems
  }

  useEffect(() => {
    setBreadCrumbItems(getBreadCrumbItems())
    return () => setBreadCrumbItems([])
  }, [])

  const formMethods = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: getDefaultValues(stepId, step),
    shouldUnregister: false,
  })

  const { handleSubmit, formState, control, watch, reset } = formMethods
  const { isSubmitting, isValid } = formState

  const onSubmit = async ({
    questionnaire: CURRENTquestionnaire,
    MODELquestionnaire,
    isUsingModel,
    questionnaireModel,
    ...values
  }: FormValues) => {
    const timeless = values?.stepDurationType?.labels?.[0] === StepDurationTypeEnum.TIMELESS ?? false
    delete values.stepDurationType
    delete values.temporaryQuestion
    delete values.temporaryJump

    const questionnaire = isUsingModel && !isEditing ? MODELquestionnaire : CURRENTquestionnaire

    const stepInput: UpdateQuestionnaireStepInput = {
      ...values,
      timeless,
      isEnabled: values.isEnabled.labels?.[0] === EnabledEnum.PUBLISHED ?? false,
      questionnaire: CURRENTquestionnaire.questionnaireId,
      ...getRequirementsInput(values),
    }

    const mergedArr = questionnaire.questions.map(q => {
      const j = questionnaire.questionsWithJumps.find(jump => q.id && jump.id && q.id === jump.id)
      return { ...q, ...j }
    })

    delete questionnaire.questionsWithJumps

    if (!stepInput.questionnaire) return mutationErrorToast(intl)

    return UpdateQuestionnaireStepMutation.commit({ input: stepInput })
      .then(async response => {
        try {
          return UpdateQuestionnaireMutation.commit({
            input: {
              ...questionnaire,
              questionnaireId: questionnaire?.questionnaireId || stepInput.questionnaire,
              title: `${stepInput.label} - ${intl.formatMessage({
                id: 'global.questionnaire',
              })}`,
              questions: formatQuestionsInput(mergedArr),
            },
          })
            .then(q => {
              toast({
                variant: 'success',
                content: intl.formatMessage({ id: 'global.changes.saved' }),
              })
              setOperationType('EDIT')
              const newFormValues = {
                ...response.updateQuestionnaireStep.questionnaireStep,
                requirements: values.requirements,
                requirementsReason: values.requirementsReason,
                questionnaire: {
                  ...q.updateQuestionnaireConfiguration.questionnaire,
                },
              }
              reset(getDefaultValues(stepId, newFormValues, true))
              return
            })
            .catch(questionnaireError => {
              console.log(questionnaireError)
              return mutationErrorToast(intl)
            })
        } catch (error) {
          console.log(error)
          return mutationErrorToast(intl)
        }
      })
      .catch(e => {
        console.log(e)
        return mutationErrorToast(intl)
      })
  }

  const stepDurationType = watch('stepDurationType')
  const isCustomStepDuration = stepDurationType?.labels?.[0] === StepDurationTypeEnum.CUSTOM

  if (!project.canEdit) {
    window.location.href = '/admin-next/projects'
    return null
  }

  return (
    <Box bg="white" p={6} borderRadius="8px" width="70%">
      <Text fontWeight={600} color="blue.800" fontSize={4}>
        {intl.formatMessage({ id: 'customize-your-questionnaire-step' })}
      </Text>
      <Box as="form" mt={4} onSubmit={handleSubmit(onSubmit)}>
        <FormProvider {...formMethods}>
          <FormControl
            name="label"
            control={control}
            isRequired
            mb={6}
            onMouseEnter={() => {
              setHelpMessage('step.create.label.helpText')
            }}
          >
            <FormLabel htmlFor="label" label={intl.formatMessage({ id: 'step-label-name' })} />
            <FieldInput
              id="label"
              name="label"
              control={control}
              type="text"
              placeholder={intl.formatMessage({ id: 'step-label-name-placeholder' })}
            />
          </FormControl>
          <FormProvider {...formMethods}>
            <TextEditor
              name="body"
              label={intl.formatMessage({ id: 'step-description' })}
              platformLanguage={defaultLocale}
              selectedLanguage={defaultLocale}
            />
          </FormProvider>
          <FormControl name="stepDurationType" control={control} isRequired mb={6} mt={6}>
            <FormLabel htmlFor="stepDurationType" label={intl.formatMessage({ id: 'step-duration' })} />
            <FieldInput
              id="stepDurationType"
              name="stepDurationType"
              control={control}
              type="radio"
              choices={[
                {
                  id: StepDurationTypeEnum.TIMELESS,
                  label: intl.formatMessage({ id: 'timeless' }),
                  useIdAsValue: true,
                },
                {
                  id: StepDurationTypeEnum.CUSTOM,
                  label: intl.formatMessage({ id: 'global.custom.feminine' }),
                  useIdAsValue: true,
                },
              ]}
            />
          </FormControl>
          {isCustomStepDuration ? (
            <Flex mb={4}>
              <FormControl name="startAt" control={control} width="max-content" mr={6} mb={0}>
                <FormLabel htmlFor="startAt" label={intl.formatMessage({ id: 'start-date' })}>
                  <Text fontSize={2} color="gray.500">
                    {intl.formatMessage({ id: 'global.optional' })}
                  </Text>
                </FormLabel>
                <FieldInput
                  id="startAt"
                  name="startAt"
                  control={control}
                  type="dateHour"
                  dateInputProps={{ isOutsideRange: true }}
                />
              </FormControl>
              <FormControl name="endAt" control={control} width="max-content">
                <FormLabel htmlFor="endAt" label={intl.formatMessage({ id: 'ending-date' })}>
                  <Text fontSize={2} color="gray.500">
                    {intl.formatMessage({ id: 'global.optional' })}
                  </Text>
                </FormLabel>
                <FieldInput
                  id="endAt"
                  name="endAt"
                  control={control}
                  type="dateHour"
                  dateInputProps={{ isOutsideRange: true }}
                />
              </FormControl>
            </Flex>
          ) : null}
          <QuestionnaireStepFormQuestionnaireTab isEditing={isEditing} defaultLocale={defaultLocale} />
          <Accordion color={CapUIAccordionColor.Transparent}>
            <Accordion.Item id={intl.formatMessage({ id: 'required-infos-to-participate' })}>
              <Accordion.Button>{intl.formatMessage({ id: 'required-infos-to-participate' })}</Accordion.Button>
              <Accordion.Panel>
                <QuestionnaireStepRequirementsTabs formMethods={formMethods} questionnaireStep={step} />
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
          <QuestionnaireStepOptionalParameters
            isEditing={isEditing}
            defaultLocale={defaultLocale}
            selectedLocale={defaultLocale}
          />
          <FormControl name="isEnabled" control={control} my={6}>
            <FormLabel htmlFor="isEnabled" label={intl.formatMessage({ id: 'admin.fields.project.published_at' })} />
            <FieldInput
              id="isEnabled"
              name="isEnabled"
              control={control}
              type="radio"
              choices={[
                {
                  id: EnabledEnum.PUBLISHED,
                  label: intl.formatMessage({ id: 'global.published' }),
                  useIdAsValue: true,
                },
                {
                  id: EnabledEnum.DRAFT,
                  label: intl.formatMessage({ id: 'global-draft' }),
                  useIdAsValue: true,
                },
              ]}
            />
          </FormControl>
          <Flex mt={6}>
            <Button
              variantSize="big"
              variant="primary"
              type="submit"
              mr={4}
              isLoading={isSubmitting}
              disabled={!isValid}
            >
              {isEditing ? intl.formatMessage({ id: 'global.save' }) : intl.formatMessage({ id: 'add-the-step' })}
            </Button>
            <Button
              variantSize="big"
              variant="secondary"
              disabled={isSubmitting}
              onClick={() => onBack(project?.adminAlphaUrl, isEditing, stepId, intl)}
            >
              {intl.formatMessage({ id: 'global.back' })}
            </Button>
          </Flex>
        </FormProvider>
      </Box>
    </Box>
  )
}

export default QuestionnaireStepForm
