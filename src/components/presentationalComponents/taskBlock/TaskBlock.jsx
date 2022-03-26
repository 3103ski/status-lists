import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import { Icon } from '@iconify/react';
import { StatusList, CreateStatusForm } from '../../../components';
import { ProjectContext } from '../../../contexts';
import { ICONIFY_CIRCLE_CHECK, ICONIFY_CIRCLE, ICONIFY_BELL, ICONIFY_BELL_FILL } from '../../../icons';
import * as style from './taskBlock.module.scss';

export default function TaskBlock({ task = { title: '' }, id, projectTitle = null }) {
	const { updateTask } = React.useContext(ProjectContext);
	const [showList, setShowList] = React.useState(false);

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
	return React.useMemo(
		() => (
			<div
				className={style.Container}
				id={`task_block_${task.id}_${task.title}`}
				data-show-list={!task.isComplete || showList ? 1 : 0}
				data-complete={task.isComplete ? 1 : 0}>
				<div className={style.BlockHeader}>
					<div className={style.HeaderLeft}>
						<h2>{task.title}</h2>
					</div>
					<div className={style.HeaderRight}>
						{task.isComplete ? (
							<div className={style.Archived}>
								<p>Show Status List</p>
								<Checkbox
									toggle
									checked={showList}
									onChange={(_, d) => {
										setShowList(d.checked);
									}}
								/>
							</div>
						) : null}
						{task.isComplete ? (
							<div className={style.Archived}>
								<p>Archive</p>
								<Checkbox
									toggle
									checked={task.archived}
									onChange={(e, d) => {
										updateTask({ variables: { taskId: task.id, archived: d.checked } });
									}}
								/>
							</div>
						) : null}
						{task.isComplete === true ? null : (
							<div
								className={style.CheckCircle}
								onClick={() =>
									updateTask({
										variables: {
											taskId: task.id,
											attentionFlag: !task.attentionFlag,
										},
									})
								}>
								<Icon icon={task.attentionFlag ? ICONIFY_BELL_FILL : ICONIFY_BELL} />
							</div>
						)}
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
					</div>
				</div>
				{!task.isComplete || showList === true ? <StatusList task={task} /> : null}
				{task.isComplete ? null : (
					<div className={style.InputWrapper}>
						<CreateStatusForm task={task} />
					</div>
				)}
			</div>
		),
		[showList, task, updateTask]
	);
}
