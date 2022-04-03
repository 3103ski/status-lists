import React from 'react';
import { Link } from 'react-router-dom';

import { Icon } from '@iconify/react';

import { ReorderItems } from '../util';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { ICONIFY_BELL_FILL } from '../../../../icons';
import { ProjectContext } from '../../../../contexts';
import { DASHBOARD, PROJECT } from '../../../../routes';
import TaskLink from './taskLink/TaskLink.jsx';

import * as style from './projectLink.module.scss';

export default function ExpandProjectLink({ text, projectId, project, index, children, match, ...rest }) {
	const { focusProject, swapTaskPos } = React.useContext(ProjectContext);

	let outerId = `${projectId}_ExpandLink__outer`;
	let innerId = `${projectId}_ExpandLink__inner`;

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

	// Manage the swapping of task positions in project
	const [state, setState] = React.useState(null);

	React.useEffect(() => {
		if (project && project !== -1) {
			let tasks = project.tasks.map((t) => ({ ...t }));
			setState(tasks);
		}
	}, [project]);

	const handleTaskSwap = React.useCallback(
		(result) => {
			console.log(result);
			if (!result.destination) return;
			let oldIndex = result.source.index;
			let newIndex = result.destination.index;

			const newOrder = ReorderItems(state, oldIndex, newIndex);
			console.log({ newOrder, state, oldIndex, newIndex, projectId });
			setState(newOrder);
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

	React.useEffect(() => {
		if (projectId) {
			let outerEl = document.getElementById(outerId);
			let innerEl = document.getElementById(innerId);

			if ((outerEl && innerEl && state) || (state && state.length !== project.tasks.length)) {
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
	}, [focusProject, innerId, outerId, project.tasks.length, projectId, state, text]);

	return React.useMemo(
		() => (
			<Draggable draggableId={project.id} key={project.id} index={index}>
				{(provided, snapshot) => (
					<div
						ref={provided.innerRef}
						{...provided.draggableProps}
						className={style.ExpandLink}
						data-active={focusProject === projectId ? 1 : 0}>
						<Link
							className={style.ExpandLinkTag}
							to={`${DASHBOARD}${PROJECT}/${projectId}`}
							data-active={projectId === focusProject ? 1 : 0}
							{...provided.dragHandleProps}
							{...rest}>
							<p className={style.Title}>
								{text}
								{!state ? null : state.filter((t) => t.attentionFlag === true).length > 0 ? (
									<span className={style.BellCountContainer}>
										<span className={style.BellIconWrapper}>
											<Icon icon={ICONIFY_BELL_FILL} />
										</span>
										<span className={style.BellCount}>
											{state.filter((t) => t.attentionFlag === true).length}
										</span>
									</span>
								) : null}
							</p>
						</Link>
						<DragDropContext onDragEnd={handleTaskSwap}>
							<div className={style.ExpandLinkChildren}>
								<div
									className={style.TaskWrapper}
									style={{
										opacity: snapshot.isDragging ? 0 : 1,
										height: (() =>
											focusProject === project.id && document.getElementById(innerId)
												? document.getElementById(innerId).getBoundingClientRect().height
												: '0px')(),
									}}
									id={outerId}>
									<Droppable droppableId={`${project.id}_link`} type='TASKS'>
										{(provided, snapshot) => {
											return (
												<div ref={provided.innerRef} id={innerId}>
													{!state || snapshot.isDragging ? null : state.length === 0 ? (
														<p style={{ padding: '10px 20px' }}>No Tasks</p>
													) : !state ? null : (
														state.map((task, index) => (
															<TaskLink
																key={task.id}
																index={index}
																onClick={
																	task.isComplete
																		? () => null
																		: () => scrollToTask(task)
																}
																task={task}
															/>
														))
													)}
													{provided.placeholder}
												</div>
											);
										}}
									</Droppable>
								</div>
							</div>
						</DragDropContext>
					</div>
				)}
			</Draggable>
		),
		[focusProject, handleTaskSwap, index, innerId, outerId, project, projectId, rest, scrollToTask, state, text]
	);
}
