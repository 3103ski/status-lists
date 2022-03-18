import React from 'react';
import { Form } from 'semantic-ui-react';
import { useForm, useGQLFormErrors } from '../../../hooks';

import { Button, FormTitle, TextInput } from '../../../components/';

import { CurrentUserContext } from '../../../contexts/';

const formID = 'form_update_user_email';

export default function UpdateAuthEmail({ callback }) {
	const { updateEmail, currentUser } = React.useContext(CurrentUserContext);
	const { setFormError, clearErrors } = useGQLFormErrors();

	const { values, onSubmit, onChange, emptyInputErrors } = useForm(
		handleUpdateEmail,
		{
			email: currentUser.user.email,
		},
		{ onChangeCB: clearErrors, setErrors: setFormError }
	);

	function handleUpdateEmail() {
		clearErrors();
		if (emptyInputErrors.length > 0) return setFormError({ [emptyInputErrors[0]]: `Missing fields` });
		return updateEmail(values.email, callback, setFormError);
	}

	return (
		<Form id={formID} onSubmit={onSubmit}>
			<FormTitle>Update your email address</FormTitle>
			<TextInput value={values.email} onChange={onChange} placeholder='Enter Your Updated Email' name='email' />
			<Button fluid type='submit' btnColor={'primary'}>
				Update
			</Button>
			<Button fluid onClick={callback}>
				Cancel
			</Button>
		</Form>
	);
}
