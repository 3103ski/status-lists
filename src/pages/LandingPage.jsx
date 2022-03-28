import React from 'react';
import { Link } from 'react-router-dom';

import { Container, Grid } from 'semantic-ui-react';

import { List, Button } from '../components';
import { LOGIN, REGISTER } from '../routes';

export default function LandingPage() {
	return (
		<Container>
			<div style={{ padding: '30px 0', textAlign: 'left' }}>
				<Grid>
					<Grid.Row>
						<Grid.Column>
							<List.Empty title='Status List Maker' message={'This app is in development.'}>
								<Button as={Link} to={LOGIN}>
									Login Page
								</Button>
								<Button as={Link} to={REGISTER}>
									Register Page
								</Button>
							</List.Empty>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</div>
		</Container>
	);
}
