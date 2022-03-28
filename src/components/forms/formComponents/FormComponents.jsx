import React from 'react';

import { Icon } from '@iconify/react';
import { ICONIFY_ENTER } from '../../../icons';
import { Dropdown as SUI_DD, Form, Input, TextArea as SUI_TA, Label, Message, Loader } from 'semantic-ui-react';
import { isNumber } from '../../../util/helpers';
import style from './shared.module.scss';
import './semanticUIOverride.scss';

export function TextInput({ name, value, onChange, border, ...rest }) {
	return (
		<Form.Field
			control={Input}
			className={style.TextInput}
			name={name}
			onChange={onChange}
			data-border={border}
			value={value}
			{...rest}
		/>
	);
}

export function InputWithEnterButton({
	name,
	value,
	onChange,
	iconDirection = 'left',
	border = null,
	loading,
	...rest
}) {
	React.useEffect(() => {
		console.log('input saw the change');
		console.log({ value });
	}, [value]);
	return (
		<div className={style.InputWithEnterButton} data-border={border ? 1 : 0}>
			{loading ? (
				<Loader active={true} />
			) : (
				<>
					<Form.Field
						control={Input}
						className={style.TextInput}
						name={name}
						onChange={onChange}
						value={value}
						data-border={'none'}
						{...rest}
					/>
					<button type='submit' className={style.EnterWrapper} data-icon-direction={iconDirection}>
						<Icon icon={ICONIFY_ENTER} />
					</button>
				</>
			)}
		</div>
	);
}

export function TextArea({ name, value, onChange, ...rest }) {
	return (
		<Form.Field
			control={SUI_TA}
			className={style.TextArea}
			name={name}
			onChange={onChange}
			value={value}
			{...rest}
		/>
	);
}

export function FileInput({ accept = '.wav, .mp3', onChange, ...rest }) {
	return (
		<Form.Field
			control={Input}
			type='file'
			accept={accept}
			onChange={onChange}
			className={style.FileInput}
			{...rest}
		/>
	);
}

export function FormTitle({ size = 'med', children }) {
	return (
		<h2 data-size={size} className={style.FormTitle}>
			{children}
		</h2>
	);
}

export function DropdownCollection({ multiple = true, ...rest }) {
	return (
		<Form.Field control={SUI_DD} fluid multiple={multiple} search selection {...rest} className={style.Dropdown} />
	);
}

export function Dropdown({ options, optionsFilterList = null, defaultValue, ...rest }) {
	let filterdOptions = !optionsFilterList
		? null
		: options.filter((option) => !optionsFilterList.includes(option.value) || defaultValue === option.value);
	return (
		<Form.Field
			control={SUI_DD}
			fluid
			selection
			defaultValue={defaultValue}
			{...rest}
			options={filterdOptions ? filterdOptions : options}
		/>
	);
}

export function DollarInput({ onChange, formHook = true, name, value, ...rest }) {
	function checkOnChange(e) {
		e.preventDefault();
		if (isNumber(e.target.value) === true || e.target.value === '' || e.target.value === null) {
			onChange(null, { set: { key: name, value: parseInt(e.target.value) } });
		}
	}
	return (
		<Form.Field
			control={Input}
			value={value === 0 || isNaN(value) ? '' : value}
			labelPosition='right'
			type='text'
			placeholder='Enter Amount'
			onChange={checkOnChange}
			name={name}
			{...rest}>
			<Label className={style.LabelLeft} basic>
				$
			</Label>
			<input />
			<Label className={style.LabelRight}>.00</Label>
		</Form.Field>
	);
}

export function LocalFormErrors({ errors, header = 'Missing Input Required', color = 'red' }) {
	return Object.values(errors).length > 0 ? (
		<Message header={header} list={Object.values(errors)} color={color} />
	) : null;
}
