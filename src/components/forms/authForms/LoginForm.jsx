import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { Form } from 'semantic-ui-react';

import { GoogleLoginButton } from '../oAuthButtons';

import { Button, TextInput, LocalFormErrors } from '../../../components';
import { CurrentUserContext } from '../../../contexts';

import { useForm } from '../../../hooks';
import { LOCAL_AUTH, REGISTER, LANDING } from '../../../routes';

export default function LoginForm({ history }) {
	// form uses authRegisterApi and not GQL query
	const { authRegisterApi, clearErrors, errors } = useContext(CurrentUserContext);

	/** setup useForm hook */
	const { values, onSubmit, onChange } = useForm(
		loginInit,
		{ email: '', password: '' },
		{
			onChangeCB: clearErrors,
		}
	);

	function loginInit() {
		return authRegisterApi({ authEndpoint: LOCAL_AUTH, data: values }, history);
	}

	console.log({ errors });

	React.useEffect(() => {
		return () => clearErrors();
	}, [clearErrors]);

	return (
		<Form onSubmit={onSubmit}>
			<TextInput name='email' value={values.email} placeholder='Email' onChange={onChange} />
			<TextInput
				name='password'
				type='password'
				value={values.password}
				placeholder='Password'
				onChange={onChange}
			/>
			<LocalFormErrors errors={errors} header={'Ooops!'} />
			<Button type='submit' fluid btnColor={'primary'}>
				Login
			</Button>
			<Button as={Link} to={REGISTER}>
				Register
			</Button>
			<Button as={Link} to={LANDING}>
				Boiler Notes
			</Button>
			{/* If not visible, toggle in config file */}
			<GoogleLoginButton history={history} />
		</Form>
	);
}
