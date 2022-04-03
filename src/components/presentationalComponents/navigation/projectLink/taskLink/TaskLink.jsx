import React from 'react';

import { Icon } from '@iconify/react';
import { Link as ScrollLink } from 'react-scroll';

import { ProjectContext, CurrentUserContext } from '../../../../../contexts';
import { ICONIFY_BELL_FILL, ICONIFY_BELL } from '../../../../../icons';

import { Draggable } from 'react-beautiful-dnd';

import * as style from './taskLink.module.scss';

export default function TaskLink({ task, index, ...rest }) {
	const { focusProject, updateTask } = React.useContext(ProjectContext);
	const { currentUser, loadingCurrentUser } = React.useContext(CurrentUserContext);

	// Drag and scroll related IDs
	const blockID = `task_block_${task.id}`;
	const linkID = `task_link_${task.id}`;
	// const sortableID = `${task.id}`;

	function highlightBlock() {
		let block = document.getElementById(blockID);

		if (block) {
			block.classList.add(style.Flash);

			setTimeout(() => {
				block.classList.remove(style.Flash);
			}, 1000);
		} else {
			console.log('no block found');
		}
	}

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

	const link = (
		<ScrollLink
			offset={-50}
			to={blockID}
			onClick={highlightBlock}
			containerId={`${focusProject}-wrapper`}
			smooth={true}
			activeClass={style.Active}
			id={linkID}
			duration={300}>
			<div className={style.ProjectLinkItem} data-is-complete={task.isComplete ? 1 : 0} {...rest}>
				<div className={style.BellWrapper} onClick={handleToggleAttentionFlag}>
					<Icon icon={attentionFlag ? ICONIFY_BELL_FILL : ICONIFY_BELL} />
				</div>
				<p>
					{!currentUser.user.preferences.showLabelsInTaskLinks ? null : (
						<span
							data-has-color={currentUser.user.preferences.showLabelColorsInNav === true ? 1 : 0}
							data-has-label={task.label ? 1 : 0}
							className={style.TaskLabel}
							style={{
								background:
									currentUser.user.preferences.showLabelColorsInNav && task.label
										? task.label.color
										: 'transparent',
							}}>
							{task.label
								? task.label.label + (!currentUser.user.preferences.showLabelColorsInNav ? ': ' : '')
								: null}
						</span>
					)}
					{task.title}
				</p>
			</div>
		</ScrollLink>
	);

	return !currentUser || loadingCurrentUser ? null : (
		<Draggable key={task.id} draggableId={task.id} index={index}>
			{(provided, snapshot) => (
				<div ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
					{link}
				</div>
			)}
		</Draggable>
	);
}
