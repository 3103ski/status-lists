import React from 'react';
import { Link } from 'react-router-dom';

import { Icon } from '@iconify/react';

import { ReorderItems } from '../util';
import { toggleMatchChildHeight } from '../../../../util';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { ICONIFY_BELL_FILL } from '../../../../icons';
import { ProjectContext } from '../../../../contexts';
import { DASHBOARD, PROJECT } from '../../../../routes';

import TaskLink from './taskLink/TaskLink.jsx';

import * as style from './projectLink.module.scss';

export default function ExpandProjectLink({ text, projectId, project, index, ...rest }) {
	const { focusProject, swapTaskPos } = React.useContext(ProjectContext);
	let tasklistWrapperID = `${projectId}_ExpandLink__outer`;

	///////////////////
	// MANAGE LIST RE-ORDERING
	///////////////////
	//>>> Manage a local copy of tasks for smoother UX when moving items
	const [state, setState] = React.useState(null);
	React.useEffect(() => {
		if (project && project !== -1) setState(project.tasks);
	}, [project]);

	//>>> Handle task re-ordering
	const handleTaskSwap = React.useCallback(
		(result) => {
			if (!result.destination) return;

			let oldIndex = result.source.index;
			let newIndex = result.destination.index;
			let newOrder = ReorderItems(state, oldIndex, newIndex);

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

	///////////////////
	// MANAGE HEIGHT OF TASK LIST WRAPPER
	///////////////////
	React.useEffect(() => {
		if (state || (state && state.length !== project.tasks.length)) {
			if (focusProject) {
				if (projectId && projectId === focusProject) {
					toggleMatchChildHeight(tasklistWrapperID, true);
				} else {
					toggleMatchChildHeight(tasklistWrapperID, false);
				}
			} else {
				toggleMatchChildHeight(tasklistWrapperID, false);
			}
		}
	}, [focusProject, tasklistWrapperID, project.tasks.length, projectId, state, text]);

	///////////////////
	// Local Templates
	///////////////////
	const RenderTitle = ({ provided }) => {
		const BellCountBadge = () =>
			!state ? null : state.filter((t) => t.attentionFlag === true).length > 0 ? (
				<span className={style.BellCountContainer}>
					<span className={style.BellIconWrapper}>
						<Icon icon={ICONIFY_BELL_FILL} />
					</span>
					<span className={style.BellCount}>{state.filter((t) => t.attentionFlag === true).length}</span>
				</span>
			) : null;
		return (
			<Link
				className={style.ExpandLinkTag}
				to={`${DASHBOARD}${PROJECT}/${projectId}`}
				data-active={projectId === focusProject ? 1 : 0}
				{...provided.dragHandleProps}
				{...rest}>
				<p className={style.Title}>
					{text}
					<BellCountBadge />
				</p>
			</Link>
		);
	};

	const RenderDropable = ({ snapshot }) => {
		return (
			<Droppable droppableId={`${project.id}_link`} type='TASKS'>
				{(provided, snapshot) => {
					return (
						<div ref={provided.innerRef}>
							{!state || state.length === 0 ? (
								<p style={{ padding: '10px 20px' }}>No Tasks</p>
							) : !state ? null : (
								state.map((task, index) => (
									<Draggable key={task.id} draggableId={task.id} index={index}>
										{(provided, snapshot) => (
											<div
												ref={provided.innerRef}
												{...provided.dragHandleProps}
												{...provided.draggableProps}>
												<TaskLink key={task.id} index={index} hide task={task} />
											</div>
										)}
									</Draggable>
								))
							)}
							{provided.placeholder}
						</div>
					);
				}}
			</Droppable>
		);
	};

	///////////////////
	// OUTPUT
	///////////////////
	return React.useMemo(
		() => (
			<Draggable draggableId={project.id} key={project.id} index={index}>
				{(provided, snapshot) => (
					<div
						ref={provided.innerRef}
						{...provided.draggableProps}
						className={style.ExpandLink}
						data-active={focusProject === projectId ? 1 : 0}>
						<RenderTitle provided={provided} />
						<DragDropContext onDragEnd={handleTaskSwap}>
							<div
								className={style.TaskWrapper}
								style={{
									opacity: snapshot.isDragging ? 0 : 1,
								}}
								id={tasklistWrapperID}>
								<RenderDropable snapshot={snapshot} />
							</div>
						</DragDropContext>
					</div>
				)}
			</Draggable>
		),
		[focusProject, handleTaskSwap, index, project, projectId, tasklistWrapperID]
	);
}
