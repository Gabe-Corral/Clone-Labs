import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
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

const JoinGame = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [gameType, setGameType] = useState('UNO');

  const handleGameChange = (e) => {
    e.preventDefault();
    setGameType(e.target.value);
  }

  const handleJoin = (e) => {
    e.preventDefault();
    let room_name = e.target.server_id.value;
    let winPhrase = e.target.win_phrase.value;
    props.setGameName(room_name);
    props.setWinPhrase(winPhrase);
    history.push(`/${gameType.toLowerCase()}/${room_name}`);
  }

  return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Join Game
            </Typography>
            <form className={classes.form} noValidate onSubmit={handleJoin}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="server_id"
                label="Room Name"
                id="server_id"
              />
              <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Game</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={gameType}
                  onChange={handleGameChange}
                >
                <MenuItem value="UNO">UNO</MenuItem>
                <MenuItem value="SCRIBBLE">SCRIBBLE</MenuItem>
                </Select>
              </FormControl>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="win_phrase"
                label="Winning Phrase"
                id="win_phrase"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Join
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="creategame" variant="body2">
                    Create Game
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/dashboard" variant="body2">
                    Profile
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
  );
}

export default withRouter(JoinGame);
