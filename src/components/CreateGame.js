import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function onCreateGame(e) {
  e.preventDefault()
  let nickname = e.target.nickname.value;
  let room_name = e.target.room_name.value;
  createPlayer(nickname)
  createGame(room_name)
}

function createGame(game_name) {
  fetch("http://localhost:8000/create_game/", {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      name: game_name
    })
  }).then(res => res.json())
  .then(res => console.log(res))
}

function createPlayer(player_name) {
  fetch("http://localhost:8000/post_player/", {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      nickname: player_name
    })
  }).then(res => res.json())
  .then(res => console.log(res))
}

export default function CreateGame() {
  const classes = useStyles();

  return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Create Game
            </Typography>
            <form className={classes.form} noValidate onSubmit={onCreateGame}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="nickname"
                label="Your Nickname"
                name="nickname"
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="room_name"
                label="Room Name"
                id="room_name"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Private Game"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Create Game
              </Button>
            </form>
          </div>
          <Box mt={8}>
            <Copyright />
          </Box>
        </Container>
  );
}
