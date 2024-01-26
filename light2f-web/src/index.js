import React from 'react';
import prettier from 'prettier/esm/standalone.mjs'
import parserBabel from 'prettier/esm/parser-babel.mjs'
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

window.codeFormart = function (value) {
  return prettier.format(value, {
    parser: "babel",
    tabWidth: 4,
    semi: false,
    printWidth: 160,
    plugins: [parserBabel],
  })
}

const root = createRoot(document.getElementById('root'));
root.render(
  <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
