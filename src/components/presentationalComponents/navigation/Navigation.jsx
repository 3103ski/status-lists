import React from 'react';
import { Link } from 'react-router-dom';

import ProjectLink from './projectLink/ProjectLink.jsx';

import { CloudinaryImage, CreateProjectForm, Loader } from '../../../components';
import { CurrentUserContext, ProjectContext } from '../../../contexts';
import { LOGIN, DASHBOARD, OVERVIEW } from '../../../routes';

import * as style from './navigation.module.scss';

export default function Navigation() {
	const { logout, loadingCurrentUser, currentUser } = React.useContext(CurrentUserContext);

	const { createProject, serverCreatingProject, errorCreatingProject } = React.useContext(ProjectContext);

	return React.useMemo(
		() => (
			<nav className={style.MainWrapper}>
				<div className={style.MenuWrapper}>
					<div className={style.MenuTop}>
						<RootLink text='Dashboard' to={`${DASHBOARD}${OVERVIEW}`} />
					</div>
					<div className={style.ProjectLinks}>
						{errorCreatingProject ? <p>Error</p> : null}
						{loadingCurrentUser || !currentUser || currentUser.user === -1 ? (
							<Loader loadingText='Getting Projects' />
						) : (
							<>
								{currentUser.user.projectFolder.projects.map((project) => {
									return (
										<ProjectLink
											key={project.id}
											project={project}
											projectId={project.id}
											text={project.title}></ProjectLink>
									);
								})}
							</>
						)}

						<CreateProjectForm
							loading={serverCreatingProject}
							callback={(values) => {
								createProject(values);
							}}
						/>
					</div>
				</div>
				<div className={style.UserDrop}>
					<UserMenuTrigger>
						<UserMenuTriggerItem text={'Logout'} onClick={logout} href={LOGIN} />
					</UserMenuTrigger>
				</div>
			</nav>
		),
		[createProject, currentUser, errorCreatingProject, loadingCurrentUser, logout, serverCreatingProject]
	);
}

const RootLink = ({ text, to, ...rest }) => {
	const { setFocusProject } = React.useContext(ProjectContext);
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
				<CloudinaryImage
					publicId={currentUser.user.info.avatar !== (null || '' || -1) ? currentUser.user.info.avatar : null}
				/>
				<p>{currentUser.user.email}</p>
			</div>
			<div className={style.TriggerMenuWrapper}>{children}</div>
		</div>
	);
};

const UserMenuTriggerItem = ({ text, to, href, ...rest }) => {
	const { setFocusProject, focusProject } = React.useContext(ProjectContext);

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
