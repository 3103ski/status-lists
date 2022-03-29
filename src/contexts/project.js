import React from 'react';

import { updateObj } from '../util';
import { useMutation } from '@apollo/client';
import {
	NEW_PROJECT,
	NEW_TASK,
	GET_PROJECT,
	NEW_STATUS,
	UPDATE_TASK,
	UPDATED_PROJECT,
	GET_USER,
	SWAP_TASK_POS,
} from '../gql';

const initialState = {
	isCreatingProject: false,
	isCreatingTask: false,
	focusProject: null,
};

const ProjectContext = React.createContext(initialState);

const projectReducer = (state, { type, isCreatingProject, focusProject, isCreatingTask }) => {
	switch (type) {
		case 'SET_FOCUS':
			return updateObj(state, {
				focusProject,
			});
		case 'TOGGLE_CREATING_PROJECT':
			return updateObj(state, {
				isCreatingProject,
			});
		case 'TOGGLE_CREATING_TASK':
			return updateObj(state, {
				isCreatingTask,
			});
		default:
			return state;
	}
};

const ProjectProvider = (props) => {
	const [state, dispatch] = React.useReducer(projectReducer, initialState);

	const setFocusProject = (focusProject = null) => {
		return dispatch({ type: 'SET_FOCUS', focusProject });
	};

	// >>> CREATING NEW PROJECTS
	const [createProject, { loading: serverCreatingProject, error: errorCreatingProject }] = useMutation(NEW_PROJECT, {
		update(cache, { data }) {
			cache.updateQuery({ query: GET_USER, variables: { userId: data.newProject.owner } }, (qd) => {
				let projects = [...qd.user.projectFolder.projects, data.newProject];
				toggleIsCreatingProject(false);
				return {
					user: {
						...qd.user,
						projects,
						projectFolder: {
							...qd.user.projectFolder,
							projects,
						},
					},
				};
			});
		},
	});

	function toggleIsCreatingProject(isCreatingProject = !state.isCreatingProject) {
		dispatch({ type: 'TOGGLE_CREATING_PROJECT', isCreatingProject });
	}

	// >>>> CREATING A NEW TASK FOR A PROJECT
	const [newTask, { loading: serverCreatingTask, error: errorCreatingTask }] = useMutation(NEW_TASK, {
		update(cache, { data }) {
			cache.updateQuery({ query: GET_PROJECT, variables: { projectId: data.newTask.project } }, (qd) => {
				let project = {
					...qd.project,
					tasks: [...qd.project.tasks, data.newTask],
				};

				return {
					project,
				};
			});

			toggleIsCreatingTask(false);
		},
	});

	function toggleIsCreatingTask(isCreatingTask = !state.isCreatingTask) {
		dispatch({ type: 'TOGGLE_CREATING_TASK', isCreatingTask });
	}

	const activeProjectId = React.useCallback(() => state.focusProject, [state.focusProject]);

	// >>>> CREATING A NEW STATUS FOR A TASK
	const [newStatus, { loading: serverCreatingStatus, error: errorCreatingStatus }] = useMutation(NEW_STATUS, {
		update(cache, { data }) {
			cache.updateQuery({ query: GET_PROJECT, variables: { projectId: activeProjectId() } }, (qd) => {
				let project = {
					...qd.project,
					tasks: qd.project.tasks.map((task) => {
						if (task.id === data.newStatus.task) {
							let t = {
								...task,
								attentionFlag: false,
								statuses: [...task.statuses, data.newStatus],
							};
							return t;
						}
						return task;
					}),
				};
				return {
					project,
				};
			});
		},
	});

	// >>>> UPDATING A TASK
	const [updateTask, { loading: serverUpdatingTask, error: errorUpdatingTask }] = useMutation(UPDATE_TASK, {
		update(cache, { data }) {
			cache.updateQuery({ query: GET_PROJECT, variables: { projectId: activeProjectId() } }, (qd) => {
				if (qd) {
					let project = {
						...qd.project,
						tasks: qd.project.tasks.map((task) => {
							if (task.id === data.updatedTask.id) {
								return data.updatedTask;
							}
							return task;
						}),
					};
					return {
						project,
					};
				}
			});
		},
	});

	const [swapTaskPos, { loading: swappingTaskPos, error: errorSwappingTaskPos }] = useMutation(SWAP_TASK_POS, {
		update(cache, { data }) {
			cache.updateQuery({ query: GET_PROJECT, variables: { projectId: data.swapTaskPos.projectId } }, (qd) => {
				if (qd) {
					let tasks = [...qd.project.tasks];
					let task = tasks.splice(data.swapTaskPos.oldIndex, 1)[0];
					tasks.splice(data.swapTaskPos.newIndex, 0, task);
					let project = {
						...qd.project,
						tasks,
					};
					return {
						project,
					};
				}
			});
		},
	});

	//>>>> UPDATING A PROJECT
	const [updateProject, { loading: serverUpdatingProject, error: errorUpdatingProject }] = useMutation(
		UPDATED_PROJECT,
		{
			update(cache, { data }) {
				cache.updateQuery({ query: GET_PROJECT, variables: { projectId: data.updatedProject.id } }, (qd) => {
					if (qd) {
						return {
							project: {
								...qd.project,
								...data.updatedProject,
							},
						};
					}
				});
			},
		}
	);

	return (
		<ProjectContext.Provider
			value={{
				// State
				focusProject: state.focusProject,
				setFocusProject,

				// >> Creating projects
				isCreatingProject: state.isCreatingProject,
				toggleIsCreatingProject,
				serverCreatingProject,
				errorCreatingProject,

				// >> Updating A Project
				updateProject,
				serverUpdatingProject,
				errorUpdatingProject,

				// >> Creating Project Tasks
				isCreatingTask: state.isCreatingTask,
				serverCreatingTask,
				errorCreatingTask,
				toggleIsCreatingTask,

				// >> Creating Task Status
				newStatus,
				serverCreatingStatus,
				errorCreatingStatus,

				// >> Update Task
				updateTask,
				serverUpdatingTask,
				errorUpdatingTask,

				swapTaskPos,
				swappingTaskPos,
				errorSwappingTaskPos,
				// Methods
				createProject,
				newTask,
			}}
			{...props}
		/>
	);
};

export { ProjectContext, ProjectProvider };
