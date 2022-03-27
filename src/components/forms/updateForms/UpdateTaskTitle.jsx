import React from 'react';

import { Form } from 'semantic-ui-react';

import { InputWithEnterButton, FormErrors } from '../../../components';
import { ProjectContext } from '../../../contexts';
import { taskValidation } from '../inputRequirements';

import { useForm } from '../../../hooks';

export default function UpdateTaskTitleInput({ task, callback }) {
	const { updateTask } = React.useContext(ProjectContext);

	const { onChange, onSubmit, values, inputHasError, formIsValid, validationErrors } = useForm(
		handleUpdateTitleSubmit,
		{ title: task.title },
		{
			validate: taskValidation,
		}
	);
	async function handleUpdateTitleSubmit() {
		const errors = await formIsValid();
		if (Object.keys(errors).length === 0) {
			updateTask({ variables: { title: values.title, taskId: task.id } });
			if (callback) {
				callback();
			}
		}
	}
	return (
		<>
			<Form onSubmit={onSubmit}>
				<InputWithEnterButton
					border
					name='title'
					value={values.title}
					placeholder='Enter Task Name'
					error={inputHasError('title')}
					onChange={onChange}
				/>
			</Form>
			<FormErrors errors={validationErrors} />
		</>
	);
}
