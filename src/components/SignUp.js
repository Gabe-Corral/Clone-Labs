import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
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

const SignUp = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const onSubmit = (e) => {
    e.preventDefault()
    let nickname = e.target.nickname.value;
    let password = e.target.password.value;
    let confirm_password = e.target.password_con.value;

    if (password === confirm_password) {
      fetch(`${process.env.REACT_APP_.BASE_URL}/post_player/`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': props.getToken('csrftoken'),
        },
        method: 'POST',
        credentials: 'same-origin',
        body: JSON.stringify({
          nickname: nickname,
          password: password
        })
      }).then(res => res.json())
      .then(res => props.handleLogin(nickname, password, props.getToken('csrftoken')))
    }
    history.push('/')
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <form className={classes.form} noValidate onSubmit={onSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="nickname"
            label="Nickname"
            name="nickname"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password_con"
            label="Confirm Password"
            type="password"
            id="password_con"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default withRouter(SignUp);
