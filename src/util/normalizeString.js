const normalizeString = (string) => {
	if (string !== null) {
		return string
			.toString()
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '');
	}
	return '';
}

export default normalizeString;
