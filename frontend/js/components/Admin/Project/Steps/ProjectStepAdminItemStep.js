// @flow
import React, { useState } from 'react';
import styled, { type StyledComponent } from 'styled-components';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { ButtonToolbar, Button, Row, Col } from 'react-bootstrap';
import { createFragmentContainer, graphql } from 'react-relay';
import { type Step } from './ProjectStepAdminList';
import DeleteModal from '~/components/Modal/DeleteModal';
import ProjectAdminStepFormModal from '../Step/ProjectAdminStepFormModal';
import type { ProjectStepAdminItemStep_project } from '~relay/ProjectStepAdminItemStep_project.graphql';
import Icon, { ICON_NAME, ICON_SIZE } from '~ds/Icon/Icon';
import Text from '~ui/Primitives/Text';
import Flex from '~ui/Primitives/Layout/Flex';

type Props = {|
  step: Step,
  index: number,
  formName: string,
  fields: { length: number, map: Function, remove: Function },
  handleClickEdit?: (index: number, type: any) => void,
  handleClickDelete?: (index: number, type: any) => void,
  project: ProjectStepAdminItemStep_project,
|};

const ItemQuestionWrapper: StyledComponent<{}, {}, HTMLDivElement> = styled.div`
  padding-right: 8px;
`;

const StepRow: StyledComponent<{}, {}, typeof Row> = styled(Row)`
  .btn-outline-danger.btn-danger {
    width: 33px;
    padding: 6px;
  }
`;

const EditButton: StyledComponent<{}, {}, typeof Button> = styled(Button).attrs({
  className: 'btn-edit btn-outline-warning',
})`
  width: 33px;
  padding: 6px;
  color: #333 !important;
  border: 1px solid #333 !important;
  background: #fff !important;
`;

const onDeleteStep = (fields, index) => {
  fields.remove(index);
};

const getWordingStep = (type: string) =>
  type === 'DebateStep' ? 'global.debate' : `${type.slice(0, -4).toLowerCase()}_step`;

export const ProjectStepAdminItemStep = ({ step, index, fields, formName, project }: Props) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <StepRow>
      <Col xs={8} className="d-flex align-items-center">
        <ItemQuestionWrapper>
          <i className="cap cap-android-menu" style={{ color: '#aaa', fontSize: '20px' }} />
        </ItemQuestionWrapper>
        <ItemQuestionWrapper>
          <strong>{step.title}</strong>
          <br />
          <span className="excerpt">
            {step.type && <FormattedMessage id={getWordingStep(step.type)} />}
          </span>

          {step.type === 'DebateStep' && (
            <>
              <br />
              <Flex
                direction="row"
                bg="blue.100"
                py={1}
                px={2}
                align="center"
                borderRadius="normal"
                border="normal"
                borderColor="blue.150"
                spacing={2}
                marginTop={2}>
                <Icon name={ICON_NAME.INFO} color="blue.500" size={ICON_SIZE.S} />

                <Text color="blue.800">
                  <FormattedHTMLMessage
                    id="finalize.face.to.face.configuration"
                    values={{ link: '#' }}
                  />
                </Text>
              </Flex>
            </>
          )}
        </ItemQuestionWrapper>
      </Col>

      <Col xs={4}>
        <ButtonToolbar className="pull-right">
          <EditButton
            bsStyle="warning"
            onClick={() => setShowEditModal(true)}
            id={`js-btn-edit-${index}`}>
            <i className="fa fa-pencil" />
          </EditButton>
          <Button
            bsStyle="danger"
            id={`js-btn-delete-${index}`}
            className="btn-outline-danger"
            onClick={() => setShowDeleteModal(true)}>
            <i className="fa fa-trash" />
          </Button>
          <ProjectAdminStepFormModal
            onClose={() => setShowEditModal(false)}
            step={step}
            type={step.type || 'OtherStep'}
            show={showEditModal}
            form={formName}
            index={index}
            project={project}
          />
          <DeleteModal
            showDeleteModal={showDeleteModal}
            deleteElement={() => onDeleteStep(fields, index)}
            closeDeleteModal={() => setShowDeleteModal(false)}
            deleteModalTitle="group.admin.step.modal.delete.title"
            deleteModalContent="group.admin.step.modal.delete.content"
          />
        </ButtonToolbar>
      </Col>
    </StepRow>
  );
};

export default createFragmentContainer(ProjectStepAdminItemStep, {
  project: graphql`
    fragment ProjectStepAdminItemStep_project on Project {
      ...ProjectAdminStepFormModal_project
    }
  `,
});
