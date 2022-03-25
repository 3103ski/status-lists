import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import { useQuery } from '@apollo/client';
import { ProjectContext } from '../../contexts';
import { TaskBlock, Loader, CreateTaskForm } from '../../components/';
import { GET_PROJECT } from '../../gql/';

import * as style from './shared.module.scss';

export default function ProjectPage({
	match: {
		params: { projectId },
	},
}) {
	const { setFocusProject, focusProject, errorCreatingTask } = React.useContext(ProjectContext);

	const {
		data: project,
		loading: loadingProject,
		errors: errorLoadingProject,
	} = useQuery(GET_PROJECT, {
		variables: {
			projectId,
		},
	});
	React.useEffect(() => {
		if (projectId && projectId !== focusProject) {
			console.log(`setting ${projectId} as focus project`);
			setFocusProject(projectId);
		}
	}, [focusProject, projectId, setFocusProject]);

	React.useEffect(() => {
		const project = document.getElementById(`${focusProject}-wrapper`);
		if (project) project.scrollTop = 0;
	}, [focusProject]);

	const [showArchived, setShowArchived] = React.useState(false);

	return React.useMemo(
		() =>
			loadingProject || project.project === -1 ? (
				<Loader loadingText='Getting Project' />
			) : (
				<div
					style={{ padding: '50px 30px' }}
					id={`${project.project.id}-wrapper`}
					className={style.ViewWrapper}>
					<div style={{ marginBottom: '30px' }}>
						<h1>{project.project.title}</h1>
						<div className={style.Archive} onClick={() => setShowArchived(!showArchived)}>
							<p>
								Show Archived Tasks ({project.project.tasks.filter((t) => t.archived === true).length})
							</p>
							<Checkbox
								toggle
								checked={showArchived}
								onChange={(_, d) => {
									setShowArchived(d.checked);
								}}
							/>
						</div>
						{errorCreatingTask || errorLoadingProject ? <p>Error</p> : null}
					</div>
					{project.project.tasks.map((task) => {
						if (task.archived === false || (task.archived === true && showArchived === true)) {
							return <TaskBlock key={task.id} projectTitle={project.project.title} task={task} />;
						}
						return null;
					})}
					<CreateTaskForm wrapperId={`${project.project.id}-wrapper`} />
				</div>
			),
		[errorCreatingTask, errorLoadingProject, loadingProject, project, showArchived]
	);
}
