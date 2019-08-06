// @flow
import React from 'react';
import { type ReadyState, QueryRenderer, graphql } from 'react-relay';
import environment, { graphqlError } from '../../createRelayEnvironment';
import { type SectionListPageQueryResponse } from '~relay/SectionListPageQuery.graphql';

import SectionList from './SectionList';
import Loader from '../Ui/FeedbacksIndicators/Loader';

const query = graphql`
  query SectionListPageQuery($userId: ID!) {
    sections(user: $userId) {
      ...SectionList_sections @arguments(userId: $userId, includeTrashed: true)
    }
  }
`;

export type Props = {|
  userId: string,
|};

export const rendering = ({
  error,
  props,
}: {|
  ...ReadyState,
  props: ?SectionListPageQueryResponse,
|}) => {
  if (error) {
    return graphqlError;
  }

  if (props) {
    if (props.sections != null) {
      // $FlowFixMe
      return <SectionList sections={props.sections} />;
    }
  }
  return <Loader />;
};

export default class SectionListPage extends React.Component<Props> {
  render() {
    const { userId } = this.props;

    return (
      <div>
        <QueryRenderer
          environment={environment}
          query={query}
          variables={{
            userId,
          }}
          render={rendering}
        />
      </div>
    );
  }
}