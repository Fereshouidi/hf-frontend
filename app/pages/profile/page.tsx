"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import Sign_in from "../register/sign-in/signin";
import Login from "../register/login/login";
import LoginBanner from './banners/loginBanner/loginBanner';
import AccountLess from "./banners/loginBanner/accountLess";
import './profile.css';
import { addUser, getAllUsers, getPopularestFriends, getUserById } from '../../crud.mjs';
import { calculateTime, calcCreatedAt } from "../../calcTime";
import ProfilePeaple from "../profilePeaple/page";

type PageProps = {
  setActivePage: (page: string) => void; // تخصيص نوع دالة `setActivePage`
};

const Profile: React.FC<PageProps> = ({ setActivePage }) => {
  const [popularestFriends, setPopularestFriends] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [profilePeapleVisible, setProfilePeapleVisible] = useState(false);
  const [singInPage, setSingInPage] = useState(false);
  const [logIn, setLogIn] = useState(false);
  const [phoProfileClicked, setPhoProfileClicked] = useState(false);
  const [accountLessBanner, setAccountLessBanner] = useState(false);

  let userData = null;
  try {
    userData = localStorage.getItem('userData') !== "undefined"
      ? JSON.parse(localStorage.getItem('userData'))
      : null;
  } catch (err) {
    console.log(err);
  }

  const phoProfileLess = localStorage.getItem('phoProfileLess');
  const phoCoverLess = localStorage.getItem('phoCoverLess');

  const fetchData = async () => {
    if (userData) {
      const refreshUser = await getUserById(userData._id);
      localStorage.setItem('userData', JSON.stringify(refreshUser));
      const users_ = await getPopularestFriends(userData._id);
      setPopularestFriends(users_);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="containerAll">
      <div className="div-photos">
        <img
          className="photo-cover"
          src={userData && userData.phoCover ? userData.phoCover : phoCoverLess}
          alt="Cover"
        />
        <img
          className="photo-profile"
          onClick={() => setPhoProfileClicked(!phoProfileClicked)}
          src={userData && userData.phoProfile ? userData.phoProfile : phoProfileLess}
          alt="Profile"
        />
      </div>
      
      {/* باقي الكود ... */}
    </div>
  );
}

export default Profile;

