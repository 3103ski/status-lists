import { Link } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { Icon } from '@iconify/react';
import style from './list.module.scss';

export default function List() {
	return <></>;
}

List.BlockContainer = ({ align = 'left', singleLine = null, children }) => {
	return (
		<div data-align={align} data-single-line={singleLine ? 1 : 0} className={style.BlockContainer}>
			{children}
		</div>
	);
};

List.Block = ({ text, i, size = 'small' }) => (
	<p key={`${text}__${i}`} className={style.Block} data-size={size}>
		{text}
	</p>
);

List.Empty = ({ message = null, minHeight = '350px', title, to, callback, children, icon = null }) => {
	const content = (
		<div
			className={style.EmptyBlock}
			onClick={callback ? callback : null}
			style={{ minHeight }}
			data-has-message={message ? 1 : 0}
			data-action-cursor={callback || to ? 1 : 0}>
			<div className={style.Top}>
				{icon ? <Icon icon={icon} /> : null}
				{title ? <h2>{title}</h2> : null}
			</div>
			<p>{message}</p>
			{children}
		</div>
	);

	return to ? <Link to={to}>{content}</Link> : content;
};

List.BoxCardContainer = ({ count = 4, children }) => {
	return (
		<Grid columns={count} relaxed doubling className={style.StatBoxes}>
			{children}
		</Grid>
	);
};

List.BoxCard = ({ title = 'SpecialText', text = 'million%', yPadding = 30 }) => {
	return (
		<Grid.Column
			className={style.BoxColumn}
			style={{ paddingTop: `${yPadding}px`, paddingBottom: `${yPadding}px ` }}>
			<div className={style.Box}>
				<p>{title}</p>
				<p>{text}</p>
			</div>
		</Grid.Column>
	);
};
