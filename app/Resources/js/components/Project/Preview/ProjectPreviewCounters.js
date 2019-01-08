// @flow
import * as React from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import ProjectPreviewCounter from './ProjectPreviewCounter';
import TagsList from '../../Ui/List/TagsList';
import ProjectRestrictedAccessFragment from '../Page/ProjectRestrictedAccessFragment';
import type { ProjectPreviewCounters_project } from './__generated__/ProjectPreviewCounters_project.graphql';

type Props = {
  project: ProjectPreviewCounters_project,
};

class ProjectPreviewCounters extends React.Component<Props> {
  getNbCounters = () => {
    const { project } = this.props;
    const { votesCount } = project;
    let nb = 2;
    nb += votesCount ? 1 : 0;
    return nb;
  };

  render() {
    const { project } = this.props;
    return (
      <TagsList>
        <ProjectPreviewCounter
          value={project.contributionsCount ? project.contributionsCount : 0}
          label="project.preview.counters.contributions"
          showZero
          icon="cap-baloon-1"
        />
        <ProjectPreviewCounter
          value={project.votesCount}
          label="project.preview.counters.votes"
          icon="cap-hand-like-2-1"
        />
        <ProjectPreviewCounter
          value={project.participantsCount}
          label="project.preview.counters.contributors"
          showZero
          icon="cap-user-2-1"
        />
        <div className="tags-list__tag">
          {/* $FlowFixMe */}
          <ProjectRestrictedAccessFragment project={project} icon="cap-lock-2-1" />
        </div>
      </TagsList>
    );
  }
}

export default createFragmentContainer(ProjectPreviewCounters, {
  project: graphql`
    fragment ProjectPreviewCounters_project on Project {
      id
      participantsCount
      contributionsCount
      votesCount
      ...ProjectRestrictedAccessFragment_project
    }
  `,
});
