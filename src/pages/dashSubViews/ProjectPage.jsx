import React from 'react';

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
			setFocusProject(projectId);
		}
	}, [focusProject, projectId, setFocusProject]);

	return loadingProject || project.project === -1 ? (
		<Loader loadingText='Getting Project' />
	) : (
		<div style={{ padding: '50px 30px' }} className={style.ViewWrapper}>
			<div style={{ marginBottom: '30px' }}>
				<h1>{project.project.title}</h1>
				{errorCreatingTask || errorLoadingProject ? <p>Error</p> : null}
				<CreateTaskForm />
			</div>
			{project.project.tasks.map((task) => (
				<TaskBlock key={task.id} task={task} />
			))}
		</div>
	);
}
