// @flow
import * as React from 'react';
import { graphql } from 'react-relay';
import { useFragment } from 'relay-hooks';
import { FormattedMessage, useIntl } from 'react-intl';
import { useState } from 'react';
import type { Props as DetailDrawerProps } from '~ds/DetailDrawer/DetailDrawer';
import DetailDrawer from '~ds/DetailDrawer/DetailDrawer';
import Flex from '~ui/Primitives/Layout/Flex';
import Text from '~ui/Primitives/Text';
import DebateStepPageAlternateArgumentsPagination, {
  CONNECTION_CONFIG,
} from '~/components/Debate/Page/Arguments/DebateStepPageAlternateArgumentsPagination';
import type {
  DebateStepPageArgumentsDrawer_debate,
  DebateStepPageArgumentsDrawer_debate$key,
} from '~relay/DebateStepPageArgumentsDrawer_debate.graphql';
import type { DebateStepPageArgumentsDrawer_viewer } from '~relay/DebateStepPageArgumentsDrawer_viewer.graphql';
import { Menu } from '~ds/Menu';
import Button from '~ds/Button/Button';
import { ICON_NAME } from '~ds/Icon/Icon';
import type { RelayHookPaginationProps as PaginationProps } from '~/types';
import { CONNECTION_NODES_PER_PAGE } from '~/components/Debate/Page/Arguments/DebateStepPageArgumentsPagination';
import type { Filter } from '~/components/Debate/Page/Arguments/types';

const DEBATE_FRAGMENT = graphql`
  fragment DebateStepPageArgumentsDrawer_debate on Debate
    @argumentDefinitions(isAuthenticated: { type: "Boolean!" }) {
    id
    arguments(first: 0) {
      totalCount
    }
    forArguments: arguments(first: 0, value: FOR) {
      totalCount
    }
    againstArguments: arguments(first: 0, value: AGAINST) {
      totalCount
    }
    ...DebateStepPageAlternateArgumentsPagination_debate
      @arguments(
        isAuthenticated: $isAuthenticated
        orderBy: { field: PUBLISHED_AT, direction: DESC }
      )
  }
`;

const VIEWER_FRAGMENT = graphql`
  fragment DebateStepPageArgumentsDrawer_viewer on User {
    ...DebateStepPageAlternateArgumentsPagination_viewer
  }
`;

const DebateStepPageArgumentsDrawer = ({
  debate: debateFragment,
  viewer: viewerFragment,
  ...drawerProps
}: {|
  ...DetailDrawerProps,
  +debate: DebateStepPageArgumentsDrawer_debate$key,
  +viewer: ?DebateStepPageArgumentsDrawer_viewer,
|}) => {
  const intl = useIntl();
  const debate: DebateStepPageArgumentsDrawer_debate = useFragment(DEBATE_FRAGMENT, debateFragment);
  const viewer: DebateStepPageArgumentsDrawer_viewer = useFragment(VIEWER_FRAGMENT, viewerFragment);
  const [filter, setFilter] = useState<Filter>('DESC');
  const [connection, setConnection] = useState<?{ ...PaginationProps, hasMore: boolean }>(null);

  return (
    <DetailDrawer {...drawerProps}>
      <DetailDrawer.Header textAlign="center" display="grid" gridTemplateColumns="1fr 10fr 1fr">
        <Flex direction="column">
          <Text fontWeight="bold">
            <FormattedMessage
              tagName={React.Fragment}
              id="shortcut.opinion"
              values={{ num: debate.arguments.totalCount }}
            />
          </Text>
          <Text color="neutral-gray.700">
            <FormattedMessage
              tagName={React.Fragment}
              id="vote-count-for-and-against"
              values={{
                for: debate.forArguments.totalCount,
                against: debate.againstArguments.totalCount,
              }}
            />
          </Text>
        </Flex>
        <Menu>
          <Menu.Button as={React.Fragment}>
            <Button p={0} rightIcon={ICON_NAME.ARROW_DOWN} color="gray.500">
              <FormattedMessage tagName={React.Fragment} id="argument.sort.label" />
            </Button>
          </Menu.Button>
          <Menu.List>
            <Menu.OptionGroup
              title={intl.formatMessage({ id: 'arguments.sort' })}
              type="radio"
              onChange={newFilter => {
                setFilter(((newFilter: any): Filter));
                const field = newFilter === 'MOST_SUPPORTED' ? 'VOTE_COUNT' : 'PUBLISHED_AT';
                const direction = newFilter === 'MOST_SUPPORTED' ? 'DESC' : newFilter;
                if (connection)
                  connection.refetchConnection(CONNECTION_CONFIG, CONNECTION_NODES_PER_PAGE, null, {
                    orderBy: { field, direction },
                    debateId: debate?.id,
                  });
              }}
              value={filter}>
              <Menu.OptionItem value="DESC">
                <Text>
                  <FormattedMessage tagName={React.Fragment} id="project.sort.last" />
                </Text>
              </Menu.OptionItem>
              <Menu.OptionItem value="ASC">
                <Text>
                  <FormattedMessage tagName={React.Fragment} id="opinion.sort.old" />
                </Text>
              </Menu.OptionItem>
              <Menu.OptionItem value="MOST_SUPPORTED">
                <Text>
                  <FormattedMessage tagName={React.Fragment} id="filter.most_supported" />
                </Text>
              </Menu.OptionItem>
            </Menu.OptionGroup>
          </Menu.List>
        </Menu>
      </DetailDrawer.Header>
      <DetailDrawer.Body>
        <Flex overflow="auto" height="100%" direction="column" spacing={4}>
          <DebateStepPageAlternateArgumentsPagination
            handleChange={value => {
              if (value.hasMore !== connection?.hasMore) setConnection(value);
            }}
            debate={debate}
            viewer={viewer}
          />
        </Flex>
      </DetailDrawer.Body>
    </DetailDrawer>
  );
};

export default DebateStepPageArgumentsDrawer;