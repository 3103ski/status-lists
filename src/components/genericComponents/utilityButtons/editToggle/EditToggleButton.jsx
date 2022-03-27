import React from 'react';

import { Icon } from '@iconify/react';

import { ICONIFY_MENU_EDIT, ICONIFY_CLOSE } from '../../../../icons';

import * as style from './editToggleButton.module.scss';

export default function EditToggleButton({ isEditing, setIsEditing }) {
	return (
		<div className={style.Wrapper} onClick={() => setIsEditing(!isEditing)}>
			<Icon icon={isEditing ? ICONIFY_CLOSE : ICONIFY_MENU_EDIT} />
		</div>
	);
}
