"use client";
import { useState, useEffect } from 'react';
import './setting.css';
import AccountLess from '../profile/banners/loginBanner/accountLess';
import Banner from './banners/banner';
import Sign_in from '../register/sign-in/page';
import Login from '../register/login/page';
import AccountEdit from './accountEdit/page';
import { Link, useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import {effect_removeAccountFromSwitch} from '../../clickEffect';


function Setting() {
    
    const phoProfileLess = localStorage.getItem('phoProfileLess');
    const phoCoverLess = localStorage.getItem('phoCoverLess');

    const [visibility, setVisibility] = useState({profile: false, security: false, switchAccount: false});

    const handleVisibility = (item) => {
        setVisibility((prevVisibility) => ({
            ...prevVisibility,
            [item]: !prevVisibility[item],
        }));
    };

    const [logoutDone, setLogoutDone] = useState(false);
    const [logoutDoneMessage, setLogoutDoneMessage] = useState('');
    const handleLogOutButton = () => {
        if(localStorage.getItem('userData')){
            localStorage.removeItem('userData');
            setLogoutDoneMessage('Log out success !')
            setLogoutDone(true);
        }else{
            setLogoutDone(true);
            setLogoutDoneMessage('there is no active accout already !')
        }
        //navigate('/pages/register');
        setLogIn(true);
    }

    const [singInPage , setSingInPage] = useState(false);
    const [logIn , setLogIn] = useState(false);
    const handleSingInPage = () => {
      setSingInPage(!singInPage);
    }

    useEffect(() => {
        //handleLogOutButton();
    }, [])


    const handleAccountEdit = (activity) => {
        localStorage.setItem('activity', activity);
        window.location.href = '/pages/setting/accountEdit';
    }

    let [listAccountsSwitch, setListAccountsSwitch] = useState(JSON.parse(localStorage.getItem('switchAccount')));

    const changeAccount = (account) => {
        localStorage.setItem('userData', JSON.stringify(account))
        localStorage.setItem('activePage', 'profile');
    }

    const deleteFromSwitchAccount = (event, account) => {

        event.stopPropagation();
        event.preventDefault();
        const element = document.getElementById(account._id)
        effect_removeAccountFromSwitch(element);
        
        const updatedList = listAccountsSwitch.filter(item => item !== account);
        localStorage.setItem('switchAccount', JSON.stringify(updatedList));
        setListAccountsSwitch(JSON.parse(localStorage.getItem('switchAccount')))
        listAccountsSwitch = updatedList;

    };
    

    return (
        <div className="setting-page">

            <ul className="setting-list">
                <li id="profile-item" className={visibility.profile ? 'basisVisible' : 'basisInvisible'}>
                 
                 <span onClick={() => handleVisibility('profile')} ><i className="fa-regular fa-user"></i>Profile</span>
                    <ul className="profile-list">
                        <li className="sub-li"><a onClick={() => {handleAccountEdit('userName')}} className="sub-li-a"> <i className='fas fa-user'></i> User name</a></li>
                        <li className="sub-li"><a onClick={() => {handleAccountEdit('phoCover')}} className="sub-li-a"><i className='fas fa-image'></i> Pho-cover</a></li>
                        <li className="sub-li"><a onClick={() => {handleAccountEdit('phoProfile')}} className="sub-li-a"><i className='fas fa-user-circle'></i> Pho-profile</a></li>
                        <li className="sub-li"><a onClick={() => {handleAccountEdit('discription')}} className="sub-li-a"><i className='fas fa-align-left'></i> Discription</a></li>
                    </ul>
                </li>
                <li className={visibility.security ? 'basisVisible' : 'basisInvisible'}>
                    <span onClick={() => handleVisibility('security')}> <i className='fas fa-lock'></i> Security</span>
                    <ul>
                        <li className="sub-li"><a onClick={() => {handleAccountEdit('password')}} className="sub-li-a"><i className='fas fa-key'></i> Change password</a></li>
                    </ul>
                </li>
                <li className={visibility.switchAccount ? 'basisVisible' : 'basisInvisible'}>
                    <span onClick={() => handleVisibility('switchAccount')}><i className='fas fa-exchange-alt'></i> Switch Account</span>
                    <ul>
                        {listAccountsSwitch? listAccountsSwitch.map((account) => {
                            return <li className="sub-li"><a href={'/'} 
                                        className="sub-li-a" onClick={() =>{changeAccount(account)}}>
                                        <img className='phoProfile' src={account.phoProfile? account.phoProfile: phoProfileLess}></img> 
                                        {account.userName}
                                        <i id={account._id} className='fas fa-times removeSwitchAccount' onClick={(event) => {deleteFromSwitchAccount(event, account)}}></i>
                                    </a></li>
                        
                        })
                        : null 
                        }
                    </ul>
                </li>
            </ul>
            <div className='log-out--and--block-account---container'>
                <div className="log-out">
                    <a onClick={handleLogOutButton} href={'/pages/register'} > <i className='fas fa-sign-out'></i> Log Out</a>
                </div>
                <div className="block-account">
                    <a onClick={handleLogOutButton} href={'/pages/register'} > <i className='fas fa-user-slash'></i> Block account</a>
                </div>
            </div>






{/* banners */}
  

     {/* login & signin banner */}
     {/* <Sign_in setSingInPage={setSingInPage} singInPage={singInPage} loginPage={logIn} setLoginPage={setLogIn}/>
    <Login setLoginnaPage={setLogIn} loginPage={logIn} setSingInPage={setSingInPage} singInPage={singInPage}/> */}
    
        
    {/* banner of there is no active account */}
    <Banner visibility={logoutDone}
     setVisibility={setLogoutDone}
      text= {logoutDoneMessage} 
      setLoginPage={setLogIn}
      handleSingInPage={handleSingInPage}
      setSingInPage={setSingInPage}
/>
        </div>
    );
}

export default Setting;







