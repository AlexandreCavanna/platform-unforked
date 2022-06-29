// @flow
import * as React from 'react';
import {
  Button,
  CapUIFontFamily,
  CapUISpotIcon,
  CapUISpotIconSize,
  Flex,
  SpotIcon,
  Text,
  Tooltip,
  MultiStepModal,
  Heading,
  useMultiStepModal
} from '@cap-collectif/ui';
import { FieldInput, FormControl } from '@cap-collectif/form';
import { graphql, useFragment } from 'react-relay';
import { FormattedHTMLMessage, useIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import formatPhoneNumber from '~/utils/formatPhoneNumber';
import phoneSplitter from '~/utils/phoneSplitter';
import VerifyUserPhoneNumberMutation from '~/mutations/VerifyUserPhoneNumberMutation';
import { mutationErrorToast } from '~/components/Utils/MutationErrorToast';
import SendSmsPhoneValidationCodeMutation from '~/mutations/SendSmsPhoneValidationCodeMutation';
import type { VerifyUserPhoneNumberMutationResponse } from '~relay/VerifyUserPhoneNumberMutation.graphql';
import type { SendSmsPhoneValidationCodeMutationResponse } from '~relay/SendSmsPhoneValidationCodeMutation.graphql';
import type { ProposalVoteConfirmationModal_viewer$key } from '~relay/ProposalVoteConfirmationModal_viewer.graphql';
import ResetCss from '~/utils/ResetCss';

export const formName = 'vote-sms-validation-form';

export type FormValues = {
  code: string,
};

export type ProposalVoteConfirmationModalProps = {|
  +viewer: ProposalVoteConfirmationModal_viewer$key,
  +setIsLoading: (isLoading: boolean) => void,
  +validationForm: any,
  +isLoading: boolean,
  +needToVerifyPhone: boolean,
  +modalTitle: string,
|};

export const onVoteConfirmationSubmit = async (
  values: FormValues,
  goToNextStep: () => void,
  intl: IntlShape,
  fromValidation: boolean,
  setIsLoading: boolean => void,
) => {
  if (fromValidation) {
    goToNextStep();
    return true;
  }
  try {
    setIsLoading(true);
    const response = await VerifyUserPhoneNumberMutation.commit({ input: { code: values.code } });
    if (response) {
      setIsLoading(false);
      goToNextStep();
    }
  } catch (e) {
    mutationErrorToast(intl);
  }
};

const FRAGMENT = graphql`
  fragment ProposalVoteConfirmationModal_viewer on User {
    phone
  }
`;

const ProposalVoteConfirmationModal = ({
  viewer: viewerFragment,
  setIsLoading,
  validationForm,
  isLoading,
  needToVerifyPhone,
  modalTitle,
}: ProposalVoteConfirmationModalProps) => {
  const intl = useIntl();
  const viewer = useFragment(FRAGMENT, viewerFragment);

  const [verified, setVerified] = React.useState<boolean>(false);
  const [limitReached, setLimitReached] = React.useState<boolean>(false);
  const { goToNextStep, goToPreviousStep } = useMultiStepModal()

  const { reset, handleSubmit, control, register, formState } = validationForm;
  const { isSubmitting } = formState;

  const validateCode = async (value: $PropertyType<FormValues, 'code'>) => {
    if (!verified) {
      try {
        setIsLoading(true);

        const response: VerifyUserPhoneNumberMutationResponse =
          await VerifyUserPhoneNumberMutation.commit({ input: { code: value } });

        if (
          response.verifyUserPhoneNumber?.user ||
          response.verifyUserPhoneNumber?.errorCode === 'PHONE_ALREADY_CONFIRMED'
        ) {
          setVerified(true);
          handleSubmit(data => {
            onVoteConfirmationSubmit(data, goToNextStep, intl, true, setIsLoading);
          })();
          setIsLoading(false);
          return true;
        }

        if (response.verifyUserPhoneNumber?.errorCode === 'CODE_EXPIRED') {
          setIsLoading(false);
          return intl.formatMessage({ id: 'CODE_EXPIRED' });
        }

        if (response.verifyUserPhoneNumber?.errorCode === 'CODE_NOT_VALID') {
          setIsLoading(false);
          return intl.formatMessage({ id: 'CODE_NOT_VALID' });
        }
      } catch (e) {
        mutationErrorToast(intl);
      }
    }

    return true;
  };

  const sendNewPhoneValidationCode = async () => {
    try {
      const response: SendSmsPhoneValidationCodeMutationResponse =
        await SendSmsPhoneValidationCodeMutation.commit({ input: {} });
      if (response.sendSmsPhoneValidationCode?.errorCode === 'RETRY_LIMIT_REACHED') {
        setLimitReached(true);
      }
    } catch (e) {
      mutationErrorToast(intl);
    }
  };

  React.useEffect(() => {
    reset({ code: 0 });
  }, [reset]);

  return (
    <>
      <ResetCss>
        <MultiStepModal.Header>
          <Text uppercase color="neutral-gray.500" fontWeight={700} fontSize={1} lineHeight="sm">{intl.formatMessage({ id: modalTitle })}</Text>
          <Heading>{intl.formatMessage({ id: 'verify.code' })}</Heading>
        </MultiStepModal.Header>
      </ResetCss>
      <MultiStepModal.Body>
        <Flex as="form" direction="column" spacing={3} align="center" justify="center">
          <SpotIcon name={CapUISpotIcon.ADD_CONTACT} size={CapUISpotIconSize.Lg} />
          <Text textAlign="center" fontSize="18px" lineHeight="24px">
            <FormattedHTMLMessage
              id="confirmation.code.header.title"
              values={{ phoneNumber: phoneSplitter(formatPhoneNumber(viewer.phone)) }}
            />
          </Text>

          <FormControl
            name="code"
            control={control}
            isRequired
            isDisabled={isSubmitting}
            align="center">
            <FieldInput
              control={control}
              {...register('code', {
                validate: {
                  validateCode,
                },
              })}
              type="codeInput"
              name="code"
              isVerified={verified}
            />
            {verified && (
              <Text
                color="green.500"
                fontFamily={CapUIFontFamily.Body}
                lineHeight="normal"
                fontSize={3}
                textAlign="center">
                {intl.formatMessage({ id: 'code.validation.success' })}
              </Text>
            )}
          </FormControl>

          {limitReached ? (
            <Tooltip
              zIndex={1500}
              id="tooltip"
              label={intl.formatMessage({ id: 'code.limit.reached' })}>
              <Button variant="link" variantColor="hierarchy">
                {intl.formatMessage({ id: 'get.new.code' })}
              </Button>
            </Tooltip>
          ) : (
            <Button variant="link" onClick={sendNewPhoneValidationCode}>
              {intl.formatMessage({ id: 'get.new.code' })}
            </Button>
          )}
        </Flex>
      </MultiStepModal.Body>
      <MultiStepModal.Footer>
        <Button
          variant="secondary"
          variantColor="hierarchy"
          variantSize="medium"
          onClick={goToPreviousStep}
        >
          {intl.formatMessage({ id: 'global.back' })}
        </Button>
        <Button
          variantSize="medium"
          variant="secondary"
          isLoading={validationForm.formState.isSubmitting || isLoading}
          disabled={needToVerifyPhone}
          onClick={e => {
            validationForm.handleSubmit(data => {
              onVoteConfirmationSubmit(data, goToNextStep, intl, false, setIsLoading);
            })(e);
          }}
        >
          {intl.formatMessage({ id: 'proposal.validate.vote' })}
        </Button>
      </MultiStepModal.Footer>
    </>
  );
};

export default ProposalVoteConfirmationModal;
