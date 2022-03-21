import React from 'react';

import { CurrentUserProvider, DashboardProvider, ProjectProvider } from '../contexts/';

export default function CombinedUserProvider({ children, ...rest }) {
	return (
		<DashboardProvider {...rest}>
			<CurrentUserProvider {...rest}>{children}</CurrentUserProvider>
		</DashboardProvider>
	);
}
