import React from 'react';

import { Grid } from 'semantic-ui-react';

import { TaskLabel, CreateLabelForm, Card, UpdateTaskLabel, Button, Divider } from '../../../../components';
import { CurrentUserContext } from '../../../../contexts';

import * as style from './labelManager.module.scss';

export default function LabelManager() {
	const { currentUser, loadingCurrentUser } = React.useContext(CurrentUserContext);

	const [focusLabel, setFocusLabel] = React.useState(null);
	const [creatingNewLabel, setCreatingNewLabel] = React.useState(false);

	return React.useMemo(
		() =>
			loadingCurrentUser || !currentUser ? null : (
				<Card title={'Manage Labels'} brand>
					<Grid>
						<Grid.Row>
							<Grid.Column mobile={16} computer={16}>
								<h3 className={style.Title}>All Labels</h3>
								<Button
									onClick={() => {
										setFocusLabel(null);
										setCreatingNewLabel(true);
									}}>
									Create New Label
								</Button>
								<div className={style.LabelsWrapper}>
									{currentUser.user.labels.map((label) => (
										<TaskLabel
											setFocusLabel={setFocusLabel}
											deleteCallback={() => setFocusLabel(null)}
											label={label}
											onClick={() => setFocusLabel(label)}
										/>
									))}
								</div>
								{focusLabel || creatingNewLabel ? <Divider /> : null}
							</Grid.Column>

							<Grid.Column mobile={16} computer={16}>
								{focusLabel ? (
									<UpdateTaskLabel label={focusLabel} callback={() => setFocusLabel(null)} />
								) : creatingNewLabel ? (
									<CreateLabelForm callback={() => setCreatingNewLabel(false)} />
								) : null}
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Card>
			),
		[creatingNewLabel, currentUser, focusLabel, loadingCurrentUser]
	);
}
