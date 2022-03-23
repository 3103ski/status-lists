import React from 'react';
import { Form } from 'semantic-ui-react';
import { StatusList, InputWithEnterButton } from '../../../components';
import * as style from './taskBlock.module.scss';

export default function TaskBlock({ task = { title: '' }, id }) {
	console.log({ task });
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
			<StatusList task={task} />
			<div className={style.InputWrapper}>
				<Form style={{ width: '100%' }}>
					<InputWithEnterButton border placeholder={`Update Status`} />
				</Form>
			</div>
		</div>
	);
}
