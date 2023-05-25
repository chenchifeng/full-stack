import React from 'react';
import './styles/global.css';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Body from "./components/Body";

function App() {
  return (
    <div className='App'>
      <div className='header-click'>
        <Header />
      </div>
      <Body />
      <Footer />
    </div>
  );
}

export default App;
