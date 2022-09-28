const React = require('react');
const { Box, Text, Newline } = require('ink');
const { ScreeOptions } = require('../constants');
const { default: SelectInput } = require('ink-select-input');

const Stats = ({ userInfo, setPage }) => {
  return (
    <Box flexDirection="column" padding={1}>
      <Text color="#F0DB4F">
        User Name : {userInfo.username} <Newline />
      </Text>
      <Text color="green">
        Correctly Answered : {userInfo.correctlyAnswered.length}
      </Text>
      <Text color="red">
        Incorrectly Answered : {userInfo.incorrectlyAnswered.length}
      </Text>
      {/* <Text color="#F0DB4F">Total Question : {totalQn}</Text> */}
      <Text>
        <Newline />
      </Text>
      <SelectInput
        items={[{ label: 'Go Back To Menu', value: ScreeOptions.Welcome }]}
        onSelect={item => {
          setPage(item.value);
        }}
      />
    </Box>
  );
};

module.exports = Stats;
