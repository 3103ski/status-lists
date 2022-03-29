import React from 'react';
import { Icon } from '@iconify/react';

import * as style from './bubbleToggle.module.scss';

export default function BubbleToggle({ active, setActive, icon = null, margin = true, onClick, children }) {
	return (
		<div
			className={style.Container}
			data-icon={icon ? 1 : 0}
			data-margin={margin === true ? 1 : 0}
			onClick={onClick ? onClick : () => setActive(!active)}
			data-active={active ? 1 : 0}>
			{!icon ? <p>{children}</p> : <Icon icon={icon} />}
		</div>
	);
}
