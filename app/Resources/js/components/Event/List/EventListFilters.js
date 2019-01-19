// @flow
import React from 'react';
import { injectIntl, FormattedMessage, type IntlShape } from 'react-intl';
import { Button, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { fetchQuery, graphql } from 'relay-runtime';
import { reduxForm, Field, formValueSelector, type FormProps } from 'redux-form';
import select from '../../Form/Select';
import type { GlobalState, Dispatch, FeatureToggles } from '../../../types';
import config from '../../../config';
import component from '../../Form/Field';
import { changeEventMobileListView } from '../../../redux/modules/event';
import EventListToggleMobileViewBtn from './EventListToggleMobileViewBtn';
import FiltersContainer from '../../Filters/FiltersContainer';
import environment from '../../../createRelayEnvironment';

type State = { projectOptions: Array<Object>, themeOptions: Array<Object> };
type Props = {|
  ...FormProps,
  features: FeatureToggles,
  dispatch: Dispatch,
  theme: ?string,
  project: ?string,
  search: ?string,
  intl: IntlShape,
  addToggleViewButton: ?boolean,
  userTypes: Array<Object>,
|};

const countFilters = (theme: ?string, project: ?string, search: ?string): number => {
  let nbFilter = 0;
  if (theme) {
    nbFilter++;
  }
  if (project) {
    nbFilter++;
  }
  if (config.isMobile && search) {
    nbFilter++;
  }

  return nbFilter;
};

const projectQuery = graphql`
  query EventListFiltersQuery($withEventOnly: Boolean) {
    projects(withEventOnly: $withEventOnly) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;

const themeQuery = graphql`
  query EventListFiltersThemeQuery {
    themes {
      id
      title
    }
  }
`;

export class EventListFilters extends React.Component<Props, State> {
  state = {
    projectOptions: [],
    themeOptions: [],
  };

  componentDidMount() {
    fetchQuery(environment, projectQuery, { withEventOnly: true })
      .then(res =>
        res.projects.edges.map(edge => ({
          value: edge.node.id,
          label: edge.node.title,
        })),
      )
      .then(projectOptions => {
        this.setState({ projectOptions });
      });
    fetchQuery(environment, themeQuery)
      .then(res =>
        res.themes.map(theme => ({
          value: theme.id,
          label: theme.title,
        })),
      )
      .then(themeOptions => {
        this.setState({ themeOptions });
      });
  }

  render() {
    const {
      features,
      theme,
      project,
      search,
      reset,
      userTypes,
      intl,
      addToggleViewButton,
      dispatch,
    } = this.props;

    const filters = [];
    const nbFilter = countFilters(theme, project, search);

    if (theme !== null || project !== null) {
      if (nbFilter > 0) {
        filters.push(
          <div className="d-flex justify-content-end">
            <Button className="btn--outline btn-dark-gray" onClick={reset}>
              <FormattedMessage id="reset-filters" />
            </Button>
          </div>,
        );
      }
    }

    if (features.themes) {
      filters.push(
        <Field
          component={select}
          clearable
          id="EventListFilters-filter-theme"
          name="theme"
          placeholder={intl.formatMessage({ id: 'type-theme' })}
          options={this.state.themeOptions}
        />,
      );
    }
    if (features.projects_form) {
      filters.push(
        <Field
          component={select}
          clearable
          id="EventListFilters-filter-project"
          name="project"
          placeholder={intl.formatMessage({ id: 'type-project' })}
          options={this.state.projectOptions}
        />,
      );
    }

    if (config.isMobile) {
      filters.push(
        <Field
          clearable
          id="event-search-input"
          name="search"
          type="text"
          addonAfter={<i className="cap cap-magnifier" />}
          component={component}
          placeholder={intl.formatMessage({ id: 'proposal-search' })}
          groupClassName="event-search-group pull-right"
        />,
      );
    }

    filters.push(
      <Field
        component={select}
        autoload
        name="userType"
        id="EventListFilters-filter-userType"
        placeholder={intl.formatMessage({ id: 'registration.type' })}
        options={userTypes.map(u => ({ value: u.id, label: u.name }))}
      />,
    );

    const popoverBottom = (
      <div>
        <form>
          {filters.map((filter, index) => (
            <Col key={index} className="mt-5">
              <div>{filter}</div>
            </Col>
          ))}
        </form>
      </div>
    );

    const filterCount = () => {
      if (nbFilter > 0) {
        return nbFilter;
      }
    };
    return (
      <Row className={config.isMobile ? 'mb-10 ml-0' : 'mb-10'}>
        <Col xs={12} md={8} className="pl-0">
          <FiltersContainer type="event" overlay={popoverBottom} filterCount={filterCount()} />
          {config.isMobile && addToggleViewButton && features.display_map ? (
            <EventListToggleMobileViewBtn
              showMapButton
              isMobileListView
              onChange={isListView => {
                dispatch(changeEventMobileListView(isListView));
              }}
            />
          ) : null}
        </Col>
        <Col md={4} smHidden xsHidden>
          <form>
            <Field
              id="event-search-input"
              name="search"
              type="text"
              component={component}
              placeholder={intl.formatMessage({ id: 'proposal-search' })}
              addonAfter={<i className="cap cap-magnifier" />}
              divClassName="event-search-group pull-right w-100"
            />
          </form>
        </Col>
      </Row>
    );
  }
}

const selector = formValueSelector('EventListFilters');

const mapStateToProps = (state: GlobalState) => ({
  features: state.default.features,
  theme: selector(state, 'theme'),
  project: selector(state, 'project'),
  search: selector(state, 'search'),
  userType: selector(state, 'userType'),
  userTypes: state.default.userTypes,
});

const form = reduxForm({
  form: 'EventListFilters',
  destroyOnUnmount: false,
})(EventListFilters);

export default connect(mapStateToProps)(injectIntl(form));
