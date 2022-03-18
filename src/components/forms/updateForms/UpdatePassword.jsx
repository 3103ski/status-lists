import React from 'react';
import { Form } from 'semantic-ui-react';

import { Button, FormTitle, TextInput } from '../../../components/';

import { LOCAL_PW_CHANGE } from '../../../routes.js';

import { useForm } from '../../../hooks';
import { CurrentUserContext } from '../../../contexts/';

const formID = 'form_update_user_password';

export default function UpdateUserPasswordForm({ callback, userEmail }) {
	const { token, authRegisterApi, setErrors, clearErrors } = React.useContext(CurrentUserContext);

	const { values, onSubmit, onChange } = useForm(
		updatePassword,
		{ password: '', newPassword: '', confirmNewPassword: '' },
		{
			onChangeCB: clearErrors,
			setErrors,
		}
	);

	function updatePassword() {
		if (token && userEmail) {
			authRegisterApi(
				{
					authEndpoint: LOCAL_PW_CHANGE,
					data: {
						email: userEmail,
						...values,
					},
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
				null,
				() => {
					window.alert('password updated');
					callback();
				}
			);
		}
	}

	return (
		<Form id={formID} onSubmit={onSubmit}>
			<FormTitle>Update Your Password</FormTitle>

			<TextInput
				type='password'
				value={values.password}
				name='password'
				onChange={onChange}
				placeholder='Current Password'
			/>
			<TextInput
				type='password'
				value={values.newPassword}
				name='newPassword'
				onChange={onChange}
				placeholder='New Password'
			/>
			<TextInput
				type='password'
				value={values.confirmNewPassword}
				name='confirmNewPassword'
				onChange={onChange}
				placeholder='Confirm New Password'
			/>

			<Button fluid onClick={updatePassword} type='submit' btnColor={'primary'}>
				Update Password
			</Button>
			<Button fluid onClick={callback}>
				Cancel
			</Button>
		</Form>
	);
}
