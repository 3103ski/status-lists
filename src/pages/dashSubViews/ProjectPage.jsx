import React from 'react';
import { DashboardContext } from '../../contexts';
import { TaskBlock } from '../../components/';

import * as style from './shared.module.scss';

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
		<div style={{ padding: '50px 30px' }} className={style.ViewWrapper}>
			<div style={{ marginBottom: '30px' }}>
				<h1>Some Project {focusProject}</h1>
			</div>
			<TaskBlock task={{ title: 'Calvin Rising Singing' }} />
			<TaskBlock task={{ title: 'Fail On Things' }} />
			<TaskBlock task={{ title: 'Arrival Of SlammSonite' }} />
		</div>
	);
}
