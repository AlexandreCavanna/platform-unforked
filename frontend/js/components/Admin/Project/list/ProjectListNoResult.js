// @flow
import * as React from 'react';
import { useIntl } from 'react-intl';
import Heading from '~ui/Primitives/Heading';
import Flex from '~ui/Primitives/Layout/Flex';
import Text from '~ui/Primitives/Text';
import SpotIcon, { SPOT_ICON_NAME } from '~ds/SpotIcon/SpotIcon';
import type { ProjectModalCreateProject_query$key } from '~relay/ProjectModalCreateProject_query.graphql';
import ProjectModalCreateProject from '~/components/Admin/Project/list/ProjectModalCreateProject';

type Props = {|
  +viewerId: string,
  +isAdmin: boolean,
  +orderBy: string,
  +term: string,
  +query: ?ProjectModalCreateProject_query$key,
  +modalInitialValues: {|
    +title: string,
    +author?: ?any,
    +type?: ?string,
  |},
  +isOnlyProjectAdmin: boolean,
  +hasProjects: boolean,
|};

const ProjectListNoResult = ({
  query,
  isAdmin,
  orderBy,
  term,
  modalInitialValues,
  viewerId,
  isOnlyProjectAdmin,
  hasProjects,
}: Props): React.Node => {
  const intl = useIntl();

  return (
    <Flex
      direction="row"
      spacing={8}
      bg="white"
      py="96px"
      px="111px"
      mt={6}
      mx={6}
      borderRadius="normal">
      <SpotIcon name={SPOT_ICON_NAME.PROJECT} size="lg" />

      <Flex direction="column" color="blue.900" align="flex-start" width="300px">
        <Heading as="h3" mb={2}>
          {intl.formatMessage({ id: 'publish.first.project' })}
        </Heading>
        <Text mb={8}>{intl.formatMessage({ id: 'project.first.description' })}</Text>

        <ProjectModalCreateProject
          viewerId={viewerId}
          intl={intl}
          isAdmin={isAdmin}
          orderBy={orderBy}
          term={term}
          query={query}
          initialValues={modalInitialValues}
          isOnlyProjectAdmin={isOnlyProjectAdmin}
          noResult
          hasProjects={hasProjects}
        />
      </Flex>
    </Flex>
  );
};

export default ProjectListNoResult;
