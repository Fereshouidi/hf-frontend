'use client';

import React, { useEffect, useState, useRef } from "react";
import './people.css';
import { getUserById, getInvitationBySender, getInvitationByReceiverer, addInvitation, addFriend, rejectInvitation, acceptInvit, deleteFriend, addConversation, blockFriend, getRelation } from "../../crud.mjs";
import calculateTimeDifference from '../.././calcTime.js';
import ProfilePeaple from "../profilePeaple/page";
import BlockBanner from "../../banners/blockBanner";


function People(props) {
    const userData = localStorage.getItem('userData') != undefined? JSON.parse(localStorage.getItem('userData')): null;


    const phoProfileLess = localStorage.getItem('phoProfileLess');
    const phoCoverLess = localStorage.getItem('phoCoverLess');

    const [blockBanner, setBlockBanner] = useState(false);
    const [userSelect, setUserSelect] = useState({});
    const [userElement, setUserElement] = useState(null)

    async function refreshUserData(){
        try{
            let updateUserData = await getUserById(userData._id);
            localStorage.setItem('userData', JSON.stringify(updateUserData))
        }catch(err){
            console.log(err)
        }
    } 
    refreshUserData();

    //console.log(userData.friends)

    const [activeSection, setActiveSection] = useState("invitationReceive");
    const handleHeaderClick = (section) => setActiveSection(section);

    const [usersSender, setUsersSender] = useState([]);
    const [invitationReceived, setInvitationReceived] = useState([]);
    const [usersReceive, setUsersReceive] = useState([]);
    const [invitationSended, setInvitationSended] = useState([]);
    const [friends, setFriends] = useState([]);
    const [relation, setRelation] = useState({})

    const previousSender = useRef([]);
    const previousReceiver = useRef([]);
    const previousFriend = useRef([]);

   //console.log(invitationReceived) alert

    useEffect(() => {
        const fetchUsers = async () => {
            try{
            const userSendingInvitation = await getInvitationBySender(userData._id);
            const userReceivingInvitation = await getInvitationByReceiverer(userData._id);

            if (JSON.stringify(previousSender.current) !== JSON.stringify(userSendingInvitation)) {
                const usersSenderData = await Promise.all(
                    userSendingInvitation.map(async (invit) => {
                        //if(invit.condition == 'pending'){ alert(invit.condition) }
                          //  setInvitationReceived(prevInvitations => [...prevInvitations, invit]);
                          //  alert(invitationReceived)
                            const user = await getUserById(invit.receiver);
                            return {user, invit};
                    })
                );
                setUsersSender(usersSenderData);
               // setInvitationReceived(usersSenderData.map((invit) => { invit.invitReceives}))
                previousSender.current = userSendingInvitation; 
            }

            if (userReceivingInvitation && JSON.stringify(previousReceiver.current) !== JSON.stringify(userReceivingInvitation)) {
                const usersReceiverData = await Promise.all(
                    userReceivingInvitation
                        .filter(invit => invit.condition === 'pending')
                        .map(async (invit) => {
                            setInvitationSended(prevInvitations => [...prevInvitations, invit]);
                            const user = await getUserById(invit.sender);
                            return {user, invit};
                        })
                );
                if(usersReceiverData.length != 0){
                    setUsersReceive(usersReceiverData);
                    previousReceiver.current = userReceivingInvitation;
                }else{
                    setUsersReceive(['undifinded'])
                }
            }
            

           // if (JSON.stringify(previousFriend.current) !== JSON.stringify(userData.friends)) {
                const friendsData = await Promise.all(
                    userData.friends.map(async (friend) => {
                        const user = await getUserById(friend);
                        const relation = await getRelation(userData._id, user._id);
                        const during = calculateTimeDifference(relation.relation.createdAt);
                        console.log(relation.relation)
                        return {user, during};
                    })
                );
                if(friendsData.length != 0){
                    setFriends(friendsData);
                }else{
                    setFriends(['undifinded'])
                }
            //    previousFriend.current = userData.friends;
            //}


            }catch(err){
                console.log(err);
                
            }
            
        };

        
        fetchUsers();
    }, [userData]);

    // const [divClicked, setDivClicked] = useState(false);
    // const [spanClicked, setSpanClicked] = useState(false);

    const handleAcceptInv = async(index, event) => {
        event.stopPropagation();
        document.getElementById(index).className = 'invisible'
        await acceptInvit(index, userData._id);
        refreshUserData();
    }
    const handleRejectInv = async(index,event) => {
        event.stopPropagation();
        document.getElementById(index).className = 'invisible';
        const res = await rejectInvitation(index, userData._id)
        refreshUserData();
    }
    
    const [activePage, setActivePage] = useState('');
    const [profilePeopleVisibility, setProfilePeopleVisibility] = useState(false);
    const [invitationCondition, setInvitationCondition] = useState('');

    const handleBlock = async(friend, event) => {
        event.stopPropagation();
        setUserSelect(friend);
        setBlockBanner(true)
        setUserElement(document.getElementById(friend._id))
        
    }
    const openChat = async(friend_id, event) => {
        event.stopPropagation();
        const creatConversation = await addConversation(userData._id, friend_id);
        localStorage.setItem('conversation', JSON.stringify(creatConversation));
        window.location.href = '/pages/conversation'
    }

    const [relationDuring, setRelationDuring] = useState('')
    const getRelationDate = async(friend) => {
        const relation = await getRelation(userData._id, friend._id);
        const during = calculateTimeDifference(relation.createdAt);
        return during;
    }
    

    return (
        <>
            <div className={userData ? 'people-page' : 'invisible'}>
                <div className="headerContent">
                    <div className={profilePeopleVisibility? 'invisible': 'header'}>
                        <h2
                            className={`header-item ${activeSection === "invitationReceive" ? "active" : ""}`}
                            onClick={() => handleHeaderClick("invitationReceive")}
                        >
                            Invitation receive
                        </h2>
                        <h2
                            className={`header-item ${activeSection === "invitationSend" ? "active" : ""}`}
                            onClick={() => handleHeaderClick("invitationSend")}
                        >
                            Invitation send
                        </h2>
                        <h2
                            className={`header-item ${activeSection === "friends" ? "active" : ""}`}
                            onClick={() => handleHeaderClick("friends")}
                        >
                            Friends
                        </h2>
                    </div>
                </div>
                <section id="section">
                    <br/>
                    <span className="activeSectionName">{
                    activeSection=='invitationReceive'? 'invitations received : '
                    :activeSection=='invitationSend'? 'invitations sended :'
                    :activeSection=='friends'? 'friends :'
                    :''
                    }
                    <i className={
                        activeSection=='invitationReceive' && usersReceive.length == 0? "fas fa-spinner"
                        :activeSection=='invitationSend' && usersSender.length == 0? "fas fa-spinner"
                        :activeSection=='friends' && friends.length == 0? "fas fa-spinner"
                        :'invisible'} style={{marginLeft:'2px'}} ></i>
                    </span> 



                    {activeSection === "invitationReceive" && (
                        <div className="content">
                            {usersReceive.includes('undifinded')? null: usersReceive.map((userReceive) => (
                                <div  id= {userReceive.user? userReceive.user._id: null} className="itemUser itemUserReceive" key={userReceive.user? userReceive.user._id: null} 
                                    onClick={() => {
                                        let list = [];
                                        list.push(userReceive.user);
                                        localStorage.setItem('userProfileClicked', JSON.stringify(list))
                                        localStorage.setItem("activePage", 'profilePeaple');
                                        setProfilePeopleVisibility(true)
                                    }}>
                                    <img className="userPhoProfile" src={userReceive.user && userReceive.user.phoProfile? userReceive.user.phoProfile: phoProfileLess}  />
                                    <div className="receiverData">
                                        <h6 className="userName">{userReceive.user? userReceive.user.userName: null}</h6>
                                        <div className="accepting">
                                            <span  className="accept-btn" onClick={(event)=>{handleAcceptInv(userReceive.user._id, event)}}>accept</span>
                                            <span  className="refuse-btn" onClick={(event) => {handleRejectInv(userReceive.user._id, event)}}>refuse</span>
                                        </div>
                                    </div>
                                    <span className="dateOfSend">{calculateTimeDifference(userReceive.invit? userReceive.invit.createdAt: null)} </span>                                    {/* <span className="condition">{userReceive.invit.condition}</span> */}
                                </div>
                            ))}
                        </div>
                    )}
                    {activeSection === "invitationSend" && (
                        <div className="content" >
                            {usersSender.map((userSender) => (
                                <div className="itemUser" key={userSender.user? userSender.user._id: null} 
                                    onClick={() => {
                                        let list = [];
                                        list.push(userSender.user);
                                        localStorage.setItem('userProfileClicked', JSON.stringify(list))
                                        localStorage.setItem("activePage", 'profilePeaple');
                                        setProfilePeopleVisibility(true)
                                        setInvitationCondition(userSender.invit.condition)
                                    }}>
                                    <img className="userPhoProfile" src={userSender.user && userSender.user.phoProfile? userSender.user.phoProfile: phoProfileLess} />
                                    <div className="senderData">
                                        <h6 className="userName">{userSender.user? userSender.user.userName: null}</h6>
                                        <span className="dateOfSend">{calculateTimeDifference(userSender.invit? userSender.invit.createdAt: null)} </span>
                                    </div>                      
                                    <span className={
                                        userSender.invit.condition === 'pending'
                                        ? 'condition conditionPending'
                                        :userSender.invit.condition === 'accepted' 
                                        ? 'condition conditionAccept' 
                                        : userSender.invit.condition === 'rejected' 
                                        ? 'condition conditionRejected' 
                                        : 'condition'
                                    }>
                                        {userSender.invit.condition}
                                    </span>

                                </div>
                            ))}
                        </div>
                    )}
                    {activeSection === "friends" && (
                        <div className="content">
                            {friends && friends.length > 0 ? (
                                friends.includes('undifinded')? null: friends.map((friend, index) => (
                                    <div  id={friend.user._id} key={index} className="itemUser" 
                                    onClick={() => {
                                        let list = [];
                                        list.push(friend.user);
                                        localStorage.setItem('userProfileClicked', JSON.stringify(list))
                                        localStorage.setItem("activePage", 'profilePeaple');
                                        setProfilePeopleVisibility(true)
                                        setInvitationCondition('accepted')
                                    }}>
                                    <img className="userPhoProfile" src={friend.user.phoProfile? friend.user.phoProfile: phoProfileLess} />
                                    <div className="friendData">
                                        <h6 className="userName">{friend.user.userName}</h6>
                                        <span className="friendshipDuring dateOfSend">{friend.during}</span>
                                    </div>
                                    <div className='dealing'>
                                        <span className="chat" onClick={(event) => {openChat(friend.user._id, event)}}>chat</span>
                                        <span className="block" onClick={(event) => {handleBlock(friend.user, event)}}>block</span>
                                    </div>
                                    </div>
                                ))
                            ) : (
                                <div>There is no friend ! </div>
                            )}
                        </div>
                    )}
                </section>
            </div>
            <div className={userData ? 'invisible' : 'people-page-without-active-account'}>there is no active account!</div>
       
       
       <ProfilePeaple 
            visibility={profilePeopleVisibility}
            setVisibility={setProfilePeopleVisibility}
            // invitationCondition={invitationCondition}
            // setInvitationCondition={setInvitationCondition}
            />

        {/* banners */}

        <BlockBanner
            visibility={blockBanner}
            setVisibility={setBlockBanner}
            blocked={userSelect}
            element={userElement}
        />

        </>

    );
}

export default People;
