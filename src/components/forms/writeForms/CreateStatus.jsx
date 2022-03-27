import React, { useContext } from 'react';

import { Form } from 'semantic-ui-react';

import { InputWithEnterButton, FormErrors } from '../../../components';
import { ProjectContext } from '../../../contexts';
import { useForm } from '../../../hooks';
import { statusValidation } from '../inputRequirements';

export default function CreateStatusForm({ task }) {
	const { newStatus, serverCreatingStatus } = useContext(ProjectContext);
	const initialState = { text: '' };
	const { onChange, values, onSubmit, validationErrors, inputHasError, formIsValid } = useForm(
		handleSubmitForm,
		initialState,
		{
			validate: statusValidation,
		}
	);

	/**
	 * 		NOTE: this 'spinner' flag works with the 'serverCreatingStatus' to determine
	 * 		if this is the specific task that needs the spinner on input.
	 * 		without this local flag, all the inputs on the page spin when
	 * 		the server is creating a status
	 */
	const [spinner, setSpinner] = React.useState(false);

	async function handleSubmitForm() {
		let errors = await formIsValid();
		if (Object.keys(errors).length === 0) {
			setSpinner(true);
			newStatus({ variables: { ...values, taskId: task.id } });
		}
	}

	React.useEffect(() => {
		// see note above regarding spinner flag
		// will switch off local spinner when status
		// update is posted
		if (!serverCreatingStatus && spinner === true) {
			setSpinner(false);
		}
	}, [spinner, serverCreatingStatus]);

	return (
		<Form onSubmit={onSubmit} style={{ width: '100%' }}>
			<InputWithEnterButton
				error={inputHasError('text')}
				loading={serverCreatingStatus && spinner}
				onChange={onChange}
				values={values.text}
				name='text'
				border
				iconDirection='up'
				placeholder={`Update status for ${task.title}`}
			/>
			<FormErrors errors={validationErrors} />
		</Form>
	);
}
