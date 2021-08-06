import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const QuizPage = (props) => {
  const [quiz, setQuiz] = useState([]);
  const [category, setCategory] = useState('9');
  const [difficulty, setDifficulty] = useState('easy');
  const [message, setMessage] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [display, setDisplay] = useState(0);
  const [user, setUser] = useState('');
  const [id, setId] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  let fetchData = async () => {
    const response = await axios.get('/api/user');
    setUser(response.data.name);
    setId(response.data.id);
    setDataLoaded(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (user === 'Guest') {
      setDisplay(3);
    }
  }, [dataLoaded]); //authentication useeffect. If you're not logged in, naff off

  let zeroes = [];
  for (let i = 0; i < 10; i++) {
    zeroes.push(0);
  }

  const [score, setScore] = useState([...zeroes]);
  const [isAnswered, setIsAnswered] = useState([...zeroes]);

  const apiURL = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple&encode=url3986`;

  const apiCall = async (url) => {
    const call = await axios.get(url);
    const unshuffled = call.data.results;
    const shuffled = unshuffled.map((q) => {
      let qArray = [q.correct_answer, ...q.incorrect_answers];
      qArray = qArray.map((q) => {
        return decodeURIComponent(q);
      });
      shuffleArray(qArray);
      q.answers = qArray;
      q.question = decodeURIComponent(q.question);
      return q;
    });
    setQuiz(shuffled);
  };

  const diffHandler = (event) => {
    event.preventDefault();
    let value = event.target.value;
    setDifficulty(value);
  };

  const quizHandler = (event) => {
    event.preventDefault();
    apiCall(apiURL);
    setIsActive(true);
    setDisplay(1);
  };

  // This is the category tracker / state handler
  const catHandler = (event) => {
    event.preventDefault();
    let value = event.target.value;
    setCategory(value);
  };

  const answerHandler = (event, answer, ref) => {
    let newScore = score;
    let answered = isAnswered;
    answered[ref] = 1;
    setIsAnswered(answered);
    if (quiz[ref].correct_answer == answer) {
      newScore[ref] = 1;
    } else {
      newScore[ref] = 0;
    }
    setScore(newScore);
  };
  const reducer = (accumulator, item) => {
    return accumulator + item;
  };

  const scoreHandler = async (event) => {
    let totalAnswered = isAnswered.reduce(reducer, 0);
    if (totalAnswered === 10) {
      setIsActive(false);
      let totalScore = score.reduce(reducer, 0);
      const body = {
        score: totalScore,
        time: seconds,
        difficulty: difficulty,
        category: category,
        user: id,
      };
      props.dataHandler(body);
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.post('/api/score', body, config);
      setDisplay(2);
    } else
      setMessage(
        `Please answer all questions before submitting. You have ${
          10 - totalAnswered
        } questions unanswered`
      );
  };

  let displays = [
    <Selection
      diffHandler={diffHandler}
      catHandler={catHandler}
      quizHandler={quizHandler}
    />,
    <Questions
      quiz={quiz}
      answerHandler={answerHandler}
      scoreHandler={scoreHandler}
      seconds={seconds}
      setSeconds={setSeconds}
      isActive={isActive}
      setIsActive={setIsActive}
    />,
    <Score time={seconds} score={score.reduce(reducer, 0)} user={user} />,
    <div className="subtitle">
      Please login before taking a quiz
      <br />
      <Link className="link" to="/login">
        <button className="button">Login</button>
      </Link>
    </div>,
  ];

  return (
    // quiz display

    <div>
      {displays[display]}
      <div className="message">{message}</div>
    </div>
  );
};

const Selection = (props) => {
  return (
    <div>
      <div className="subtitle">Select your quiz</div>
      <form>
        <div className="subheading">Select your difficulty</div>
        {/* The hander is passed to here and triggered "onChange" */}
        <select onChange={props.diffHandler} className="selector selectDiff">
          <option name="difficulty" value={'easy'}>
            Easy
          </option>
          <option name="difficulty" value={'medium'}>
            Medium
          </option>
          <option name="difficulty" value={'hard'}>
            Hard
          </option>
        </select>
        <div className="subheading">Select your category</div>
        {/* As above, the handler is passed to here and triggered "onChange" */}
        <select onChange={props.catHandler} className="selector selectCat">
          <option value={'9'} name="category">
            General Knowledge
          </option>
          <option value={'10'} name="category">
            Entertainment: Books
          </option>
          <option value={'11'} name="category">
            Entertainment: Film
          </option>
          <option value={'12'} name="category">
            Entertainment: Music
          </option>
          <option value={'13'} name="category">
            Entertainment: Musicals & Theatres
          </option>
          <option value={'14'} name="category">
            Entertainment: Television
          </option>
          <option value={'15'} name="category">
            Entertainment: Video Games
          </option>
          <option value={'16'} name="category">
            Entertainment: Board Games
          </option>
          <option value={'17'} name="category">
            Science & Nature
          </option>
          <option value={'18'} name="category">
            Science: Computers
          </option>
          <option value={'19'} name="category">
            Science: Mathematics
          </option>
          <option value={'20'} name="category">
            Mythology
          </option>
          <option value={'21'} name="category">
            Sports
          </option>
          <option value={'22'} name="category">
            Geography
          </option>
          <option value={'23'} name="category">
            History
          </option>
          <option value={'24'} name="category">
            Politics
          </option>
          <option value={'25'} name="category">
            Art
          </option>
          <option value={'26'} name="category">
            Celebrities
          </option>
          <option value={'27'} name="category">
            Animals
          </option>
          <option value={'28'} name="category">
            Vehicles
          </option>
          <option value={'29'} name="category">
            Entertainment: Comics
          </option>
          <option value={'30'} name="category">
            Science: Gadgets
          </option>
          <option value={'31'} name="category">
            Entertainment: Japanese Anime & Manga
          </option>
          <option value={'32'} name="category">
            Entertainment: Cartoon & Animations
          </option>
        </select>
        <br />
        <br />
        <div>
          <button id="submit" className="button" onClick={props.quizHandler}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

const Questions = (props) => {
  if (props.quiz[1]) {
    const questions = props.quiz.map((q, i) => {
      return (
        // <div>Found something{i}</div>
        <QuizCard
          question={q.question}
          correct_answer={q.correct_answer}
          answers={q.answers}
          number={i}
          key={i}
          answerHandler={props.answerHandler}
        />
      );
    });
    return (
      <div className="quizPage">
        <div className="quizContainer">{questions}</div>
        <button
          id="submitAnswers"
          className="button"
          onClick={props.scoreHandler}
        >
          Submit
        </button>
        <Timer
          seconds={props.seconds}
          setSeconds={props.setSeconds}
          isActive={props.isActive}
          setIsActive={props.setIsActive}
        />
      </div>
    );
  } else {
    return <div className="loadingMessage">.</div>;
  }
};

const QuizCard = (props) => {
  if (props.question) {
    // checks there is an array
    return (
      <div className="quizCard" name={props.number}>
        <div className="question" name={props.number}>
          {props.question}
        </div>
        <div className="answerListContainer">
          <AnswerList
            qNumber={props.number}
            answers={props.answers}
            answerHandler={props.answerHandler}
          />
        </div>
        <br />
      </div>
    );
  } else {
    return <div>.</div>;
  }
};

const AnswerList = (props) => {
  //format for questions for the answer
  let i = 0;
  const answers = props.answers.map((answer) => {
    i++;
    return (
      <Answer
        number={props.qNumber}
        answer={answer}
        key={i}
        answerHandler={props.answerHandler}
      />
    );
  });
  return answers;
};

const Answer = (props) => {
  // format for each radio button
  return (
    // returns laid out button

    <label className="answerContainer" htmlFor={props.answer}>
      <input
        type="radio"
        className="radioButton answer"
        name={props.number}
        id={props.answer}
        onClick={(e) => props.answerHandler(e, props.answer, props.number)}
      />
      {props.answer}
    </label>
  );
};

const Timer = (props) => {
  const isActive = props.isActive;
  const setIsActive = props.setIsActive;
  const seconds = props.seconds;
  const setSeconds = props.setSeconds;

  const toggle = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, seconds]);

  if (props.isActive) {
    return (
      <div className="timer">
        <div className="time">{props.seconds}s</div>
      </div>
    );
  } else {
    return null;
  }
};

const Score = (props) => {
  return (
    <div className="gzMessage">
      Nice one! You got {props.score} correct out of 10, in {props.time}s!
      <br />
      How does your score compare?
      <br />
      <Link to="/topscores">
        <button className="button">See the leaderboards</button>
      </Link>
    </div>
  );
};

const shuffleArray = (array) => {
  //Durstenfeld shuffle algorithm, credit https://stackoverflow.com/users/310500/laurens-holst
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export default QuizPage;
