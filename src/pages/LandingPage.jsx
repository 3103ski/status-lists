import React from 'react';
import { Link } from 'react-router-dom';

import { Container, Grid } from 'semantic-ui-react';

import { Card, Button } from '../components';
import { LOGIN, REGISTER } from '../routes';

export default function LandingPage() {
	return (
		<Container>
			<div style={{ padding: '30px 0', textAlign: 'left' }}>
				<Grid>
					<Grid.Row>
						<Grid.Column>
							<Card title={'Mongodb-Express-React-Node-Graphql(MERNG) App Template Notes'} brand>
								<h3>A few things</h3>
								<ul>
									<li>
										This template includes most Google oAuth setup. see config file for more info.
									</li>
									<li>
										There is no nav included in this app router, there are however user forms at
										'/login' and '/register'. Look at routes.js file in root directory for
										preexisting paths
									</li>
									<li>
										You must connect the proper .env data and config data for user setups to work.
										There should be a server template with GQL and express running that goes with
										this template. Without it, none of the auth related work int his template is of
										use unless it matches another pattern you are using.
									</li>
									<li>
										SASS folder holds global variables for color schems that are used in generic
										components
									</li>
									<li>
										between useForm hook, formErrors component, and formComponents file, a lot of
										form work should be easy work flow. See useForm hook for more info on how to
										best use.
									</li>
									<li>
										If this is still part of the template that means I have not spent time on
										documentation yet, sorry.
									</li>
								</ul>
								<Button as={Link} to={LOGIN}>
									Login Page
								</Button>
								<Button as={Link} to={REGISTER}>
									Register Page
								</Button>
							</Card>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</div>
		</Container>
	);
}
