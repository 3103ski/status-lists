export const statusValidation = {
	text: { errorMsg: 'You must include a title', min: 1 },
};
export const taskValidation = {
	title: { errorMsg: 'You must include a title', min: 1 },
};

export const projectValidation = {
	title: { errorMsg: 'You must include a title', min: 1 },
};

export const labelValidation = {
	label: { errorMsg: 'Label text is required and can not be longer than 12 letters', max: 12, min: 1 },
};

export const userInfoRequirements = {
	displayName: { errorMsg: 'Display name can not be empty', min: 1 },
};
