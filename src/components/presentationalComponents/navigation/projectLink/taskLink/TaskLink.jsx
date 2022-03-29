import React from 'react';

import { Icon } from '@iconify/react';
import { Link as ScrollLink } from 'react-scroll';

import { ProjectContext } from '../../../../../contexts';
import { ICONIFY_BELL_FILL, ICONIFY_BELL } from '../../../../../icons';

import * as style from './taskLink.module.scss';

export default function TaskLink({ task, ...rest }) {
	const { focusProject, updateTask } = React.useContext(ProjectContext);

	const blockID = `task_block_${task.id}_${task.title}`;

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

	return (
		<ScrollLink
			offset={-50}
			to={blockID}
			onClick={highlightBlock}
			containerId={`${focusProject}-wrapper`}
			smooth={true}
			activeClass={style.Active}
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
