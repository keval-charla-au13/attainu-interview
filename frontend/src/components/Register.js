import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Register = (props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [display, setDisplay] = useState(false);
  let history = useHistory();

  const formHandler = async (event) => {
    event.preventDefault();

    const body = {
      userName: name,
      userEmail: email,
      userPassword: password,
      userPassword2: password2,
    };
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const backend = await axios.post('/register', body, config);

    setName('');
    setEmail('');
    setPassword('');
    setPassword2('');
  };

  const clickHandler = () => {
    setName('');
    setEmail('');
    setPassword('');
    setPassword2('');
    setDisplay(!display);
  };
  //  const clickLoginHandler = () => {
  //   history.push("/profile");
  //  }

  const formLoginHandler = async (event) => {
    event.preventDefault();

    const body = {
      userEmail: email,
      userPassword: password,
    };
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const loginSuccess = await axios.post('/login', body, config);
    props.nameHandler(loginSuccess.data.user);

    setName('');
    setEmail('');
    setPassword('');
    setPassword2('');

    history.push('/profile');
  };

  return (
    <div>
      {display ? (
        <RegisterDisplay
          formHandler={formHandler}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          password2={password2}
          setPassword2={setPassword2}
          clickHandler={clickHandler}
        />
      ) : (
        <LoginDisplay
          clickHandler={clickHandler}
          formLoginHandler={formLoginHandler}
          setEmail={setEmail}
          setPassword={setPassword}
        />
      )}
    </div>
  );
};

const RegisterDisplay = (props) => {
  return (
    <div>
      <div className="title">Register to start playing</div>
      <div className="formContainer">
        <form onSubmit={props.formHandler} className="form">
          <label className="label">User Name:</label>
          <input
            className="input"
            type="text"
            value={props.name}
            onChange={(e) => props.setName(e.target.value)}
          ></input>
          <br />

          <label className="label">Email:</label>
          <input
            className="input"
            type="email"
            name="userEmail"
            value={props.email}
            onChange={(e) => props.setEmail(e.target.value)}
          ></input>
          <br />

          <label className="label">Password:</label>
          <input
            className="input"
            type="password"
            name="userPassword"
            placeholder="password"
            value={props.password}
            onChange={(e) => props.setPassword(e.target.value)}
          ></input>
          <br />
          <label className="label">Confirm Password:</label>
          <input
            className="input passwords"
            type="password"
            name="userPassword2"
            placeholder="confirm password"
            value={props.password2}
            onChange={(e) => props.setPassword2(e.target.value)}
          ></input>
          <br />
          <button
            type="submit"
            className="button btn-login"
            // onClick={clickHandler}
          >
            Register
          </button>
          <button type="button" className="button" onClick={props.clickHandler}>
            Go To Login
          </button>
          <div className="App"></div>
        </form>
        {/* {backendMessage} */}
      </div>
    </div>
  );
};

const LoginDisplay = (props) => {
  return (
    <div>
      <div className="title-container">
        <div className="title">Login</div>
      </div>
      <div className="formContainer">
        <form onSubmit={props.formLoginHandler} className="form">
          <label className="label">Email:</label>
          <input
            className="input"
            type="email"
            name="userEmail"
            placeholder="email"
            onChange={(e) => props.setEmail(e.target.value)}
          ></input>
          <br />
          <label className="label">Password:</label>
          <input
            className="input"
            type="password"
            name="userPassword"
            placeholder="password"
            onChange={(e) => props.setPassword(e.target.value)}
          ></input>
          <br />
          <button className="button btn-login">Login</button>
          <br />
          <button
            className="button btn-login"
            type="button"
            onClick={props.clickHandler}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
