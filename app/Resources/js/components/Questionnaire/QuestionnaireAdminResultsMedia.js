// @flow
import * as React from 'react';
import { createPaginationContainer, graphql, type RelayPaginationProp } from 'react-relay';
import { Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import type { QuestionnaireAdminResultsMedia_mediaQuestion } from './__generated__/QuestionnaireAdminResultsMedia_mediaQuestion.graphql';
import Loader from '../Ui/FeedbacksIndicators/Loader';
import { CardContainer } from '../Ui/Card/CardContainer';
import FileIcon from '../Ui/Icons/FileIcon';

const RESPONSE_PAGINATION = 15;

type Props = {
  relay: RelayPaginationProp,
  mediaQuestion: QuestionnaireAdminResultsMedia_mediaQuestion,
};

type State = {
  loading: boolean,
};

export class QuestionnaireAdminResultsMedia extends React.Component<Props, State> {
  state = {
    loading: false,
  };

  handleLoadMore = () => {
    this.setState({ loading: true });
    this.props.relay.loadMore(RESPONSE_PAGINATION, () => {
      this.setState({ loading: false });
    });
  };

  render() {
    const { relay, mediaQuestion } = this.props;
    const { loading } = this.state;

    const mediaQuestionMedias =
      mediaQuestion &&
      mediaQuestion.responses &&
      mediaQuestion.responses.edges &&
      mediaQuestion.responses.edges.reduce((acc, curr) => {
        acc.push(curr && curr.node.medias);
        return acc;
      }, []);

    const medias = mediaQuestionMedias && [].concat(...mediaQuestionMedias);

    console.log(medias);

    if (medias && medias.length > 0) {
      return (
        <div className="mb-20">
          <div className="row d-flex flex-wrap">
            {medias.map((media, key) => {
              const { contentType } = media;
              const format = contentType.split('/').pop();
              let size;
              if (media.size / 1000 < 1000) {
                size = `${Math.round(media.size / 1000)} Ko`;
              } else if (media.size / 1000000 < 1000) {
                size = `${Math.round(media.size / 1000000)} Mo`;
              } else {
                size = `${Math.round(media.size / 1000000000)} Go`;
              }

              return (
                <div key={key} className="col-sm-3 col-xs-6 d-flex">
                  <CardContainer>
                    <div className="card__body text-center">
                      <div className="mb-5">
                        <FileIcon format={format} />
                      </div>
                      <span className="mb-5">
                        <a href={media.url}>{media.name}</a>
                      </span>
                      <span>
                        {/* {media.size} */}
                        {size}
                      </span>
                    </div>
                  </CardContainer>
                </div>
              );
            })}
          </div>

          {relay.hasMore() && (
            <div className="w-100 text-center">
              {loading ? (
                <Loader />
              ) : (
                <Button
                  bsStyle="primary"
                  className="btn-outline-primary"
                  onClick={this.handleLoadMore}>
                  <FormattedMessage id="global.more" />
                </Button>
              )}
            </div>
          )}
        </div>
      );
    }

    return null;
  }
}

export default createPaginationContainer(
  QuestionnaireAdminResultsMedia,
  {
    mediaQuestion: graphql`
      fragment QuestionnaireAdminResultsMedia_mediaQuestion on MediaQuestion
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 5 }
          cursor: { type: "String", defaultValue: null }
        ) {
        id
        responses(first: $count, after: $cursor)
          @connection(key: "QuestionnaireAdminResultsMedia__responses", filters: []) {
          edges {
            node {
              id
              ... on MediaResponse {
                medias {
                  url
                  name
                  size
                  contentType
                }
              }
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
      return props.mediaQuestion && props.mediaQuestion.responses;
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
        questionId: props.mediaQuestion.id,
      };
    },
    query: graphql`
      query QuestionnaireAdminResultsMediaQuery($questionId: ID!, $cursor: String, $count: Int) {
        mediaQuestion: node(id: $questionId) {
          ...QuestionnaireAdminResultsMedia_mediaQuestion @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
