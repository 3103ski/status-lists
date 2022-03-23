import React from 'react';

import StatusListItem from './statusListItem/StatusListItem';

import * as style from './statusList.module.scss';

export default function StatusList({ task }) {
	return (
		<div className={style.Container}>
			<div className={style.ListWrapper}>
				{task.statuses.length === 0 ? (
					<p>Task created {task.createdAt}</p>
				) : (
					task.statuses.map((item, i) => (
						<StatusListItem
							key={item.id}
							first={i === 0 ? true : false}
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
