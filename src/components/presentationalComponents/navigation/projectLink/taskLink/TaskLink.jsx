import React from 'react';

import { Icon } from '@iconify/react';
import { Link as ScrollLink } from 'react-scroll';

import { ProjectContext } from '../../../../../contexts';
import { ICONIFY_BELL_FILL, ICONIFY_BELL } from '../../../../../icons';

import * as style from './taskLink.module.scss';

export default function TaskLink({ task, ...rest }) {
	const { focusProject, updateTask } = React.useContext(ProjectContext);

	// Drag and scroll related IDs
	const blockID = `task_block_${task.id}`;
	const linkID = `task_link_${task.id}`;
	const sortableID = `${task.id}`;

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

	// Manage Draggin Events

	const dragOver = React.useCallback(() => {
		let sortableEl = document.getElementById(sortableID);
		sortableEl.style.borderBottom = '10px solid rgba(0,0,0,.14)';
	}, [sortableID]);

	const dragLeave = React.useCallback(() => {
		let sortableEl = document.getElementById(sortableID);
		sortableEl.style.borderBottom = '0px solid rgba(0,0,0,0)';
	}, [sortableID]);

	const dragEnd = React.useCallback(() => {
		let taskLink = document.getElementById(`task_link_${task.id}`);
		let sortableEl = document.getElementById(sortableID);

		sortableEl.style.borderBottom = 'none';

		sortableEl.style.opacity = '1';
		taskLink.style.opacity = '1';
	}, [sortableID, task.id]);

	const drag = React.useCallback(() => {
		let sortableEl = document.getElementById(sortableID);
		let taskLink = document.getElementById(linkID);

		sortableEl.style.opacity = '.25';
		taskLink.style.opacity = '.25';
	}, [sortableID, linkID]);

	React.useEffect(() => {
		let sortableEl = document.getElementById(sortableID);
		if (sortableEl) {
			sortableEl.style.transitionTimingFunction = 'ease';
			sortableEl.style.transition = '.35';
			sortableEl.addEventListener('dragover', dragOver);
			sortableEl.addEventListener('dragend', dragEnd);
			sortableEl.addEventListener('drop', dragEnd);
			sortableEl.addEventListener('drag', drag);
			sortableEl.addEventListener('dragleave', dragLeave);
		}
	}, [drag, dragEnd, dragLeave, dragOver, sortableID, task]);

	return (
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
				<p>{task.title}</p>
			</div>
		</ScrollLink>
	);
}
