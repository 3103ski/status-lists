import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container, Grid } from 'semantic-ui-react';

import { Navigation } from '../components';
import { ProjectContext, ProjectProvider } from '../contexts';

import { OverView, Project, UserSettings } from './dashSubViews/';
import { OVERVIEW, PROJECT, DASHBOARD, USER_SETTINGS } from '../routes';

import * as style from './shared.module.scss';

export default function DashboardPage(props) {
	return React.useMemo(
		() => (
			<Container fluid>
				<Router>
					<Grid>
						<Grid.Row className={style.DashContainer}>
							<Grid.Column computer={4}>
								<Route
									path={DASHBOARD}
									render={(props) => {
										return (
											<ProjectProvider {...props}>
												<Navigation />
											</ProjectProvider>
										);
									}}
								/>
							</Grid.Column>
							<Grid.Column computer={12}>
								<Route path={`${DASHBOARD}${OVERVIEW}`} exact component={OverView} />
								<Route
									path={`${DASHBOARD}${PROJECT}/:projectId`}
									render={(props) => {
										return (
											<ProjectProvider {...props}>
												<Project {...props} />
											</ProjectProvider>
										);
									}}
								/>
								<Route path={`${DASHBOARD}${USER_SETTINGS}`} component={UserSettings} />
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Router>
			</Container>
		),
		[]
	);
}
