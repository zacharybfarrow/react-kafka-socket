import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Card } from '@mui/material';
import { css } from '@emotion/react';
import { WebSocketDemo } from './WebSocketDemo';

function App() {
  return (
    <>
      <div>
        <a href='https://vitejs.dev' target='_blank'>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Websocket + Kafka Events</h1>
      <WebSocketDemo />
      <Card
        css={css`
          padding: 2em;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1em;
          margin: 1em;
        `}
      ></Card>
    </>
  );
}

export default App;
