import React, { useContext } from 'react';
import { Icon } from '@iconify/react';
import { Form } from 'semantic-ui-react';

import { InputWithEnterButton, FormErrors } from '../../../components';
import { clickIsOutsideEl } from '../../../util';
import { ProjectContext } from '../../../contexts';
import { useForm } from '../../../hooks';
import { taskValidation } from '../inputRequirements';
import { ICONIFY_ADD_LIST } from '../../../icons';

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

	function clickListenerCallback(e) {
		clickIsOutsideEl(e, 'add-task-form', () => toggleIsCreatingTask(false));
	}

	React.useEffect(() => {
		if (isCreatingTask) {
			document.addEventListener('click', clickListenerCallback);
		}

		return () => document.removeEventListener('click', clickListenerCallback);
	});

	return isCreatingTask ? (
		<>
			<div id='add-task-form' className={style.FormWrapper} style={{ marginBottom: '45px' }}>
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
			data-size='large'
			style={{ justifyContent: 'center', marginBottom: '45px' }}
			onClick={() => toggleIsCreatingTask(true)}>
			<Icon icon={ICONIFY_ADD_LIST} />
		</div>
	);
}
