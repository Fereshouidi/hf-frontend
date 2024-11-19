'use client';
//import { pages } from "next/dist/build/templates/app-page";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import Sign_in from "../register/sign-in/page";
import Login from "../register/login/page";
import LoginBanner from './banners/loginBanner/loginBanner';
import AccountLess from "./banners/loginBanner/accountLess";
import './profile.css';
import {addUser, getAllUsers, getPopularestFriends, getUserById} from '../../crud.mjs';
import {calculateTime, calcCreatedAt} from "../../calcTime";
import ProfilePeaple from "../profilePeaple/page";


type PageProps = {
  setActivePage: any;
};

const ProfilePage: React.FC<PageProps> = ({ setActivePage }) => {

  let userData = null;
  try{
    userData = localStorage.getItem('userData') != undefined? 
    JSON.parse(localStorage.getItem('userData'))
    : localStorage.setItem('userData', null);
  }catch(err){
    console.log(err);
  }

  const phoProfileLess = localStorage.getItem('phoProfileLess');
  const phoCoverLess = localStorage.getItem('phoCoverLess');

  const [popularestFriends, setPopularestFriends] = useState([]);

    const [allUsers, setAllUsers] = useState([]) ;

    const [profilePeapleVisible, setProfilePeapleVisible] = useState(false);

    
    const fetchData = async() => {
      if(userData){
        const refreshUser = await getUserById(userData._id);
        localStorage.setItem('userData', JSON.stringify(refreshUser))
        const users_ = await getPopularestFriends(userData._id);
        console.log(users_);
        setPopularestFriends(users_);
      }
    } 

    useEffect(()=>{
      fetchData();
    },[])

  const [singInPage , setSingInPage] = useState(false);
  const [logIn , setLogIn] = useState(false);
  const handleSingInPage = () => {
    setSingInPage(!singInPage);
  }

  const [phoProfileClicked, setPhoProfileClicked] =useState(false);
  const handlePhoProfileClicked = () => {
    setPhoProfileClicked(!phoProfileClicked)
  }
  
  const [accountLessBanner, setAccountLessBanner] = useState(false);
  
  // const [accountLessBanner, setAccountLessBanner] = useState(false);
  // const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')));
  // useEffect(() => {
  //   if(localStorage.getItem('userData')){
  //     setUserData(JSON.parse(localStorage.getItem('userData')) ) ;
  //     setAccountLessBanner(false);
  //   }else{
  //     setAccountLessBanner(true)
  //   }
  // },[localStorage.getItem('userData'),userData])



  
  return (
    <div className="containerAll">
      <div className="div-photos">
        <img 
          className="photo-cover" 
          src={userData && userData.phoCover
            ? userData.phoCover
            : phoCoverLess}
     alt="Profile"
        />
        <img
  className="photo-profile"
  onClick={handlePhoProfileClicked}
  src={userData && userData.phoProfile 
         ? userData.phoProfile
         : phoProfileLess}
  alt="Profile"
/>

        {/* <span className="follow">follow</span> */}
      </div>
      <div className="userInformation">
        <div className="userNameDiv">
          <h2 className="userName">{ userData? userData.userName: 'unknown'}</h2>
          
        </div>
        <p className="joined-at"><i className="fas fa-calendar-alt"></i>Joined {userData? calcCreatedAt(userData.createdAt): ''} </p>
        <div className="statistic">
        <p><span>{userData? userData.friends.length: null}</span>friends</p>
        <p><span>{userData? userData.likes.length: null}</span>likes</p>
        </div>
        <div className="followed-by">
          {popularestFriends.map((friend) => {
            return <img 
              src={friend.phoProfile? friend.phoProfile: phoProfileLess}
              onClick={() => {
                let list = [];
                list.push(friend);
                localStorage.setItem('userProfileClicked', JSON.stringify(list))
                localStorage.setItem("activePage", 'profilePeaple');
                setProfilePeapleVisible(true)}}
                />
          })}
        </div>
        <p className="bio">{userData && userData.discription? userData.discription: ''}</p>
        </div>
      
{/* {"hi my name is fares houidi and i'm web devoloper , i like computer cience and i hope to finishing this web aplication"} */}





    {/* <h5 id="sign-in-link" onClick={()=>{localStorage.removeItem('userData')}} >delete data</h5> */}
 
    




    {/* banners */}

      {/* login & signin banner */}
    <Sign_in setSingInPage={setSingInPage} singInPage={singInPage} loginPage={logIn} setLoginPage={setLogIn}/>
    <Login setLoginPage={setLogIn} loginPage={logIn} setSingInPage={setSingInPage} singInPage={singInPage}/>
    
    {/* photo clicked banner */}
    <div className={ phoProfileClicked? 'phoProfileClickedVisible': 'phoProfileClickedVisibleInvisible'}>
      <i id='cancel' onClick={()=>{setPhoProfileClicked(false)}} className="fas fa-times cancel"></i>
      <img className="phoProfileClicked" src={userData && userData.phoProfile 
         ? userData.phoProfile
         : phoProfileLess}></img>
    </div>

    {/* banner of there is no active account */}
    <AccountLess visibility={accountLessBanner}
     setVisibility={setAccountLessBanner}
      text={'there is no active account  !'} 
      setLoginPage={setLogIn}
      handleSingInPage={handleSingInPage}
      setSingInPage={setSingInPage}
/>

    <ProfilePeaple 
      visibility={profilePeapleVisible}
      setVisibility={setProfilePeapleVisible}
    />
      
    </div>
  );
}

export default Profile;


