import React from 'react';

// import { Icon } from '@iconify/react';
import { CloudinaryImage, LuxonTimestamp } from '../../../../components';
// import { ICONIFY_CIRCLE_REMOVE, ICONIFY_CALENDAR, ICONIFY_BELL } from '../../../../icons';
import * as style from './statusListItem.module.scss';

export default function StatusListItem({ text, date, even, first = null, last = null }) {
	return (
		<div className={style.Container} data-first={first ? 1 : 0} data-last={last ? 1 : 0} data-even={even ? 1 : 0}>
			<div className={style.Filter}></div>
			<div className={style.Left}>
				<CloudinaryImage />
				<p>{text}</p>
			</div>
			<div className={style.Right}>
				<LuxonTimestamp timestamp={date} />
			</div>
		</div>
	);
}
