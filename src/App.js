import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Routes from './routes';
import GlobalStyle from './styles/global';

import Header from './components/Header';

toast.configure();

function App() {
  return (
    <>
      <Header />
      <Routes />
      <GlobalStyle />
    </>
  );
}

export default App;
