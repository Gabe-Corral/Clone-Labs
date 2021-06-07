import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import CreateGame from './components/CreateGame';
import JoinGame from './components/JoinGame';
import Game from './components/Game';
import './App.css';

class App extends React.Component {

  constructor() {
    super();

    this.state = {
      loggedInStatus: false,
      player: ''
    }

    this.handleLogin = this.handleLogin.bind(this);
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
    fetch("http://localhost:8000/authenticated/", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': this.getToken('csrftoken')
      },
      credentials: 'include'
    }).then(res => res.json())
    .then(res => {
      if (res !== "Error") {
        this.handleSuccessfulLogin(res)
      }
    })
  }

  componentDidMount() {
    this.fetchToken();
    this.checkLoginStatus();
  }

  fetchToken() {
    fetch("http://localhost:8000/cookie/", {
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
    fetch("http://localhost:8000/login/", {
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
  }

  render() {
    return (
      <Switch>
        <Route exact path="/">
          {this.state.loggedInStatus ? (
            <JoinGame  />
          ) : (
            <Login getToken={this.getToken} handleLogin={this.handleLogin} />
          )}
        </Route>
        <Route exact path="/signup">
          <SignUp getToken={this.getToken} handleLogin={this.handleLogin} />
        </Route>
        <Route exact path="/creategame">
          <CreateGame />
        </Route>
        <Route path="/:name">
          <Game player={this.state.player} />
        </Route>
      </Switch>
    );
  }
}

export default App
