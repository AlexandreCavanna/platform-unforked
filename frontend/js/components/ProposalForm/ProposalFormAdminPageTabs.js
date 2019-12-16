// @flow
import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { injectIntl, type IntlShape, FormattedMessage } from 'react-intl';
import { createFragmentContainer, graphql } from 'react-relay';
import ProposalFormAdminConfigurationForm from './ProposalFormAdminConfigurationForm';
import ProposalFormAdminNotificationForm from './ProposalFormAdminNotificationForm';
import ProposalFormAdminEvaluationForm from './ProposalFormAdminEvaluationForm';
import ProposalFormAdminSettingsForm from './ProposalFormAdminSettingsForm';
import type { ProposalFormAdminPageTabs_proposalForm } from '~relay/ProposalFormAdminPageTabs_proposalForm.graphql';
import type { ProposalFormAdminPageTabs_query } from '~relay/ProposalFormAdminPageTabs_query.graphql';

type DefaultProps = void;
type Props = {|
  proposalForm: ProposalFormAdminPageTabs_proposalForm,
  query: ProposalFormAdminPageTabs_query,
  intl: IntlShape,
|};
type State = void;

export class ProposalFormAdminPageTabs extends Component<Props, State> {
  static defaultProps: DefaultProps;

  render() {
    const { intl, proposalForm, query } = this.props;
    return (
      <div>
        {proposalForm.url !== '' ? (
          <p>
            <strong>
              <FormattedMessage id="permalink" /> :
            </strong>{' '}
            <a href={proposalForm.url}>{proposalForm.url}</a> |{' '}
            <b>{intl.formatMessage({ id: 'global.ref' })} : </b>{' '}
            {proposalForm.reference}
          </p>
        ) : (
          <p>
            <strong>
              <FormattedMessage id="permalink-unavailable" />{' '}
            </strong>
            <FormattedMessage id="proposal-form-not-linked-to-a-project" /> |{' '}
            <b>{intl.formatMessage({ id: 'global.ref' })} : </b>{' '}
            {proposalForm.reference}
          </p>
        )}
        <Tabs defaultActiveKey={1} id="proposal-form-admin-page-tabs">
          <Tab eventKey={1} title={intl.formatMessage({ id: 'global.configuration' })}>
            <ProposalFormAdminConfigurationForm proposalForm={proposalForm} query={query} />
          </Tab>
          <Tab eventKey={2} title={intl.formatMessage({ id: 'proposal.tabs.evaluation' })}>
            <ProposalFormAdminEvaluationForm proposalForm={proposalForm} />
          </Tab>
          <Tab eventKey={3} title={intl.formatMessage({ id: 'proposal_form.admin.notification' })}>
            <ProposalFormAdminNotificationForm proposalForm={proposalForm} />
          </Tab>
          <Tab eventKey={4} title={intl.formatMessage({ id: 'global.params' })}>
            <ProposalFormAdminSettingsForm proposalForm={proposalForm} />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

const container = injectIntl(ProposalFormAdminPageTabs);

export default createFragmentContainer(container, {
  proposalForm: graphql`
    fragment ProposalFormAdminPageTabs_proposalForm on ProposalForm {
      url
      reference
      ...ProposalFormAdminConfigurationForm_proposalForm
      ...ProposalFormAdminNotificationForm_proposalForm
      ...ProposalFormAdminSettingsForm_proposalForm
      ...ProposalFormAdminEvaluationForm_proposalForm
    }
  `,
  query: graphql`
    fragment ProposalFormAdminPageTabs_query on Query {
      ...ProposalFormAdminConfigurationForm_query
    }
  `,
});