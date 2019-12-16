// @flow
import * as React from 'react';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Field, formValueSelector, FieldArray, getFormSyncErrors } from 'redux-form';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';
import CloseButton from '../Form/CloseButton';
import SubmitButton from '../Form/SubmitButton';
import component from '../Form/Field';
import type { GlobalState } from '../../types';
import QuestionChoiceAdminForm from '../QuestionChoices/QuestionChoiceAdminForm';
import QuestionsJumpAdmin from '../QuestionJump/QuestionsJumpAdminForm';
import type { Question } from '../../utils/responsesHelper';

type ParentProps = {
  show: boolean,
  onClose: () => void,
  onSubmit: () => void,
  member: string,
  isCreating: boolean,
  formName: string,
};

type Props = {
  type: string,
  validationRuleType: string,
  formErrors: Object,
  currentQuestion: Question,
  intl: IntlShape,
} & ParentProps;

// When creating a new question, we can not rely on __typename because it does not exists before creation
// so this is used to determine if we can show the "choices" section of the question form when creating a new one
const multipleChoiceQuestions = ['button', 'radio', 'select', 'checkbox', 'ranking'];

export class ProposalFormAdminQuestionModal extends React.Component<Props> {
  render() {
    let disabled = false;
    const {
      member,
      show,
      isCreating,
      onClose,
      onSubmit,
      formName,
      type,
      intl,
      validationRuleType,
      currentQuestion,
      formErrors,
    } = this.props;
    if (formErrors.questions !== undefined) {
      disabled = true;
    }

    const optional = (
      <span className="excerpt">
        {' '}
        <FormattedMessage id="global.optional" />
      </span>
    );
    return (
      <Modal
        show={show}
        onHide={onClose}
        aria-labelledby="proposal-form-admin-question-modal-title-lg">
        <Modal.Header closeButton>
          <Modal.Title
            id="proposal-form-admin-question-modal-title-lg"
            children={
              <FormattedMessage
                id={!isCreating ? 'question_modal.create.title' : 'question_modal.update.title'}
              />
            }
          />
        </Modal.Header>
        <Modal.Body>
          <Field
            label={<FormattedMessage id="title" />}
            id={`${member}.title`}
            name={`${member}.title`}
            type="text"
            component={component}
          />
          <Field
            label={
              <span>
                <FormattedMessage id='global.help.text' />
                {optional}
              </span>
            }
            id={`${member}.helpText`}
            name={`${member}.helpText`}
            type="text"
            component={component}
          />
          <Field
            name={`${member}.description`}
            component={component}
            type="editor"
            id={`${member}.description`}
            label={
              <span>
                <FormattedMessage id='global.description' />
                {optional}
              </span>
            }
          />
          <Field
            label={intl.formatMessage({ id: 'admin.fields.question.type' })}
            id={`${member}.type`}
            name={`${member}.type`}
            type="select"
            component={component}
            disabled={isCreating}>
            <option value="" disabled>
              {intl.formatMessage({ id: 'global.select' })}
            </option>
            <optgroup label={intl.formatMessage({ id: 'global.question.types.free' })}>
              <option value="text">
                {intl.formatMessage({ id: 'global.question.types.text' })}
              </option>
              <option value="textarea">
                {intl.formatMessage({ id: 'global.question.types.textarea' })}
              </option>
              <option value="editor">
                {intl.formatMessage({ id: 'global.question.types.editor' })}
              </option>
              <option value="number">
                {intl.formatMessage({ id: 'admin.fields.validation_rule.number' })}
              </option>
              <option value="medias">
                {intl.formatMessage({ id: 'global.question.types.medias' })}
              </option>
            </optgroup>
            <optgroup label={intl.formatMessage({ id: 'global.question.types.multiple_unique' })}>
              <option value="button">{intl.formatMessage({ id: 'question.types.button' })}</option>
              <option value="radio">
                {intl.formatMessage({ id: 'global.question.types.radio' })}
              </option>
              <option value="select">
                {intl.formatMessage({ id: 'global.question.types.select' })}
              </option>
            </optgroup>
            <optgroup label={intl.formatMessage({ id: 'global.question.types.multiple_multiple' })}>
              <option value="checkbox">
                {intl.formatMessage({ id: 'global.question.types.checkbox' })}
              </option>
              <option value="ranking">
                {intl.formatMessage({ id: 'global.question.types.ranking' })}
              </option>
            </optgroup>
          </Field>
          {multipleChoiceQuestions.includes(type) && (
            <div>
              <h4 style={{ fontWeight: 'bold' }}>
                <FormattedMessage id='admin.fields.reply.responses' />
              </h4>
              <FieldArray
                name={`${member}.choices`}
                component={QuestionChoiceAdminForm}
                formName={formName}
                oldMember={member}
                type={type}
              />
            </div>
          )}
          <h4 style={{ fontWeight: 'bold' }}>
            <span>
              <FormattedMessage id="conditional-jumps" />
            </span>
          </h4>
          {currentQuestion && currentQuestion.id ? (
            <FieldArray
              name={`${member}.jumps`}
              component={QuestionsJumpAdmin}
              formName={formName}
              oldMember={member}
            />
          ) : (
            <FormattedMessage id="save-question-before-adding-conditional-jump" tagName="p" />
          )}
          <h4 style={{ fontWeight: 'bold' }}>
            <span>
              <FormattedMessage id='global.options' />
            </span>
          </h4>
          {currentQuestion && currentQuestion.__typename === 'MultipleChoiceQuestion' && (
            <div>
              <Field
                id={`${member}.randomQuestionChoices`}
                name={`${member}.randomQuestionChoices`}
                type="checkbox"
                normalize={val => !!val}
                children={<FormattedMessage id="admin.fields.question.random_question_choices" />}
                component={component}
              />
              <Field
                id={`${member}.isOtherAllowed`}
                name={`${member}.isOtherAllowed`}
                type="checkbox"
                normalize={val => !!val}
                children={<FormattedMessage id="admin.fields.question.other_allowed" />}
                component={component}
              />
            </div>
          )}
          <Field
            id={`${member}.required`}
            name={`${member}.required`}
            type="checkbox"
            normalize={val => !!val}
            children={<FormattedMessage id="global.admin.required" />}
            component={component}
          />
          <Field
            children={<FormattedMessage id="admin.fields.question.private" />}
            id={`${member}.private`}
            normalize={val => !!val}
            name={`${member}.private`}
            type="checkbox"
            component={component}
          />
          {currentQuestion && currentQuestion.__typename === 'MultipleChoiceQuestion' && (
            <div>
              <h4 style={{ fontWeight: 'bold' }}>
                <span>
                  <FormattedMessage id="admin.fields.question.group_validation" />
                </span>
              </h4>
              <Field
                label={<FormattedMessage id="admin.fields.validation_rule.type" />}
                id={`${member}.validationRule.type`}
                name={`${member}.validationRule.type`}
                type="select"
                component={component}>
                <option value="">{intl.formatMessage({ id: 'global.select' })}</option>
                <option value="MIN">
                  {intl.formatMessage({ id: 'questionnaire.validation.type.min' })}
                </option>
                <option value="MAX">
                  {intl.formatMessage({ id: 'questionnaire.validation.type.max' })}
                </option>
                <option value="EQUAL">
                  {intl.formatMessage({ id: 'questionnaire.validation.type.equal' })}
                </option>
              </Field>
              {(validationRuleType === 'MIN' ||
                validationRuleType === 'MAX' ||
                validationRuleType === 'EQUAL') && (
                <Field
                  label={
                    <span>
                      <FormattedMessage id="admin.fields.validation_rule.number" />
                      {optional}
                    </span>
                  }
                  id={`${member}.validationRule.number`}
                  name={`${member}.validationRule.number`}
                  type="number"
                  component={component}
                  normalize={val => (val && !Number.isNaN(val) ? parseInt(val, 10) : null)}
                />
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <CloseButton onClose={onClose} />
          <SubmitButton
            id={`${member}.submit`}
            label="global.validate"
            isSubmitting={false}
            onSubmit={onSubmit}
            disabled={disabled}
          />
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = (state: GlobalState, props: ParentProps) => {
  const selector = formValueSelector(props.formName);
  return {
    currentQuestion: selector(state, `${props.member}`),
    type: selector(state, `${props.member}.type`),
    validationRuleType: selector(state, `${props.member}.validationRule.type`),
    formErrors: getFormSyncErrors(props.formName)(state),
  };
};

export default connect(mapStateToProps)(injectIntl(ProposalFormAdminQuestionModal));