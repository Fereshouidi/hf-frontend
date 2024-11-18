"use client"
import logoJPG from '../../images/logo.jpg';
import './register.css';
import Login from './login/page';
import Sign_in from './sign-in/page';
import { cache, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';


function Register() {

    const [singInPage , setSingInPage] = useState(false);
    const [logIn , setLogIn] = useState(true);
    const handleSingInPage = () => {
      setSingInPage(!singInPage);
    }



    useEffect(() => {
        if(localStorage.getItem('userData')){
            window.location.href = '/';
        }
    },[])



    return(
        <Router>
            <div className= 'registerPage'>
                <div id='logo_'>
                    <img src={logoJPG.src} alt="Logo" />
                </div>

                <div id='sectionRegister'>

            <Sign_in setSingInPage={setSingInPage} singInPage={singInPage} loginPage={logIn} setLoginPage={setLogIn}/>
             <Login setLoginPage={setLogIn} loginPage={logIn} setSingInPage={setSingInPage} singInPage={singInPage}/>
        
                </div>

            </div>
        </Router>
    )
}

export default Register;