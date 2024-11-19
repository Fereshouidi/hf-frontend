"use client";
import React, { useState, useEffect } from "react";
import Header from "../../../components/header/header";
import Section from "../../../components/section/section";
import './login.css';
import LoginBanner from '../../profile/banners/loginBanner/loginBanner';
import '../../../components/section/section-media.css';
import Link from "next/link";
import { useRef } from "react";
import { getUserBy_Email_Password } from '../../../crud.mjs';
import { useRouter } from "next/router";

type Sign_inParams = {
  loginPage: boolean;
  setLoginPage: React.Dispatch<React.SetStateAction<boolean>>;
  singInPage: boolean;
  setSingInPage: React.Dispatch<React.SetStateAction<boolean>>;
};

const Login: React.FC<Sign_inParams> = ({ loginPage, setLoginPage, singInPage, setSingInPage }) => {
  const router = useRouter();
  const [isUserDataExist, setIsUserDataExist] = useState(false);
  const [inputData, setInputData] = useState({ email: '', password: '' });
  const [banner, setBanner] = useState(false);
  const [bannerText, setBannerText] = useState('');
  const [passwordType, setPasswordType] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  let switchAccount = JSON.parse(localStorage.getItem('switchAccount') || '[]');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputData(prevInputs => ({ ...prevInputs, [name]: value }));
  };

  const logIn_buttonClicked = async () => {
    try {
      const userData = await getUserBy_Email_Password(inputData);
      localStorage.setItem('userData', JSON.stringify(userData));
      setIsUserDataExist(true);
      const userData_ = JSON.parse(localStorage.getItem('userData') || '{}');
      setBanner(true);
      setBannerText('login success!');

      if (isSaved) {
        const exist = switchAccount.some(account => account._id === userData_._id);
        if (!exist) {
          switchAccount.push(userData_);
          localStorage.setItem('switchAccount', JSON.stringify(switchAccount));
        }
      }

      localStorage.setItem("activePage", 'profile');
      router.push('/');
    } catch {
      setBanner(true);
      setBannerText('email or password is wrong!');
    }
  };

  const handlePasswordInput = () => {
    setPasswordType(!passwordType);
  };

  const handleSaveAccount = () => {
    setIsSaved(!isSaved);
  };

  return (
    <div id="login-page" className={loginPage ? 'login-page-active' : 'login-page-inactive'}>
      <div className="containerCart">
        <h2>Login</h2>
        <div className="input-container">
          <input name="email" onChange={handleInputChange} type="text" placeholder="user name ..." />
          <i className="fas fa-user"></i>
        </div>
        <div className="input-container">
          <input name="password" onChange={handleInputChange} type={passwordType ? 'password' : 'text'} placeholder="password ..." />
          <div className="password-i">
            <i onClick={handlePasswordInput} className={!passwordType ? 'fas fa-eye' : 'invisible'}></i>
            <i onClick={handlePasswordInput} className={passwordType ? 'fas fa-eye-slash' : 'invisible'}></i>
            <i className="fas fa-lock"></i>
          </div>
        </div>
        <div className="side-of-matter">
          <div className="checkbox">
            <input onClick={handleSaveAccount} type="checkbox" checked={isSaved} />
            <p>Remember me</p>
          </div>
          <p className="p">forget password</p>
        </div>
        <a onClick={logIn_buttonClicked} href="#" className="login-button">Login</a>
        <p className="switch">Don't have an account? 
          <span onClick={() => {
            setLoginPage(false);
            setSingInPage(true);
          }}>Sign in</span>
        </p>
        <LoginBanner visibility={banner} setVisibility={setBanner} text={bannerText} setLoginPage={setLoginPage} />
      </div>
    </div>
  );
  
};

export default Login;
