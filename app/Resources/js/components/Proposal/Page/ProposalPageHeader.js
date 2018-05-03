// @flow
import React from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { connect, type MapStateToProps } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import { createFragmentContainer, graphql } from 'react-relay';
import UserAvatar from '../../User/UserAvatar';
import UserLink from '../../User/UserLink';
import ProposalVoteModal from '../Vote/ProposalVoteModal';
import ProposalVoteButtonWrapperFragment from '../Vote/ProposalVoteButtonWrapperFragment';
import ProposalFollowButton from '../Follow/ProposalFollowButton';
import type { ProposalPageHeader_proposal } from './__generated__/ProposalPageHeader_proposal.graphql';
import type { ProposalPageHeader_step } from './__generated__/ProposalPageHeader_step.graphql';
import type { ProposalPageHeader_viewer } from './__generated__/ProposalPageHeader_viewer.graphql';
import type { State } from '../../../types';

type Props = {
  proposal: ProposalPageHeader_proposal,
  viewer: ?ProposalPageHeader_viewer,
  step: ?ProposalPageHeader_step,
  className: string,
  referer: string,
};

export class ProposalPageHeader extends React.Component<Props> {
  static defaultProps = {
    className: '',
  };

  render() {
    const { step, viewer, proposal, className, referer } = this.props;
    const createdDate = (
      <FormattedDate
        value={moment(proposal.createdAt)}
        day="numeric"
        month="long"
        year="numeric"
        hour="numeric"
        minute="numeric"
      />
    );
    const updatedDate = (
      <FormattedDate
        value={moment(proposal.updatedAt)}
        day="numeric"
        month="long"
        year="numeric"
        hour="numeric"
        minute="numeric"
      />
    );

    const classes = {
      proposal__header: true,
      [className]: true,
    };

    return (
      <div className={classNames(classes)}>
        <div>
          <a style={{ textDecoration: 'none' }} href={referer || proposal.show_url}>
            <i className="cap cap-arrow-65-1 icon--black" /> <FormattedMessage id="proposal.back" />
          </a>
        </div>
        <h1 className="consultation__header__title h1">{proposal.title}</h1>
        <div className="media mb-15">
          <UserAvatar className="pull-left" user={proposal.author} />
          <div className="media-body">
            <p className="media--aligned excerpt">
              <FormattedMessage
                id="proposal.infos.header"
                values={{
                  user: <UserLink user={proposal.author} />,
                  createdDate,
                }}
              />
              {moment(proposal.updatedAt).diff(proposal.createdAt, 'seconds') > 1 && (
                <span>
                  {' • '}
                  <FormattedMessage
                    id="global.edited_on"
                    values={{
                      updated: updatedDate,
                    }}
                  />
                </span>
              )}
            </p>
          </div>
        </div>
        {proposal.publicationStatus !== 'DRAFT' && (
          <div className="proposal__buttons">
            {step && (
              // $FlowFixMe
              <ProposalVoteButtonWrapperFragment
                proposal={proposal}
                step={step}
                viewer={viewer}
                id="proposal-vote-btn"
              />
            )}
            {/* $FlowFixMe https://github.com/cap-collectif/platform/issues/4973 */}
            <ProposalFollowButton proposal={proposal} isAuthenticated={!!viewer} />
          </div>
        )}
        {viewer &&
          proposal.publicationStatus !== 'DRAFT' &&
          step && <ProposalVoteModal proposal={proposal} step={step} />}
      </div>
    );
  }
}

const mapStateToProps: MapStateToProps<*, *, *> = (state: State) => {
  return {
    referer: state.proposal.referer,
  };
};

const container = connect(mapStateToProps)(ProposalPageHeader);

export default createFragmentContainer(container, {
  viewer: graphql`
    fragment ProposalPageHeader_viewer on User {
      ...ProposalVoteButtonWrapperFragment_viewer @arguments(stepId: $stepId)
    }
  `,
  step: graphql`
    fragment ProposalPageHeader_step on ProposalStep
      @argumentDefinitions(isAuthenticated: { type: "Boolean", defaultValue: true }) {
      ...ProposalVoteButtonWrapperFragment_step
      ...ProposalVoteModal_step @include(if: $isAuthenticated)
    }
  `,
  proposal: graphql`
    fragment ProposalPageHeader_proposal on Proposal
      @argumentDefinitions(isAuthenticated: { type: "Boolean", defaultValue: true }) {
      id
      ...ProposalVoteButtonWrapperFragment_proposal
        @arguments(stepId: $stepId, isAuthenticated: $isAuthenticated)
      ...ProposalVoteModal_proposal @arguments(stepId: $stepId) @include(if: $isAuthenticated)
      ...ProposalFollowButton_proposal @arguments(isAuthenticated: $isAuthenticated)
      title
      theme {
        title
      }
      author {
        username
        displayName
        media {
          url
        }
      }
      createdAt
      updatedAt
      publicationStatus
      show_url
    }
  `,
});
