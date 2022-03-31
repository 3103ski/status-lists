import React from 'react';

import * as style from './label.module.scss';
import { Icon } from '@iconify/react';
import { ConfirmationModal, Loader } from '../../../../components';
import { ProjectContext } from '../../../../contexts/';
import { ICONIFY_CLOSE } from '../../../../icons';

export default function Label({ label, placeholder = 'Label Preview', setFocusLabel, ...rest }) {
	const { deleteLabel, serverDeletingLabel } = React.useContext(ProjectContext);
	const [isDeleting, setIsDeleting] = React.useState(false);

	async function confirmDeleteLabel() {
		await setIsDeleting(false);
		await setFocusLabel(null);
		deleteLabel({ variables: { labelId: label.id } });
	}

	return (
		<div className={style.MainWrapper}>
			<div
				className={style.LabelWrapper}
				onClick={() => (setFocusLabel ? setFocusLabel(label) : null)}
				style={{ backgroundColor: label.color }}
				{...rest}>
				{serverDeletingLabel ? <Loader /> : <p>{label.label === '' ? placeholder : label.label}</p>}

				<ConfirmationModal
					isOpen={isDeleting}
					confirmCallback={confirmDeleteLabel}
					closeCallback={() => setIsDeleting(false)}
					title='Delete Label'
					message={
						'Are you sure you want to delete this label? It will remove it from all tasks you have assigned it to'
					}
				/>
			</div>
			{!setFocusLabel ? null : (
				<div className={style.DeleteButton} onClick={() => setIsDeleting(true)}>
					<Icon icon={ICONIFY_CLOSE} />
				</div>
			)}
		</div>
	);
}
