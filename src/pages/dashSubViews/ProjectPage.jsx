import React from 'react';

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
	BubbleToggle,
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
			setShowCompleted(false);
			setShowArchived(false);
			setHideAllLists(false);
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
						<div className={style.BubbleBlock}>
							<BubbleToggle active={showArchived} setActive={setShowArchived}>
								Show Archived Tasks ({project.project.tasks.filter((t) => t.archived === true).length})
							</BubbleToggle>
							<BubbleToggle active={showCompleted} setActive={setShowCompleted}>
								Show Completed Tasks (
								{
									project.project.tasks.filter((t) => t.isComplete === true && t.archived === false)
										.length
								}
								)
							</BubbleToggle>
							<BubbleToggle active={hideAllLists} setActive={setHideAllLists}>
								Hide All Status Lists
							</BubbleToggle>
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
