// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import { graphql, createPaginationContainer, type RelayPaginationProp } from 'react-relay';
import Comment from './Comment';
import Loader from '../Ui/FeedbacksIndicators/Loader';
import { TRASHED_COMMENT_PAGINATOR_COUNT } from '../Project/ProjectTrashComment';

type Props = {
  relay: RelayPaginationProp,
  project: Object,
};

type State = {
  loading: boolean,
};

export class CommentTrashedListPaginated extends React.Component<Props, State> {
  state = {
    loading: false,
  };

  handleLoadMore = () => {
    this.setState({ loading: true });
    this.props.relay.loadMore(TRASHED_COMMENT_PAGINATOR_COUNT, () => {
      this.setState({ loading: false });
    });
  };

  render() {
    const { project, relay } = this.props;
    const { loading } = this.state;
    if (!project.comments || project.comments.totalCount === 0) {
      return null;
    }

    return (
      <React.Fragment>
        <h3>{project.comments.totalCount} Comment(s)</h3>
        <ListGroup bsClass="media-list" componentClass="ul">
          {project &&
            project.comments &&
            project.comments.edges &&
            project.comments.edges
              .filter(Boolean)
              .map(edge => edge.node)
              .filter(Boolean)
              .map(node => <Comment key={node.id} comment={node} />)}
          {relay.hasMore() && (
            <ListGroupItem style={{ textAlign: 'center' }}>
              {loading ? (
                <Loader />
              ) : (
                <Button bsStyle="link" onClick={this.handleLoadMore}>
                  <FormattedMessage id="global.more" />
                </Button>
              )}
            </ListGroupItem>
          )}
        </ListGroup>
      </React.Fragment>
    );
  }
}

export default createPaginationContainer(
  CommentTrashedListPaginated,
  {
    project: graphql`
      fragment CommentTrashedListPaginated_project on Project {
        id
        comments(first: $count, after: $cursor, onlyTrashed: true)
          @connection(key: "CommentTrashedListPaginated_comments") {
          totalCount
          edges {
            node {
              id
              ...Comment_comment @arguments(isAuthenticated: $isAuthenticated)
            }
          }
          pageInfo {
            hasPreviousPage
            hasNextPage
            startCursor
            endCursor
          }
        }
      }
    `,
  },
  {
    direction: 'forward',
    getConnectionFromProps(props: Props) {
      return props.project && props.project.comments;
    },
    getFragmentVariables(prevVars) {
      return {
        ...prevVars,
      };
    },
    getVariables(props: Props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        count,
        cursor,
      };
    },
    query: graphql`
      query CommentTrashedListPaginatedQuery(
        $projectId: ID!
        $count: Int
        $cursor: String
        $isAuthenticated: Boolean!
      ) {
        project: node(id: $projectId) {
          ...CommentTrashedListPaginated_project
        }
      }
    `,
  },
);
