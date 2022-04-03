import React from 'react';
import { Link } from 'react-router-dom';

import ProjectLink from './projectLink/ProjectLink.jsx';

import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { ReorderItems } from './util';

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

	const handleSwap = React.useCallback(
		async (result) => {
			if (!result.destination) return;

			if (result.type === 'PROJECTS' && state) {
				let newOrder = await ReorderItems(state, result.source.index, result.destination.index);

				setState(newOrder);
				swapProjectPosition({
					variables: {
						projectId: result.draggableId,
						oldIndex: result.source.index,
						newIndex: result.destination.index,
						projectFolderId,
					},
				});
			}
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
								<DragDropContext onDragEnd={handleSwap}>
									<Droppable droppableId={`${currentUser.user.id}Projects`} type='PROJECTS'>
										{(provided, _) => (
											<div ref={provided.innerRef} className={style.ProjectsWrapper}>
												{state.map((project, index) => {
													return (
														<ProjectLink
															key={project.id}
															index={index}
															project={project}
															projectId={project.id}
															text={project.title}
														/>
													);
												})}
												{provided.placeholder}
											</div>
										)}
									</Droppable>
								</DragDropContext>
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
		[createProject, currentUser, errorCreatingProject, handleSwap, loadingCurrentUser, serverCreatingProject, state]
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
