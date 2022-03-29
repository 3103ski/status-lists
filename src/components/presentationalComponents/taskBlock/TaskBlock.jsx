import React from 'react';
import { Icon } from '@iconify/react';
import { StatusList, CreateStatusForm, UpdateTaskTitleInput, BubbleToggle } from '../../../components';
import { clickIsOutsideEl } from '../../../util';
import { ProjectContext } from '../../../contexts';
import {
	ICONIFY_CIRCLE_CHECK,
	ICONIFY_PLUS,
	ICONIFY_CIRCLE,
	ICONIFY_BELL,
	ICONIFY_BELL_FILL,
	ICONIFY_MENU_EDIT,
	ICONIFY_CLOSE,
	ICONIFY_CANCEL,
	ICONIFY_CLIPBOARD,
	ICONIFY_ARCHIVE,
	ICONIFY_ARCHIVE_FILL,
} from '../../../icons';
import * as style from './taskBlock.module.scss';

export default function TaskBlock({
	task = { title: '' },
	id,
	projectTitle = null,
	globalHideList = false,
	clearGlobalHide,
}) {
	// console.log({ task });
	const { updateTask } = React.useContext(ProjectContext);
	// const [showList, setShowList] = React.useState(task.listExpanded);

	const [isEditingTitle, setIsEditingTitle] = React.useState(false);

	React.useEffect(() => {
		if (projectTitle) {
			let outerId = `${projectTitle}_ExpandLink__outer`;
			let innerId = `${projectTitle}_ExpandLink__inner`;
			let outerEl = document.getElementById(outerId);
			let outerElHeight = outerEl.getBoundingClientRect().height;
			let innerEl = document.getElementById(innerId);
			let innerElHeight = innerEl.getBoundingClientRect().height;

			if (outerElHeight !== innerElHeight) {
				outerEl.style.height = `${innerElHeight}px`;
			}
		}
	}, [projectTitle]);

	const [isAddingStatus, setIsAddingStatus] = React.useState(false);

	function listenerCallback(e) {
		// executes callback if click is outside of the task block
		clickIsOutsideEl(e, `task_block_${task.id}_${task.title}`, () => setIsAddingStatus(false));
	}

	React.useEffect(() => {
		if (isAddingStatus) {
			document.addEventListener('click', listenerCallback);
		}
		return () => document.removeEventListener('click', listenerCallback);
	});

	const dragOver = React.useCallback(() => {
		let thisEl = document.getElementById(`${task.id}`);
		thisEl.style.borderBottom = '10px solid rgba(0,0,0,.14)';
	}, [task]);

	const dragLeave = React.useCallback(() => {
		let thisEl = document.getElementById(`${task.id}`);
		thisEl.style.borderBottom = '0px solid rgba(0,0,0,0)';
	}, [task]);

	const dragEnd = React.useCallback(() => {
		let taskBlock = document.getElementById(`task_block_${task.id}_${task.title}`);
		let thisEl = document.getElementById(`${task.id}`);

		thisEl.style.borderBottom = 'none';

		thisEl.style.opacity = '1';
		taskBlock.style.opacity = '1';
	}, [task]);
	const drag = React.useCallback(() => {
		let thisEl = document.getElementById(`${task.id}`);
		let taskBlock = document.getElementById(`task_block_${task.id}_${task.title}`);

		thisEl.style.opacity = '.25';
		taskBlock.style.opacity = '.25';
	}, [task]);

	React.useEffect(() => {
		let thisEl = document.getElementById(`${task.id}`);
		if (thisEl) {
			thisEl.style.transitionTimingFunction = 'ease';
			thisEl.style.transition = '.35';
			thisEl.addEventListener('dragover', dragOver);
			thisEl.addEventListener('dragend', dragEnd);
			thisEl.addEventListener('drop', dragEnd);
			thisEl.addEventListener('drag', drag);
			thisEl.addEventListener('dragleave', dragLeave);

			console.log(thisEl);
		}
	}, [drag, dragEnd, dragLeave, dragOver, task]);

	return React.useMemo(
		() => (
			<div
				className={style.Container}
				onDrag={() => console.log('dragging!')}
				id={`task_block_${task.id}_${task.title}`}
				data-show-list={!task.isComplete || task.listExpanded ? 1 : 0}
				data-complete={task.isComplete ? 1 : 0}>
				<div className={style.BlockHeader}>
					<div className={style.HeaderLeft}>
						<div
							className={style.CheckCircle}
							onClick={() =>
								updateTask({
									variables: {
										taskId: task.id,
										isComplete: !task.isComplete,
										archived: !task.isComplete === false ? false : task.archived,
									},
								})
							}>
							{task.isComplete ? <Icon icon={ICONIFY_CIRCLE_CHECK} /> : <Icon icon={ICONIFY_CIRCLE} />}
						</div>
						{!isEditingTitle ? (
							<h2 onClick={() => setIsEditingTitle(!isEditingTitle)}>{task.title}</h2>
						) : (
							<UpdateTaskTitleInput task={task} callback={() => setIsEditingTitle(false)} />
						)}

						<div className={style.EditWrapper}>
							{isEditingTitle ? (
								<Icon
									className={style.EditIcon}
									onClick={() => setIsEditingTitle(!isEditingTitle)}
									icon={ICONIFY_CLOSE}
								/>
							) : (
								<Icon
									className={style.EditIcon}
									onClick={() => setIsEditingTitle(!isEditingTitle)}
									icon={ICONIFY_MENU_EDIT}
								/>
							)}
						</div>
					</div>
					<div className={style.HeaderRight}>
						{task.isComplete ? (
							<BubbleToggle
								active={task.archived}
								icon={task.archived ? ICONIFY_ARCHIVE_FILL : ICONIFY_ARCHIVE}
								onClick={() => {
									updateTask({ variables: { taskId: task.id, archived: !task.archived } });
								}}
							/>
						) : null}

						{globalHideList === true ? (
							<div className={style.GlobalHiddenBadge} onClick={clearGlobalHide}>
								<Icon icon={ICONIFY_CANCEL} />
								<p>Globally Hidden</p>
							</div>
						) : (
							<BubbleToggle
								active={task.listExpanded}
								onClick={() => {
									updateTask({ variables: { taskId: task.id, listExpanded: !task.listExpanded } });
								}}
								icon={ICONIFY_CLIPBOARD}
							/>
						)}

						<BubbleToggle
							active={task.attentionFlag}
							onClick={() =>
								updateTask({
									variables: {
										taskId: task.id,
										attentionFlag: !task.attentionFlag,
									},
								})
							}
							icon={task.attentionFlag ? ICONIFY_BELL_FILL : ICONIFY_BELL}
						/>
					</div>
				</div>
				<div className={style.Bottom}>
					{task.listExpanded && globalHideList === false ? (
						<div onClick={() => setIsAddingStatus(!isAddingStatus)}>
							<StatusList task={task} />
						</div>
					) : null}
					{task.isComplete || globalHideList === true || task.listExpanded === false ? null : (
						<div className={style.InputWrapper} data-is-adding-status={isAddingStatus ? 1 : 0}>
							<div className={style.FormWrapper}>
								<CreateStatusForm task={task} callback={() => setIsAddingStatus(false)} />
							</div>
						</div>
					)}
					<div className={style.PlusIcon} data-is-adding-status={isAddingStatus ? 1 : 0}>
						<Icon icon={ICONIFY_PLUS} className={style.Plus} onClick={() => setIsAddingStatus(true)} />
					</div>
				</div>
			</div>
		),
		[clearGlobalHide, globalHideList, isAddingStatus, isEditingTitle, task, updateTask]
	);
}
