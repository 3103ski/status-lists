import React from 'react';

import { DateTime } from 'luxon';
import style from './luxonTimestamp.module.scss';

export default function Timestamp({ timestamp, type = 'med', preText = null }) {
	let date;

	switch (type) {
		case 'short':
			date = DateTime.DATETIME_SHORT;
			break;
		default:
			date = DateTime.DATETIME_MED;
			break;
	}

	return (
		<div className={style.TimestampWrapper}>
			{preText ? <p className={style.PreText}>{preText} </p> : null}
			<p>{new DateTime.fromISO(timestamp).toLocaleString(date)}</p>
		</div>
	);
}
