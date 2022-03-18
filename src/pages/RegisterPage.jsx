import React from 'react';
import { Container } from 'semantic-ui-react';
import { RegisterUserForm, Card } from '../components';

export default function RegisterUserView(props) {
	return (
		<Container>
			<div style={{ padding: '30px 0', textAlign: 'left' }}>
				<Card brand title='Register New User'>
					<RegisterUserForm history={props.history} />
				</Card>
			</div>
		</Container>
	);
}
