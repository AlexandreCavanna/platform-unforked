// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { graphql } from 'react-relay';
import { useDisclosure } from '@liinkiing/react-hooks';
import { useFragment } from 'relay-hooks';
import Heading from '~ui/Primitives/Heading';
import AppBox from '~/components/Ui/Primitives/AppBox';
import Button from '~ds/Button/Button';
import Flex from '~/components/Ui/Primitives/Layout/Flex';
import type { MobileDebateStepPageArguments_debate$key } from '~relay/MobileDebateStepPageArguments_debate.graphql';
import type { MobileDebateStepPageArguments_viewer$key } from '~relay/MobileDebateStepPageArguments_viewer.graphql';
import DebateStepPageAlternateArgumentsPagination from '~/components/Debate/Page/Arguments/DebateStepPageAlternateArgumentsPagination';
import DebateStepPageArgumentsDrawer from '~/components/Debate/Page/Drawers/DebateStepPageArgumentsDrawer';

type Props = {|
  +debate: MobileDebateStepPageArguments_debate$key,
  +viewer: ?MobileDebateStepPageArguments_viewer$key,
|};

const DEBATE_FRAGMENT = graphql`
  fragment MobileDebateStepPageArguments_debate on Debate
    @argumentDefinitions(isAuthenticated: { type: "Boolean!" }) {
    arguments(first: 0) {
      totalCount
    }
    ...DebateStepPageArgumentsDrawer_debate @arguments(isAuthenticated: $isAuthenticated)
    ...DebateStepPageAlternateArgumentsPagination_debate
      @arguments(
        isAuthenticated: $isAuthenticated
        orderBy: { field: PUBLISHED_AT, direction: DESC }
      )
  }
`;

const VIEWER_FRAGMENT = graphql`
  fragment MobileDebateStepPageArguments_viewer on User {
    ...DebateStepPageArgumentsDrawer_viewer
    ...DebateStepPageAlternateArgumentsPagination_viewer
  }
`;

export const MobileDebateStepPageArguments = ({
  debate: debateFragment,
  viewer: viewerFragment,
}: Props) => {
  const debate = useFragment(DEBATE_FRAGMENT, debateFragment);
  const viewer = useFragment(VIEWER_FRAGMENT, viewerFragment);
  const { isOpen, onClose, onOpen } = useDisclosure();
  if (!debate) return null;

  const argumentsCount = debate.arguments?.totalCount ?? 0;
  return (
    <AppBox id="DebateStepPageArguments">
      <DebateStepPageArgumentsDrawer
        onClose={onClose}
        isOpen={isOpen}
        debate={debate}
        viewer={viewer}
      />
      <Flex direction="row" justifyContent="space-between" mb={6}>
        <Heading as="h3" fontWeight="400" capitalize>
          <FormattedMessage id="shortcut.opinion" values={{ num: argumentsCount }} />
        </Heading>
        <Button onClick={onOpen} variant="link" ml="auto">
          <FormattedMessage id="global.show_all" />
        </Button>
      </Flex>
      <Flex direction="row">
        <DebateStepPageAlternateArgumentsPagination debate={debate} viewer={viewer} preview />
      </Flex>
    </AppBox>
  );
};

export default MobileDebateStepPageArguments;