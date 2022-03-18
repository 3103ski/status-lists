import React from 'react';

import style from './showMoreContainer.module.scss';

export default function SeeMoreContainer({
	children,
	text = 'Show More',
	id = `showMore__${Math.random()}`,
	whiteBottom = null,
	maxHeight = 200,
}) {
	const [open, setOpen] = React.useState(false);
	const buttonId = `${id}_btn`;

	const toggleOpen = React.useCallback(async () => {
		// let button = document.getElementById(buttonId);
		let container = await document.getElementById(id);
		let contentHeight = await document.getElementById(`${id}_content-inner`).getBoundingClientRect().height;
		let height = `${maxHeight}px`;

		if (open === true) {
			container.style.height = height;
			setOpen(false);
		} else {
			height = `${contentHeight}px`;
			container.style.height = height;
			setOpen(true);
		}
	}, [id, maxHeight, open]);

	React.useEffect(() => {
		let contentHeight = document.getElementById(`${id}_content-inner`).getBoundingClientRect().height;
		let container = document.getElementById(id);
		let button = document.getElementById(buttonId);

		if (open === false) {
			if (contentHeight > maxHeight) {
				container.style.height = `${maxHeight}px`;
				button.style.display = 'block';
			} else {
				button.style.display = 'none';
				container.style.height = `${contentHeight}px`;
			}
		}
	}, [buttonId, id, maxHeight, open]);

	return React.useMemo(
		() => (
			<div className={style.Container} style={{ height: `${maxHeight}px` }} id={id} data-button={open ? 0 : 1}>
				<div className={style.Inner} id={`${id}_content-inner`}>
					{children}
				</div>
				<div
					className={style.ExpandButton}
					data-white={whiteBottom ? 1 : 0}
					onClick={toggleOpen}
					id={buttonId}
					style={{ display: 'none' }}>
					{open ? <p style={{ transform: 'translateY(10px)' }}>Hide</p> : <p>{text}</p>}
				</div>
			</div>
		),
		[maxHeight, id, open, children, whiteBottom, toggleOpen, buttonId, text]
	);
}
