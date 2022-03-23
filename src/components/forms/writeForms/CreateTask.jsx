import React, { useContext } from 'react';

import { Form } from 'semantic-ui-react';

import { InputWithEnterButton, FormErrors } from '../../../components';
import { ProjectContext } from '../../../contexts';
import { useForm } from '../../../hooks';
import { taskValidation } from '../inputRequirements';

export default function CreateTaskForm() {
	const { newTask, focusProject, serverCreatingTask } = useContext(ProjectContext);
	const initialState = { title: '', notes: '' };
	const { onChange, values, onSubmit, validationErrors, inputHasError } = useForm(handleSubmitForm, initialState, {
		validate: taskValidation,
	});

	function handleSubmitForm() {
		newTask({ variables: { ...values, projectId: focusProject } });
	}

	return (
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
			<FormErrors errors={validationErrors} />
		</Form>
	);
}
