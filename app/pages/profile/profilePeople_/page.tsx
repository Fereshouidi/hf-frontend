'use client';
//import { pages } from "next/dist/build/templates/app-page";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import Sign_in from "../../register/sign-in/page";
import Login from "../../register/login/page";
import '../../profile/profile.css';
import './profilePeople.css';
import {addUser, getAllUsers, addInvitation, getInvitationBySender, getInvitation, deleteFriend, addConversation, addLike, getIsLiked, getPopularestFriends} from '../../../crud.mjs';
import Conversation from "../../conversation/page";


type ProfilePeoplePageProps = {
  visibility: boolean;
  setVisibility: (visibility: boolean) => void;
};

const ProfilePeoplePage_: React.FC<ProfilePeoplePageProps> = ({ visibility, setVisibility }) => {
  return (

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  let userProfileClicked_ = JSON.parse(localStorage.getItem('userProfileClicked_'))
  const phoProfileLess = localStorage.getItem('phoProfileLess');
  const phoCoverLess = localStorage.getItem('phoCoverLess');
  const [invitationCondition, setInvitationCondition] = useState('');

  const [popularestFriends, setPopularestFriends] = useState([]);
 
  const refreshInvitCondition = async() => {
    try{
      const invitation = await getInvitation(userProfileClicked_._id, userData._id);
      setInvitationCondition(invitation.condition);
    }catch{
      setInvitationCondition('regected')
    }
  }



  
  const handleInvitation = async() => {
    userData = JSON.parse(localStorage.getItem('userData'));
    if(userData){
      if(userData.friends.includes(userProfileClicked_._id)){
        alert('you are froends already !')
        deleteFriend(userData._id, userProfileClicked_._id);
      }else{
        const res = await addInvitation(userData._id, userProfileClicked_._id );
        //refreshInvitCondition();
        const anyChange = false;
        refreshInvitCondition()
      }
    }else{
      alert('you have to make an account first !')
    }
  }

  const handleConversation = async() => {
    const creatConversation = await addConversation(userData._id, userProfileClicked_._id);
    localStorage.setItem('conversation', JSON.stringify(creatConversation));
    console.log(creatConversation);
    // alert(JSON.parse(localStorage.getItem("conversation"))._id)
  }

  const [phoProfileClicked, setPhoProfileClicked] =useState(false);
  const handlePhoProfileClicked = () => {
    setPhoProfileClicked(!phoProfileClicked)
  }

  const [liked, setLiked] = useState(false);
  
  const getLikeCondition = async() => {
    const isLiked = await getIsLiked(userData._id, userProfileClicked_._id)
    console.log(isLiked)
    setLiked(isLiked);
  }

  const like = async() => {
    const user = await addLike(userData._id, userProfileClicked_._id)
    if(user){
      setLiked(
        user.likes.includes(userData._id)?
        true
        :false
      )
      localStorage.setItem('userProfileClicked_', JSON.stringify(user));
    }
  }

  const fetchData = async() => {
    //const users = await getAllUsers();
    const users_ = await getPopularestFriends(userData._id);
    console.log(users_);
    
    setPopularestFriends(users_);
    //setAllUsers(users);
    //console.log(allUsers)
  } 

  useEffect(() => {
    fetchData();
    refreshInvitCondition();
    getLikeCondition();
  },[visibility || userProfileClicked_ || invitationCondition])
  
  return (
    <div className={visibility? "containerAll profilePeoplePage": "invisible"}>
      <i className="fas fa-arrow-left backIcon" onClick={()=>{setVisibility(false)}}></i>
      <div className="div-photos">
      <img 
          className="photo-cover" 
          src={userProfileClicked_ && userProfileClicked_.phoCover
            ? userProfileClicked_.phoCover
            : phoCoverLess}
     alt="Profile"
        />
        <img
        onClick={handlePhoProfileClicked}
  className="photo-profile" src={userProfileClicked_ && userProfileClicked_.phoProfile? userProfileClicked_.phoProfile:'https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?w=166&h=180&c=7&r=0&o=5&pid=1.7'}
  alt="Profile"
/>

       
        
      </div>
      <div className="userInformation">
        <div className="userNameDiv">
          <h2 className="userName">{userProfileClicked_? userProfileClicked_.userName: null}</h2>
          
        </div>
        <p className="joined-at"><i className="fas fa-calendar-alt"></i>Joined June 2009</p>
        <div className="statistic">
          <p><span>{userProfileClicked_ && userProfileClicked_.friends? userProfileClicked_.friends.length: null}</span>friends</p>
          <p><span>{userProfileClicked_ && userProfileClicked_.friends? userProfileClicked_.likes.length: null}</span>likes</p>
        </div>
        <div className="followed-by">
          {popularestFriends.map((friend) => {
              return <img 
                src={friend.phoProfile? friend.phoProfile: phoProfileLess}
                // onClick={() => {
                //   localStorage.setItem('userProfileClicked_', JSON.stringify(friend))
                //   localStorage.setItem("activePage", 'profilePeaple');
                //   setVisibility(true)}}
                  />
            })}
        </div>

        

        <p className="bio">hi my name is fares houidi and i'm web devoloper , i like computer cience and i hope to finishing this web aplication</p>
        
        <div className="dealingWithUser">

          <span className={
            userData && userProfileClicked_ &&
            userProfileClicked_._id == userData._id? 'invisible':
            invitationCondition =='accepted'? 'follow acceptedShape'
            : invitationCondition == 'pending'? 'follow pendingShape'
            : 'follow'
          } onClick={handleInvitation} >{
            invitationCondition =='accepted'? 'friend'
            : invitationCondition == 'pending'? 'pending...'
            : 'invitation'
          }
          <i className={
            invitationCondition =='accepted'? 'fas fa-check'
            : invitationCondition == 'pending'? 'invisible'
            : 'invisible'
          }></i>
          </span>

          <Link href={"/pages/conversation"}
          className={
            userData && userProfileClicked_ && userProfileClicked_._id == userData._id? 'invisible': 'conversation'}
            onClick={handleConversation} >message</Link>

          <span 
            onClick={like}
            className={
            userData && userProfileClicked_ &&
            userProfileClicked_.id == "1"? 'invisible':
            liked? 'like likedShape'
            : 'like'
            } >{
              liked? 'liked'
              : 'like'
            }
            <i className={
              liked? 'fas fa-like'
              : 'invisible'
            }></i>
          </span>
            
        </div>

        </div>
      




    {/* banners */}
    
 
   {/* photo clicked banner */}
   <div className={ phoProfileClicked? 'phoProfileClickedVisible': 'phoProfileClickedVisibleInvisible'}>
      <i id='cancel' onClick={()=>{setPhoProfileClicked(false)}} className="fas fa-times cancel"></i>
      <img className="phoProfileClicked" src={userProfileClicked_ && userProfileClicked_.phoProfile 
         ? userProfileClicked_.phoProfile
         : phoProfileLess}></img>
    </div>
   
      
    </div>
  );
}

export default ProfilePeaple_;
