// @flow
import * as React from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import { connect, type MapStateToProps } from 'react-redux';
// import SourceActions from '../../../actions/SourceActions';
import OpinionSourceVoteButton from './OpinionSourceVoteButton';
import type { GlobalState } from '../../../types';
import type { OpinionSourceVoteBox_source } from './__generated__/OpinionSourceVoteBox_source.graphql';

type Props = {
  source: OpinionSourceVoteBox_source,
  user?: Object,
};

class OpinionSourceVoteBox extends React.Component<Props> {
  vote = () => {
    // const { source } = this.props;
    // this.setState({ hasVoted: true });
    // SourceActions.addVote(source.id);
  };

  deleteVote = () => {
    // const { source } = this.props;
    // this.setState({ hasVoted: false });
    // SourceActions.deleteVote(source.id);
  };

  isTheUserTheAuthor = () => {
    const { source, user } = this.props;
    if (source.author === null || !user) {
      return false;
    }
    return user.uniqueId === source.author.slug;
  };

  render() {
    const { source } = this.props;
    return (
      <span>
        <form style={{ display: 'inline-block' }}>
          <OpinionSourceVoteButton
            disabled={!source.contribuable || this.isTheUserTheAuthor()}
            hasVoted={source.viewerHasVote}
            onClick={source.viewerHasVote ? this.deleteVote : this.vote}
          />
        </form>{' '}
        <span className="opinion__votes-nb">{source.votesCount}</span>
      </span>
    );
  }
}

const mapStateToProps: MapStateToProps<*, *, *> = (state: GlobalState) => {
  return {
    user: state.user.user,
  };
};

const container = connect(mapStateToProps)(OpinionSourceVoteBox);
export default createFragmentContainer(
  container,
  graphql`
    fragment OpinionSourceVoteBox_source on Source
      @argumentDefinitions(isAuthenticated: { type: "Boolean" }) {
      author {
        id
        slug
      }
      contribuable
      votesCount
      viewerHasVote @include(if: $isAuthenticated)
    }
  `,
);
