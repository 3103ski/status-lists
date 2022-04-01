import React from 'react';
import { Link } from 'react-router-dom';

import { Icon } from '@iconify/react';

import { SortableItem, swapArrayPositions } from 'react-sort-list';
import { ICONIFY_BELL_FILL } from '../../../../icons';
import { ProjectContext } from '../../../../contexts';
import { DASHBOARD, PROJECT } from '../../../../routes';
import TaskLink from './taskLink/TaskLink.jsx';

import * as style from './projectLink.module.scss';

export default function ExpandProjectLink({ text, projectId, project, children, match, ...rest }) {
	const { focusProject, swapTaskPos } = React.useContext(ProjectContext);
	let outerId = `${text}_ExpandLink__outer`;
	let innerId = `${text}_ExpandLink__inner`;

	function blockID(id) {
		return `task_block_${id}`;
	}

	const scrollToTask = React.useCallback(
		async (task) => {
			if (task && focusProject) {
				const block = await document.getElementById(blockID(task.id));
				const project = await document.getElementById(`${focusProject}-wrapper`);
				const blockScrollHeight = await block.getBoundingClientRect();

				project.scrollTop = blockScrollHeight.y + 50;
			}
		},
		[focusProject]
	);

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

	// Manage the swapping of task positions in project
	const [state, setState] = React.useState(null);

	React.useEffect(() => {
		if (project && project !== -1) {
			let tasks = project.tasks.map((t) => ({ ...t }));
			setState(tasks);
		}
	}, [project]);

	const swap = React.useCallback(
		(oldIndex, newIndex) => {
			let swappedTodos = swapArrayPositions(state, oldIndex, newIndex);
			setState([...swappedTodos]);
			swapTaskPos({
				variables: {
					projectId,
					oldIndex,
					newIndex,
				},
			});
		},
		[projectId, state, swapTaskPos]
	);

	return React.useMemo(
		() => (
			<div className={style.ExpandLink} data-active={focusProject === projectId ? 1 : 0}>
				<Link
					className={style.ExpandLinkTag}
					to={`${DASHBOARD}${PROJECT}/${projectId}`}
					data-active={projectId === focusProject ? 1 : 0}
					{...rest}>
					<p className={style.Title}>
						{text}{' '}
						{project.tasks.filter((t) => t.attentionFlag === true).length > 0 ? (
							<span className={style.BellCountContainer}>
								<span className={style.BellIconWrapper}>
									<Icon icon={ICONIFY_BELL_FILL} />
								</span>
								{/* <span className={style.BellCountWrapper}> */}
								<span className={style.BellCount}>
									{project.tasks.filter((t) => t.attentionFlag === true).length}
								</span>
								{/* </span> */}
							</span>
						) : null}
					</p>
				</Link>
				<div
					className={style.ExpandLinkChildren}
					id={`${text}_ExpandLink__outer`}
					style={{ height: '0px', padding: '0px' }}>
					<div id={`${text}_ExpandLink__inner`}>
						{project.tasks.length === 0 ? (
							<p style={{ padding: '10px 20px' }}>No Tasks</p>
						) : (
							project.tasks
								.filter((t) => t.archived === false && t.isComplete === false)
								.map((task) => (
									<SortableItem items={state} id={`${task.id}`} key={`${task.id}`} swap={swap}>
										<TaskLink
											onClick={task.isComplete ? () => null : () => scrollToTask(task)}
											task={task}
										/>
									</SortableItem>
								))
						)}
						{project.tasks
							.filter((t) => t.isComplete === true && t.archived === false)
							.map((task) => (
								<TaskLink
									onClick={task.isComplete ? () => null : () => scrollToTask(task)}
									task={task}
									key={task.id}
								/>
							))}
					</div>
				</div>
			</div>
		),
		[focusProject, project, projectId, rest, scrollToTask, state, swap, text]
	);
}
