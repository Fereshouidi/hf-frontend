'use client';
//import { pages } from "next/dist/build/templates/app-page";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import Sign_in from "../register/sign-in/page";
import Login from "../register/login/page";
import '../profile/profile.css';
import './profilePeople.css';
import {addUser, getAllUsers, addInvitation, getInvitationBySender, getInvitation, deleteFriend, addConversation, addLike, getIsLiked, getPopularestFriends} from '../../crud.mjs';
import Conversation from "../conversation/page";
import ProfilePeaple_ from "../profile/profilePeople_/page";
import { calcCreatedAt } from "../../calcTime";
import { addRelation, getRelation , getUserById} from "../../crud.mjs";
import {effect_dealingWithUser} from "../../clickEffect";
import UnblockBanner from "../../banners/unblockBanner";

type ProfilePeoplePageProps = {
  visibility: boolean;
  setVisibility: (visibility: boolean) => void;
};

const ProfilePeoplePage: React.FC<ProfilePeoplePageProps> = ({ visibility, setVisibility }) => {
  return (


  //alert(  JSON.parse(localStorage.getItem('userProfileClicked')))
  const [usersProfileClicked, setUsersProfileClicked] = useState([]);

  let userData = null;
  try{
    userData = localStorage.getItem('userData') != undefined? 
    JSON.parse(localStorage.getItem('userData'))
    : localStorage.setItem('userData', null);
  }catch(err){
    console.log(err);
  }  // let userProfileClicked = JSON.parse(localStorage.getItem('userProfileClicked'))
  // alert(userProfileClicked)

  const phoProfileLess = localStorage.getItem('phoProfileLess');
  const phoCoverLess = localStorage.getItem('phoCoverLess');
  const [invitationCondition, setInvitationCondition] = useState('');
  const [relationData, setRelationData] = useState({});

  const [popularestFriends, setPopularestFriends] = useState([]);

  const [profilePeapleVisible, setProfilePeapleVisible] = useState(false);

 
  const refreshInvitCondition = async() => {
    try{
      const relation = await getRelation( userData._id, usersProfileClicked[usersProfileClicked.length-1]._id);
      //alert(relation.relation.condition)
      setInvitationCondition(relation.relation.condition);
      setRelationData(relation)
      //alert(relationData.blockData.blocker)
    }catch(err){
      setInvitationCondition('regected')
      //alert(err)
    }
  }



  const addProfileClicked = (profile) => {
    fetchData(profile._id);
    let list = JSON.parse(localStorage.getItem('userProfileClicked'));
    list.push(profile);
    localStorage.setItem('userProfileClicked', JSON.stringify(list))
  }

  const [unblockBanner, setUnBlockBanner] = useState(false);
  
  const handleInvitation = async() => {
   // alert(invitationCondition);
    userData = JSON.parse(localStorage.getItem('userData'));
    if(userData){
      if(invitationCondition == 'block'){
        setUnBlockBanner(true);
      }else{
        const relation = await addInvitation(userData._id, usersProfileClicked[usersProfileClicked.length-1]._id)
        setInvitationCondition(relation.condition)
        if(relation.condition == 'friend'){
        }else{
          const anyChange = false;
          refreshInvitCondition()
        }
        refreshInvitCondition()
      }

    }else{
      alert('you have to make an account first !')
    }
  }

  const handleConversation = async() => {
    const creatConversation = await addConversation(userData._id, usersProfileClicked[usersProfileClicked.length-1]._id);
    localStorage.setItem('conversation', JSON.stringify(creatConversation));
    window.location.href ='/pages/conversation'
    console.log(creatConversation);
    // alert(JSON.parse(localStorage.getItem("conversation"))._id)
  }

  const [phoProfileClicked, setPhoProfileClicked] = useState(false);
  const handlePhoProfileClicked = () => {
    setPhoProfileClicked(!phoProfileClicked)
  }

  const [liked, setLiked] = useState(false);
  
  const getLikeCondition = async() => {
    if(usersProfileClicked.length != 0){
      //alert('hoo')
      const isLiked = await getIsLiked(userData._id, usersProfileClicked[usersProfileClicked.length-1]._id)
     // alert(isLiked)
      setLiked(isLiked);
    }
    //alert(usersProfileClicked.length != 0)
  }

  const like = async(userLiked) => {
    try {

      const element = document.getElementById(usersProfileClicked[usersProfileClicked.length-1]._id)
      effect_dealingWithUser(element);
        // إرسال طلب الإعجاب واسترجاع المستخدم المحدث
        const updatedUser = await addLike(userData._id, usersProfileClicked[usersProfileClicked.length - 1]._id);

        if (updatedUser) {
            // تحديث حالة الإعجاب بناءً على النتيجة
            setLiked(updatedUser.likes.includes(userData._id));

            // تحديث قائمة المستخدمين في Local Storage
            let list = JSON.parse(localStorage.getItem('userProfileClicked'));

            // البحث عن المستخدم الذي تم تحديثه في القائمة
            const userIndex = list.findIndex(user => user._id === userLiked._id);

            if (userIndex !== -1) {
                // تحديث المستخدم المحدث في القائمة
                list[userIndex] = updatedUser;
            }

            // تحديث Local Storage والحالة
            localStorage.setItem('userProfileClicked', JSON.stringify(list));
            setUsersProfileClicked(list);

            // تسجيل القائمة المحدثة في وحدة التحكم
            console.log(list);
        }
    } catch (error) {
        console.error('Failed to like the user:', error);
    }
}


  const fetchData = async(userId) => {
    //const users = await getAllUsers();
    let list = JSON.parse(localStorage.getItem('userProfileClicked'));
    if(usersProfileClicked.length != 0){
      const users_ = await getPopularestFriends(userId);
      //alert(users_)
      console.log(users_);
      setPopularestFriends(users_);
    }
    
    
    //alert(users_)
    //setAllUsers(users);
    //console.log(allUsers)
  } 

  // useEffect(() => {
  //   const refreshUserProfileClicked = async() => {
  //     if(usersProfileClicked[usersProfileClicked.length-1]){
  //       const user = await getUserById(usersProfileClicked[usersProfileClicked.length-1]._id)
  //       let list = JSON.parse(localStorage.getItem('userProfileClicked'));
  //     const userIndex = list.indexOf(usersProfileClicked[usersProfileClicked.length-1]);
  //     list[userIndex] = user;
  //     localStorage.setItem('userProfileClicked', JSON.stringify(list));
  //     setUsersProfileClicked(list);
  //     }
  //     refreshUserProfileClicked
  //   }

  // },[usersProfileClicked[usersProfileClicked.length-1]? usersProfileClicked[usersProfileClicked.length-1].likes: null])

  useEffect(() => {
    fetchData(usersProfileClicked[usersProfileClicked.length-1]? usersProfileClicked[usersProfileClicked.length-1]._id: null);
    
    refreshInvitCondition();
    getLikeCondition();
  },[visibility || invitationCondition || usersProfileClicked.length])

  
  
  useEffect(() => {
    if(JSON.parse(localStorage.getItem('userProfileClicked')) && JSON.parse(localStorage.getItem('userProfileClicked')).lenth != usersProfileClicked.length){
          console.log(JSON.parse(localStorage.getItem('userProfileClicked')) +'-----'+ usersProfileClicked)

       setUsersProfileClicked(JSON.parse(localStorage.getItem('userProfileClicked')))
    }
    // if(usersProfileClicked.length == 0 && visibility){
    //   setVisibility(false);
    // }

    //refreshInvitCondition();
   // alert(JSON.parse(localStorage.getItem('userProfileClicked')))
   //alert(usersProfileClicked)
  },[JSON.parse(localStorage.getItem('userProfileClicked'))])

  useEffect(() => {
    if(usersProfileClicked.length != 0){
      refreshInvitCondition();
      fetchData(usersProfileClicked[usersProfileClicked.length-1]? usersProfileClicked[usersProfileClicked.length-1]._id: null);
      getLikeCondition();
    }
    if(usersProfileClicked.length == 0 && visibility){
      setVisibility(false);
    }
    //alert(usersProfileClicked.length)
  }, [usersProfileClicked.length])



  const isUserClicked = usersProfileClicked[usersProfileClicked.length - 1];
const isCurrentUser = userData && isUserClicked && isUserClicked._id === userData._id;
const isFriend = invitationCondition === 'friend';
const isPending = invitationCondition === 'pending';
const isBlockedByUser = invitationCondition === 'block' && relationData.blockData.blocker === userData._id;
const isBlockedByOther = invitationCondition === 'block' && isUserClicked && relationData.blockData.blocker === isUserClicked._id;

const spanClassName = isCurrentUser ? 'invisible' :
    isFriend ? 'follow acceptedShape' :
    isPending ? 'follow pendingShape' :
    isBlockedByUser ? 'follow blockedShape' :
    isBlockedByOther ? 'invisible' :
    'follow';

const spanText = isFriend ? 'friend' :
    isPending ? 'pending...' :
    isBlockedByUser ? 'unblock' :
    'invitation';

const iconClassName = isFriend ? 'fas fa-check' :
    isPending ? 'invisible' :
    isBlockedByUser ? 'fas fa-ban' :
    'fas fa-user-plus';

  return (
    <div style={{top: top}} className={visibility? "containerAll profilePeoplePage": "invisible"}>
      <i className="fas fa-arrow-left backIcon" onClick={() => {
        const lastElement = usersProfileClicked[usersProfileClicked.length - 1]; 
        setUsersProfileClicked(usersProfileClicked.slice(0, -1));
        localStorage.setItem('userProfileClicked', JSON.stringify(usersProfileClicked.slice(0, -1)))
        fetchData(usersProfileClicked[usersProfileClicked.length-2]? usersProfileClicked[usersProfileClicked.length-2]._id: null);
      }}></i>
      <div className="div-photos">
      <img 
          className="photo-cover" 
          src={usersProfileClicked[usersProfileClicked.length-1] && usersProfileClicked[usersProfileClicked.length-1].phoCover
            ? usersProfileClicked[usersProfileClicked.length-1].phoCover
            : phoCoverLess}
     alt="Profile"
        />
        <img
        onClick={handlePhoProfileClicked}
  className="photo-profile" src={usersProfileClicked[usersProfileClicked.length-1] && usersProfileClicked[usersProfileClicked.length-1].phoProfile? usersProfileClicked[usersProfileClicked.length-1].phoProfile:'https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?w=166&h=180&c=7&r=0&o=5&pid=1.7'}
  alt="Profile"
/>

       
        
      </div>
      <div className="userInformation">
        <div className="userNameDiv">
          <h2 className="userName">{usersProfileClicked[usersProfileClicked.length-1]? usersProfileClicked[usersProfileClicked.length-1].userName: 'null'}</h2>
          
        </div>
        <p className="joined-at"><i className="fas fa-calendar-alt"></i>Joined {usersProfileClicked[usersProfileClicked.length-1]? calcCreatedAt(usersProfileClicked[usersProfileClicked.length-1].createdAt): ''} </p>
        <div className="statistic">
          <p><span>{usersProfileClicked[usersProfileClicked.length-1] && usersProfileClicked[usersProfileClicked.length-1].friends? usersProfileClicked[usersProfileClicked.length-1].friends.length: null}</span>friends</p>
          <p><span>{usersProfileClicked[usersProfileClicked.length-1] && usersProfileClicked[usersProfileClicked.length-1].friends? usersProfileClicked[usersProfileClicked.length-1].likes.length: null}</span>likes</p>
        </div>
        <div className="followed-by">
          {popularestFriends? popularestFriends.map((friend) => {
              return <img 
                src={friend.phoProfile? friend.phoProfile: phoProfileLess}
                onClick={() => {addProfileClicked(friend)}}
                />
            }): null}
        </div>

        

        <p className="bio">{usersProfileClicked[usersProfileClicked.length-1] && usersProfileClicked[usersProfileClicked.length-1].discription? usersProfileClicked[usersProfileClicked.length-1].discription: ''}</p>
        
        <div className="dealingWithUser">

          <span className={
            relationData.blockData && usersProfileClicked[usersProfileClicked.length-1] && relationData.blockData.blocker == usersProfileClicked[usersProfileClicked.length-1]._id?
             'follow blockedShape': 'invisible'}>
              {usersProfileClicked[usersProfileClicked.length-1]? 
              usersProfileClicked[usersProfileClicked.length-1].userName + ' has blocked you !'
              : null}
             </span>

             <span className={spanClassName} onClick={handleInvitation}>
                {spanText}
                <i className={iconClassName}></i>
            </span>

          <a
          className={
            userData && usersProfileClicked[usersProfileClicked.length-1] && usersProfileClicked[usersProfileClicked.length-1]._id == userData._id || invitationCondition == 'block'? 'invisible': 'conversation'}
            onClick={handleConversation} >message
             <i className= 'fas fa-comments'></i>
          </a>

          <span 
            id={usersProfileClicked[usersProfileClicked.length-1]? usersProfileClicked[usersProfileClicked.length-1]._id: null}
            onClick={() => {like(usersProfileClicked[usersProfileClicked.length-1])}}
            className={
            userData && usersProfileClicked[usersProfileClicked.length-1] &&
            usersProfileClicked[usersProfileClicked.length-1]._id == "1"
            || invitationCondition == 'block'
            || usersProfileClicked[usersProfileClicked.length-1] && userData && usersProfileClicked[usersProfileClicked.length-1]._id == userData._id? 'invisible':
            liked? 'like likedShape'
            : 'like'
            } >{
              liked? 'liked'
              : 'like'
            }
            <i className={
              liked? 'fas fa-thumbs-up'              //fa-check 
              : 'fas fa-thumbs-up'
            }></i>
          </span>
            
        </div>

        </div>
      




    {/* banners */}
    
    <UnblockBanner 
      visibility = {unblockBanner}
      setVisibility = {setUnBlockBanner}
      blocked={usersProfileClicked[usersProfileClicked.length-1]}
      setRelationCondition={setInvitationCondition}
    />
 
   {/* photo clicked banner */}
   <div className={ phoProfileClicked? 'phoProfileClickedVisible': 'phoProfileClickedVisibleInvisible'}>
      <i id='cancel' onClick={()=>{setPhoProfileClicked(false)}} className="fas fa-times cancel"></i>
      <img className="phoProfileClicked" src={usersProfileClicked[usersProfileClicked.length-1] && usersProfileClicked[usersProfileClicked.length-1].phoProfile 
         ? usersProfileClicked[usersProfileClicked.length-1].phoProfile
         : phoProfileLess}></img>
    </div>
   

   {/* <ProfilePeaple_
   visibility={profilePeapleVisible}
     setVisibility={setProfilePeapleVisible}
   /> */}
      
    </div>
  );
}

export default ProfilePeaple;
