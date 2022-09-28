const { useState } = require('react');
const React = require('react');
const { Box, Text, Newline } = require('ink');
const { default: SelectInput } = require('ink-select-input');
const { default: Markdown } = require('ink-markdown');
const { ScreeOptions } = require('../constants');
const { writeUserInfo } = require('../utils');

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
    setAnswerState(1);
    if (item.value === question.answer) {
      writeUserInfo({
        ...userInfo,

        correctlyAnswered: [...userInfo.correctlyAnswered, question.id],
      })
        .then(data => {
          setIsCorrect(true);
          setUserInfo(data);
        })
        .catch(err => console.log(err));
    } else {
      writeUserInfo({
        ...userInfo,

        incorrectlyAnswered: [...userInfo.incorrectlyAnswered, question.id],
      })
        .then(data => {
          setIsCorrect(false);
          setUserInfo(data);
        })
        .catch(err => console.log(err));
    }
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Text>
        {question.id}. {question.title}
        <Newline />
      </Text>
      {question.question ? (
        <Box borderStyle="singleDouble" borderColor="yellow">
          <Markdown code="green">{question.question}</Markdown>
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
                writeUserInfo({
                  ...userInfo,
                  questionIndex: (userInfo.questionIndex || 0) + 1,
                })
                  .then(user => {
                    setUserInfo(user);
                    setQuestionIndex(user.questionIndex);
                    setAnswerState(0);
                  })
                  .catch(err => console.log(err));
              } else {
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
