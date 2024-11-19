'use client';
import Link from "next/link";
import React, { useState, useEffect } from "react";
import '../../profile/profile.css';
import './profilePeople.css';
import { addInvitation, getInvitation, deleteFriend, addConversation, addLike, getIsLiked, getPopularestFriends } from '../../../crud.mjs';

interface ProfilePeoplePageProps {
  visibility: boolean;
  setVisibility: (visibility: boolean) => void;
}

const ProfilePeoplePage: React.FC<ProfilePeoplePageProps> = ({ visibility, setVisibility }) => {

  let userData = localStorage.getItem('userData') ? localStorage.getItem('userData') : null;
  const userProfileClicked_ = localStorage.getItem('userProfileClicked_') ? JSON.parse(localStorage.getItem('userProfileClicked_')!) : null;
  const phoProfileLess = localStorage.getItem('phoProfileLess');
  const phoCoverLess = localStorage.getItem('phoCoverLess');
  const [invitationCondition, setInvitationCondition] = useState('');
  const [popularestFriends, setPopularestFriends] = useState([]);
  const [phoProfileClicked, setPhoProfileClicked] = useState(false);
  const [liked, setLiked] = useState(false);

  // Function to refresh the invitation condition
  const refreshInvitCondition = async () => {
    try {
      if (userProfileClicked_ && typeof userProfileClicked_ === 'object' && '_id' in userProfileClicked_) {
        const invitation = await getInvitation(userProfileClicked_._id, userData._id);
        setInvitationCondition(invitation.condition);
      } else {
        console.error('Invalid userProfileClicked_ format');
        setInvitationCondition('rejected');
      }
    } catch (error) {
      console.error('Error fetching invitation:', error);
      setInvitationCondition('rejected');
    }
  };

  // Function to handle invitation (send or delete)
  const handleInvitation = async () => {
    userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      if (userData.friends.includes(userProfileClicked_._id)) {
        alert('You are already friends!');
        await deleteFriend(userData._id, userProfileClicked_._id);
      } else {
        const res = await addInvitation(userData._id, userProfileClicked_._id);
        refreshInvitCondition();
      }
    } else {
      alert('You must create an account first!');
    }
  };

  // Function to handle conversation initiation
  const handleConversation = async () => {
    const createdConversation = await addConversation(userData._id, userProfileClicked_._id);
    localStorage.setItem('conversation', JSON.stringify(createdConversation));
    console.log(createdConversation);
  };

  // Function to check if the user has liked the profile
  const getLikeCondition = async () => {
    const isLiked = await getIsLiked(userData._id, userProfileClicked_._id);
    setLiked(isLiked);
  };

  // Function to like/unlike the profile
  const like = async () => {
    const user = await addLike(userData._id, userProfileClicked_._id);
    if (user) {
      setLiked(user.likes.includes(userData._id));
      localStorage.setItem('userProfileClicked_', JSON.stringify(user));
    }
  };

  // Fetch popularest friends data
  const fetchData = async () => {
    const users_ = await getPopularestFriends(userData._id);
    setPopularestFriends(users_);
  };

  useEffect(() => {
    fetchData();
    refreshInvitCondition();
    getLikeCondition();
  }, [visibility || userProfileClicked_ || invitationCondition]);

  return (
    <div className={visibility ? "containerAll profilePeoplePage" : "invisible"}>
      <i className="fas fa-arrow-left backIcon" onClick={() => { setVisibility(false) }}></i>
      <div className="div-photos">
        <img 
          className="photo-cover" 
          src={userProfileClicked_ && userProfileClicked_.phoCover ? userProfileClicked_.phoCover : phoCoverLess} 
          alt="Profile" 
        />
        <img
          onClick={() => setPhoProfileClicked(!phoProfileClicked)}
          className="photo-profile" 
          src={userProfileClicked_ && userProfileClicked_.phoProfile ? userProfileClicked_.phoProfile : 'https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?w=166&h=180&c=7&r=0&o=5&pid=1.7'} 
          alt="Profile" 
        />
      </div>
      <div className="userInformation">
        <div className="userNameDiv">
          <h2 className="userName">{userProfileClicked_ ? userProfileClicked_.userName : null}</h2>
        </div>
        <p className="joined-at"><i className="fas fa-calendar-alt"></i> Joined June 2009</p>
        <div className="statistic">
          <p><span>{userProfileClicked_ && userProfileClicked_.friends ? userProfileClicked_.friends.length : null}</span> friends</p>
          <p><span>{userProfileClicked_ && userProfileClicked_.friends ? userProfileClicked_.likes.length : null}</span> likes</p>
        </div>
        <div className="followed-by">
          {popularestFriends.map((friend) => {
            return <img key={friend._id} src={friend.phoProfile ? friend.phoProfile : phoProfileLess} />
          })}
        </div>
        <p className="bio">Hi, my name is Fares Houidi and I'm a web developer. I like computer science and I hope to finish this web application soon.</p>
        <div className="dealingWithUser">
          <span 
            className={
              userData && userProfileClicked_ && userProfileClicked_._id === userData._id ? 'invisible' : 
              invitationCondition === 'accepted' ? 'follow acceptedShape' : 
              invitationCondition === 'pending' ? 'follow pendingShape' : 'follow'
            }
            onClick={handleInvitation}
          >
            {invitationCondition === 'accepted' ? 'Friend' : 
             invitationCondition === 'pending' ? 'Pending...' : 'Invitation'}
            <i className={invitationCondition === 'accepted' ? 'fas fa-check' : 'invisible'}></i>
          </span>
          <Link 
            href="/pages/conversation"
            className={userData && userProfileClicked_ && userProfileClicked_._id === userData._id ? 'invisible' : 'conversation'}
            onClick={handleConversation}
          >
            Message
          </Link>
          <span
            onClick={like}
            className={
              userData && userProfileClicked_ && userProfileClicked_.id === "1" ? 'invisible' :
              liked ? 'like likedShape' : 'like'
            }
          >
            {liked ? 'Liked' : 'Like'}
            <i className={liked ? 'fas fa-like' : 'invisible'}></i>
          </span>
        </div>
      </div>

      {/* Photo clicked banner */}
      <div className={phoProfileClicked ? 'phoProfileClickedVisible' : 'phoProfileClickedVisibleInvisible'}>
        <i id='cancel' onClick={() => { setPhoProfileClicked(false) }} className="fas fa-times cancel"></i>
        <img className="phoProfileClicked" src={userProfileClicked_ && userProfileClicked_.phoProfile ? userProfileClicked_.phoProfile : phoProfileLess} />
      </div>
    </div>
  );
};

export default ProfilePeoplePage;

