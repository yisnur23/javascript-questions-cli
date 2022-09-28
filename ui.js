'use strict';
const React = require('react');
const importJsx = require('import-jsx');
const { useState, useEffect } = require('react');
const { loadUserInfo } = require('./utils');
const { Box, Text } = require('ink');
const { ScreeOptions } = require('./constants');
const { getQuestions } = require('./utils');
const Spinner = require('ink-spinner').default;
const WelcomeScreen = importJsx('./components/WelcomeScreen');
const Stats = importJsx('./components/Stats');
const Question = importJsx('./components/Question');

const App = () => {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(ScreeOptions.Welcome);
  const [questions, setQuestions] = useState();
  const [questionIndex, setQuestionIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    loadUserInfo()
      .then(user => {
        setUserInfo(user);
        setQuestionIndex(user.questionIndex);

        getQuestions().then(questions => {
          setLoading(false);
          setQuestions(questions);
        });
      })
      .catch(err => console.log(err));
  }, []);

  if (page === ScreeOptions.Welcome) {
    return (
      <Box padding={1}>
        {loading ? (
          <Text>
            <Spinner type="simpleDots" /> loading user info and questions
          </Text>
        ) : (
          <WelcomeScreen
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            setPage={setPage}
          />
        )}
      </Box>
    );
  } else if (page === ScreeOptions.Questions) {
    return questionIndex === questions.length ? (
      <Box padding={1} flexDirection="column">
        <Text>You have Completed all the avaliable questions.</Text>
        <Stats userInfo={userInfo} setPage={setPage} />
      </Box>
    ) : (
      <Question
        question={questions[questionIndex || 0]}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        setPage={setPage}
        setQuestionIndex={setQuestionIndex}
      />
    );
  } else if (page === ScreeOptions.Stats) {
    return <Stats userInfo={userInfo} setPage={setPage} />;
  }
};

module.exports = App;
