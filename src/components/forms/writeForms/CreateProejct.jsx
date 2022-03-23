import React from 'react';

import { Form } from 'semantic-ui-react';
import { InputWithEnterButton, FormErrors } from '../../../components';

import { useForm } from '../../../hooks';
import { projectValidation } from '../inputRequirements';

export default function CreateProjectForm({ callback, loading }) {
	const initialState = { title: '' };

	const { values, onSubmit, onChange, validationErrors, resetFormValues, inputHasError, formIsValid } = useForm(
		handleCreateProject,
		initialState,
		{
			validate: projectValidation,
		}
	);

	async function handleCreateProject() {
		let errors = await formIsValid();
		if (Object.keys(errors).length === 0) {
			callback({ variables: values });
			resetFormValues();
		}
	}

	return (
		<Form onSubmit={onSubmit} style={{ width: '100%' }}>
			<InputWithEnterButton
				error={inputHasError('title')}
				onChange={onChange}
				placeholder={'Enter Project Name'}
				value={values.title}
				loading={loading}
				name='title'
			/>
			<FormErrors errors={validationErrors} />
		</Form>
	);
}
