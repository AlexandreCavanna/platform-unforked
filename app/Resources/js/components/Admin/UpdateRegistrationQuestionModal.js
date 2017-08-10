// @flow
import React, { PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { submit, isSubmitting } from 'redux-form';
import type { Connector } from 'react-redux';
import CloseButton from '../Form/CloseButton';
import { hideRegistrationFieldModal } from '../../redux/modules/default';
import UpdateRegistrationQuestionForm, {
  formName,
} from './UpdateRegistrationQuestionForm';
import type { Dispatch, State } from '../../types';

export const UpdateRegistrationQuestionModal = React.createClass({
  propTypes: {
    submitting: PropTypes.bool.isRequired,
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  },

  render() {
    const { submitting, show, onClose, onSubmit } = this.props;
    return (
      <Modal
        animation={false}
        show={show}
        onHide={onClose}
        autoFocus
        bsSize="large"
        aria-labelledby="contained-modal-title-lg">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">
            Modifier un champ supplémentaire
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UpdateRegistrationQuestionForm />
        </Modal.Body>
        <Modal.Footer>
          <CloseButton onClose={onClose} />
          <Button
            id="confirm-update-question"
            type="submit"
            disabled={submitting}
            onClick={onSubmit}
            bsStyle="primary">
            {submitting
              ? <FormattedMessage id="global.loading" />
              : <FormattedMessage id="global.save" />}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  },
});

type Props = {
  submitting: boolean,
  show: boolean,
  onSubmit: (e: Event) => void,
  onClose: () => void,
};

const mapStateToProps = (state: State) => ({
  submitting: isSubmitting(formName)(state),
  show: !!(
    state.default.updatingRegistrationFieldModal &&
    state.default.updatingRegistrationFieldModal !== null
  ),
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  onSubmit: (e: Event) => {
    e.preventDefault();
    dispatch(submit(formName));
  },
  onClose: () => {
    dispatch(hideRegistrationFieldModal());
  },
});

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default connector(UpdateRegistrationQuestionModal);
