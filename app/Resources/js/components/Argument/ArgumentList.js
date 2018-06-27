// @flow
import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect, type MapStateToProps } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { QueryRenderer, graphql, type ReadyState } from 'react-relay';
import Input from '../Form/Input';
import environment, { graphqlError } from '../../createRelayEnvironment';
import ArgumentListView from './ArgumentListView';
import Loader from '../Ui/Loader';
import type ArgumentListQueryResponse from './__generated__/ArgumentListQuery.graphql';

type Props = {
  argumentable: { id: string },
  isAuthenticated: boolean,
  type: 'FOR' | 'AGAINST' | 'SIMPLE',
};

type State = {
  order: string,
};

export class ArgumentList extends React.Component<Props, State> {
  state = {
    order: 'recent',
  };

  updateOrderBy = (event: Event) => {
    this.setState({
      // $FlowFixMe
      order: event.target.value,
    });
  };

  render() {
    const { type, isAuthenticated } = this.props;
    return (
      <div id={`opinion__arguments--${type}`} className="block--tablet block--bordered">
        <QueryRenderer
          environment={environment}
          query={graphql`
            query ArgumentListQuery(
              $argumentableId: ID!
              $isAuthenticated: Boolean!
              $type: ArgumentValue
              $count: Int!
              $cursor: String
              $orderBy: ArgumentOrder
            ) {
              argumentable: node(id: $argumentableId) {
                ... on Argumentable {
                  allArguments: arguments(first: 0, type: $type) {
                    totalCount
                  }
                }
                ...ArgumentListView_argumentable
              }
            }
          `}
          variables={{
            isAuthenticated,
            argumentableId: this.props.argumentable.id,
            type,
            count: 10,
            cursor: null,
            orderBy: { field: 'CREATED_AT', direction: 'DESC' },
          }}
          render={({ error, props }: ReadyState & { props?: ArgumentListQueryResponse }) => {
            if (error) {
              return graphqlError;
            }
            if (props) {
              const argumentable = props.argumentable;
              const totalCount = argumentable.allArguments.totalCount;
              const htmlFor = `filter-arguments-${type}`;
              return (
                <React.Fragment>
                  <Row className="opinion__arguments__header">
                    <Col xs={12} sm={6} md={6}>
                      <h4 className="opinion__header__title">
                        {type === 'SIMPLE' ? (
                          <FormattedMessage
                            id="argument.simple.list"
                            values={{ num: totalCount }}
                          />
                        ) : type === 'FOR' ? (
                          <FormattedMessage id="argument.yes.list" values={{ num: totalCount }} />
                        ) : (
                          <FormattedMessage id="argument.no.list" values={{ num: totalCount }} />
                        )}
                      </h4>
                    </Col>
                    {totalCount && (
                      <Col xs={12} sm={6} md={6} className="block--first-mobile">
                        <label htmlFor={htmlFor}>
                          <span className="sr-only">
                            <FormattedMessage
                              id={`argument.filter.${type === 'AGAINST' ? 'no' : 'yes'}`}
                            />
                          </span>
                        </label>
                        <Input
                          id={htmlFor}
                          className="form-control pull-right"
                          type="select"
                          onChange={this.updateOrderBy}>
                          <FormattedMessage id="global.filter_last">
                            {message => <option value="last">{message}</option>}
                          </FormattedMessage>
                          <FormattedMessage id="global.filter_old">
                            {message => <option value="old">{message}</option>}
                          </FormattedMessage>
                          <FormattedMessage id="global.filter_popular">
                            {message => <option value="popular">{message}</option>}
                          </FormattedMessage>
                        </Input>
                      </Col>
                    )}
                  </Row>
                  {/* $FlowFixMe */}
                  <ArgumentListView order={this.state.order} argumentable={argumentable} />
                </React.Fragment>
              );
            }
            return <Loader />;
          }}
        />
      </div>
    );
  }
}

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  isAuthenticated: !!state.user.user,
});
const container = connect(mapStateToProps)(ArgumentList);

export default container;
