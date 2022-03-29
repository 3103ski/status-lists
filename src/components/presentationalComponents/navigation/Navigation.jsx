import React from 'react';
import { Link } from 'react-router-dom';

import { Link as ScrollLink } from 'react-scroll';
import { Icon } from '@iconify/react';

import ProjectLink from './projectLink/ProjectLink.jsx';
import TaskLink from './projectLink/taskLink/TaskLink.jsx';

import { CloudinaryImage, CreateProjectForm, Loader } from '../../../components';
import { CurrentUserContext, ProjectContext } from '../../../contexts';
import { LOGIN, DASHBOARD, OVERVIEW, PROJECT } from '../../../routes';

import { ICONIFY_BELL_FILL, ICONIFY_BELL } from '../../../icons';

import * as style from './navigation.module.scss';

export default function Navigation() {
	const { logout, loadingCurrentUser, currentUser } = React.useContext(CurrentUserContext);

	const { createProject, serverCreatingProject, errorCreatingProject, focusProject } =
		React.useContext(ProjectContext);

	const scrollToTask = React.useCallback(
		async (task) => {
			if (task && focusProject) {
				const block = await document.getElementById(`task_block_${task.id}_${task.title}`);
				const project = await document.getElementById(`${focusProject}-wrapper`);
				const blockScrollHeight = await block.getBoundingClientRect();

				project.scrollTop = blockScrollHeight.y + 50;
			}
		},
		[focusProject]
	);

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
							currentUser.user.projectFolder.projects.map((project) => {
								return (
									<ProjectLink
										key={project.id}
										project={project}
										projectId={project.id}
										text={project.title}>
										{project.tasks.length === 0 ? (
											<p>No Tasks</p>
										) : (
											project.tasks.map((task) =>
												task.archived ? null : (
													<TaskLink
														onClick={
															task.isComplete ? () => null : () => scrollToTask(task)
														}
														task={task}
														key={task.id}
													/>
												)
											)
										)}
									</ProjectLink>
								);
							})
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
		[
			createProject,
			currentUser,
			errorCreatingProject,
			loadingCurrentUser,
			logout,
			scrollToTask,
			serverCreatingProject,
		]
	);
}
const ExpandProjectLink = ({ text, projectId, children, match, ...rest }) => {
	const { focusProject } = React.useContext(ProjectContext);

	let outerId = `${text}_ExpandLink__outer`;
	let innerId = `${text}_ExpandLink__inner`;

	React.useEffect(() => {
		if (projectId) {
			let outerEl = document.getElementById(outerId);
			let innerEl = document.getElementById(innerId);

			if (outerEl && innerEl) {
				if (focusProject) {
					let innerElHeight = innerEl.getBoundingClientRect().height;

					if (projectId === focusProject) {
						outerEl.style.padding = `0px 0px 0px 15px`;
						outerEl.style.marginBottom = `0px`;
						outerEl.style.height = `${innerElHeight}px`;
					} else {
						outerEl.style.padding = `0px 0px 0px 15px`;
						outerEl.style.marginBottom = `0px`;
						outerEl.style.height = '0px';
					}
				} else {
					outerEl.style.padding = `0px 0px 0px 15px`;
					outerEl.style.height = '0px';
				}
			}
		}
	}, [focusProject, innerId, outerId, projectId, text]);

	return React.useMemo(
		() => (
			<div className={style.ExpandLink} data-active={focusProject === projectId ? 1 : 0}>
				<Link
					to={`${DASHBOARD}${PROJECT}/${projectId}`}
					data-active={projectId === focusProject ? 1 : 0}
					{...rest}>
					<p className={style.Title}>{text}</p>
				</Link>
				<div
					className={style.ExpandLinkChildren}
					id={`${text}_ExpandLink__outer`}
					style={{ height: '0px', padding: '0px 0px 0px 10px' }}>
					<div id={`${text}_ExpandLink__inner`}>{children}</div>
				</div>
			</div>
		),
		[children, focusProject, projectId, rest, text]
	);
};

const ProjectLinkItem = ({ task, ...rest }) => {
	const { focusProject } = React.useContext(ProjectContext);
	return (
		<ScrollLink
			offset={-50}
			to={`task_block_${task.id}_${task.title}`}
			containerId={`${focusProject}-wrapper`}
			smooth={true}
			activeClass={style.Active}
			duration={300}>
			<div className={style.ProjectLinkItem} data-is-complete={task.isComplete ? 1 : 0} {...rest}>
				<Icon icon={task.attentionFlag ? ICONIFY_BELL_FILL : ICONIFY_BELL} />
				<p>{task.title}</p>
			</div>
		</ScrollLink>
	);
};

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
