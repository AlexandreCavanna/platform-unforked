import React, { PropTypes } from 'react';
import ProposalActions from '../../../actions/ProposalActions';
import ProposalVoteModal from '../Vote/ProposalVoteModal';
import { VOTE_TYPE_DISABLED, VOTE_TYPE_SIMPLE } from '../../../constants/ProposalConstants';
import ProposalVoteButtonWrapper from '../Vote/ProposalVoteButtonWrapper';
import { connect } from 'react-redux';

const ProposalPreviewVote = React.createClass({
  propTypes: {
    proposal: PropTypes.object.isRequired,
    selectionStep: PropTypes.object,
    creditsLeft: PropTypes.number,
    userHasVote: PropTypes.bool.isRequired,
    onVoteChange: PropTypes.func.isRequired,
    user: PropTypes.object,
  },

  getDefaultProps() {
    return {
      selectionStep: null,
      creditsLeft: null,
      user: null,
    };
  },

  getInitialState() {
    return {
      showModal: false,
    };
  },

  anonymousCanVote() {
    return this.props.selectionStep && this.props.selectionStep.voteType === VOTE_TYPE_SIMPLE;
  },

  toggleModal(value) {
    this.setState({
      showModal: value,
    });
  },

  vote() {
    ProposalActions
      .vote(
        this.props.selectionStep.id,
        this.props.proposal.id,
        this.props.proposal.estimation
      )
      .then(() => {
        this.props.onVoteChange(true);
      })
    ;
  },

  deleteVote() {
    ProposalActions
      .deleteVote(
        this.props.selectionStep.id,
        this.props.proposal.id,
        this.props.proposal.estimation
      )
      .then(() => {
        this.props.onVoteChange(false);
      })
    ;
  },

  voteAction() {
    if (!this.props.user || !this.props.userHasVote) {
      this.toggleModal(true);
      return;
    }
    this.deleteVote();
  },

  render() {
    const { selectionStep, onVoteChange } = this.props;
    if (!selectionStep || selectionStep.voteType === VOTE_TYPE_DISABLED) {
      return null;
    }

    return (
      <div>
        <ProposalVoteButtonWrapper
          selectionStep={selectionStep}
          proposal={this.props.proposal}
          creditsLeft={this.props.creditsLeft}
          userHasVote={this.props.userHasVote}
          onClick={this.voteAction}
          style={{ width: '100%' }}
        />
        <ProposalVoteModal
          proposal={this.props.proposal}
          selectionStep={selectionStep}
          showModal={this.state.showModal}
          onToggleModal={this.toggleModal}
          onVoteChange={onVoteChange}
        />
      </div>
    );
  },

});

const mapStateToProps = (state) => {
  return {
    user: state.default.user,
  };
};

export default connect(mapStateToProps)(ProposalPreviewVote);
