import React from 'react';

import { Form, Grid } from 'semantic-ui-react';

import { FormErrors, TextInput, Button, TaskLabel } from '../../../components';
import { SliderPicker } from 'react-color';
import { ProjectContext } from '../../../contexts';
import { useForm } from '../../../hooks';
import { randomHexColor } from '../../../util';
import { labelValidation } from '../inputRequirements';
import * as style from './shared.module.scss';

export default function CreateLabelForm({ callback }) {
	const { createLabel } = React.useContext(ProjectContext);
	const initialState = { label: '' };
	const [color, setColor] = React.useState(randomHexColor());

	const { onChange, values, onSubmit, validationErrors, inputHasError, formIsValid, resetFormValues } = useForm(
		handleSubmitForm,
		initialState,
		{
			validate: labelValidation,
		}
	);

	async function handleSubmitForm() {
		let errors = await formIsValid();
		if (Object.keys(errors).length === 0) {
			await createLabel({ variables: { ...values, color } });
			await setColor(randomHexColor());
			if (callback) callback();
			return resetFormValues();
		}
	}

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
						<div className={style.ButtonWrapper}>
							<Button btnColor={'primary'} type='submit'>
								Add Label
							</Button>
							<Button onClick={() => setColor(randomHexColor())}>Random Color</Button>
						</div>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</Form>
	);
}
