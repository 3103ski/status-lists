import React from 'react';

import { Form } from 'semantic-ui-react';

import { useForm } from '../../../hooks';

import { Button, FormTitle, TextInput, TextArea, LocalFormErrors } from '../../../components/';
import { CurrentUserContext } from '../../../contexts/';
import { userInfoRequirements } from '../inputRequirements';

const formID = 'form_update_user_info';

export default function UpdateUserInfo({ callback }) {
	const { currentUser, updateInfo } = React.useContext(CurrentUserContext);
	if (!currentUser) throw new Error('Update user form requires a valid "user" arg');

	/** Form uses GQL, so setup useGQLFormErrors hook */
	// const { setFormError, clearErrors } = useGQLFormErrors();
	//
	/** Setup useForm hook; since it is an update form, pass initial state */
	const { values, onSubmit, onChange, validationErrors, inputHasError, formIsValid, disableSubmit } = useForm(
		updateUserInfoHandler,
		{
			firstName: currentUser.user.info.firstName,
			lastName: currentUser.user.info.lastName,
			displayName: currentUser.user.info.displayName,
			title: currentUser.user.info.title,
			location: currentUser.user.info.location,
			bio: currentUser.user.info.bio,
		},
		{
			validate: userInfoRequirements,
			// onChangeCB: clearErrors,
			// setErrors: setFormError,
		}
	);

	async function updateUserInfoHandler() {
		let errors = await formIsValid();
		if (Object.keys(errors).length === 0) {
			updateInfo({ variables: { ...values } });
			return callback();
		}
	}

	return (
		<Form id={formID} onSubmit={onSubmit}>
			<FormTitle>Update Your Profile Information</FormTitle>
			<TextInput placeholder={'First Name'} name='firstName' onChange={onChange} value={values.firstName} />
			<TextInput placeholder={'Last Name'} name='lastName' onChange={onChange} value={values.lastName} />
			<TextInput
				placeholder={'Display Name'}
				error={inputHasError('displayName')}
				name='displayName'
				onChange={onChange}
				value={values.displayName}
			/>
			<TextInput placeholder={'Title Name'} name='title' onChange={onChange} value={values.title} />
			<TextInput placeholder={'Location Name'} name='location' onChange={onChange} value={values.location} />
			<TextArea placeholder='Bio' name='bio' onChange={onChange} value={values.bio} />

			<LocalFormErrors errors={validationErrors} />
			<Button fluid type='submit' disabled={disableSubmit} btnColor={disableSubmit ? 'passive' : 'primary'}>
				Update Profile Information
			</Button>
			<Button fluid onClick={callback}>
				Cancel
			</Button>
		</Form>
	);
}
