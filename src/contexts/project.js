import React from 'react';

import { updateObj } from '../util';
import { useMutation, useQuery } from '@apollo/client';
import { NEW_PROJECT, GET_USER_PROJECTS, NEW_TASK, GET_PROJECT } from '../gql';

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
	const { data: projects, loading: loadingProjects, error: errorLoadingProjects } = useQuery(GET_USER_PROJECTS);

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
					tasks: [data.newTask, ...qd.project.tasks],
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

	return (
		<ProjectContext.Provider
			value={{
				// State
				focusProject: state.focusProject,
				setFocusProject,

				// >> Getting projects
				projects: projects && projects.userProjects !== -1 ? projects.userProjects : [],
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

				// Methods
				createProject,
				newTask,
			}}
			{...props}
		/>
	);
};

export { ProjectContext, ProjectProvider };
