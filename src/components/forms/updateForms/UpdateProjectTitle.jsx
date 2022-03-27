import React from 'react';

import { Form } from 'semantic-ui-react';

import { InputWithEnterButton, FormErrors } from '../../../components';
import { ProjectContext } from '../../../contexts';
import { projectValidation } from '../inputRequirements';

import { useForm } from '../../../hooks';

export default function UpdateProjectTitleInput({ project, callback }) {
	const { updateProject } = React.useContext(ProjectContext);

	const { onChange, onSubmit, values, inputHasError, formIsValid, validationErrors } = useForm(
		handleUpdateTitleSubmit,
		{ title: project.title },
		{
			validate: projectValidation,
		}
	);
	async function handleUpdateTitleSubmit() {
		const errors = await formIsValid();
		if (Object.keys(errors).length === 0) {
			updateProject({ variables: { title: values.title, projectId: project.id } });
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
					placeholder='Enter Project Name'
					error={inputHasError('title')}
					onChange={onChange}
				/>
			</Form>
			<FormErrors errors={validationErrors} />
		</>
	);
}
