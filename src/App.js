import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import CreateGame from './components/CreateGame';
import JoinGame from './components/JoinGame';
import UnoGame from './uno-components/UnoGame';
import ScibbleGame from './scibble-components/ScibbleGame';
import './App.css';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      loggedInStatus: false,
      player: '',
      winPhrase: '',
      gameName: ''
    }

    this.handleLogin = this.handleLogin.bind(this);
    this.setWinPhrase = this.setWinPhrase.bind(this);
    this.setGameName = this.setGameName.bind(this);
  }

  getToken(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }

  checkLoginStatus() {
    fetch(`${process.env.REACT_APP_.BASE_URL}/authenticated/`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': this.getToken('csrftoken'),
      },
      credentials: 'include'
    }).then(res => res.json())
    .then(res => {
      if (res !== "Error") {
        this.handleSuccessfulLogin(res)
      }
    }).catch(error => console.log(error))
  }

  componentDidMount() {
    this.fetchToken();
    this.checkLoginStatus();
  }

  fetchToken() {
    fetch(`${process.env.REACT_APP_.BASE_URL}/cookie/`, {
      credentials: 'include'
    })
  }

  handleSuccessfulLogin(player) {
    this.setState({
      loggedInStatus: true,
      player: player
    })
  }

  handleLogin(nickname, password, token) {
    fetch(`${process.env.REACT_APP_.BASE_URL}/login/`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': token
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        nickname: nickname,
        password: password
      })
    }).then(res => res.json())
    .then(res => this.handleSuccessfulLogin(res))
    .catch(error => console.log(error))
  }

  setWinPhrase(phrase) {
    this.setState({ winPhrase: phrase });
  }

  setGameName(name) {
    this.setState({ gameName: name });
  }

  render() {
    return (
      <Switch>
        <Route exact path="/">
          {this.state.loggedInStatus ? (
            <JoinGame
            setGameName={this.setGameName}
            setWinPhrase={this.setWinPhrase}
            />
          ) : (
            <Login
            getToken={this.getToken}
            handleLogin={this.handleLogin}
            />
          )}
        </Route>
        <Route exact path="/signup">
          <SignUp
          getToken={this.getToken}
          handleLogin={this.handleLogin}
          />
        </Route>
        <Route exact path="/creategame">
          <CreateGame
          player={this.state.player}
          setWinPhrase={this.setWinPhrase}
          setGameName={this.setGameName}
          getToken={this.getToken}
          />
        </Route>
        <Route path="/uno/:name">
          <UnoGame
          player={this.state.player}
          winPhrase={this.state.winPhrase}
          gameName={this.state.gameName}
          />
        </Route>
        <Route path="/scribble/:name">
          <ScibbleGame
          player={this.state.player}
          winPhrase={this.state.winPhrase}
          gameName={this.state.gameName}
          />
        </Route>
      </Switch>
    );
  }
}

export default App
