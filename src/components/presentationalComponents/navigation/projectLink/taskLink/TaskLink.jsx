import React from 'react';

import { Icon } from '@iconify/react';
import { Link as ScrollLink } from 'react-scroll';

import { ProjectContext, CurrentUserContext } from '../../../../../contexts';
import { LuxonTimestamp } from '../../../../../components';
import { ICONIFY_BELL_FILL, ICONIFY_BELL } from '../../../../../icons';

import * as style from './taskLink.module.scss';

export default function TaskLink({ task, hide, ...rest }) {
	const { focusProject, updateTask } = React.useContext(ProjectContext);
	const { currentUser, loadingCurrentUser } = React.useContext(CurrentUserContext);

	// Task Link IDs
	const blockID = `task_block_${task.id}`;
	const linkID = `task_link_${task.id}`;

	///////////////////
	// A function to bring attention to task
	// block when link is clicked
	///////////////////
	const highlightBlock = React.useCallback(() => {
		let block = document.getElementById(blockID);
		if (block) {
			block.classList.add(style.Flash);
			setTimeout(() => {
				block.classList.remove(style.Flash);
			}, 1000);
		} else {
			console.log('no block found');
		}
	}, [blockID]);

	const scrollToTask = React.useCallback(
		async (task) => {
			if (task && focusProject) {
				const block = await document.getElementById(`task_block_${task.id}`);
				const project = await document.getElementById(`${focusProject}-wrapper`);
				const blockScrollHeight = await block.getBoundingClientRect();

				project.scrollTop = blockScrollHeight.y + 50;
			}
			highlightBlock();
		},
		[focusProject, highlightBlock]
	);

	///////////////////
	// Manage attention bell status and icon
	///////////////////
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

	React.useEffect(() => {
		if (attentionFlag !== task.attentionFlag) {
			setAttentionFlag(task.attentionFlag);
		}
	}, [attentionFlag, task.attentionFlag]);

	///////////////////
	// COMPONENT TO DICTATE LABEL DISPLAY
	///////////////////
	const RenderLabel = () => {
		const labelStyling = () => ({
			background:
				currentUser.user.preferences.showLabelColorsInNav && task.label ? task.label.color : 'transparent',
		});

		const labelText = () =>
			task.label ? task.label.label + (!currentUser.user.preferences.showLabelColorsInNav ? ': ' : '') : null;

		return !currentUser.user.preferences.showLabelsInTaskLinks ? null : (
			<span
				data-has-color={currentUser.user.preferences.showLabelColorsInNav === true ? 1 : 0}
				data-has-label={task.label ? 1 : 0}
				className={style.TaskLabel}
				style={labelStyling()}>
				{labelText()}
			</span>
		);
	};

	///////////////////
	// COMPONENT TO DICTATE SHOWING TIME SINCE UPDATE
	///////////////////
	const RenderTimeSinceUpdate = () => {
		return !currentUser.user.preferences.showDaysSinceTaskUpdate ? null : (
			<span
				data-has-color={currentUser.user.preferences.showDaysSinceTaskUpdate === true ? 1 : 0}
				data-show-label={currentUser.user.preferences.showDaysSinceTaskUpdate ? 1 : 0}
				className={style.TimeLabel}>
				<LuxonTimestamp timestamp={task.createdAt} showRelative />
			</span>
		);
	};

	///////////////////
	///////////////////
	return !currentUser || loadingCurrentUser ? null : (
		<ScrollLink
			offset={-50}
			to={blockID}
			onClick={() => (task.isComplete ? null : scrollToTask())}
			containerId={`${focusProject}-wrapper`}
			smooth={true}
			activeClass={style.Active}
			id={linkID}
			duration={300}>
			<div
				className={style.ProjectLinkItem}
				data-hide={hide ? 1 : 0}
				data-is-complete={task.isComplete ? 1 : 0}
				{...rest}>
				<div className={style.BellWrapper} onClick={handleToggleAttentionFlag}>
					<Icon icon={attentionFlag ? ICONIFY_BELL_FILL : ICONIFY_BELL} />
				</div>
				<p>
					<RenderLabel />
					{task.title}
				</p>
				<RenderTimeSinceUpdate />
			</div>
		</ScrollLink>
	);
}
