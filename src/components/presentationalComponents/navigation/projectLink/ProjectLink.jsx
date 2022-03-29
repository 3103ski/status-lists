import React from 'react';
import { Link } from 'react-router-dom';

import { ProjectContext } from '../../../../contexts';
import { DASHBOARD, PROJECT } from '../../../../routes';

import * as style from './projectLink.module.scss';

export default function ExpandProjectLink({ text, projectId, project, children, match, ...rest }) {
	const { focusProject } = React.useContext(ProjectContext);

	let outerId = `${text}_ExpandLink__outer`;
	let innerId = `${text}_ExpandLink__inner`;

	React.useEffect(() => {
		if (projectId) {
			let outerEl = document.getElementById(outerId);
			let innerEl = document.getElementById(innerId);

			if (outerEl && innerEl) {
				if (focusProject) {
					let innerElHeight = innerEl.getBoundingClientRect().height;

					if (projectId === focusProject) {
						// outerEl.style.padding = `0px 0px 0px 15px`;
						outerEl.style.marginBottom = `0px`;
						outerEl.style.height = `${innerElHeight}px`;
					} else {
						// outerEl.style.padding = `0px 0px 0px 15px`;
						outerEl.style.marginBottom = `0px`;
						outerEl.style.height = '0px';
					}
				} else {
					// outerEl.style.padding = `0px 0px 0px 15px`;
					outerEl.style.height = '0px';
				}
			}
		}
	}, [focusProject, innerId, outerId, projectId, text]);

	return React.useMemo(
		() => (
			<div className={style.ExpandLink} data-active={focusProject === projectId ? 1 : 0}>
				<Link
					to={`${DASHBOARD}${PROJECT}/${projectId}`}
					data-active={projectId === focusProject ? 1 : 0}
					{...rest}>
					<p className={style.Title}>{text}</p>
				</Link>
				<div
					className={style.ExpandLinkChildren}
					id={`${text}_ExpandLink__outer`}
					style={{ height: '0px', padding: '0px' }}>
					<div id={`${text}_ExpandLink__inner`}>{children}</div>
				</div>
			</div>
		),
		[children, focusProject, projectId, rest, text]
	);
}
