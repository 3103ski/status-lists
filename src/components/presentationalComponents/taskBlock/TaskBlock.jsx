import React from 'react';
import { Icon } from '@iconify/react';
import {
	StatusList,
	CreateStatusForm,
	UpdateTaskTitleInput,
	BubbleToggle,
	DropMenu,
	TaskLabel,
} from '../../../components';

import { ProjectContext, CurrentUserContext } from '../../../contexts';
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
	ICONIFY_LABEL,
} from '../../../icons';

import { clickIsOutsideEl } from '../../../util';

import * as style from './taskBlock.module.scss';

export default function TaskBlock({
	task = { title: '' },
	projectTitle = null,
	globalHideList = false,
	clearGlobalHide,
	hideWhenComplete = null,
}) {
	const { updateTask } = React.useContext(ProjectContext);
	const blockID = `task_block_${task.id}`;

	const [isEditingTitle, setIsEditingTitle] = React.useState(false);

	React.useEffect(() => {
		if (projectTitle) {
			let outerId = `${projectTitle}_ExpandLink__outer`;
			let innerId = `${projectTitle}_ExpandLink__inner`;
			let outerEl = document.getElementById(outerId);
			let innerEl = document.getElementById(innerId);

			if (outerEl && innerEl) {
				let outerElHeight = outerEl.getBoundingClientRect().height;
				let innerElHeight = innerEl.getBoundingClientRect().height;

				if (outerElHeight !== innerElHeight) {
					outerEl.style.height = `${innerElHeight}px`;
				}
			}
		}
	}, [projectTitle]);

	const [isAddingStatus, setIsAddingStatus] = React.useState(false);

	const listenerCallback = React.useCallback(
		(e) => {
			// executes callback if click is outside of the task block
			clickIsOutsideEl(e, blockID, () => setIsAddingStatus(false));
		},
		[blockID]
	);

	React.useEffect(() => {
		if (isAddingStatus) {
			document.addEventListener('click', listenerCallback);
		}
		return () => document.removeEventListener('click', listenerCallback);
	}, [isAddingStatus, listenerCallback]);

	//>>>  Toggle Complete
	const [isComplete, setIsComplete] = React.useState(task.isComplete);
	const handleToggleComplete = React.useCallback(() => {
		setIsComplete(!task.isComplete);
		updateTask({
			variables: {
				taskId: task.id,
				isComplete: !task.isComplete,
				attentionFlag: false,
				listExpanded: !task.isComplete === true ? false : true,
				archived: !task.isComplete === false ? false : task.archived,
			},
		});
	}, [task.archived, task.id, task.isComplete, updateTask]);

	// >>>> Toggle List Expanded
	const [listExpanded, setListExpanded] = React.useState(task.listExpanded);
	const handleToggleListExpanded = React.useCallback(async () => {
		await setListExpanded(!task.listExpanded);
		updateTask({ variables: { taskId: task.id, listExpanded: !task.listExpanded } });
	}, [task, updateTask]);

	// >>>> Toggle Attention Flag
	const [attentionFlag, setAttentionFlag] = React.useState(task.attentionFlag);
	const handleToggleAttentionFlag = React.useCallback(() => {
		setAttentionFlag(!task.attentionFlag);
		updateTask({
			variables: {
				taskId: task.id,
				isComplete: !task.attentionFlag === true ? false : task.isComplete,
				attentionFlag: !task.attentionFlag,
			},
		});
	}, [task, updateTask]);

	// >>>> Toggle Archived
	const [archived, setArchived] = React.useState(task.archived);
	const handleToggleArchived = React.useCallback(() => {
		setArchived(!task.archived);
		updateTask({ variables: { taskId: task.id, archived: !task.archived } });
	}, [task, updateTask]);

	React.useEffect(() => {
		// update the toggles if the task is updated from elsewheres
		if (task.attentionFlag !== attentionFlag) {
			setAttentionFlag(task.attentionFlag);
		}
	}, [attentionFlag, task.attentionFlag]);

	return React.useMemo(
		() => (
			<div
				className={style.Container}
				id={blockID}
				data-hide-complete={task.isComplete && hideWhenComplete ? 1 : 0}
				data-collapsed={!listExpanded || globalHideList === true ? 1 : 0}
				data-show-list={!task.isComplete || listExpanded ? 1 : 0}
				data-complete={task.isComplete ? 1 : 0}>
				<div className={style.BlockHeader}>
					<div className={style.HeaderLeft}>
						<BubbleToggle
							margin={false}
							active={attentionFlag}
							onClick={handleToggleAttentionFlag}
							icon={attentionFlag ? ICONIFY_BELL_FILL : ICONIFY_BELL}
						/>
						<div className={style.CheckCircle} onClick={handleToggleComplete}>
							{isComplete ? <Icon icon={ICONIFY_CIRCLE_CHECK} /> : <Icon icon={ICONIFY_CIRCLE} />}
						</div>
					</div>
					<div className={style.HeaderCenter}>
						{task.label ? <TaskLabel label={task.label} /> : null}
						{!isEditingTitle ? (
							<>
								<h2 onClick={handleToggleListExpanded}>{task.title}</h2>
							</>
						) : (
							<UpdateTaskTitleInput task={task} callback={() => setIsEditingTitle(false)} />
						)}
						<div className={style.EditWrapper}>
							<Icon
								className={style.EditIcon}
								onClick={() => setIsEditingTitle(!isEditingTitle)}
								icon={isEditingTitle ? ICONIFY_CLOSE : ICONIFY_MENU_EDIT}
							/>
						</div>
						<UserLabelSelector task={task} />
					</div>
					<div className={style.HeaderRight}>
						{globalHideList === true ? (
							<div className={style.GlobalHiddenBadge} onClick={clearGlobalHide}>
								<Icon icon={ICONIFY_CANCEL} />
								<p>All Lists Hidden</p>
							</div>
						) : null}
						{isComplete ? (
							<BubbleToggle
								margin={false}
								active={archived}
								icon={archived ? ICONIFY_ARCHIVE_FILL : ICONIFY_ARCHIVE}
								onClick={handleToggleArchived}
							/>
						) : null}
						{globalHideList === true ? null : (
							<BubbleToggle
								margin={false}
								active={listExpanded}
								onClick={handleToggleListExpanded}
								icon={ICONIFY_CLIPBOARD}
							/>
						)}
					</div>
				</div>
				<div className={style.Bottom}>
					{listExpanded && globalHideList === false ? (
						<div onClick={() => setIsAddingStatus(!isAddingStatus)}>
							<StatusList task={task} />
						</div>
					) : null}
					{isComplete || globalHideList === true || listExpanded === false ? null : (
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
		[
			archived,
			attentionFlag,
			blockID,
			clearGlobalHide,
			globalHideList,
			handleToggleArchived,
			handleToggleAttentionFlag,
			handleToggleComplete,
			handleToggleListExpanded,
			hideWhenComplete,
			isAddingStatus,
			isComplete,
			isEditingTitle,
			listExpanded,
			task,
		]
	);
}

const UserLabelSelector = ({ task }) => {
	const { currentUser, loadingCurrentUser } = React.useContext(CurrentUserContext);
	const { updateTask, updateVal } = React.useContext(ProjectContext);

	return loadingCurrentUser || !currentUser ? null : (
		<div className={style.LabelWrapper}>
			<DropMenu icon={ICONIFY_LABEL} simple>
				{currentUser.user.labels.map((label) => (
					<DropMenu.ListItem
						onClick={() =>
							updateTask({
								variables: {
									taskId: task.id,
									label: label.id,
								},
							})
						}
						key={label.id}>
						{label.label}
					</DropMenu.ListItem>
				))}
				{!task.label ? null : (
					<DropMenu.ListItem
						topDivided={true}
						onClick={() =>
							updateTask({
								variables: {
									taskId: task.id,
									label: null,
								},
							})
						}>
						Remove Label
					</DropMenu.ListItem>
				)}
				<DropMenu.ListItem topDivided={true} onClick={() => updateVal('isManagingLabels', true)}>
					Manage Labels
				</DropMenu.ListItem>
			</DropMenu>
		</div>
	);
};
