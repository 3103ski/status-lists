import React from 'react';

import { Popup, Dropdown } from 'semantic-ui-react';
import { Icon } from '@iconify/react';
import { Button } from '../../../components';

import style from './dropMenu.module.scss';

export default function DropMenu({
	position = 'bottom left',
	button = null,
	triggerMargin = '0px',
	btnColor = 'primary',
	on = 'click',
	text = null,
	icon = null,
	trigger: Trigger = null,
	children,
	size = 'normal',
}) {
	const [isOpen, setIsOpen] = React.useState(false);

	const toggleOpen = React.useCallback(() => {
		setIsOpen(!isOpen);
	}, [isOpen]);

	return React.useMemo(
		() => (
			<div
				className={style.TriggerWrapper}
				data-size={size}
				style={{ margin: triggerMargin }}
				data-is-button={button ? 1 : 0}
				data-is-text={text ? 1 : 0}>
				<Popup
					className={style.PopupComponent}
					on={on}
					open={isOpen}
					onClose={toggleOpen}
					onOpen={toggleOpen}
					position={position}
					content={<div className={style.MenuWrapper}>{children}</div>}
					trigger={
						Trigger ? (
							<Trigger />
						) : text && button ? (
							<Button btnColor={btnColor}>{text}</Button>
						) : text ? (
							<p className={style.TextTrigger}>{text}</p>
						) : (
							<Icon icon={icon ? icon : 'bi:three-dots'} />
						)
					}
				/>
			</div>
		),
		[Trigger, btnColor, button, children, icon, isOpen, on, position, size, text, toggleOpen, triggerMargin]
	);
}

DropMenu.ListItem = ({ text, onClick, divided = null, topDivided = null, children }) => {
	return (
		<div
			className={style.MenuListItem}
			onClick={onClick}
			data-divided={divided ? 1 : 0}
			data-top-divided={topDivided ? 1 : 0}>
			{children ? children : <p>{text}</p>}
		</div>
	);
};

DropMenu.SubMenu = ({ icon = 'angle right', direction = 'left', triggerText = 'Add "triggerText"', children }) => {
	return (
		<Dropdown item text={triggerText} className={style.SubMenuWrapper} icon={icon}>
			<Dropdown.Menu simple={'true'} className={style.SubMenuInner} direction={direction}>
				<div className={style.SubMenuInnerWrapper}>{children}</div>
			</Dropdown.Menu>
		</Dropdown>
	);
};

DropMenu.SubMenuItem = ({ onClick, text = 'add "text" prop', divided = null, topDivided = null, children }) => {
	return (
		<Dropdown.Item
			data-divided={divided ? 1 : 0}
			data-top-divided={topDivided ? 1 : 0}
			className={`${style.SubMenuItem}`}
			key={`${Math.random()}`}
			onClick={onClick}>
			{children ? children : text}
		</Dropdown.Item>
	);
};
