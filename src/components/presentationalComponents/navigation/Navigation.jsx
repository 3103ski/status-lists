import React from 'react';
import { Link } from 'react-router-dom';

import { CloudinaryImage, Modal, CreateProjectForm, Button, Loader } from '../../../components';
import { CurrentUserContext, DashboardContext, ProjectContext } from '../../../contexts';
import { LOGIN, DASHBOARD, OVERVIEW, PROJECT, USER_SETTINGS } from '../../../routes';

import * as style from './navigation.module.scss';

export default function Navigation() {
	const { logout } = React.useContext(CurrentUserContext);

	const {
		createProject,
		projects,
		loadingProjects,
		errorLoadingProjects,
		isCreatingProject,
		toggleIsCreatingProject,
		serverCreatingProject,
		errorCreatingProject,
	} = React.useContext(ProjectContext);

	return React.useMemo(
		() => (
			<nav className={style.MainWrapper}>
				<div className={style.MenuWrapper}>
					<RootLink text='Overview' to={`${DASHBOARD}${OVERVIEW}`} />
					{errorLoadingProjects || errorCreatingProject ? <p>Error</p> : null}
					{loadingProjects ? (
						<Loader loadingText='Getting Projects' />
					) : (
						projects.map((project) => {
							return (
								<ExpandProjectLink key={project.id} projectId={project.id} text={project.title}>
									{project.tasks.map((task) => (
										<ProjectLinkItem text={task.title} key={task.id} />
									))}
								</ExpandProjectLink>
							);
						})
					)}
					<div>
						<Button onClick={() => toggleIsCreatingProject(true)}>Create Project</Button>
					</div>
				</div>
				<div className={style.UserDrop}>
					<UserMenuTrigger>
						<UserMenuTriggerItem text={'Profile Settings'} to={`${DASHBOARD}${USER_SETTINGS}`} />
						<UserMenuTriggerItem text={'Logout'} onClick={logout} href={LOGIN} />
					</UserMenuTrigger>
				</div>
				<Modal open={isCreatingProject} toggle={toggleIsCreatingProject}>
					{serverCreatingProject ? (
						<Loader loadingText='Creating Project' />
					) : (
						<CreateProjectForm
							callback={(values) => {
								createProject(values);
							}}
						/>
					)}
				</Modal>
			</nav>
		),
		[
			createProject,
			errorCreatingProject,
			errorLoadingProjects,
			isCreatingProject,
			loadingProjects,
			logout,
			projects,
			serverCreatingProject,
			toggleIsCreatingProject,
		]
	);
}
const ExpandProjectLink = ({ text, projectId, children, ...rest }) => {
	const { focusProject } = React.useContext(DashboardContext);

	let outerId = `${text}_ExpandLink__outer`;
	let innerId = `${text}_ExpandLink__inner`;

	React.useEffect(() => {
		if (projectId) {
			let outerEl = document.getElementById(outerId);
			let innerEl = document.getElementById(innerId);

			if (outerEl && innerEl) {
				if (focusProject) {
					let innerElHeight = innerEl.getBoundingClientRect().height;
					if (outerEl.getBoundingClientRect().height === 0 && projectId === focusProject) {
						outerEl.style.padding = `5px 0px 5px 10px`;
						outerEl.style.height = `${innerElHeight}px`;
					} else {
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
