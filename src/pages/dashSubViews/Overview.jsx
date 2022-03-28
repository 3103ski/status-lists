import React from 'react';
import { List } from '../../components';

export default function OverviewPage() {
	// const { currentUser } = React.useContext(CurrentUserContext);

	return (
		<div style={{ padding: '30px' }}>
			<List.Empty title={'Dashboard is in the works!'} />
		</div>
	);
}
