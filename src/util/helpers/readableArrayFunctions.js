const arrayHasAtLeast = (array, min) => {
	if (Array.isArray(array)) {
		return array.length >= min;
	}
};

const arrayHasMoreThan = (array, min) => {
	if (Array.isArray(array)) {
		return array.length > min;
	}
};

const arrayIsEmpty = (array) => {
	return !arrayHasMoreThan(array, 0);
};

export { arrayHasAtLeast, arrayHasMoreThan, arrayIsEmpty };
