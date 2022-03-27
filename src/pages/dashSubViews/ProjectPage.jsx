import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import { useQuery } from '@apollo/client';
import { ProjectContext, CurrentUserContext } from '../../contexts';
import {
	TaskBlock,
	Loader,
	CreateTaskForm,
	UpdateProjectTitleInput,
	EditToggleIcon,
	Divider,
	List,
} from '../../components/';
import { GET_PROJECT } from '../../gql/';

import * as style from './shared.module.scss';

export default function ProjectPage({
	match: {
		params: { projectId },
	},
}) {
	// Context Data
	//>>>>>>
	const { loadingCurrentUser, currentUser } = React.useContext(CurrentUserContext);
	const { setFocusProject, focusProject, errorCreatingTask } = React.useContext(ProjectContext);

	// Fetch Project Data
	//>>>>>>
	const {
		data: project,
		loading: loadingProject,
		errors: errorLoadingProject,
	} = useQuery(GET_PROJECT, {
		variables: {
			projectId,
		},
	});

	//Edit states
	//>>>>>>
	const [isEditingProjectTitle, setIsEditingProjectTitle] = React.useState(false);

	// List Filters
	//>>>>>>
	const [showArchived, setShowArchived] = React.useState(false);
	const [showCompleted, setShowCompleted] = React.useState(false);
	const [hideAllLists, setHideAllLists] = React.useState(false);

	// Enture context sees correct id for loaded project
	//>>>>>>
	React.useEffect(() => {
		if (projectId && projectId !== focusProject) {
			setFocusProject(projectId);
		}
	}, [focusProject, projectId, setFocusProject]);

	// If the page just loaded, scroll the view component to the top
	//>>>>>>
	React.useEffect(() => {
		const project = document.getElementById(`${focusProject}-wrapper`);
		if (project) project.scrollTop = 0;
	}, [focusProject]);

	return React.useMemo(
		() =>
			loadingProject || project.project === -1 || !focusProject || !currentUser || loadingCurrentUser ? (
				<Loader loadingText='Getting Project' />
			) : (
				<div id={`${project.project.id}-wrapper`} className={style.ViewWrapper}>
					<div className={style.HeaderWrapper}>
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
						<div className={style.Archive} onClick={() => setShowCompleted(!showCompleted)}>
							<p>
								Show Completed Tasks (
								{
									project.project.tasks.filter((t) => t.isComplete === true && t.archived === false)
										.length
								}
								)
							</p>
							<Checkbox
								toggle
								checked={showCompleted}
								onChange={(_, d) => {
									setShowCompleted(d.checked);
								}}
							/>
						</div>
						<div className={style.Archive} onClick={() => setShowCompleted(!showCompleted)}>
							<p>
								Show Both (
								{
									project.project.tasks.filter((t) => t.isComplete === true || t.archived === true)
										.length
								}
								)
							</p>
							<Checkbox
								toggle
								checked={showCompleted && showArchived}
								onChange={(_, d) => {
									setShowCompleted(d.checked);
									setShowArchived(d.checked);
								}}
							/>
						</div>
						<div className={style.Archive} onClick={() => setHideAllLists(!hideAllLists)}>
							<p>Hide All Lists</p>
							<Checkbox
								toggle
								checked={hideAllLists}
								onChange={(_, d) => {
									setHideAllLists(d.checked);
								}}
							/>
						</div>
						{errorCreatingTask || errorLoadingProject ? <p>Error</p> : null}
					</div>
					{showArchived === false ? null : (
						<>
							<h3>Archived</h3>
							{project.project.tasks.map((task) => {
								if (task.archived === true) {
									return (
										<TaskBlock
											key={task.id}
											projectTitle={project.project.title}
											task={task}
											globalHideList={hideAllLists}
											clearGlobalHide={() => setHideAllLists(false)}
										/>
									);
								}
								return null;
							})}
							{project.project.tasks.filter((t) => t.archived === true).length === 0 ? (
								<p>Empty</p>
							) : null}
							<Divider />
						</>
					)}
					{showCompleted === false ? null : (
						<>
							<h3>Completed</h3>
							{project.project.tasks.map((task) => {
								if (task.isComplete === true && task.archived === false) {
									return (
										<TaskBlock
											key={task.id}
											projectTitle={project.project.title}
											task={task}
											globalHideList={hideAllLists}
											clearGlobalHide={() => setHideAllLists(false)}
										/>
									);
								}
								return null;
							})}
							{project.project.tasks.filter((t) => t.isComplete === true && t.archived === false)
								.length === 0 ? (
								<p>Empty</p>
							) : null}
							<Divider />
						</>
					)}
					{project.project.tasks.filter((task) => task.archived === false && task.isComplete === false)
						.length === 0 ? (
						<List.Empty title={`${project.project.title} has no active tasks`} minHeight='50px' />
					) : (
						project.project.tasks.map((task) => {
							if (task.archived === false && task.isComplete === false) {
								return (
									<TaskBlock
										key={task.id}
										projectTitle={project.project.title}
										task={task}
										globalHideList={hideAllLists}
										clearGlobalHide={() => setHideAllLists(false)}
									/>
								);
							}
							return null;
						})
					)}
					<CreateTaskForm wrapperId={`${project.project.id}-wrapper`} />
				</div>
			),
		[
			currentUser,
			errorCreatingTask,
			errorLoadingProject,
			focusProject,
			hideAllLists,
			isEditingProjectTitle,
			loadingCurrentUser,
			loadingProject,
			project,
			showArchived,
			showCompleted,
		]
	);
}
