import React from 'react';
import { Form } from 'semantic-ui-react';
import { StatusList, TextInput } from '../../../components';
import * as style from './taskBlock.module.scss';

export default function TaskBlock({ task = { title: '' } }) {
	return (
		<div className={style.Container}>
			<div className={style.BlockHeader}>
				<div className={style.HeaderLeft}>
					<h2>{task.title}</h2>
				</div>
				<div className={style.HeaderRight}>
					<div className={style.CheckCircle}></div>
				</div>
			</div>
			<div className={style.InputWrapper}>
				<Form>
					<TextInput placeholder={`Update Status`} />
				</Form>
			</div>
			<StatusList />
		</div>
	);
}
