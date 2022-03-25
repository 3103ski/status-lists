import React from 'react';

import { Icon } from '@iconify/react';

import { Form } from 'semantic-ui-react';
import { InputWithEnterButton, FormErrors } from '../../../components';
import { ProjectContext } from '../../../contexts';
import { ICONIFY_CLOSE, ICONIFY_PLUS } from '../../../icons';

import { useForm } from '../../../hooks';
import { projectValidation } from '../inputRequirements';
import * as style from './shared.module.scss';
export default function CreateProjectForm({ callback, loading }) {
	const initialState = { title: '' };
	const { isCreatingProject, toggleIsCreatingProject } = React.useContext(ProjectContext);

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

	return isCreatingProject ? (
		<div className={style.FormWrapper}>
			<div className={style.CloseForm} onClick={() => toggleIsCreatingProject(false)}>
				<Icon icon={ICONIFY_CLOSE} />
			</div>
			<Form onSubmit={onSubmit} style={{ width: '100%' }}>
				<InputWithEnterButton
					error={inputHasError('title')}
					onChange={onChange}
					placeholder={'Project Name'}
					value={values.title}
					loading={loading}
					name='title'
				/>
				<FormErrors errors={validationErrors} />
			</Form>
		</div>
	) : (
		<div className={style.FormTrigger} onClick={() => toggleIsCreatingProject(true)}>
			<Icon icon={ICONIFY_PLUS} />
			<p>Create Project</p>
		</div>
	);
}
