import React from 'react';

import { updateObj } from '../util';
import { useMutation, useQuery } from '@apollo/client';
import { NEW_PROJECT, GET_USER_PROJECTS } from '../gql';

const initialState = {
	isCreatingProject: false,
};

const ProjectContext = React.createContext(initialState);

const projectReducer = (state, { type, isCreatingProject }) => {
	switch (type) {
		case 'TOGGLE_CREATING_PROJECT':
			return updateObj(state, {
				isCreatingProject,
			});
		default:
			return state;
	}
};

const ProjectProvider = (props) => {
	const [state, dispatch] = React.useReducer(projectReducer, initialState);

	// >>> GETTING USER PROJECTS
	const { data: projects, loading: loadingProjects, error: errorLoadingProjects } = useQuery(GET_USER_PROJECTS);

	// >>> CREATING NEW PROJECTS
	const [createProject, { loading: serverCreatingProject, error: errorCreatingProject }] = useMutation(NEW_PROJECT, {
		update(cache, data) {
			cache.updateQuery({ query: GET_USER_PROJECTS }, (qd) => {
				let userProjects = [...qd.userProjects, data.data.newProject];
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

	return (
		<ProjectContext.Provider
			value={{
				// State
				// >> Creating projects
				isCreatingProject: state.isCreatingProject,
				toggleIsCreatingProject,
				serverCreatingProject,
				errorCreatingProject,

				// >> Getting projects
				projects: projects && projects.userProjects !== -1 ? projects.userProjects : [],
				loadingProjects,
				errorLoadingProjects,

				// Methods
				createProject,
			}}
			{...props}
		/>
	);
};

export { ProjectContext, ProjectProvider };
