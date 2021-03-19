// @flow
import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { QueryRenderer, graphql } from 'react-relay';
import environment from '~/createRelayEnvironment';
import type {
  EmailingListPageQueryResponse,
  EmailingListPageQueryVariables,
} from '~relay/EmailingListPageQuery.graphql';
import { Container, Header, Content } from './EmailingListPage.style';
import { useDashboardMailingListContext } from './DashboardMailingList/DashboardMailingList.context';
import PickableList from '~ui/List/PickableList';
import DashboardMailingList, {
  MAILING_LIST_PAGINATION,
} from '~/components/Admin/Emailing/EmailingList/DashboardMailingList/DashboardMailingList';
import type { DashboardParameters } from '~/components/Admin/Emailing/EmailingList/DashboardMailingList/DashboardMailingList.reducer';
import DashboardMailingListPlaceholder from './DashboardMailingListPlaceholder/DashboardMailingListPlaceholder';
import Flex from '~ui/Primitives/Layout/Flex';
import Tag from '~ds/Tag/Tag';
import Button from '~ds/Button/Button';
import { ICON_NAME } from '~ds/Icon/Icon';
import Skeleton from '~ds/Skeleton';

const listMailingList = ({
  error,
  props,
  retry,
}: {
  ...ReactRelayReadyState,
  props: ?EmailingListPageQueryResponse,
}) => {
  return (
    <Skeleton
      isLoaded={!!props}
      placeholder={<DashboardMailingListPlaceholder hasError={!!error} fetchData={retry} />}>
      <PickableList.Provider>
        <DashboardMailingList query={props} />
      </PickableList.Provider>
    </Skeleton>
  );
};

export const createQueryVariables = (
  parameters: DashboardParameters,
): EmailingListPageQueryVariables => ({
  count: MAILING_LIST_PAGINATION,
  cursor: null,
  term: parameters.filters.term,
});

export const EmailingListPage = () => {
  const { parameters, dispatch } = useDashboardMailingListContext();
  const intl = useIntl();

  React.useEffect(() => {
    dispatch({
      type: 'INIT_FILTERS_FROM_URL',
    });
  }, [dispatch]);

  return (
    <Container className="emailing-mailingList-page">
      <Header>
        <Flex direction="row">
          <FormattedMessage id="admin-menu-emailing-list" tagName="h2" />
          <Tag variant="yellow" ml={2}>
            {intl.formatMessage({ id: 'global.beta' })}
          </Tag>
        </Flex>

        <Button
          leftIcon={ICON_NAME.CIRCLE_INFO}
          variant="link"
          variantColor="primary"
          onClick={() => {
            window.location.href = intl.formatMessage({
              id: 'admin.help.link.emailing',
            });
          }}>
          {intl.formatMessage({ id: 'about-mailing-list' })}
        </Button>
      </Header>

      <Content>
        <QueryRenderer
          environment={environment}
          query={graphql`
            query EmailingListPageQuery($count: Int, $cursor: String, $term: String) {
              ...DashboardMailingList_query @arguments(count: $count, cursor: $cursor, term: $term)
            }
          `}
          variables={createQueryVariables(parameters)}
          render={listMailingList}
        />
      </Content>
    </Container>
  );
};

export default EmailingListPage;
