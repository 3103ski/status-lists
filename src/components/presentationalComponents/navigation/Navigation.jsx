import React from 'react';

import { Link, useHistory, useLocation } from 'react-router-dom';

import { CloudinaryImage } from '../../../components';
import { CurrentUserContext, DashboardContext } from '../../../contexts';
import { LOGIN, DASHBOARD, OVERVIEW, PROJECT, USER_SETTINGS } from '../../../routes';

import * as style from './navigation.module.scss';

export default function Navigation({ match }) {
	const { logout } = React.useContext(CurrentUserContext);
	console.log('this', { match });

	return React.useMemo(
		() => (
			<nav className={style.MainWrapper}>
				<div className={style.MenuWrapper}>
					<RootLink text='Overview' to={`${DASHBOARD}${OVERVIEW}`} />
					<ExpandProjectLink text={'Some Project'} projectId={'23894cg293'}>
						<ProjectLinkItem text='Calvin Rising Singing' />
						<ProjectLinkItem text='Fail On Things' />
						<ProjectLinkItem text='Arrival Of SlamSonite' />
					</ExpandProjectLink>
					<ExpandProjectLink text={'Another Project'} projectId={'89qv3t59223jk4v'}>
						<ProjectLinkItem text='slam things along' />
						<ProjectLinkItem text='Bloo' />
					</ExpandProjectLink>
				</div>
				<div className={style.UserDrop}>
					<UserMenuTrigger>
						<UserMenuTriggerItem text={'Profile Settings'} to={`${DASHBOARD}${USER_SETTINGS}`} />
						<UserMenuTriggerItem text={'Logout'} onClick={logout} href={LOGIN} />
					</UserMenuTrigger>
				</div>
			</nav>
		),
		[logout]
	);
}
const ExpandProjectLink = ({ text, projectId, children, ...rest }) => {
	const { focusProject } = React.useContext(DashboardContext);

	let outerId = `${text}_ExpandLink__outer`;
	let innerId = `${text}_ExpandLink__inner`;

	// console.log({ history: useHistory(), location: useLocation(), focusProject });

	React.useEffect(() => {
		console.log(`I ${text} saw the change in ${projectId} and ${focusProject}`);
		if (projectId) {
			let outerEl = document.getElementById(outerId);
			let innerEl = document.getElementById(innerId);

			if (outerEl && innerEl) {
				if (focusProject) {
					let innerElHeight = innerEl.getBoundingClientRect().height;
					if (outerEl.getBoundingClientRect().height === 0 && projectId === focusProject) {
						console.log('it wanted to open');
						outerEl.style.padding = `5px 0px 5px 10px`;
						outerEl.style.height = `${innerElHeight}px`;
					} else {
						console.log(`${text} should be closed`);
						outerEl.style.padding = `0px 0px 0px 10px`;
						outerEl.style.height = '0px';
					}
				} else {
					outerEl.style.padding = `0px 0px 0px 10px`;
					outerEl.style.height = '0px';
				}
			}
		}
	}, [focusProject, innerId, outerId, projectId, text]);

	return React.useMemo(
		() => (
			<Link
				to={`${DASHBOARD}${PROJECT}/${projectId}`}
				className={style.ExpandLink}
				data-active={projectId === focusProject ? 1 : 0}
				{...rest}>
				<p>{text}</p>
				<div
					className={style.ExpandLinkChildren}
					id={`${text}_ExpandLink__outer`}
					style={{ height: '0px', padding: '0px 0px 0px 10px' }}>
					<div id={`${text}_ExpandLink__inner`}>{children}</div>
				</div>
			</Link>
		),
		[children, focusProject, projectId, rest, text]
	);
};

const ProjectLinkItem = ({ text, ...rest }) => {
	return (
		<div className={style.ProjectLinkItem} {...rest}>
			<p>{text}</p>
		</div>
	);
};

const RootLink = ({ text, to, ...rest }) => {
	const { setFocusProject } = React.useContext(DashboardContext);
	return (
		<Link to={to} onClick={() => setFocusProject(null)} className={style.RootLink} {...rest}>
			{text}
		</Link>
	);
};

const UserMenuTrigger = ({ children }) => {
	const { currentUser, loadingCurrentUser } = React.useContext(CurrentUserContext);

	return loadingCurrentUser || !currentUser ? null : (
		<div className={style.UserMenuTrigger}>
			<div className={style.Trigger}>
				<CloudinaryImage />
				<p>{currentUser.user.info.displayName}</p>
			</div>
			<div className={style.TriggerMenuWrapper}>{children}</div>
		</div>
	);
};

const UserMenuTriggerItem = ({ text, to, href, ...rest }) => {
	const { setFocusProject, focusProject } = React.useContext(DashboardContext);

	function handleOnClick() {
		if (focusProject) {
			setFocusProject(null);
		}
	}

	return href ? (
		<a className={style.UserMenuTriggerItem} href={href} onClick={handleOnClick} {...rest}>
			<p>{text}</p>
		</a>
	) : (
		<Link className={style.UserMenuTriggerItem} to={to} onClick={handleOnClick} {...rest}>
			<p>{text}</p>
		</Link>
	);
};
