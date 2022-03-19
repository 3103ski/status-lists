import React from 'react';

import { updateObj } from '../util';

const initialState = {
	focusProject: null,
};

const DashboardContext = React.createContext(initialState);

const dashboardReducer = (state, { type, focusProject = null }) => {
	switch (type) {
		case 'SET_FOCUS':
			return updateObj(state, {
				focusProject,
			});
		default:
			return state;
	}
};

const DashboardProvider = (props) => {
	const [state, dispatch] = React.useReducer(dashboardReducer, initialState);

	const setFocusProject = (focusProject = null) => {
		return dispatch({ type: 'SET_FOCUS', focusProject });
	};

	return (
		<DashboardContext.Provider
			value={{
				// State
				focusProject: state.focusProject,

				// Methods
				setFocusProject,
			}}
			{...props}
		/>
	);
};

export { DashboardContext, DashboardProvider };
