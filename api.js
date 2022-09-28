const { default: axios } = require("axios");

const getQuestionsFromRepo = async () => {
	return await axios.get(
		"https://raw.githubusercontent.com/lydiahallie/javascript-questions/master/README.md"
	);
};

module.exports = {
	getQuestionsFromRepo,
};
