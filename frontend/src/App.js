import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Logout from './components/Logout';
import Home from './components/Home';
import QuizPage from './components/QuizPage';
import Topscores from './components/TopScores';
import Footer from './components/Footer';
import './App.css';
import Register from './components/Register';
import { Component } from 'react';
import Profile from './components/Profile';
import axios from 'axios';

//I changed this to a class component. It is just makes more sense to my brain
class App extends Component {
  //state lives here as blank strings
  state = {
    difficulty: 'easy',
    category: '9',
    data: {},
    name: 'Guest',
  };

  componentDidMount() {
    //when the page loads for the first time it sets the state to defaults easy and general knowledge - if you just write them in the state it hard codes them
    axios.get('/topscores').then((res) => {
      this.setState({
        data: res.data,
      });
    });
  }

  //This is the difficulty tracker / state handler
  diffHandler = (event) => {
    event.preventDefault();
    let value = event.target.value;
    this.setState({ difficulty: value });
  };

  //This is the category tracker / state handler
  catHandler = (event) => {
    event.preventDefault();
    let value = event.target.value;
    this.setState({ category: value });
  };

  dataHandler = (scoredata) => {
    let dataObj = this.state.data;
    let temp = [...this.state.data.scores];
    temp.push(scoredata);
    dataObj.scores = temp;
    this.setState({ data: dataObj });
  };

  nameHandler = (namedata) => {
    this.setState({ name: namedata });
  };

  //Have to use render as it is now a class component
  render() {
    return (
      <div className="appJSMain">
        <BrowserRouter>
          <Nav />
          <Switch>
            {/* In this setup you have to use this render property to pass props because it is a Route */}
            <Route
              exact
              path="/"
              render={(props) => (
                <Home
                  diffHandler={this.diffHandler}
                  catHandler={this.catHandler}
                  state={this.state}
                  category={this.state.category}
                  difficulty={this.state.difficulty}
                  data={this.state.data}
                />
              )}
            />
            <Route
              exact
              path="/profile"
              render={(props) => <Profile data={this.state.data.scores} />}
            />
            <Route
              exact
              path="/login"
              render={(props) => <Register nameHandler={this.nameHandler} />}
            />
            <Route exact path="/logout" component={Logout} />
            {/* <Route exact path="/register" component={Register} /> */}
            <Route
              exact
              path="/quiz"
              render={(props) => (
                <QuizPage
                  category={this.state.category}
                  difficulty={this.state.difficulty}
                  dataHandler={this.dataHandler}
                />
              )}
            />
            <Route
              exact
              path="/topscores"
              render={(props) => <Topscores data={this.state.data.scores} />}
            />
            {/* <Route
              exact
              path="/accountUpdate"
                render={(props) => (
                  <accountUpdate

                  />
                )}

             /> */}
          </Switch>
        </BrowserRouter>
        <div className="holder">
          <Footer />
        </div>
      </div>
    );
  }
}

export default App;
