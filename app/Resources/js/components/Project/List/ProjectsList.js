// @flow
import * as React from 'react';
import { connect, type MapStateToProps } from 'react-redux';
import ProjectPreview from '../Preview/ProjectPreview';
import type { State } from '../../../types';

type Props = {
  projects: Array<Object>,
  hasSecondTitle?: boolean,
};

export class ProjectsList extends React.Component<Props> {
  render() {
    const { projects, hasSecondTitle } = this.props;
    if (projects.length > 0) {
      return (
        <div className="project__preview">
          {projects.map((project, index) => (
            <ProjectPreview key={index} project={project} hasSecondTitle={hasSecondTitle} />
          ))}
        </div>
      );
    }
    return <p>Aucun projet</p>;
  }
}

const mapStateToProps: MapStateToProps<*, *, *> = (state: State, props: Object) => ({
  projects: props.projects.map(project => state.project.projectsById[project.id]),
});
export default connect(mapStateToProps)(ProjectsList);
