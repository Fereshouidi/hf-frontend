"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import Sign_in from "../register/sign-in/signin";
import Login from "../register/login/login";
import AccountLess from "./banners/loginBanner/accountLess";
import './profile.css';
import { getPopularestFriends, getUserById } from '../../crud.mjs';
import { calcCreatedAt } from "../../calcTime";
import ProfilePeaple from "../profilePeaple/page";

const Profile = () => {
  // الحصول على بيانات المستخدم من localStorage
  let userData = null;
  try {
    userData = localStorage.getItem('userData') !== "undefined"
      ? JSON.parse(localStorage.getItem('userData')!)
      : null;
  } catch (err) {
    console.log(err);
  }

  // الصور الافتراضية
  const phoProfileLess = localStorage.getItem('phoProfileLess');
  const phoCoverLess = localStorage.getItem('phoCoverLess');

  // حالة قائمة الأصدقاء الشائعين
  const [popularestFriends, setPopularestFriends] = useState([]);

  // حالة لعرض تفاصيل الأشخاص
  const [profilePeapleVisible, setProfilePeapleVisible] = useState(false);

  // حالة صفحات التسجيل وتسجيل الدخول
  const [singInPage, setSingInPage] = useState(false);
  const [logIn, setLogIn] = useState(false);

  // حالة النقر على الصورة الشخصية
  const [phoProfileClicked, setPhoProfileClicked] = useState(false);

  // حالة لعرض البانر عند عدم وجود حساب
  const [accountLessBanner, setAccountLessBanner] = useState(false);

  // دالة جلب البيانات
  const fetchData = async () => {
    if (userData) {
      const refreshUser = await getUserById(userData._id);
      localStorage.setItem('userData', JSON.stringify(refreshUser));
      const users_ = await getPopularestFriends(userData._id);
      setPopularestFriends(users_);
    }
  };

  // تأثير الجلب عند تحميل الصفحة
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

      <div className="userInformation">
        <div className="userNameDiv">
          <h2 className="userName">{userData ? userData.userName : 'unknown'}</h2>
        </div>
        <p className="joined-at">
          <i className="fas fa-calendar-alt"></i>
          Joined {userData ? calcCreatedAt(userData.createdAt) : ''}
        </p>
        <div className="statistic">
          <p><span>{userData ? userData.friends.length : null}</span> friends</p>
          <p><span>{userData ? userData.likes.length : null}</span> likes</p>
        </div>
        <div className="followed-by">
          {popularestFriends.map((friend) => (
            <img
              key={friend._id}
              src={friend.phoProfile ? friend.phoProfile : phoProfileLess}
              onClick={() => {
                let list = [];
                list.push(friend);
                localStorage.setItem('userProfileClicked', JSON.stringify(list));
                localStorage.setItem("activePage", 'profilePeaple');
                setProfilePeapleVisible(true);
              }}
              alt="Friend"
            />
          ))}
        </div>
        <p className="bio">{userData && userData.discription ? userData.discription : ''}</p>
      </div>

      {/* banner: login & sign in */}
      <Sign_in setSingInPage={setSingInPage} singInPage={singInPage} loginPage={logIn} setLoginPage={setLogIn} />
      <Login setLoginPage={setLogIn} loginPage={logIn} setSingInPage={setSingInPage} singInPage={singInPage} />

      {/* photo clicked banner */}
      <div className={phoProfileClicked ? 'phoProfileClickedVisible' : 'phoProfileClickedVisibleInvisible'}>
        <i id='cancel' onClick={() => setPhoProfileClicked(false)} className="fas fa-times cancel"></i>
        <img className="phoProfileClicked" src={userData && userData.phoProfile ? userData.phoProfile : phoProfileLess} alt="Profile" />
      </div>

      {/* banner when no account exists */}
      <AccountLess
        visibility={accountLessBanner}
        setVisibility={setAccountLessBanner}
        text={'There is no active account!'}
        setLoginPage={setLogIn}
        handleSingInPage={() => setSingInPage(!singInPage)}
        setSingInPage={setSingInPage}
      />

      <ProfilePeaple
        visibility={profilePeapleVisible}
        setVisibility={setProfilePeapleVisible}
      />
    </div>
  );
};

export default Profile;

