const { useState } = require('react');
const React = require('react');
const { Box, Text, Newline } = require('ink');
const { default: SelectInput } = require('ink-select-input');
const { default: Markdown } = require('ink-markdown');
const { ScreeOptions } = require('../constants');
const { writeUserInfo } = require('../utils');
const dedent = require('dedent');

const Question = ({
  question,
  userInfo,
  setUserInfo,
  setPage,
  setQuestionIndex,
}) => {
  const [answerState, setAnswerState] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelect = item => {
    let updatedUserInfo = {
      ...userInfo,
      questionIndex: (userInfo.questionIndex || 0) + 1,
    };
    let isAnswerCorrect = false;
    if (item.value === question.answer) {
      isAnswerCorrect = true;
      updatedUserInfo = {
        ...updatedUserInfo,
        correctlyAnswered: [...userInfo.correctlyAnswered, question.id],
      };
    } else {
      updatedUserInfo = {
        ...updatedUserInfo,
        incorrectlyAnswered: [...userInfo.incorrectlyAnswered, question.id],
      };
    }
    writeUserInfo(updatedUserInfo)
      .then(userInfo => {
        setUserInfo(userInfo);
        setIsCorrect(isAnswerCorrect);
        setAnswerState(1);
      })
      .catch(err => console.log(err));
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Text>
        {question.id}. {question.title}
        <Newline />
      </Text>
      {question.question ? (
        <Box
          borderStyle="single"
          alignItems="center"
          justifyContent="flex-start"
          borderColor="yellow"
        >
          <Markdown>{dedent(question.question)}</Markdown>
        </Box>
      ) : (
        <Text></Text>
      )}
      <Text>
        <Newline />
      </Text>
      <SelectInput
        items={question.choices.map(c => ({
          label: c.choice + '.' + c.label,
          value: c.choice,
        }))}
        isFocused={!answerState}
        onSelect={handleSelect}
      />
      {answerState ? (
        <Box flexDirection="column">
          <Text>
            <Newline />
            <Text inverse color={isCorrect ? 'green' : 'red'}>
              Your are {isCorrect ? 'correct ' : 'incorrect '}
              <Newline />
            </Text>
            Answer : {question.answer}
            <Newline />
          </Text>

          <Box
            padding={1}
            borderStyle="singleDouble"
            borderColor="yellow"
            flexDirection="column"
          >
            <Text>
              Explanation
              <Newline />
            </Text>
            <Markdown>{question.explanation}</Markdown>
          </Box>
          <Text>
            <Newline />
            Next Question ?
            <Newline />
          </Text>
          <SelectInput
            items={[
              { label: 'Yes', value: 1 },
              { label: 'No', value: 0 },
            ]}
            onSelect={item => {
              if (item.value) {
                setAnswerState(0);
                setQuestionIndex(userInfo.questionIndex);
              } else {
                setQuestionIndex(userInfo.questionIndex);
                setPage(ScreeOptions.Welcome);
              }
            }}
          />
        </Box>
      ) : (
        <Text></Text>
      )}
    </Box>
  );
};

module.exports = Question;
