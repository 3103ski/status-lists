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
	CREATE_LABEL,
	UPDATE_LABEL,
	DELETE_LABEL,
} from '../gql';

const initialState = {
	isCreatingProject: false,
	isCreatingTask: false,
	focusProject: null,
	isManagingLabels: false,
};

const ProjectContext = React.createContext(initialState);

const projectReducer = (state, { type, isCreatingProject, focusProject, isCreatingTask, key, val }) => {
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
		case 'UPDATE_VAL':
			return updateObj(state, {
				[key]: val,
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

	function updateVal(key, val) {
		dispatch({ type: 'UPDATE_VAL', key, val });
	}

	const activeProjectId = React.useCallback(() => state.focusProject, [state.focusProject]);

	// >>>> CREATING A NEW LABEL
	const [createLabel, { loading: serverCreatingLabel, error: errorCreatingLabel }] = useMutation(CREATE_LABEL, {
		update(cache, { data }) {
			console.log({ data });
			cache.updateQuery({ query: GET_USER, variables: { userId: data.label.userId } }, (qd) => {
				if (qd) {
					return {
						user: {
							...qd.user,
							labels: [...qd.user.labels, data.label],
						},
					};
				}
			});
		},
	});

	const [updateLabel, { loading: serverUpdatingLabel, error: errorUpdatingLabel }] = useMutation(UPDATE_LABEL, {
		update(cache, { data }) {
			cache.updateQuery({ query: GET_USER, variables: { userId: data.updatedLabel.userId } }, (qd) => {
				if (qd) {
					let labels = qd.user.labels.map((label) =>
						label.id === data.updatedLabel.id ? data.updatedLabel : label
					);
					return {
						user: {
							...qd.user,
							labels,
						},
					};
				}
			});
		},
	});

	const [deleteLabel, { loading: serverDeletingLabel, error: errorDeletingLabel }] = useMutation(DELETE_LABEL, {
		update(cache, { data }) {
			let activeProjectTasklistUpdate = [];

			cache.updateQuery({ query: GET_USER, variables: { userId: data.deletedLabel.userId } }, (qd) => {
				if (qd) {
					// copy projects
					let projects = [...qd.user.projectFolder.projects];

					for (let a = 0; a < projects.length; a++) {
						// grab each project
						let project = { ...projects[a] };

						for (let b = 0; b < project.tasks.length; b++) {
							// remove label from all tasks in project that have it
							let tasks = project.tasks.map((task) => {
								console.log({ task, label: data.deletedLabel.id });
								if (task.label && task.label.id === data.deletedLabel.id) {
									return {
										...task,
										label: null,
									};
								}
								return task;
							});
							project.tasks = [...tasks];

							if (project.id === state.focusProject) {
								activeProjectTasklistUpdate = [...tasks];
							}
						}

						// assign project
						projects[a] = project;
					}

					let labels = qd.user.labels;
					labels = labels.filter((l) => l.id !== data.deletedLabel.id);

					return {
						user: {
							...qd.user,
							labels,
							projectFolder: {
								...qd.user.projectFolder,
								projects,
							},
						},
					};
				}
			});
			if (state.focusProject) {
				cache.updateQuery({ query: GET_PROJECT, variables: { projectId: state.focusProject } }, (qd) => {
					if (qd) {
						console.log({ activeProjectTasklistUpdate });
						return {
							project: { ...qd.project, tasks: [...activeProjectTasklistUpdate] },
						};
					}
				});
			}
		},
	});

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
			console.log({ data });
			cache.updateQuery({ query: GET_PROJECT, variables: { projectId: activeProjectId() } }, (qd) => {
				if (qd) {
					let project = {
						...qd.project,
						tasks: qd.project.tasks.map((task) => {
							if (task.id === data.updatedTask.id) {
								return {
									...task,
									...data.updatedTask,
								};
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

				// Managing user labels
				isManagingLabels: state.isManagingLabels,
				createLabel,
				updateLabel,
				serverCreatingLabel,
				errorCreatingLabel,
				serverUpdatingLabel,
				errorUpdatingLabel,
				deleteLabel,
				serverDeletingLabel,
				errorDeletingLabel,

				// Update any single value
				updateVal,
			}}
			{...props}
		/>
	);
};

export { ProjectContext, ProjectProvider };
