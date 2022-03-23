import React, { useContext } from 'react';
import { useApolloClient } from '@apollo/client';
import { Link } from 'react-router-dom';

import { Form } from 'semantic-ui-react';

import { GoogleLoginButton } from '../oAuthButtons';

import { Button, TextInput, LocalFormErrors, Loader } from '../../../components';
import { CurrentUserContext } from '../../../contexts';

import { useForm } from '../../../hooks';
import { LOCAL_AUTH, REGISTER, LANDING } from '../../../routes';

export default function LoginForm({ history }) {
	// form uses authRegisterApi and not GQL query
	const { authRegisterApi, clearErrors, errors, isLoading, isLoadingCurrentUser } = useContext(CurrentUserContext);

	/** setup useForm hook */
	const { values, onSubmit, onChange } = useForm(
		loginInit,
		{ email: '', password: '' },
		{
			onChangeCB: clearErrors,
		}
	);

	let client = useApolloClient();
	console.log({ client });

	function loginInit() {
		return authRegisterApi({ authEndpoint: LOCAL_AUTH, data: values }, history);
	}

	console.log({ errors });

	React.useEffect(() => {
		return () => clearErrors();
	}, [clearErrors]);

	return isLoading || isLoadingCurrentUser ? (
		<Loader loadingText='logging in...' />
	) : (
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
			<GoogleLoginButton history={history} />
		</Form>
	);
}
