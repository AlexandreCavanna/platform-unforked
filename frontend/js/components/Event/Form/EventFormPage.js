// @flow
import * as React from 'react';
import {
  hasSubmitFailed,
  hasSubmitSucceeded,
  isInvalid,
  isPristine,
  isSubmitting,
  isValid,
  SubmissionError,
  submit,
} from 'redux-form';
import moment from 'moment';
import { connect } from 'react-redux';
import { Button, ButtonToolbar } from 'react-bootstrap';
import { createFragmentContainer, graphql } from 'react-relay';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';

import {
  type EventRefusedReason,
  type EventReviewStatus,
} from '~relay/ReviewEventMutation.graphql';
import EventForm, { formName, type FormValues } from './EventForm';
import type { Dispatch, GlobalState } from '~/types';
import AlertForm from '~/components/Alert/AlertForm';
import DeleteModal from '~/components/Modal/DeleteModal';
import SubmitButton from '~/components/Form/SubmitButton';
import AddEventMutation from '~/mutations/AddEventMutation';
import ReviewEventMutation from '~/mutations/ReviewEventMutation';
import ChangeEventMutation from '~/mutations/ChangeEventMutation';
import DeleteEventMutation from '~/mutations/DeleteEventMutation';
import type { EventFormPage_event } from '~relay/EventFormPage_event.graphql';
import type { EventFormPage_query } from '~relay/EventFormPage_query.graphql';
import { getTranslation, handleTranslationChange } from '~/services/Translation';
import AppDispatcher from '~/dispatchers/AppDispatcher';

type Props = {|
  ...ReduxFormFormProps,
  intl: IntlShape,
  query: EventFormPage_query,
  event: ?EventFormPage_event,
  dispatch: Dispatch,
  isFrontendView: boolean,
  className?: string,
  currentLanguage: string,
  initialValues: Object,
|};

type ReviewEventForm = {|
  comment: ?string,
  refusedReason: ?EventRefusedReason,
  status: EventReviewStatus,
|};

type EditFormValue = {|
  ...FormValues,
  ...ReviewEventForm,
  id: string,
|};

type State = {| showDeleteModal: boolean |};

const onSubmit = (values: FormValues, dispatch: Dispatch, props: Props) => {
  const { intl, isFrontendView } = props;
  const media =
    typeof values.media !== 'undefined' && values.media !== null ? values.media.id : null;
  const guestListEnabled = values.guestListEnabled ? values.guestListEnabled : false;
  const adminAuthorizeDataTransfer = values.adminAuthorizeDataTransfer
    ? values.adminAuthorizeDataTransfer
    : false;
  const authorAgreeToUsePersonalDataForEventOnly = values.authorAgreeToUsePersonalDataForEventOnly
    ? values.authorAgreeToUsePersonalDataForEventOnly
    : false;
  const commentable = values.commentable ? values.commentable : false;
  const enabled = values.enabled ? values.enabled : false;
  const addressJson = values.addressJson || null;

  const translation = {
    locale: props.currentLanguage,
    title: values.title,
    body: values.body,
    metaDescription: values.metadescription ? values.metadescription : undefined,
    link: values.link,
  };

  const input = {
    translations: handleTranslationChange(
      props.event && props.event.translations ? props.event.translations : [],
      translation,
      props.currentLanguage,
    ),
    measurable: isFrontendView ? false : values.measurable,
    bodyUsingJoditWysiwyg: values?.bodyUsingJoditWysiwyg ?? false,
    startAt: moment(values.startAt).format('YYYY-MM-DD HH:mm:ss'),
    endAt: values.endAt ? moment(values.endAt).format('YYYY-MM-DD HH:mm:ss') : null,
    customCode: values.customcode,
    commentable,
    guestListEnabled,
    addressJson,
    enabled,
    media,
    themes: values.themes ? values.themes.map(t => t.value) : null,
    projects: values.projects ? values.projects.map(p => p.value) : null,
    steps: values.steps ? values.steps.map(s => s.value) : null,
    author: values.author ? values.author.value : undefined,
    adminAuthorizeDataTransfer,
    authorAgreeToUsePersonalDataForEventOnly,
    maxRegistrations:
      ((isFrontendView && values.guestListEnabled) ||
        (!isFrontendView && values?.guestListEnabled === true && values?.measurable === true)) &&
      values.maxRegistrations &&
      !Number.isNaN(values.maxRegistrations)
        ? Math.round(Number(values.maxRegistrations))
        : null,
  };

  return AddEventMutation.commit({ input })
    .then(response => {
      if (!response.addEvent || !response.addEvent.eventEdge) {
        throw new Error('Mutation "AddEventMutation" failed.');
      }
      if (response?.addEvent?.eventEdge?.node) {
        if (isFrontendView) {
          AppDispatcher.dispatch({
            actionType: 'UPDATE_ALERT',
            alert: { bsStyle: 'success', content: 'alert.success.add.argument' },
          });
        }
        window.location.href = isFrontendView
          ? response.addEvent.eventEdge.node.url
          : `/admin/capco/app/event/${response.addEvent.eventEdge.node._id}/edit`;
      }
    })
    .catch(response => {
      if (response.response.message) {
        throw new SubmissionError({
          _error: response.response.message,
        });
      } else {
        throw new SubmissionError({
          _error: intl.formatMessage({ id: 'global.error.server.form' }),
        });
      }
    });
};

const updateEvent = (values: EditFormValue, dispatch: Dispatch, props: Props) => {
  const { intl, event, isFrontendView } = props;
  const media = values.media && values.media.id ? values.media.id : null;
  const guestListEnabled = values.guestListEnabled ? values.guestListEnabled : false;
  const commentable = values.commentable ? values.commentable : false;
  const enabled = values.enabled ? values.enabled : false;
  const addressJson = values.addressJson || null;

  const translation = {
    locale: props.currentLanguage,
    title: values.title,
    body: values.body,
    metaDescription: values.metadescription ? values.metadescription : null,
    link: values.link,
  };

  const measurable = isFrontendView ? false : values.measurable;
  let maxRegistrations =
    values.maxRegistrations && !Number.isNaN(values.maxRegistrations)
      ? Math.round(Number(values.maxRegistrations))
      : null;
  if (isFrontendView && !values.guestListEnabled) {
    maxRegistrations = null;
  } else if (
    !isFrontendView &&
    values?.guestListEnabled === true &&
    event?.review &&
    values.maxRegistrations
  ) {
    maxRegistrations = Math.round(Number(values.maxRegistrations));
  } else if (
    !isFrontendView &&
    values?.guestListEnabled === true &&
    !event?.review &&
    !values.measurable
  ) {
    maxRegistrations = null;
  }

  const updateInput = {
    id: values.id,
    startAt: moment(values.startAt).format('YYYY-MM-DD HH:mm:ss'),
    endAt: values.endAt ? moment(values.endAt).format('YYYY-MM-DD HH:mm:ss') : null,
    customCode: values.customcode,
    commentable,
    guestListEnabled,
    addressJson,
    enabled,
    media,
    measurable,
    themes: values.themes ? values.themes.map(t => t.value) : null,
    projects: values.projects ? values.projects.map(p => p.value) : null,
    steps: values.steps ? values.steps.map(s => s.value) : null,
    author: values.author ? values.author.value : undefined,
    adminAuthorizeDataTransfer: values.adminAuthorizeDataTransfer,
    authorAgreeToUsePersonalDataForEventOnly:
      values.authorAgreeToUsePersonalDataForEventOnly !== null
        ? values.authorAgreeToUsePersonalDataForEventOnly
        : false,
    translations: handleTranslationChange(
      props.event && props.event.translations ? props.event.translations : [],
      translation,
      props.currentLanguage,
    ),
    bodyUsingJoditWysiwyg: values?.bodyUsingJoditWysiwyg ?? false,
    maxRegistrations,
  };
  const reviewInput =
    values.refusedReason !== 'NONE'
      ? {
          id: values.id,
          comment: values.comment,
          status: values.status,
          refusedReason: values.refusedReason,
        }
      : { id: values.id, comment: values.comment, status: values.status };

  return ChangeEventMutation.commit({ input: updateInput })
    .then(response => {
      if (!response.changeEvent || !response.changeEvent.event) {
        throw new Error('Mutation "ChangeEventMutation" failed.');
      }
      if (
        !isFrontendView &&
        event?.review &&
        (event?.review?.status !== values.status ||
          event?.review?.comment !== values.comment ||
          event?.review?.refusedReason !== values.refusedReason)
      ) {
        return ReviewEventMutation.commit({ input: reviewInput })
          .then(reviewResponse => {
            if (!reviewResponse.reviewEvent || !reviewResponse.reviewEvent.event) {
              throw new Error('Mutation "ReviewEventMutation" failed.');
            }
          })
          .catch(reviewResponse => {
            if (reviewResponse.response.message) {
              throw new SubmissionError({
                _error: reviewResponse.response.message,
              });
            } else {
              throw new SubmissionError({
                _error: intl.formatMessage({ id: 'global.error.server.form' }),
              });
            }
          });
      }
      if (isFrontendView) {
        return window.location.reload();
      }
    })
    .catch(response => {
      if (response.response.message) {
        throw new SubmissionError({
          _error: response.response.message,
        });
      } else {
        throw new SubmissionError({
          _error: intl.formatMessage({ id: 'global.error.server.form' }),
        });
      }
    });
};

const onDelete = (eventId: string) =>
  DeleteEventMutation.commit({
    input: {
      eventId,
    },
  }).then(() => {
    window.location.href = `${window.location.protocol}//${window.location.host}/admin-next/events`;
  });

export class EventFormPage extends React.Component<Props, State> {
  static defaultProps = {
    isFrontendView: false,
  };

  state = {
    showDeleteModal: false,
  };

  openDeleteModal = () => {
    this.setState({ showDeleteModal: true });
  };

  cancelCloseDeleteModal = () => {
    this.setState({ showDeleteModal: false });
  };

  renderSubmitButton = () => {
    const { pristine, submitting, event, query, dispatch } = this.props;
    if (!event) {
      return (
        <SubmitButton
          id="confirm-event-create"
          label="global.save"
          isSubmitting={submitting}
          disabled={pristine || submitting}
          onSubmit={() => {
            dispatch(submit(formName));
          }}
        />
      );
    }
    if (
      query.viewer.isSuperAdmin ||
      query.viewer.isOnlyProjectAdmin ||
      (event?.review?.status !== 'REFUSED' && event?.deletedAt === null && query.viewer.isAdmin)
    ) {
      return (
        <SubmitButton
          id={event ? 'confirm-event-edit' : 'confirm-event-create'}
          label="global.save"
          isSubmitting={submitting}
          disabled={pristine || submitting}
          onSubmit={() => {
            dispatch(submit(formName));
          }}
        />
      );
    }
  };

  render() {
    const {
      invalid,
      valid,
      submitSucceeded,
      submitFailed,
      submitting,
      event,
      query,
      isFrontendView,
      className,
    } = this.props;
    const { showDeleteModal } = this.state;

    return (
      <>
        <div className={`${!isFrontendView ? 'box box-primary container-fluid' : ''}`}>
          <EventForm
            event={event}
            onSubmit={event ? updateEvent : onSubmit}
            query={query}
            className={className}
            isFrontendView={isFrontendView}
          />
          {!isFrontendView && (
            <ButtonToolbar className="mt-45 box-content__toolbar">
              {this.renderSubmitButton()}
              {event &&
                (event.viewerDidAuthor || query.viewer.isSuperAdmin) &&
                event.deletedAt === null && (
                  <>
                    <DeleteModal
                      closeDeleteModal={this.cancelCloseDeleteModal}
                      showDeleteModal={showDeleteModal}
                      deleteElement={() => {
                        onDelete(event.id);
                      }}
                      deleteModalTitle="event.alert.delete"
                      deleteModalContent="group.admin.parameters.modal.delete.content"
                      buttonConfirmMessage="global.removeDefinitively"
                    />
                    <Button
                      bsStyle="danger"
                      className="ml-5"
                      onClick={this.openDeleteModal}
                      id="delete-event">
                      <i className="fa fa-trash" /> <FormattedMessage id="global.delete" />
                    </Button>
                  </>
                )}
              {event?.deletedAt === null && (
                <AlertForm
                  valid={valid}
                  invalid={invalid}
                  submitSucceeded={submitSucceeded}
                  submitFailed={submitFailed}
                  submitting={submitting}
                />
              )}
            </ButtonToolbar>
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: GlobalState, { event }: Props) => {
  const translation = getTranslation(
    event && event.translations ? event.translations : [],
    state.language.currentLanguage,
  );

  return {
    currentLanguage: state.language.currentLanguage,
    initialValues: {
      title: translation ? translation.title : null,
      description: translation ? translation.body : null,
      metaDescription: translation ? translation.metaDescription : null,
      link: translation ? translation.link : null,
    },
    pristine: isPristine(formName)(state),
    valid: isValid(formName)(state),
    invalid: isInvalid(formName)(state),
    submitting: isSubmitting(formName)(state),
    submitSucceeded: hasSubmitSucceeded(formName)(state),
    submitFailed: hasSubmitFailed(formName)(state),
  };
};

export const EventFormCreatePage = connect<any, any, _, _, _, _>(mapStateToProps)(
  injectIntl(EventFormPage),
);

export default createFragmentContainer(EventFormCreatePage, {
  query: graphql`
    fragment EventFormPage_query on Query
    @argumentDefinitions(affiliations: { type: "[ProjectAffiliation!]" }) {
      ...EventForm_query @arguments(affiliations: $affiliations)
      viewer {
        isSuperAdmin
        isAdmin
        isOnlyProjectAdmin
      }
    }
  `,
  event: graphql`
    fragment EventFormPage_event on Event
    @argumentDefinitions(isAuthenticated: { type: "Boolean!" }) {
      id
      review {
        status
        comment
        refusedReason
      }
      deletedAt
      author {
        id
        isAdmin
      }
      translations {
        locale
        title
        body
        metaDescription
        link
      }
      viewerDidAuthor @include(if: $isAuthenticated)
      ...EventForm_event
    }
  `,
});
