import React from 'react';
import { Checkbox } from 'semantic-ui-react';

import { Card } from '../../../components';
import { CurrentUserContext } from '../../../contexts';

import * as style from './preferences.module.scss';

export default function UserPreferences() {
	const { currentUser, updateUserPreferences } = React.useContext(CurrentUserContext);

	const Preference = ({ property, description }) => {
		return (
			<div className={style.Preference} data-disabled={currentUser.user.preferences[property] ? 0 : 1}>
				<p>{description}</p>
				<Checkbox
					slider
					checked={currentUser.user.preferences[property]}
					onChange={(e, d) => {
						updateUserPreferences({
							variables: {
								[property]: d.checked,
							},
						});
					}}
				/>
			</div>
		);
	};
	return (
		<Card title={'User Preferences'} brand>
			<div className={style.PreferencesWrapper}>
				{userPreferenceList.map((p) => {
					return <Preference property={p.property} description={p.description} />;
				})}
			</div>
		</Card>
	);
}

let userPreferenceList = [
	{
		property: 'showLabelsInTaskLinks',
		description: 'Show task labels in projects navigation',
	},
	{
		property: 'showLabelColorsInNav',
		description: 'Show label colors in task navigation',
	},
	{
		property: 'showDaysSinceTaskUpdate',
		description: 'Show days since task update in task navigation',
	},
];
