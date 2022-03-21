import React from 'react';

import { Form } from 'semantic-ui-react';
import { TextInput, FormErrors, Button } from '../../../components';
// import { ProjectContext } from '../../../contexts';
import { useForm } from '../../../hooks';
import { projectValidation } from '../inputRequirements';

export default function CreateProjectForm({ callback }) {
	const initialState = { title: '' };

	const { values, onSubmit, onChange, validationErrors, inputHasError, formIsValid } = useForm(
		handleCreateProject,
		initialState,
		{
			validate: projectValidation,
		}
	);

	async function handleCreateProject() {
		let errors = await formIsValid();
		if (Object.keys(errors).length === 0) {
			return callback({ variables: values });
		}
	}

	return (
		<Form onSubmit={onSubmit}>
			<TextInput
				error={inputHasError('title')}
				onChange={onChange}
				placeholder={'Enter Project Name'}
				value={values.title}
				name='title'
			/>
			<FormErrors errors={validationErrors} />
			<Button type='submit' btnColor={'primary'}>
				Create Project
			</Button>
		</Form>
	);
}
