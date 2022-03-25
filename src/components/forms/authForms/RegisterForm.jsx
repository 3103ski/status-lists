import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { Form } from 'semantic-ui-react';

import { GoogleLoginButton } from '../oAuthButtons';

import { Button, TextInput, LocalFormErrors } from '../../../components';
import { CurrentUserContext } from '../../../contexts';

import { useForm } from '../../../hooks';
import { LOCAL_REGISTER, LOGIN } from '../../../routes.js';

const formID = 'form_update_user_profile';

export default function RegisterUserForm({ history }) {
	const { authRegisterApi, clearErrors, errors } = useContext(CurrentUserContext);

	const { values, onSubmit, onChange } = useForm(
		registerUser,
		{ email: '', displayName: '', password: '', confirmPassword: '' },
		{
			onChangeCB: clearErrors,
		}
	);

	function registerUser() {
		authRegisterApi(
			{
				authEndpoint: LOCAL_REGISTER,
				data: values,
			},
			history
		);
	}

	React.useEffect(() => {
		return () => clearErrors();
	}, [clearErrors]);

	return (
		<Form id={formID} onSubmit={onSubmit}>
			<TextInput name='email' value={values.email} placeholder={'Email'} onChange={onChange} />
			<TextInput name='displayName' value={values.displayName} placeholder={'Display Name'} onChange={onChange} />
			<TextInput
				name='password'
				type='password'
				value={values.password}
				placeholder={'Password'}
				onChange={onChange}
			/>
			<TextInput
				name='confirmPassword'
				type='password'
				value={values.confirmPassword}
				placeholder={'Confirm Password'}
				onChange={onChange}
			/>
			<LocalFormErrors errors={errors} />

			<Button type='submit' fluid btnColor={'primary'}>
				Sign Up!
			</Button>
			<Button as={Link} to={LOGIN}>
				Already signed up? Login
			</Button>
			{/* <Button as={Link} to={LANDING}>
				Boiler Notes
			</Button> */}

			{/* If not visible, toggle in config file */}
			<GoogleLoginButton history={history} />
		</Form>
	);
}
