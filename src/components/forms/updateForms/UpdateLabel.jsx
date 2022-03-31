import React from 'react';

import { Form, Grid } from 'semantic-ui-react';

import { FormErrors, TextInput, Button, TaskLabel } from '../..';
import { SliderPicker } from 'react-color';
import { ProjectContext } from '../../../contexts';
import { useForm } from '../../../hooks';
// import { randomHexColor } from '../../../util';
import { labelValidation } from '../inputRequirements';
import * as style from './shared.module.scss';

export default function UpdateLabelForm({ label = { label: '', color: '' }, callback }) {
	const { updateLabel } = React.useContext(ProjectContext);
	// const initialState = { label: label.label };
	const [id, setId] = React.useState(null);
	const [color, setColor] = React.useState(label.color);

	const { onChange, values, onSubmit, validationErrors, inputHasError, formIsValid, resetFormValues } = useForm(
		handleSubmitForm,
		{ label: label.label },
		{
			validate: labelValidation,
		}
	);

	async function handleSubmitForm() {
		let errors = await formIsValid();
		if (Object.keys(errors).length === 0) {
			await updateLabel({ variables: { ...values, color, labelId: label.id } });
			if (callback) callback();
			return resetFormValues();
		}
	}

	React.useEffect(() => {
		if (!id || label.id !== id) {
			setId(label.id);
			setColor(label.color);
			resetFormValues();
		}
	}, [color, id, label, resetFormValues]);

	return (
		<Form onSubmit={onSubmit} style={{ width: '100%' }}>
			<Grid>
				<Grid.Row>
					<Grid.Column mobile={16} computer={8}>
						<TextInput
							error={inputHasError('label')}
							onChange={onChange}
							value={values.label}
							name='label'
							placeholder={`Enter a title for your label (12 letter max)`}
						/>
						<SliderPicker
							color={color}
							onChange={(color) => {
								setColor(color.hex);
							}}
						/>
						<FormErrors errors={validationErrors} />
					</Grid.Column>
					<Grid.Column mobile={16} computer={8}>
						<div className={style.PreviewWrapper}>
							<h2>Label Preview</h2>
							<TaskLabel label={{ color, label: values.label }} />
						</div>
						<Button btnColor={'primary'} type='submit'>
							Update Label
						</Button>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</Form>
	);
}
