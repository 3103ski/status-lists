import React from 'react';
import { Popup } from 'semantic-ui-react';
import { Icon } from '@iconify/react';
import { Button, Modal, Card } from '../../../../components/';
import * as style from './learnMoreModal.module.scss';

export function LearnMoreModal({
	information,
	popup = true,
	popupText = 'Learn More',
	text = null,
	icon = 'eva:question-mark-circle-outline',
}) {
	const [open, setOpen] = React.useState(false);

	let modalTriggerTemplate = (
		<div className={style.TriggerWrapper}>
			<Icon icon={icon} />
			{text ? <p>{text}</p> : null}
		</div>
	);
	let popupTemplate = <Popup content={popupText} position='bottom right' trigger={modalTriggerTemplate} />;
	return (
		<Modal
			open={open}
			toggle={setOpen}
			trigger={
				<div className={style.TriggerWrapper} onClick={() => setOpen(true)}>
					{popup ? popupTemplate : modalTriggerTemplate}
				</div>
			}>
			<Card>
				<p className={style.Information}>{information}</p>
				<Button btnColor='confirm' onClick={() => setOpen(false)}>
					Got It!
				</Button>
			</Card>
		</Modal>
	);
}
