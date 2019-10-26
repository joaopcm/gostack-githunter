import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  html, body, div#root {
    min-height: 100%;
  }

  body {
    background: #e6e6e6;
    -webkit-font-smoothing: antialiased !important;
  }

  body, input, select, button {
    color: #222;
    font-size: 14px;
    font-family: Arial, Helvetica, sans-serif;
  }

  button {
    cursor: pointer;
  }

  .Toastify__toast {
    border-radius: 4px;
  }
`;
