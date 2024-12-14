import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Main from './main';
import Titles from './titles';
import Middle from './middle';

function Source2() {
  return (
    <>
      <Main />
      <Middle/>
      <Titles />
    </>
  );
}

export default Source2;
