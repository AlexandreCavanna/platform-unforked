// @flow
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDisclosure } from '@liinkiing/react-hooks';
import Heading from '~ui/Primitives/Heading';
import Flex from '~ui/Primitives/Layout/Flex';
import Text from '~ui/Primitives/Text';
import Button from '~ds/Button/Button';
import SpotIcon, { SPOT_ICON_NAME } from '~ds/SpotIcon/SpotIcon';
import ModalCreateQuestionnaire from './ModalCreateQuestionnaire';
import { type Viewer } from './QuestionnaireListPage';

type Props = {|
  +isAdmin: boolean,
  +viewer: Viewer,
  +term: string,
  +orderBy: string,
  +hasQuestionnaire: boolean,
|};

const NoResult = ({ isAdmin, viewer, term, orderBy, hasQuestionnaire }: Props): React.Node => {
  const intl = useIntl();
  const { isOpen, onOpen, onClose } = useDisclosure(false);

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
      <SpotIcon name={SPOT_ICON_NAME.QUESTIONNAIRE} size="lg" />

      <Flex direction="column" color="blue.900" align="flex-start" maxWidth="300px">
        <Heading as="h3" mb={2}>
          {intl.formatMessage({ id: 'publish-first-questionnaire' })}
        </Heading>
        <Text mb={8}>{intl.formatMessage({ id: 'questionnaire-description' })}</Text>

        <>
          <Button
            variant="primary"
            variantColor="primary"
            variantSize="medium"
            leftIcon="ADD"
            onClick={onOpen}>
            {intl.formatMessage({ id: 'create-questionnaire' })}
          </Button>
          <ModalCreateQuestionnaire
            viewer={viewer}
            intl={intl}
            isAdmin={isAdmin}
            term={term}
            orderBy={orderBy}
            onClose={onClose}
            show={isOpen}
            hasQuestionnaire={hasQuestionnaire}
          />
        </>
      </Flex>
    </Flex>
  );
};

export default NoResult;
