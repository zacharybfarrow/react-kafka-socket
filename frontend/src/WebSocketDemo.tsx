import { Button, Card, TextField, Typography } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { css } from '@emotion/react';

export const WebSocketDemo = () => {
  const [value, setValue] = useState<Record<string, string>>({ A: '', B: '' });
  const [sender, setSender] = useState('');
  const [newMsg, setNewMsg] = useState(false);
  const [response, setResponse] = useState<Record<string, string>[]>([{ user: '', data: '' }]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = { ...value };
    newValue[e.target.id] = e.target.value;
    setValue({ ...newValue });
    setSender(e.target.id);
  };

  useEffect(() => {
    const ws = new WebSocket('ws://127.0.0.1:8000/ws');

    const apiCall = { user: sender, data: value[sender] };
    ws.onopen = () => {
      if (apiCall.data) {
        ws.send(JSON.stringify(apiCall));
      }
    };

    ws.onmessage = (event) => {
      try {
        console.log(event);
        const responseData = JSON.parse(event.data);
        setResponse(responseData);
      } catch (err) {
        console.log(err);
      }
    };

    return () => {
      if (ws.readyState === 1) ws.close();
    };
  }, [newMsg]);

  return (
    <Card
      css={css`
        padding: 2em;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1em;
        margin: 1em;
      `}
    >
      <Typography variant='h5'>Websocket Chat Example</Typography>
      <div
        css={css`
          flex-direction: row;
        `}
      >
        <TextField
          label='User A'
          css={css`
            background-color: white;
            width: 50%;
          `}
          onChange={handleChange}
          value={value.A}
          id='A'
        />
        <Button onClick={() => setNewMsg((prev) => !prev)}>Send from User A</Button>
        <TextField
          label='User B'
          css={css`
            background-color: white;
            width: 50%;
          `}
          onChange={handleChange}
          value={value.B}
          id='B'
        />
        <Button onClick={() => setNewMsg((prev) => !prev)}>Send from User B</Button>
      </div>

      {response && (
        <Typography variant={'subtitle1'}>
          {response.map((msg) => {
            if (msg.user && msg.data)
              return (
                <Typography
                  key={`${msg.user}-${msg.data}`}
                >{`${msg.user}: ${msg.data}`}</Typography>
              );
          })}
        </Typography>
      )}
    </Card>
  );
};
