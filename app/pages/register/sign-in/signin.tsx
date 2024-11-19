"use client";
import React from "react";
import { useState, useEffect } from "react";
import Header from "../../../components/header/header";
import Section from "../../../components/section/section";
import Login from "../login/page";
import './sign-in.css';
import '../../../components/section/section-media.css';
import Link from "next/link";
import { useRef } from "react";
import {addUser, sendActivationCode} from '../../../crud.mjs';
import LoginBanner from "../../profile/banners/loginBanner/loginBanner";
import {generateActivationCode} from '../../../randomNum';

type Sign_inParams = {
    singInPage: boolean,
    setSingInPage: Function
    loginPage: boolean,
    setLoginPage: Function
}
function Sign_in(props:Sign_inParams){
   
    const [inputData ,setInputData] = useState({userName:'', email:'', birthDate:'', password:'', repassword:''});
    
    let switchAccount = JSON.parse(localStorage.getItem('switchAccount'));

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputData(prevInputs => ({ ...prevInputs, [name]: value }));
      };
    
    const verifyEmail_btn_clicked = async() => {
        
        
    }

    const passwordMatches = () => {
        if(inputData.password === inputData.repassword){
            return true;
        }else{
            return false;
        }
    }

    const [verificationCode, setVerificationCode] = useState(0);
    const verifyEmail = () => {
        try{
            const codeVerification = generateActivationCode()
            setVerificationCode(codeVerification);
            sendActivationCode(inputData.email, codeVerification);
        }catch(err){
            console.log(err);
        }
    }

    const signIn_buttonClicked = async() => {
        if(passwordMatches()){
            try{
                verifyEmail();
                setVerificationDisplay(true);
            }catch(err){
                alert('your email is not valid !')
            }
        }else{
            alert('password does not matches !')
        }
    } 

    const [inputUserVerificationCode, setInputUserVerificationCode] = useState(0);
    const handleInputUserVerificationCode = (event) => {
        setInputUserVerificationCode(event.target.value)
    }
    const submateVerificationBTN_clicked = async() => {
        if(verificationCode == inputUserVerificationCode){
            try{
                const newUser = await addUser(inputData);
                localStorage.setItem('userData', JSON.stringify(newUser));
                setBanner(true);
                setBannerText('sign in success !')
                if(isSaved){
                    if(switchAccount){
                        switchAccount.push(newUser);
                        localStorage.setItem('switchAccount', JSON.stringify(switchAccount))
                    }else{
                        localStorage.setItem('switchAccount', JSON.stringify([newUser]));
                    }
                }
                localStorage.setItem("activePage", 'profile');
                window.location.href = '/';
            }catch(err){
                setBanner(true);
                setBannerText('password does not match !')
            }
        }else{
            console.log(verificationCode , inputUserVerificationCode);
            alert('verification code is wrong !')
        }
        
    }

    const [passwordType, setPasswordType] = useState(false);
    const handlePasswordInput = () => {
        setPasswordType(!passwordType);
    }

    const [isSaved, setIsSaved] = useState(false);
    const handleSaveAccount = () => {
        setIsSaved(!isSaved);
    }

    const [banner, setBanner] = useState(false);
    const [bannerText, setBannerText] = useState('');

    const [verificationDisplay, setVerificationDisplay] = useState(false);


    const resendClicked = () => {
        const element = document.getElementById('resend');
        element.style.color = 'var(--primary-color)';
        setTimeout(() => {
            element.style.color = 'black';
        },100)
        verifyEmail();
    }

    return (
        <div  id="sign-in-page" className={props.singInPage? 'sign-in-page-active': 'sign-in-page-inactive' }>
            <div className="container-cart" >
                {/* <i id='cancel' onClick={()=>{props.setSingInPage(false)}} className="fas fa-times cancel"></i> */}
                <h2>Sign in</h2>
                <div className="input-container">
                    <input name="userName" onChange={handleInputChange} type="text" placeholder="user name ..."></input>
                    <i className="fas fa-user"></i>
                </div>
                <div className="input-container">
                    <input name="email" onChange={handleInputChange} type="text" placeholder="email ..."></input>
                    <i className="fas fa-envelope"></i>
                </div>

                <div className="input-container">
                    <label htmlFor="birthDate" className="custom-label">
                        <input
                            id="birthDate"
                            name="birthDate"
                            onChange={handleInputChange}
                            type="text"
                            placeholder="date of birth ..."
                            style={{
                                appearance: 'none',
                                WebkitAppearance: 'none',
                                MozAppearance: 'textfield'
                            }} 
                            onFocus={(e) => (e.target.type = 'date')}
                            onBlur={(e) => e.target.value === '' ? (e.target.type = 'text') : (e.target.type = 'date')}
                        />
                    </label>
                    <i className="fas fa-birthday-cake"></i>
                </div>



                <div className="input-container">
                    <input name="password" onChange={handleInputChange} type={passwordType? 'password': 'text'} placeholder="password ..."></input>
                    <div className="password-i">
                        <i onClick={handlePasswordInput} className={!passwordType? 'fas fa-eye': 'invisible'}></i>
                        <i onClick={handlePasswordInput} className={passwordType? 'fas fa-eye-slash': 'invisible'}></i>
                        <i className="fas fa-lock"></i>
                    </div>
                </div>
                <div className="input-container">
                    <input name="repassword" onChange={handleInputChange} type={passwordType? 'password': 'text'} placeholder="repassword ..."></input>
                    <div className="password-i">
                    {/* <i onClick={handlePasswordInput} className="fas fa-eye"></i> */}
                        <i className="fas fa-lock"></i>
                    </div>
                </div>
                <div className="side-of-matter">
                    <div className="checkbox">
                    <input onClick={handleSaveAccount} type="checkbox" value="false"/>
                    <p> Remember me</p>
                    </div>
                </div>
                <a className="sign-in-button" onClick={signIn_buttonClicked}>Sign in</a>
                <p className="switch">Have an account already ? <span onClick={()=>{
                        props.setSingInPage(false)
                        props.setLoginPage(true);
                    }} >Login</span></p>
                     <LoginBanner visibility={banner} setVisibility={setBanner} text={bannerText} setLoginPage={props.setLoginPage}/>
            </div> 
            <div className={verificationDisplay? 'verifyBanner': 'invisible'}>
                <div className="container">
                    <i className=" fas fa-times cancel" onClick={() => {setVerificationDisplay(false)}}></i>
                    <p>Whrite verification code :</p>
                    <input type="number" name="verificationCode" id="verificationCode" placeholder="verification code..." onChange={(event) => {handleInputUserVerificationCode(event)}} />
                    <p className="resend" id="resend" onClick={resendClicked}>send again !</p>
                    <button className="submateBTN" onClick={submateVerificationBTN_clicked}>submate</button>
                </div>
            </div>
        </div>
    )
}
export default Sign_in;