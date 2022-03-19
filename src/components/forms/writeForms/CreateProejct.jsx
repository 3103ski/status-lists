import React from 'react';

import { Form } from 'semantic-ui-react';
import { TextInput, FormErrors, Button } from '../../../components';
import { useForm } from '../../../hooks';

export default function CreateProjectForm() {
	return (
		<Form>
			<TextInput placeholder={'Enter Project Name'} />
			<Button btnColor={'primary'}>Create Project</Button>
		</Form>
	);
}
