import React from 'react';
import * as style from './divider.module.scss';

export default function Divider({ direction = 'horizontal', color = 'passive', marginTop = 10, marginBottom = 10 }) {
	return <div className={style.Divider} data-color={color} style={{ marginTop, marginBottom }} />;
}
