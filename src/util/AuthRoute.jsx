import React from 'react';

import { Route, Redirect } from 'react-router-dom';
import { Loader } from '../components';
import { CurrentUserContext } from '../contexts/';
import { TOKEN_DURATION, TOKEN_TITLE } from '../config';
import { NO_AUTH_REDIRECT } from '../routes.js';

const AuthRoute = ({ path, component: Component, provider: Provider, ...rest }) => {
	return (
		<Route
			path={path}
			{...rest}
			render={(props) => {
				const token = localStorage.getItem(TOKEN_TITLE);

				if (!token) {
					return <Redirect to={NO_AUTH_REDIRECT} />;
				}
				const RenderThis = () => (
					<TimedWrapper>
						<Component {...props} {...rest} />
					</TimedWrapper>
				);

				return Provider ? (
					<Provider {...props} {...rest}>
						<RenderThis />
					</Provider>
				) : (
					<RenderThis />
				);
			}}
		/>
	);
};

export default AuthRoute;

function TimedWrapper({ children }) {
	const { logout, refreshToken, token, refreshingToken } = React.useContext(CurrentUserContext);
	React.useEffect(() => {
		if (token) {
			refreshToken({ variables: { token } });
		}
		const timer = setTimeout(logout, TOKEN_DURATION.ms);
		return () => clearTimeout(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return refreshingToken ? <Loader /> : children;
}
