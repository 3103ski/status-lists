import React from 'react';
import { Icon } from '@iconify/react';

import { Modal as SemanticModal } from 'semantic-ui-react';
import { ICONIFY_CLOSE } from '../../../../icons';

import * as style from './modal.module.scss';

// Some modal styling is globally set in the app.module.scss file.
// Modules will not override semantic UI's stylings for certain properties.

export function Modal({ children, toggle, bgClosesModal = true, open, replaceToggleCallback, ...rest }) {
	return (
		<SemanticModal
			open={open}
			dimmer='blurring'
			onClose={
				bgClosesModal === false
					? () => null
					: replaceToggleCallback
					? () => replaceToggleCallback()
					: () => toggle(false)
			}
			size={'large'}
			basic
			centered
			style={{ backgroundColor: 'rgba(255, 255, 255, 0.4) !important' }}
			{...rest}>
			<SemanticModal.Content scrolling className={style.ChildrenWrapper}>
				<div className={style.IconWrapper}>
					<Icon icon={ICONIFY_CLOSE} onClick={() => toggle(false)} />
				</div>
				{children}
			</SemanticModal.Content>
		</SemanticModal>
	);
}
