import { useState } from 'react';

export default function useGQLFormErrors() {
	const [errors, setErrors] = useState({});

	const setFormError = (err) => {
		if (err.graphQLErrors && err.graphQLErrors[0]) {
			return setErrors(err.graphQLErrors[0].extensions.exception.errors);
		}
		return setErrors(err);
	};

	const clearErrors = () => setErrors({});

	return { errors, setFormError, clearErrors };
}
