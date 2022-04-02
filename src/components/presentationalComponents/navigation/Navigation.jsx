import React from 'react';
import { Link } from 'react-router-dom';

import ProjectLink from './projectLink/ProjectLink.jsx';
import { SortableItem, swapArrayPositions } from 'react-sort-list';

import { CreateProjectForm, Loader } from '../../../components';
import { CurrentUserContext, ProjectContext } from '../../../contexts';
import { DASHBOARD, OVERVIEW } from '../../../routes';

import * as style from './navigation.module.scss';

export default function Navigation() {
	const { loadingCurrentUser, currentUser } = React.useContext(CurrentUserContext);

	const { createProject, serverCreatingProject, errorCreatingProject, swapProjectPosition } =
		React.useContext(ProjectContext);

	// Manage the swapping of projects in project list
	const [state, setState] = React.useState(null);
	const [projectFolderId, setProjectFolderId] = React.useState(null);

	React.useEffect(() => {
		if (!loadingCurrentUser && currentUser.user !== -1) {
			let projects = currentUser.user.projectFolder.projects.map((t) => ({ ...t }));
			setState(projects);

			if (!projectFolderId && currentUser.user.projectFolder !== -1) {
				setProjectFolderId(currentUser.user.projectFolder.id);
			}
		}
	}, [currentUser, loadingCurrentUser, projectFolderId]);

	const swap = React.useCallback(
		(oldIndex, newIndex, projectId) => {
			let swappedTodos = swapArrayPositions(state, oldIndex, newIndex);
			console.log({ swappedTodos });
			setState([...swappedTodos]);
			swapProjectPosition({
				variables: {
					projectId,
					oldIndex,
					newIndex,
					projectFolderId,
				},
			});
		},
		[projectFolderId, state, swapProjectPosition]
	);

	return React.useMemo(
		() =>
			!state ? null : (
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
									{state.map((project) => {
										return (
											<SortableItem
												items={state}
												id={`${project.id}`}
												key={project.id}
												swap={(oldIndex, newIndex) => swap(oldIndex, newIndex, project.id)}>
												<ProjectLink
													project={project}
													projectId={project.id}
													text={project.title}></ProjectLink>
											</SortableItem>
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
		[createProject, currentUser, errorCreatingProject, loadingCurrentUser, serverCreatingProject, state, swap]
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
