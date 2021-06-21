import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { withRouter, useHistory } from 'react-router-dom';

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

const CreateGame = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const handleCreateGame = (e) => {
    e.preventDefault();
    let room_name = e.target.room_name.value;
    let winPhrase = e.target.win_phrase.value;

    fetch(`${process.env.REACT_APP_.BASE_URL}/create_game/`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://uno-back-end.herokuapp.com'
      },
      method: 'POST',
      body: JSON.stringify({
        name: room_name,
        host_id: props.player.id
      })
    }).then(res => res.json())
    .then(res => console.log(res))

    props.setWinPhrase(winPhrase);
    history.push(`/${e.target.room_name.value}`);
  }

  return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Create Game
            </Typography>
            <form className={classes.form} noValidate onSubmit={handleCreateGame}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="room_name"
                label="Room Name"
                id="room_name"
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="win_phrase"
                label="Winning Phrase"
                id="win_phrase"
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
        </Container>
  );
}

export default withRouter(CreateGame);
