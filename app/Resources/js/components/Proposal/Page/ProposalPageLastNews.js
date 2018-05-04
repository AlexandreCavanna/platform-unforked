// @flow
import * as React from 'react';
import classNames from 'classnames';
import { graphql, createFragmentContainer } from 'react-relay';
import AnswerBody from '../../Answer/AnswerBody';
import type { ProposalPageLastNews_proposal } from './__generated__/ProposalPageLastNews_proposal.graphql';

export class ProposalPageLastNews extends React.Component<{
  proposal: ProposalPageLastNews_proposal,
  className: string,
}> {
  static defaultProps = {
    className: '',
  };

  render() {
    const { proposal, className } = this.props;
    if (proposal.news.totalCount === 0 || !proposal.news.edges) {
      return null;
    }
    const edge = proposal.news.edges[0];
    if (!edge || typeof edge === 'undefined') {
      return null;
    }
    const post = JSON.parse(JSON.stringify(edge.node));
    post.author = post.authors[0] && post.authors[0];
    const classes = {
      'bg-vip': post.authors[0] && post.authors[0].vip,
      block: true,
      className: false,
    };
    if (className) {
      classes[className] = true;
    }

    return (
      <div className={classNames(classes)}>
        {post.title && <h3 className="h3 proposal__last__news__title">{post.title}</h3>}
        <AnswerBody answer={post} />
      </div>
    );
  }
}
export default createFragmentContainer(
  ProposalPageLastNews,
  graphql`
    fragment ProposalPageLastNews_proposal on Proposal {
      news {
        totalCount
        edges {
          node {
            url
            title
            createdAt
            body
            authors {
              id
              vip
              displayName
            }
          }
        }
      }
    }
  `,
);
