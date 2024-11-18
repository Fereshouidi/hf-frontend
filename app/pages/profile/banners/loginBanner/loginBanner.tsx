'use client';
import React, { useState, useEffect } from 'react';

// import '../../pages/login/login.css';

function LoginBanner(props) {

  return (
    <>
      <div id='login-success-banner-container' className={props.visibility? 'login-success-banner-container': 'invisible' }>
          <div id='login-success-banner' >
            <i id='cancel' onClick={ ()=>{ 
                if(props.text == 'login success !'){
                  props.setVisibility(false);
                  props.setLoginPage(false);
                }else{
                  props.setVisibility(false);
                }
            }} className="fas fa-times cancel"></i>
            <h2>{props.text}</h2>
          </div>
      </div>
    </>
  );
}

export default LoginBanner;
