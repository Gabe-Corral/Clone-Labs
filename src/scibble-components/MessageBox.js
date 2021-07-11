import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: '100%',
    height: '10%'
  },
  headBG: {
      backgroundColor: '#e0e0e0'
  },
  borderRight500: {
      borderRight: '1px solid #e0e0e0'
  },
  messageArea: {
    height: '22vh',
    overflowY: 'auto'
  }
});

const MessageBox = (props) => {
  const classes = useStyles();
  let [messages, setMessages] = useState([]);
  const [word, setWord] = useState('');

  const addMessage = useCallback((user, text) => {
    let key = messages.length + 1
    let newMessages = messages.slice();
    newMessages.push(
      <ListItem key={key.toString()}>
          <Grid container>
              <Grid item={true} xs={12}>
                  <ListItemText align="left" primary={text}></ListItemText>
              </Grid>
              <Grid item={true} xs={12}>
                  <ListItemText align="left" secondary={user}></ListItemText>
              </Grid>
          </Grid>
      </ListItem>
    )
    setMessages(newMessages);
  }, [messages])

  useEffect(() => {
    props.socket.on('message', ({user, text}) => {
      addMessage(user, text);
    })
  }, [props.socket, addMessage])

  const handleChange = (e) => {
    e.preventDefault();
    setWord(e.target.value);
  }

  const sendMessage = () => {
    props.socket.emit('sendMessage', {
      user: props.player,
      message: word
    })
    setWord('');
  }

  return (
    <div>
      <Grid container component={Paper} className={classes.chatSection}>
          <Grid item={true} xs={9}>
              <List className={classes.messageArea}>
                {messages}
              </List>
              <Divider />
              <Grid container style={{padding: '20px'}}>
                  <Grid item={true} xs={11}>
                      <TextField
                       id="outlined-basic-email"
                       label="Type Something"
                       onChange={handleChange}
                       value={word}
                       fullWidth />
                  </Grid>
                  <Grid item={true} xs={1} align="right">
                      <Fab color="primary" aria-label="add" onClick={sendMessage}><SendIcon /></Fab>
                  </Grid>
              </Grid>
          </Grid>
            <ol className="order-list">
            	{props.players.map((player, index) =>
                <li key={index}>
                  {player.name}
                </li>
              )}
          </ol>
      </Grid>
    </div>
  )
}

export default MessageBox;
