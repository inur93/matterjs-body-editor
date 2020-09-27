import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Circle, Square, Triangle } from './icons/Icons';
import { Toolbox } from './Toolbox';

ReactDOM.render(
  <React.StrictMode>
    <div style={{ height: 20, border: "1px solid black" }}>
      <Square />
      <Triangle />
      <Circle />

    </div>
    <Toolbox />

    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
