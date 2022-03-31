import React from 'react';
import { Link } from 'react-router-dom';

import ProjectLink from './projectLink/ProjectLink.jsx';

import { CreateProjectForm, Loader } from '../../../components';
import { CurrentUserContext, ProjectContext } from '../../../contexts';
import { DASHBOARD, OVERVIEW } from '../../../routes';

import * as style from './navigation.module.scss';

export default function Navigation() {
	const { loadingCurrentUser, currentUser } = React.useContext(CurrentUserContext);
	console.log(currentUser);
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
			</nav>
		),
		[createProject, currentUser, errorCreatingProject, loadingCurrentUser, serverCreatingProject]
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
