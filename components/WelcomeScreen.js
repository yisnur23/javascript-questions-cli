const React = require('react');
const importJsx = require('import-jsx');
const BigText = require('ink-big-text');
const { Box, Text, Newline, Color } = require('ink');
const Link = require('ink-link');
const { default: SelectInput } = require('ink-select-input');
const NamePrompt = importJsx('./NamePrompt');
const { ScreeOptions } = require('../constants');

const WelcomeScreen = ({ userInfo, setUserInfo, setPage, totalQuestions }) => {
  return (
    <Box flexDirection="column">
      <BigText text="Javascript Questions" font="chrome" colors={['#F0DB4F']} />
      <Box>
        <Text>
          This Project uses questions from the&nbsp;
          <Text color="green">
            <Link url="https://github.com/lydiahallie/javascript-questions/">
              javascript question repo&nbsp;
            </Link>
          </Text>
          &nbsp;by&nbsp;
          <Text color="green">
            <Link url="https://github.com/lydiahallie">lydiahallie</Link>
          </Text>
        </Text>
      </Box>
      <Box>
        {userInfo.username ? (
          <Box flexDirection="column">
            <Text>Name: {userInfo.username}</Text>
            <Text>Total Number of Questions: {totalQuestions}</Text>
            <Text>
              Go to:
              <Newline />
            </Text>

            <SelectInput
              items={[
                { label: 'Questions', value: ScreeOptions.Questions },
                { label: 'Stats', value: ScreeOptions.Stats },
                { label: 'quit', value: ScreeOptions.Quit },
              ]}
              onSelect={item => {
                if (item.value === ScreeOptions.Quit) process.exit(1);
                setPage(item.value);
              }}
            />
          </Box>
        ) : (
          <NamePrompt userInfo={userInfo} setUserInfo={setUserInfo} />
        )}
      </Box>
    </Box>
  );
};

module.exports = WelcomeScreen;
