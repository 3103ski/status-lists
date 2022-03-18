import React from 'react';
import { Container } from 'semantic-ui-react';
import { LoginForm, Card } from '../components';

export default function LoginPage(props) {
	return (
		<Container>
			<div style={{ padding: '30px 0', textAlign: 'left' }}>
				<Card brand title='Register New User'>
					<LoginForm history={props.history} />
				</Card>
			</div>
		</Container>
	);
}
