import React from 'react';
import { CurrentUserContext } from '../../contexts/';

export default function OverviewPage() {
	const { currentUser } = React.useContext(CurrentUserContext);
	console.log(currentUser);
	return (
		<div>
			<h1>Overview Page</h1>
		</div>
	);
}
