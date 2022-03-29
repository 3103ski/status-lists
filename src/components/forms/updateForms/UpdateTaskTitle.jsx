import React from 'react';

import { Form } from 'semantic-ui-react';

import { InputWithEnterButton, FormErrors } from '../../../components';
import { ProjectContext } from '../../../contexts';
import { taskValidation } from '../inputRequirements';

import { useForm } from '../../../hooks';
import { clickIsOutsideEl } from '../../../util';

export default function UpdateTaskTitleInput({ task, callback }) {
	const { updateTask } = React.useContext(ProjectContext);
	const formID = `${task.id}_title_update`;
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

	const listenerCallback = React.useCallback(
		(e) => {
			clickIsOutsideEl(e, formID, callback);
		},
		[callback, formID]
	);

	React.useEffect(() => {
		document.addEventListener('click', listenerCallback);
		return () => document.removeEventListener('click', listenerCallback);
	}, [listenerCallback]);

	return (
		<>
			<Form onSubmit={onSubmit} id={formID} style={{ width: '100%' }}>
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
