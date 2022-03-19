import React from 'react';
import { DashboardContext } from '../../contexts';

export default function ProjectPage({
	match: {
		params: { projectId },
	},
}) {
	const { setFocusProject, focusProject } = React.useContext(DashboardContext);
	React.useEffect(() => {
		if (projectId && projectId !== focusProject) {
			setFocusProject(projectId);
		}
	}, [focusProject, projectId, setFocusProject]);
	return (
		<div>
			<h1>Some Project {focusProject}</h1>
		</div>
	);
}
