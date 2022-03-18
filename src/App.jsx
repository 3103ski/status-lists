import './App.scss';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import { LoginPage, RegisterPage, LandingPage, DashboardPage } from './pages';

import { AuthRoute } from './util';
import { LANDING, LOGIN, REGISTER, DASHBOARD } from './routes';

function App() {
	return (
		<div className='App'>
			<Router>
				<Route exact path={LANDING} component={LandingPage} />
				<Route exact path={LOGIN} component={LoginPage} />
				<Route exact path={REGISTER} component={RegisterPage} />
				<AuthRoute exact path={DASHBOARD} component={DashboardPage} />
			</Router>
		</div>
	);
}

export default App;
