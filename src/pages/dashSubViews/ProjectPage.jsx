import React from 'react';

import { ReorderItems } from '../../components/presentationalComponents/navigation/util';

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

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
	const { setFocusProject, focusProject, errorCreatingTask, swapTaskPos } = React.useContext(ProjectContext);

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

	const [state, setState] = React.useState(null);

	React.useEffect(() => {
		if (project && project.project !== -1) {
			let tasks = project.project.tasks.map((t) => ({ ...t }));
			setState(tasks);
		}
	}, [project]);

	const handleTaskSwap = React.useCallback(
		(result) => {
			console.log(result);
			if (!result.destination) return;
			let oldIndex = result.source.index;
			let newIndex = result.destination.index;

			const newOrder = ReorderItems(state, oldIndex, newIndex);
			console.log({ newOrder, state, oldIndex, newIndex, projectId });
			setState(newOrder);
			swapTaskPos({
				variables: {
					projectId,
					oldIndex,
					newIndex,
				},
			});
		},
		[projectId, state, swapTaskPos]
	);

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
			loadingProject || !state || !focusProject || !currentUser || loadingCurrentUser ? (
				<Loader loadingText='Getting Project' />
			) : (
				<div id={`${project.project.id}-wrapper`} className={style.ViewWrapper}>
					<div className={style.HeaderWrapper}>
						<div className={style.TitleWrapper}>
							{!isEditingProjectTitle ? (
								<h1 onClick={() => setIsEditingProjectTitle(true)}>{project.project.title}</h1>
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

					<DragDropContext onDragEnd={handleTaskSwap}>
						<Droppable droppableId={`${project.project.id}_projectScreen`} type='TASK_CARDS'>
							{(provided, snapshot) => (
								<div ref={provided.innerRef}>
									{project.project.tasks.filter(
										(task) => task.archived === false && task.isComplete === false
									).length === 0 ? (
										<List.Empty
											title={`${project.project.title} has no active tasks`}
											minHeight='50px'
										/>
									) : (
										<>
											{state.map((task, index) => {
												if (task.archived === false && task.isComplete === false) {
													return (
														<Draggable
															draggableId={`${task.id}_card`}
															key={task.id}
															index={index}>
															{(provided, snapshot) => (
																<div
																	ref={provided.innerRef}
																	{...provided.dragHandleProps}
																	{...provided.draggableProps}>
																	<TaskBlock
																		projectTitle={project.project.title}
																		task={task}
																		globalHideList={hideAllLists}
																		hideWhenComplete
																		clearGlobalHide={() => setHideAllLists(false)}
																	/>
																</div>
															)}
														</Draggable>
													);
												}
												return null;
											})}
										</>
									)}
								</div>
							)}
						</Droppable>
					</DragDropContext>

					<CreateTaskForm wrapperId={`${project.project.id}-wrapper`} />
				</div>
			),
		[
			loadingProject,
			state,
			focusProject,
			currentUser,
			loadingCurrentUser,

			project,
			isEditingProjectTitle,
			showArchived,
			showCompleted,
			hideAllLists,
			errorCreatingTask,
			errorLoadingProject,
			handleTaskSwap,
		]
	);
}
