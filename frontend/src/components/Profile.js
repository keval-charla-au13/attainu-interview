import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

const Profile = (props) => {
  const [user, setUser] = useState('');
  const [email, setEmail] = useState([]);
  const [password, setPassword] = useState([]);
  const [updatePassword, setUpdatePassword] = useState([]);
  const [display, setDisplay] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [originalArray, setOriginalArray] = useState([]);
  const [sortedArray, setSortedArray] = useState([]);

  const [messageUpdate, setMessageUpdate] = useState();
  let history = useHistory();

  let fetchData = async () => {
    const response = await axios.get('/api/user');
    setUser(response.data.name);
    setEmail(response.data.email);

    setDataLoaded(true);
  };

  let userScores = async () => {
    const res = await axios.get('userScores');
    let tempArr = res.data.scores;
    if (tempArr) {
      tempArr.sort((a, b) =>
        a.score < b.score
          ? 1
          : a.score === b.score
          ? a.time > b.time
            ? 1
            : -1
          : -1
      );
    }
    setSortedArray(tempArr);
    setOriginalArray(tempArr);
  };

  useEffect(() => {
    fetchData();
    userScores();
  }, []);

  useEffect(() => {
    if (user !== 'Guest') {
      setDisplay(1);
    } else {
      setDisplay(0);
    }
  }, [dataLoaded]);

  const loginHandler = () => {
    history.push('/login');
  };

  const deleteHandler = async () => {
    await axios.delete('/delete');
    history.push('/');
  };

  const updateHandler = async (event) => {
    event.preventDefault();

    const body = {
      userName: user,
      userEmail: email,
      userPassword: password,
      userUpdatePassword: updatePassword,
    };
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await axios.put('/update', body, config);
    setMessageUpdate(response.data.Message);

    setUser('');
    setEmail('');
    setPassword('');
    setUpdatePassword('');

    window.location.reload(true);
  };
  const viewHandler = () => {
    setDisplay(2);
  };

  const catHandler = (event) => {
    event.preventDefault();
    let value = event.target.value;
    if (value !== '0') {
      let newScore = [];
      originalArray.map((score) => {
        if (score.category === event.target.value) {
          newScore.push(score);
        }
        return score;
      });
      setSortedArray(newScore);
    } else if (value === '0') {
      setSortedArray(originalArray);
    }
  };

  const views = [
    // array of different views depending on authorisation
    <UserNotAuth
      title="Profile Page"
      guest="You need to login"
      loginHandler={loginHandler}
    />,
    <UserProfile
      title="Profile Page"
      user={user}
      email={email}
      deleteHandler={deleteHandler}
      viewHandler={viewHandler}
      sortedArray={sortedArray}
      data={props.data}
      messageUpdate={messageUpdate}
      catHandler={catHandler}
    />,
    <AccountUpdate
      updateHandler={updateHandler}
      setUser={setUser}
      user={user}
      email={email}
      setEmail={setEmail}
      setPassword={setPassword}
      setUpdatePassword={setUpdatePassword}
    />,
  ];

  return <div>{views[display]}</div>;
};

const UserProfile = (props) => {
  //user profile func component
  return (
    <div className="table-div">
      {props.messageUpdate}
      <div className="title">{props.title}</div>
      <div className="subtitle">{props.user}</div>
      <div className="subtitle">{props.email}</div>
      <div>
        <button className="button" onClick={props.deleteHandler}>
          Delete account
        </button>
        <Link to="/quiz">
          <button className="button">Start a quiz</button>
        </Link>

        <button className="button" onClick={props.viewHandler}>
          Update My Account
        </button>
      </div>
      <br />
      <select onChange={props.catHandler} className="selector selectCat">
        <option value={'0'} name="category">
          All Scores
        </option>
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
      <div className="top-score-list">
        <table className="table">
          <tr className="tableRow">
            <th className="tableHeader">Score</th>
            <th className="tableHeader">Name</th>
            <th className="tableHeader tableCat">Category</th>
            <th className="tableHeader tableDiff">Difficulty</th>
            <th className="tableHeader">Time</th>
          </tr>
          {props.sortedArray.slice(0, 10).map((item, index) => {
            return (
              <tr className="tableRow">
                <td className="tableData">{item.score}</td>
                <td className="tableData">{item.user.name}</td>
                <td className="tableData tableCat">{categorySorter(item.category)}</td>
                <td className="tableData tableDiff">{item.difficulty}</td>
                <td className="tableData">{item.time} secs</td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  );
};

const UserNotAuth = (props) => {
  //tells you to naff of if you're not logged in
  return (
    <div>
      <div className="title">{props.title}</div>
      <div className="subtitle">{props.guest}</div>
      <div>
        <button className="button" onClick={props.loginHandler}>
          Login Page
        </button>
      </div>
    </div>
  );
};

const AccountUpdate = (props) => {
  //updater functional component
  return (
    <div className="formContainer">
      <form onSubmit={props.updateHandler} className="form">
        <label className="label form">Name</label>
        <input
          className="input"
          type="text"
          value={props.user}
          onChange={(e) => props.setUser(e.target.value)}
        ></input>
        <br />
        <label>Email</label>
        <input
          className="input"
          type="email"
          value={props.email}
          onChange={(e) => props.setEmail(e.target.value)}
        ></input>
        <br />
        <input
          className="input"
          type="password"
          onChange={(e) => props.setPassword(e.target.value)}
          placeholder="password"
        ></input>
        <br />
        <label>Update or confirm password</label>
        <input
          className="input"
          type="password"
          onChange={(e) => props.setUpdatePassword(e.target.value)}
        ></input>
        <br />
        <button className="button" type="submit">
          update
        </button>
      </form>
    </div>
  );
};

const categorySorter = (category) => {
  //horrible switch/case to translate the category number into the relevant string for score display
  let cat;
  switch (category) {
    case '9':
      cat = 'General Knowledge';
      break;
    case '10':
      cat = 'Entertainment: Books';
      break;
    case '11':
      cat = 'Entertainment: Film';
      break;
    case '12':
      cat = 'Entertainment: Music';
      break;
    case '13':
      cat = 'Entertainment: Musicals & Theatres';
      break;
    case '14':
      cat = 'Entertainment: Television';
      break;
    case '15':
      cat = 'Entertainment: Video Games';
      break;
    case '16':
      cat = 'Entertainment: Board Games';
      break;
    case '17':
      cat = 'Science & Nature';
      break;
    case '18':
      cat = 'Science: Computers';
      break;
    case '19':
      cat = 'Science: Mathematics';
      break;
    case '20':
      cat = 'Mythology';
      break;
    case '21':
      cat = 'Sports';
      break;
    case '22':
      cat = 'Geography';
      break;
    case '23':
      cat = 'History';
      break;
    case '24':
      cat = 'Politics';
      break;
    case '25':
      cat = 'Art';
      break;
    case '26':
      cat = 'Celebrities';
      break;
    case '27':
      cat = 'Animals';
      break;
    case '28':
      cat = 'Vehicles';
      break;
    case '29':
      cat = 'Entertainment: Comics';
      break;
    case '30':
      cat = 'Science: Gadgets';
      break;
    case '31':
      cat = 'Entertainment: Japanese Anime & Manga';
      break;
    case '32':
      cat = 'Entertainment: Cartoon & Animations';
      break;

    default:
      cat = 'category not found';
  }
  return cat;
};

export default Profile;
