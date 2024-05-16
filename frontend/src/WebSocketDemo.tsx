import { Button, Card, TextField, Typography } from '@mui/material';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';

export const WebSocketDemo = () => {
  const [value, setValue] = useState('');
  const [userId, setUserId] = useState('');
  const [newMsg, setNewMsg] = useState(false);
  const [response, setResponse] = useState<Record<string, string>[]>([{ user: '', data: '' }]);

  const ws = useRef<WebSocket | null>(null);
  const userIdRef = useRef<HTMLInputElement>();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSubmitUserId = () => {
    if (userIdRef && userIdRef.current) {
      setUserId(userIdRef.current.value);
    }
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
    if (!ws.current || !userId) return;

    const apiCall = { user: userId, data: value };

    if (ws.current) {
      ws.current.onopen = () => {
        if (apiCall.data && ws.current) {
          ws.current.send(JSON.stringify(apiCall));
        }
      };
      ws.current.onopen(event as Event);
      setValue('');
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
      {!userId ? (
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
            label='Enter user id'
            css={css`
              background-color: white;
              width: 50%;
              margin: 1em;
            `}
            inputRef={userIdRef && userIdRef}
            autoFocus
            autoComplete='off'
          />
          <Button variant='contained' onClick={handleSubmitUserId}>
            Submit
          </Button>
        </div>
      ) : (
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
              label='Send a message...'
              css={css`
                background-color: white;
                width: 50%;
                margin: 1em;
              `}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setNewMsg((prev) => !prev);
                }
              }}
              value={value}
              autoFocus
              autoComplete='off'
            />
            <Button
              variant='contained'
              onClick={() => setNewMsg((prev) => !prev)}
              disabled={!userId || !value}
            >
              Send
            </Button>
          </div>
        </div>
      )}
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
                  key={msg.data}
                  css={
                    msg.user === userId
                      ? css`
                          display: flex;
                          flex-direction: column;
                          height: 100%;
                          justify-content: flex-start;
                          align-items: start;
                        `
                      : css`
                          display: flex;
                          flex-direction: column;
                          height: 100%;
                          justify-content: flex-start;
                          align-items: end;
                        `
                  }
                >
                  <Typography
                    css={css`
                      padding-bottom: 0.25em;
                      padding-left: 0.5em;
                      padding-right: 0.5em;
                      width: fit-content;
                    `}
                    variant='caption'
                  >
                    {msg.user === userId ? 'You' : msg.user}
                  </Typography>
                  <span
                    css={
                      msg.user === userId
                        ? css`
                            color: white;
                            background-color: steelblue;
                            border: solid black 1px;
                            border-radius: 10%;
                            width: fit-content;
                            padding: 0.25em 1em;
                            margin-bottom: 0.5em;
                          `
                        : css`
                            color: white;
                            background-color: green;
                            border: solid black 1px;
                            border-radius: 10%;
                            width: fit-content;
                            padding: 0.25em 1em;
                          `
                    }
                  >
                    <Typography variant='body1' key={`${msg.data}`}>{`${msg.data}`}</Typography>
                  </span>
                </div>
              );
          })}
        </div>
      )}
    </Card>
  );
};
