const fs = require('fs');
const { getQuestionsFromRepo } = require('./api');

const loadUserInfo = async () => {
  if (!fs.existsSync('user-info.json')) {
    const userInfo = {
      username: '',
      correctlyAnswered: [],
      incorrectlyAnswered: [],
      questionIndex: 0,
    };
    await fs.promises.writeFile('user-info.json', JSON.stringify(userInfo));
  }
  return JSON.parse(await fs.promises.readFile('user-info.json'));
};

const writeUserInfo = async userInfo => {
  await fs.promises.writeFile('user-info.json', JSON.stringify(userInfo));
  return await loadUserInfo();
};

const cleanup = s => s.trim().replace(/<i>(.*)<\/i>|<em>(.*)<\/em>/, '*$1*');

const getQuestions = async () => {
  try {
    const { data: rawContent } = await getQuestionsFromRepo();
    const questionStart = '###### 1.';
    const qs = rawContent.split(questionStart)[1];

    return questionStart
      .concat(qs)
      .split(/---/)
      .map(s => s && s.trim())
      .filter(s => !!s)
      .map(section => {
        try {
          const [, title, question, choices, answer, explanation] =
            section.match(
              /######\s*(.*?)\s*\n\s*(.*?)\s*((?:[-*]\s*[A-Z]: .*?)+)\s*<details>.*?#### .*?: ([A-Z])\n(.*?)<\/p>\s*<\/details>/ms,
            );

          return {
            id: cleanup(title).split('. ')[0],
            title: cleanup(title).split('. ')[1],
            question: cleanup(question),
            choices: choices.split('\n').map(s => {
              try {
                const [, choice, label] = s.match(
                  /^[-*]\s*([A-Z]):\s*(.+?)\s*$/,
                );
                return { choice, label: cleanup(label) };
              } catch (err) {
                console.log({ s });
                throw err;
              }
            }),
            answer: cleanup(answer),
            explanation: cleanup(explanation),
          };
        } catch (err) {
          console.log({ section });
          throw err;
        }
      });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  loadUserInfo,
  writeUserInfo,
  getQuestions,
};
