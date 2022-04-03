import React from 'react';
import { Link } from 'react-router-dom';

import { Checkbox } from 'semantic-ui-react';

import { CurrentUserContext, ProjectContext } from '../../../contexts';
import { CloudinaryImage, Modal, LabelManager } from '../../../components';

import { LOGIN } from '../../../routes';

import * as style from './userMenu.module.scss';

export default function UserMenu() {
	const { logout, loadingCurrentUser, currentUser, updateUserPreferences } = React.useContext(CurrentUserContext);

	const { updateVal, isManagingLabels } = React.useContext(ProjectContext);
	const [isUpdatingPreferences, setIsUpdatingPreferences] = React.useState(false);

	return loadingCurrentUser || !currentUser ? null : (
		<>
			<Menu>
				<MenuLink text={'Manage Labels'} onClick={() => updateVal('isManagingLabels', true)} />
				<MenuLink text={'Preferences'} onClick={() => setIsUpdatingPreferences(true)} />
				<MenuLink text={'Logout'} onClick={logout} href={LOGIN} />
			</Menu>
			<Modal
				dimmer={'inverted'}
				basic
				open={isManagingLabels}
				replaceToggleCallback={() => updateVal('isManagingLabels', false)}>
				<LabelManager />
			</Modal>
			<Modal dimmer={'inverted'} basic open={isUpdatingPreferences} toggle={setIsUpdatingPreferences}>
				<h1>Preferences</h1>
				<div>
					<p>Show label colors in navbar</p>
					<Checkbox
						slider
						checked={currentUser.user.preferences.showLabelColorsInNav}
						onChange={(e, d) => {
							console.log(d);
							updateUserPreferences({
								variables: {
									showLabelColorsInNav: d.checked,
								},
							});
							console.log(e);
						}}
					/>
					<p>Show label in navbar</p>
					<Checkbox
						slider
						checked={currentUser.user.preferences.showLabelsInTaskLinks}
						onChange={(e, d) => {
							console.log(d);
							updateUserPreferences({
								variables: {
									showLabelsInTaskLinks: d.checked,
								},
							});
							console.log(e);
						}}
					/>
				</div>
			</Modal>
		</>
	);
}

const Menu = ({ children }) => {
	const { currentUser, loadingCurrentUser } = React.useContext(CurrentUserContext);

	return loadingCurrentUser || !currentUser ? null : (
		<div className={style.Menu}>
			<div className={style.Trigger}>
				<CloudinaryImage
					publicId={currentUser.user.info.avatar !== (null || '' || -1) ? currentUser.user.info.avatar : null}
				/>
			</div>
			<div className={style.MenuWrapper}>{children}</div>
		</div>
	);
};

const MenuLink = ({ text, to, href, onClick, ...rest }) => {
	const { setFocusProject, focusProject } = React.useContext(ProjectContext);

	function handleOnClick() {
		if (focusProject) {
			setFocusProject(null);
		}
		if (onClick) {
			onClick();
		}
	}

	return href ? (
		<a className={style.MenuLink} href={href} onClick={handleOnClick} {...rest}>
			{text}
		</a>
	) : to ? (
		<Link className={style.MenuLink} to={to} onClick={handleOnClick} {...rest}>
			<p>{text}</p>
		</Link>
	) : (
		<a className={style.MenuLink} onClick={handleOnClick} {...rest}>
			{text}
		</a>
	);
};
