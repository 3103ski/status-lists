import { regex_FindSlashes, regex_FindDashes } from '../regex.js';

export default function slugToText(slug) {
	const returnString = slug.replace(regex_FindSlashes, ' ').replace(regex_FindDashes, ' ');
	return returnString[0] === ' ' ? returnString.slice(1) : returnString;
}
