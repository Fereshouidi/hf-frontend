"use client";
import React, { useState,useEffect } from "react";
import Header from "../../components/header/header";
import {getConversations, getUserById, getMessagesByConversationId, getLastMessage, getConversationCondition} from '../../crud.mjs'
import './chats.css';
import { Link } from "react-router-dom";
import { isNull } from "util";


function Chats(props){

    const userData = localStorage.getItem('userData') != undefined? JSON.parse(localStorage.getItem('userData')): null;
    const [userConversations, setUserConversations] = useState([]);

    const getUserConversations = async () => {
        try {
            const conversations = await getConversations(userData._id);
            setUserConversations(conversations? conversations: [] );
        } catch (err) {
            console.log(err);
        }
    };
    
    useEffect(() => {
        const updateUserConversations = async() => {
            let res = await getUserConversations()
        }
        updateUserConversations();
    },[])

    const handleConversation = (conversation) => {
        localStorage.setItem('conversation', JSON.stringify(conversation.conversation));
        console.log(conversation.vueCondition.hasViewed)
    }


    return (
        <>
         <div className="chatsPage">
            <br/>
            <span className="pageName">Chats : 
            <i className={
                         userConversations.length == 0? "fas fa-spinner conversationsLoading"
                        :'invisible'} style={{marginLeft:'2px'}} ></i>
            </span>
            <br/>

            {userConversations.map((conversation) => {
                return <a key={conversation._id} className="userChat" href="/pages/conversation" onClick={() => {handleConversation(conversation)}}>
                    <img className="phoProfile" src={conversation && conversation.user.phoProfile? conversation.user.phoProfile: 'https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?w=166&h=180&c=7&r=0&o=5&pid=1.7' }></img>
                    <div className="conversationData">
                        <h6 className="correspondent">{conversation && conversation.user.userName}</h6>
                        <p className="lastMessage">
                            {conversation && conversation.lastMessage ? (
                                conversation.lastMessage.image ? (
                                'send a picture ...'
                                ) : (
                                conversation.lastMessage.message.length > 35
                                    ? `${conversation.lastMessage.message.substring(0, 35)}...`
                                    : conversation.lastMessage.message
                                )
                            ) : '...'}
                        </p>



                    </div>
                    <img className="vue" src={conversation && conversation.vueCondition && conversation.vueCondition.hasViewed?
                    conversation.user.phoProfile? conversation.user.phoProfile
                    : "https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?w=166&h=180&c=7&r=0&o=5&pid=1.7"
                    : null } />
                   
                   {/* {conversation && conversation.vueCondition && conversation.vueCondition.hasViewed? conversation.vueCondition.hasViewed: 'false'} */}

                    {/* <p>{conversation && conversation.vueCondition?
                    conversation.user.phoProfile? conversation.user.phoProfile
                    : "https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?w=166&h=180&c=7&r=0&o=5&pid=1.7"
                    : null }</p> */}
                </a>
            })}
         </div>
         </>
    )
}
export default Chats;