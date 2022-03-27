import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import { useQuery } from '@apollo/client';
import { ProjectContext } from '../../contexts';
import { TaskBlock, Loader, CreateTaskForm, UpdateProjectTitleInput, EditToggleIcon } from '../../components/';
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

	React.useEffect(() => {
		const project = document.getElementById(`${focusProject}-wrapper`);
		if (project) project.scrollTop = 0;
	}, [focusProject]);

	const [showArchived, setShowArchived] = React.useState(false);
	const [isEditingProjectTitle, setIsEditingProjectTitle] = React.useState(false);

	return React.useMemo(
		() =>
			loadingProject || project.project === -1 ? (
				<Loader loadingText='Getting Project' />
			) : (
				<div
					style={{ padding: '50px 30px' }}
					id={`${project.project.id}-wrapper`}
					className={style.ViewWrapper}>
					<div style={{ marginBottom: '30px' }} className={style.HeaderWrapper}>
						<div className={style.TitleWrapper}>
							{!isEditingProjectTitle ? (
								<h1 onDoubleClick={() => setIsEditingProjectTitle(true)}>{project.project.title}</h1>
							) : (
								<UpdateProjectTitleInput
									project={project.project !== -1 ? project.project : {}}
									callback={() => setIsEditingProjectTitle(false)}
								/>
							)}
							<EditToggleIcon isEditing={isEditingProjectTitle} setIsEditing={setIsEditingProjectTitle} />
						</div>
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
		[errorCreatingTask, errorLoadingProject, isEditingProjectTitle, loadingProject, project, showArchived]
	);
}
