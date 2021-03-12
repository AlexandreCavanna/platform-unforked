// @flow
import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import noop from 'lodash/noop';
import { createFragmentContainer, graphql, type RelayFragmentContainer } from 'react-relay';
import Button from '~ds/Button/Button';
import Modal from '~ds/Modal/Modal';
import type { ModalDeleteVoteMobile_debate } from '~relay/ModalDeleteVoteMobile_debate.graphql';
import Text from '~ui/Primitives/Text';
import { FontWeight } from '~ui/Primitives/constants';
import Heading from '~ui/Primitives/Heading';

import RemoveDebateVoteAlternateArgumentMutation from '~/mutations/RemoveDebateVoteAlternateArgumentMutation';
import type { VoteState } from '~/components/Debate/Page/MainActions/DebateStepPageVoteAndShare';

type Props = {|
  debate: ModalDeleteVoteMobile_debate,
  setVoteState: VoteState => void,
  setShowArgumentForm: boolean => void,
|};

const STATE = {
  CHOICES: 'CHOICES',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

const deleteVoteFromViewer = (
  debateId: string,
  setVoteState: VoteState => void,
  setShowArgumentForm: boolean => void,
  setModalState: (state: $Values<typeof STATE>) => void,
  setErrorCount: (count: number) => void,
  errorCount: number,
) => {
  return RemoveDebateVoteAlternateArgumentMutation.commit({
    input: {
      debateId,
    },
  })
    .then(response => {
      if (response.removeDebateVote?.errorCode) {
        setModalState(STATE.ERROR);
        setErrorCount(errorCount + 1);
      } else {
        setErrorCount(0);
        setModalState(STATE.SUCCESS);
      }
    })
    .catch(() => {
      setModalState(STATE.ERROR);
      setErrorCount(errorCount + 1);
    });
};

export const ModalDeleteVoteMobile = ({ debate, setVoteState, setShowArgumentForm }: Props) => {
  const intl = useIntl();
  const [modalState, setModalState] = React.useState<$Values<typeof STATE>>(STATE.CHOICES);
  const [errorCount, setErrorCount] = React.useState<number>(0);
  const viewerVoteValue = debate.viewerVote?.type;

  const getModalContent = (state: $Values<typeof STATE>, hideModal) => {
    switch (state) {
      case 'CHOICES':
        return (
          <>
            <Modal.Header textAlign="center">
              <Heading as="h4">{intl.formatMessage({ id: 'confirm-delete-vote' })}</Heading>
            </Modal.Header>

            <Modal.Body pb={6}>
              <Text color="neutral-gray.700" mb={4} textAlign="center">
                {intl.formatMessage({ id: 'argument-associated-vote-also-deleted' })}
              </Text>

              <Button
                onClick={() =>
                  deleteVoteFromViewer(
                    debate.id,
                    setVoteState,
                    setShowArgumentForm,
                    setModalState,
                    setErrorCount,
                    errorCount,
                  )
                }
                variant="primary"
                variantColor="danger"
                variantSize="big"
                justifyContent="center"
                mb={4}>
                {intl.formatMessage({ id: 'global.confirm.removal' })}
              </Button>
              <Button
                variant="tertiary"
                variantColor="hierarchy"
                onClick={hideModal}
                justifyContent="center">
                {intl.formatMessage({ id: 'global.cancel' })}
              </Button>
            </Modal.Body>
          </>
        );
      case 'SUCCESS':
        return (
          <>
            <Modal.Header />
            <Modal.Body pb={6} pt={0} align="center">
              <Text aria-hidden role="img" mb={1} fontWeight={FontWeight.Semibold}>
                ✅
              </Text>
              <Text textAlign="center" width="70%">
                {intl.formatMessage({ id: 'alert.success.delete.argument.and.vote' })}
              </Text>
            </Modal.Body>
          </>
        );

      case 'ERROR':
        return (
          <>
            <Modal.Header />
            <Modal.Body pb={6} pt={0} align="center">
              <Text mb={3} aria-hidden role="img">
                😓
              </Text>
              <Text fontWeight={FontWeight.Semibold}>
                {intl.formatMessage({ id: 'error.title.damn' })}
              </Text>
              <Text textAlign="center">
                {intl.formatMessage({
                  id: errorCount <= 1 ? 'error-has-occurred' : 'error.persist.try.again',
                })}
              </Text>
            </Modal.Body>

            <Modal.Footer justify="center">
              {errorCount <= 1 ? (
                <Button
                  variant="primary"
                  variantColor="danger"
                  variantSize="big"
                  width="100%"
                  justifyContent="center"
                  onClick={() =>
                    deleteVoteFromViewer(
                      debate.id,
                      setVoteState,
                      setShowArgumentForm,
                      setModalState,
                      setErrorCount,
                      errorCount,
                    )
                  }>
                  {intl.formatMessage({ id: 'global.delete' })}
                </Button>
              ) : (
                <Button variant="tertiary" variantColor="hierarchy" onClick={hideModal}>
                  {intl.formatMessage({ id: 'back.to.arguments' })}
                </Button>
              )}
            </Modal.Footer>
          </>
        );
      default:
        // eslint-disable-next-line no-unused-expressions
        (state: empty);
        throw Error(`state ${state} is not a valid state`);
    }
  };

  const onDeleteSuccess = () => {
    setVoteState('NONE');
    setShowArgumentForm(true);
  };

  return (
    <Modal
      disclosure={
        <Button color="gray.700" ml={[0, 2]} mb={[3, 0]} variant="link">
          <FormattedMessage
            id={viewerVoteValue === 'FOR' ? 'delete.vote.for' : 'delete.vote.against'}
          />
        </Button>
      }
      ariaLabel={intl.formatMessage({ id: 'confirm-delete-argument' })}
      onClose={modalState === STATE.SUCCESS ? onDeleteSuccess : noop}>
      {({ hide }) => getModalContent(modalState, hide)}
    </Modal>
  );
};

export default (createFragmentContainer(ModalDeleteVoteMobile, {
  debate: graphql`
    fragment ModalDeleteVoteMobile_debate on Debate
      @argumentDefinitions(isAuthenticated: { type: "Boolean!" }) {
      id
      viewerVote @include(if: $isAuthenticated) {
        type
      }
    }
  `,
}): RelayFragmentContainer<typeof ModalDeleteVoteMobile>);
