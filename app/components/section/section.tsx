'use client';
import React, { useState, useEffect } from 'react';
import Profile from '../../pages/profile/page';
import Setting from '../../pages/setting/page';
import People from '../../pages/people/page';
import Chats from '../../pages/chats/page';
import Search from '../../pages/search/page';
import './section.css';
import './section-media.css';
import Sign_in from '../../pages/register/sign-in/signin';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import ProfilePeaple from '../../pages/profilePeaple/page';

const pageComponents = {
  profile: Profile,
  people: People,
  chats: Chats,
  Sign_in: Sign_in,
  setting: Setting,
  search: Search,
  profilePeaple: ProfilePeaple
};

function Section({ activePage, setActivePage }) {
  const PageComponent = pageComponents[activePage? activePage:'chats'] || null;

  const [userFound, setUserFound] = useState([]);

  return (
    
      <div id="main-section">
      {PageComponent ? <PageComponent setActivePage={setActivePage} /> : <div>Page not found</div>}
      {/* <p>hooo</p> */}
    </div>



    
  );
}

export default Section;
