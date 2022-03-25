import React from 'react';

import StatusListItem from './statusListItem/StatusListItem';

import * as style from './statusList.module.scss';

export default function StatusList({ task }) {
	React.useEffect(() => {
		var elem = document.getElementById(`${task.id}_status_list`);
		elem.scrollTop = elem.scrollHeight;
	}, [task]);
	return (
		<div className={style.Container} data-no-tasks={task.statuses.length === 1 ? 1 : 0}>
			<div className={style.ListWrapper} id={`${task.id}_status_list`}>
				{task.statuses.length === 0 ? (
					<p>Task created {task.createdAt}</p>
				) : (
					task.statuses.map((item, i) => (
						<StatusListItem
							key={item.id}
							first={i === 0 ? true : false}
							last={i === task.statuses.length - 1 ? 1 : 0}
							even={i % 2 === 1 ? 0 : 1}
							text={item.text}
							date={item.createdAt}
						/>
					))
				)}
			</div>
		</div>
	);
}
