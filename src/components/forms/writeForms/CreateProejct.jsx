import React from 'react';

import { Icon } from '@iconify/react';

import { Form } from 'semantic-ui-react';
import { InputWithEnterButton, FormErrors } from '../../../components';
import { ProjectContext } from '../../../contexts';
import { ICONIFY_PLUS } from '../../../icons';
import { clickIsOutsideEl } from '../../../util';

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

	const clickListenerCallback = React.useCallback(
		(e) => {
			clickIsOutsideEl(e, 'create-project-form', () => toggleIsCreatingProject(false));
		},
		[toggleIsCreatingProject]
	);

	React.useEffect(() => {
		if (isCreatingProject) {
			document.addEventListener('click', clickListenerCallback);
		}
		return () => document.removeEventListener('click', clickListenerCallback);
	}, [clickListenerCallback, isCreatingProject]);

	return isCreatingProject ? (
		<div id={'create-project-form'} className={`${style.FormWrapper} ${style.CreateProjectFormWrapper}`}>
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
		<div
			data-input-active={isCreatingProject ? 1 : 0}
			className={`${style.FormTrigger} ${style.CreateProjectTrigger}`}
			onClick={() => toggleIsCreatingProject(true)}>
			<Icon icon={ICONIFY_PLUS} />
			<p>Create Project</p>
		</div>
	);
}
