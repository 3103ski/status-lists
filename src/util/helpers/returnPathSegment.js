import { slugToText } from '../helpers/';

export default function returnPathSegment(path, segment = 0, removeSymbols = false) {
	const text = path.split('/').filter((e) => e !== '/')[segment + 1];
	return removeSymbols ? slugToText(text) : text;
}
