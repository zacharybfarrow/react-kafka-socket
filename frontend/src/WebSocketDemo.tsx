import { Button, Card, TextField, Typography } from '@mui/material';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';

export const WebSocketDemo = () => {
  const [value, setValue] = useState<Record<string, string>>({ A: '', B: '' });
  const [sender, setSender] = useState('');
  const [newMsg, setNewMsg] = useState(false);
  const [response, setResponse] = useState<Record<string, string>[]>([{ user: '', data: '' }]);

  const ws = useRef<WebSocket | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = { ...value };
    newValue[e.target.id] = e.target.value;
    setValue({ ...newValue });
    setSender(e.target.id);
  };

  useEffect(() => {
    ws.current = new WebSocket('ws://127.0.0.1:8000/ws');

    const wsCurrent = ws.current;

    ws.current.onmessage = (event) => {
      try {
        console.log(event);
        const responseData = JSON.parse(event.data);
        setResponse(responseData);
      } catch (err) {
        console.log(err);
      }
    };

    return () => {
      if (wsCurrent.readyState === 1) wsCurrent.close();
    };
  }, []);

  useEffect(() => {
    if (!ws.current) return;

    const apiCall = { user: sender, data: value[sender] };

    if (ws.current) {
      ws.current.onopen = () => {
        if (apiCall.data && ws.current) {
          ws.current.send(JSON.stringify(apiCall));
        }
      };
      ws.current.onopen(event as Event);
      setValue({ A: '', B: '' });
    }
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
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 70vw;
        `}
      >
        <div
          css={css`
            display: flex;
            flex-direction: row;
            width: 100%;
            align-items: center;
            justify-content: center;
          `}
        >
          <TextField
            label='Chat Message from User A'
            css={css`
              background-color: white;
              width: 50%;
              margin: 1em;
            `}
            onChange={handleChange}
            value={value.A}
            id='A'
          />
          <Button variant='contained' onClick={() => setNewMsg((prev) => !prev)}>
            Send from User A
          </Button>
        </div>
        <div
          css={css`
            display: flex;
            flex-direction: row;
            width: 100%;
            align-items: center;
            justify-content: center;
          `}
        >
          <TextField
            label='Chat Message from User B'
            css={css`
              background-color: white;
              width: 50%;
              margin: 1em;
            `}
            onChange={handleChange}
            value={value.B}
            id='B'
          />
          <Button variant='contained' onClick={() => setNewMsg((prev) => !prev)}>
            Send from User B
          </Button>
        </div>
      </div>
      {response && (
        <div
          css={css`
            width: 75%;
          `}
        >
          {response.map((msg) => {
            if (msg.user && msg.data)
              return (
                <div
                  css={
                    msg.user === 'A'
                      ? css`
                          display: flex;
                          flex-direction: row;
                          justify-content: flex-start;
                          color: blue;
                        `
                      : css`
                          display: flex;
                          flex-direction: row;
                          justify-content: flex-end;
                          color: green;
                        `
                  }
                >
                  <Typography
                    key={`${msg.user}-${msg.data}`}
                  >{`${msg.user}: ${msg.data}`}</Typography>
                </div>
              );
          })}
        </div>
      )}
    </Card>
  );
};
