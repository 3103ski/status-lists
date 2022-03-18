export default function formatSeconds(seconds) {
	if (!isNaN(seconds)) {
		const min = Math.floor(seconds / 60);
		const sec = Math.round(seconds % 60);
		return `${sec % 60 === 0 ? Math.round(seconds / 60) : min}:${sec < 10 ? `0${sec}` : sec === 60 ? `00` : sec}`;
	} else {
		return '-:--';
	}
}
