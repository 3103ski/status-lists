import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import { Icon } from '@iconify/react';
import { StatusList, CreateStatusForm, UpdateTaskTitleInput } from '../../../components';
import { ProjectContext } from '../../../contexts';
import {
	ICONIFY_CIRCLE_CHECK,
	ICONIFY_CIRCLE,
	ICONIFY_BELL,
	ICONIFY_BELL_FILL,
	ICONIFY_MENU_EDIT,
	ICONIFY_CLOSE,
	ICONIFY_CANCEL,
} from '../../../icons';
import * as style from './taskBlock.module.scss';

export default function TaskBlock({
	task = { title: '' },
	id,
	projectTitle = null,
	globalHideList = false,
	clearGlobalHide,
}) {
	const { updateTask } = React.useContext(ProjectContext);
	const [showList, setShowList] = React.useState(task.archived || task.isComplete ? false : true);
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

	return React.useMemo(
		() => (
			<div
				className={style.Container}
				id={`task_block_${task.id}_${task.title}`}
				data-show-list={!task.isComplete || showList ? 1 : 0}
				data-complete={task.isComplete ? 1 : 0}>
				<div className={style.BlockHeader}>
					<div className={style.HeaderLeft}>
						{!isEditingTitle ? (
							<h2 onDoubleClick={() => setIsEditingTitle(!isEditingTitle)}>{task.title}</h2>
						) : (
							<UpdateTaskTitleInput task={task} callback={() => setIsEditingTitle(false)} />
						)}
						{isEditingTitle ? (
							<Icon onClick={() => setIsEditingTitle(!isEditingTitle)} icon={ICONIFY_CLOSE} />
						) : (
							<Icon onClick={() => setIsEditingTitle(!isEditingTitle)} icon={ICONIFY_MENU_EDIT} />
						)}
					</div>
					<div className={style.HeaderRight}>
						<div className={style.Archived}>
							{globalHideList === true ? (
								<div className={style.GlobalHiddenBadge} onClick={clearGlobalHide}>
									<Icon icon={ICONIFY_CANCEL} />
									<p>Globally Hidden</p>
								</div>
							) : (
								<>
									<p>Show Status List</p>
									<Checkbox
										toggle
										checked={showList}
										onChange={(_, d) => {
											setShowList(d.checked);
										}}
									/>
								</>
							)}
						</div>

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
				{showList && globalHideList === false ? <StatusList task={task} /> : null}
				{task.isComplete ? null : (
					<div className={style.InputWrapper}>
						<CreateStatusForm task={task} />
					</div>
				)}
			</div>
		),
		[clearGlobalHide, globalHideList, isEditingTitle, showList, task, updateTask]
	);
}
