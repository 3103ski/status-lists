import React, { useState } from 'react';
import { updateObj } from '../util/';

export default function useForm(callback, initialState = {}, options) {
	/** Destructured options */
	const { onChangeCB, validate = {} } = { ...options };

	/** Return states */
	const [values, setValues] = useState(initialState);
	const [validationErrors, setValidationErrors] = React.useState({});

	function checkForAndAssignError({ value, key }) {
		function manageError(errorKey, action) {
			// A function that adds and removes key messages from error object
			let updatedErrors = { ...validationErrors };
			switch (action) {
				case 'remove':
					delete updatedErrors[errorKey];
					break;
				case 'add':
				default:
					updatedErrors = updateObj(updatedErrors, { [errorKey]: validate[errorKey].errorMsg });
			}
			setValidationErrors(updatedErrors);
		}

		// The key has validation specified
		if (Object.keys(validate).includes(key)) {
			// The incoming value does not meet validation requirements
			if (
				(Object.keys(validate[key]).includes('min') && value.length < validate[key].min) ||
				(Object.keys(validate[key]).includes('exclude') && validate[key].exclude.includes(value)) ||
				(Object.keys(validate[key]).includes('notNull') && !value) ||
				(Object.keys(validate[key]).includes('max') && value.length > validate[key].max)
			) {
				return manageError(key, 'add');
			}
		}

		// value key is in error object, but new value passed validation; remove key message
		if (Object.keys(validationErrors).includes(key)) {
			return manageError(key, 'remove');
		}
	}

	/** Handle change value on object data */
	const onChange = (e, { drop = null, set = null }) => {
		if (!drop && !set) {
			checkForAndAssignError({ key: e.target.name, value: e.target.value });
			setValues({ ...values, [e.target.name]: e.target.value });
		}

		if (set) {
			checkForAndAssignError(set);
			setValues({ ...values, [set.key]: set.value });
		}

		if (drop) {
			checkForAndAssignError(drop);
			setValues({ ...values, [drop.key]: drop.value });
		}

		if (onChangeCB) onChangeCB();
	};

	async function formIsValid() {
		let errors = {};
		for (let key in validate) {
			if (Object.keys(validate).includes(key)) {
				// The incoming value does not meet validation requirements

				if (
					(Object.keys(validate[key]).includes('min') && values[key].length < validate[key].min) ||
					(Object.keys(validate[key]).includes('exclude') && validate[key].exclude.includes(values[key])) ||
					(Object.keys(validate[key]).includes('notNull') && !values[key]) ||
					(Object.keys(validate[key]).includes('max') && values[key].length > validate[key].max)
				) {
					errors[key] = await validate[key].errorMsg;
				}
			}
		}
		await setValidationErrors(errors);
		return errors;
	}

	/** hit callback if all required fields are present */
	const onSubmit = async (e) => {
		e.preventDefault();
		return callback();
	};

	/** Add ability to reset form to initial state */
	function resetFormValues() {
		return setValues(initialState);
	}

	return {
		/**Return Methods */
		onChange,
		onSubmit,
		resetFormValues,
		inputHasError: (name) => Object.keys(validationErrors).includes(name),
		formIsValid,
		setValidationErrors,

		/**Return States */
		values,
		validationErrors,
		formNotValid: Object.keys(validationErrors).length > 0,
		disableSubmit: Object.keys(validationErrors).length > 0,
	};
}
