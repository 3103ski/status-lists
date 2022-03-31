import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container, Grid } from 'semantic-ui-react';

import { Navigation, UserMenu } from '../components';
import { ProjectProvider } from '../contexts';

import { OverView, Project, UserSettings } from './dashSubViews/';
import { OVERVIEW, PROJECT, DASHBOARD, USER_SETTINGS } from '../routes';

import * as style from './shared.module.scss';

export default function DashboardPage() {
	return React.useMemo(
		() => (
			<ProjectProvider>
				<UserMenu />
				<Container fluid>
					<Router>
						<Grid>
							<Grid.Row className={style.DashContainer}>
								<Grid.Column computer={4}>
									<Route
										path={DASHBOARD}
										render={(props) => {
											return <Navigation />;
										}}
									/>
								</Grid.Column>
								<Grid.Column computer={12}>
									<Route path={`${DASHBOARD}${OVERVIEW}`} exact component={OverView} />
									<Route
										path={`${DASHBOARD}${PROJECT}/:projectId`}
										render={(props) => {
											return <Project {...props} />;
										}}
									/>
									<Route path={`${DASHBOARD}${USER_SETTINGS}`} component={UserSettings} />
								</Grid.Column>
							</Grid.Row>
						</Grid>
					</Router>
				</Container>
			</ProjectProvider>
		),
		[]
	);
}
