import React from 'react';

import { updateObj } from '../util';
import { useMutation, useQuery } from '@apollo/client';
import { NEW_PROJECT, GET_USER_PROJECTS, NEW_TASK, GET_PROJECT, NEW_STATUS, UPDATE_TASK } from '../gql';

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

	// >>> GETTING USER PROJECTS
	const {
		data: projects,
		loading: loadingProjects,
		error: errorLoadingProjects,
		refetch: refetchUserProjects,
	} = useQuery(GET_USER_PROJECTS);

	// >>> CREATING NEW PROJECTS
	const [createProject, { loading: serverCreatingProject, error: errorCreatingProject }] = useMutation(NEW_PROJECT, {
		update(cache, { data }) {
			cache.updateQuery({ query: GET_USER_PROJECTS }, (qd) => {
				let userProjects = [...qd.userProjects, data.newProject];
				toggleIsCreatingProject(false);
				return {
					userProjects,
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

	return (
		<ProjectContext.Provider
			value={{
				// State
				focusProject: state.focusProject,
				setFocusProject,

				refetchUserProjects,

				// >> Getting projects
				projects,
				loadingProjects,
				errorLoadingProjects,

				// >> Creating projects
				isCreatingProject: state.isCreatingProject,
				toggleIsCreatingProject,
				serverCreatingProject,
				errorCreatingProject,

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

				// Methods
				createProject,
				newTask,
			}}
			{...props}
		/>
	);
};

export { ProjectContext, ProjectProvider };