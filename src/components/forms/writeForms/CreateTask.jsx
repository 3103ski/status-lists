import React, { useContext } from 'react';
import { Icon } from '@iconify/react';
import { Form } from 'semantic-ui-react';

import { InputWithEnterButton, FormErrors } from '../../../components';
import { ProjectContext } from '../../../contexts';
import { useForm } from '../../../hooks';
import { taskValidation } from '../inputRequirements';
import { ICONIFY_PLUS, ICONIFY_CLOSE } from '../../../icons';

import * as style from './shared.module.scss';

export default function CreateTaskForm() {
	const { newTask, isCreatingTask, toggleIsCreatingTask, focusProject, serverCreatingTask } =
		useContext(ProjectContext);

	const initialState = { title: '', notes: '' };
	const { onChange, values, onSubmit, validationErrors, inputHasError, resetFormValues, formIsValid } = useForm(
		handleSubmitForm,
		initialState,
		{
			validate: taskValidation,
		}
	);

	async function handleSubmitForm() {
		let errors = await formIsValid();
		if (Object.keys(errors).length === 0) {
			newTask({ variables: { ...values, projectId: focusProject } });
			resetFormValues();
		}
	}

	return isCreatingTask ? (
		<>
			<div className={style.FormWrapper}>
				<div className={style.CloseForm} onClick={() => toggleIsCreatingTask(false)}>
					<Icon icon={ICONIFY_CLOSE} />
				</div>
				<Form onSubmit={onSubmit} style={{ width: '100%' }}>
					<InputWithEnterButton
						error={inputHasError('title')}
						loading={serverCreatingTask}
						onChange={onChange}
						values={values.title}
						name='title'
						border
						placeholder='Create Task'
					/>
				</Form>
			</div>
			<FormErrors errors={validationErrors} />
		</>
	) : (
		<div
			className={style.FormTrigger}
			style={{ justifyContent: 'center' }}
			onClick={() => toggleIsCreatingTask(true)}>
			<Icon icon={ICONIFY_PLUS} />
		</div>
	);
}
