import React from 'react';

import { Button, Modal, Card } from '../../../../components/';

import * as style from './confirmationModal.module.scss';

export function ConfirmationModal({
	isOpen,
	closeCallback,
	confirmCallback,
	title = 'Are you sure?',
	message = 'Clicking yes will do the thing',
}) {
	return (
		<Modal open={isOpen} toggle={closeCallback}>
			<Card title={title} brand>
				<div className={style.Wrapper}>
					<p>{message}</p>
					<div className={style.Buttons}>
						<Button
							fluid
							btnColor='confirm'
							data-margin-x='small'
							onClick={() => {
								confirmCallback();
							}}>
							Yes
						</Button>
						<Button fluid onClick={closeCallback} data-margin-x='small'>
							No
						</Button>
					</div>
				</div>
			</Card>
		</Modal>
	);
}
