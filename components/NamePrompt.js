const React = require("react");
const { Text, Newline } = require("ink");
const { useState } = require("react");
const { default: TextInput } = require("ink-text-input");
const { writeUserInfo } = require("../utils");

const NamePrompt = ({ userInfo, setUserInfo }) => {
	const [value, setValue] = useState("");
	const handleSubmit = () => {
		writeUserInfo({ ...userInfo, username: value })
			.then((data) => setUserInfo(data))
			.catch((err) => console.log(err));
	};

	return (
		<Text color="#F0DB4F">
			<Newline />
			Enter Your Name to get Started :
			<TextInput
				color="#F0DB4F"
				value={value}
				onChange={setValue}
				onSubmit={handleSubmit}
			/>
		</Text>
	);
};

module.exports = NamePrompt;
