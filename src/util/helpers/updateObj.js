export default function updateObj(obj, newData) {
	return {
		...obj,
		...newData,
	};
}
