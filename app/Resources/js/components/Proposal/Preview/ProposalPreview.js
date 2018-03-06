import React, { PropTypes } from 'react';
import { Col } from 'react-bootstrap';
import classNames from 'classnames';
import ProposalPreviewHeader from './ProposalPreviewHeader';
import ProposalPreviewBody from './ProposalPreviewBody';
import ProposalPreviewVote from './ProposalPreviewVote';
import ProposalPreviewFooter from './ProposalPreviewFooter';
import ProposalStatus from './ProposalStatus';
import ProposalVoteThresholdProgressBar from '../Vote/ProposalVoteThresholdProgressBar';
import { VOTE_TYPE_DISABLED, VOTE_TYPE_BUDGET } from '../../../constants/ProposalConstants';
import { CardContainer } from "../../Ui/Card/CardContainer";

const ProposalPreview = React.createClass({
  propTypes: {
    proposal: PropTypes.object.isRequired,
    step: PropTypes.object.isRequired,
    showThemes: PropTypes.bool,
    showComments: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      showThemes: false,
      showComments: false,
    };
  },

  render() {
    const { proposal, step, showThemes, showComments } = this.props;
    const voteType = step.voteType;

    return (
      <Col componentClass="li" xs={12} sm={6} md={4} lg={3}>
        <CardContainer
          id={`proposal-${proposal.id}`}
          className={proposal.author && proposal.author.vip ? 'bg-vip ' : null}
        >
          <ProposalPreviewHeader proposal={proposal} />
          <ProposalPreviewBody
            proposal={proposal}
            showNullEstimation={voteType === VOTE_TYPE_BUDGET}
            showThemes={showThemes}
          />
          {step.id === proposal.votableStepId && (
            <div className="proposal__buttons text-center">
              <ProposalPreviewVote proposal={proposal} />
            </div>
          )}
          {step.voteThreshold > 0 && (
            <div style={{ marginTop: '20px' }}>
              <ProposalVoteThresholdProgressBar proposal={proposal} step={step} />
            </div>
          )}
          <ProposalPreviewFooter
            proposal={proposal}
            showVotes={voteType !== VOTE_TYPE_DISABLED}
            showComments={showComments}
            stepId={step.id}
          />
          <ProposalStatus proposal={proposal} stepId={step.id} />
        </CardContainer>
      </Col>
    );
  },
});

export default ProposalPreview;
