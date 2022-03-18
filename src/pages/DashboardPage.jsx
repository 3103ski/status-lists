import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from '../components';
import { LOGIN } from '../routes';
import { CurrentUserContext } from '../contexts';

export default function DashboardPage() {
	const { logout } = React.useContext(CurrentUserContext);
	return (
		<div style={{ padding: '30px 0', textAlign: 'left' }}>
			<h1>Successful Login</h1>
			<Button as={Link} onClick={logout} to={LOGIN}>
				Logout
			</Button>
		</div>
	);
}
