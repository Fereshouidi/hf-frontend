'use client';

import { useEffect, useState } from "react";
import Login from "../../../register/login/page";
import Sign_in from "../../../register/sign-in/page";

const AccountLess = (props) => {

    // const [singInPage , setSingInPage] = useState(false);
    // const [logIn , setLogIn] = useState(false);
    const handleSingInPage = () => {
      props.setSingInPage(true);
      props.setVisibility(false);
    }
    
    const [topPosition, setTopPosition] = useState('-100px')
    useEffect(() => {
        const timer = setTimeout(() => {
            setTopPosition('15px')
        },1)
    })

    return(
        <div id="banner-container" className={props.visibility? 'banner-container': 'invisible' } style={{top: topPosition}} >
            <div id='accountLess-banner' >
              <i id='cancel' onClick={ ()=>{ 
                  if(props.text == 'login success !'){
                    props.setVisibility(false);
                    props.setLoginPage(false);
                  }else{
                    props.setVisibility(false);
                  }
              }} className="fas fa-times cancel"></i>
              <div className="banner-text">
                <h2>{props.text}</h2>
                <a id="sign-in-link" onClick={handleSingInPage} href="/pages/register">sign in </a></div>
            </div>
        </div>
    )
}
export default AccountLess;