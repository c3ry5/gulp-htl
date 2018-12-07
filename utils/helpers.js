module.exports = {
	replaceAll(text, regex, replace) {
		if (regex.test(text)) {
			return replaceAll(text.replace(regex, replace), regex, replace);
		}
		return text;
	}
};