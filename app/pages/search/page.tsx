'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfilePeaple from '../profilePeaple/page';
import { getPublicSearch, getFriendsSearch } from '../../crud.mjs';
import './search.css';



function Search(props) {
  const userData = localStorage.getItem('userData') != undefined? JSON.parse(localStorage.getItem('userData')): null || [];
  //const userFound_public = JSON.parse(localStorage.getItem('userFound_public')) || [];

  const phoProfileLess = localStorage.getItem('phoProfileLess');
  const phoCoverLess = localStorage.getItem('phoCoverLess');


  const navigate = useNavigate();

  const [profilePeopleVisibility, setProfilePeopleVisibility] = useState(false);
  const [invitationCondition, setInvitationCondition] = useState('accepted');


  const searchRef = useRef();
  const [userSearch, setUserSearch] = useState('');
  const handleSearch = () => {
    setUserSearch(searchRef.current.value);
  }

  const [userFound_public, setUserFound_public] = useState([]);
  const [userFound_friend, setUserFound_friend] = useState([]);

  
  useEffect(() => {
    async function getPublicSearch_() {
      let res = await getPublicSearch(userSearch);
      if(res.length != 0){
        setUserFound_public(res);
        console.log(props.userFound_public);
        localStorage.setItem('userFound_public', JSON.stringify(userFound_public) );
      }else{
        setUserFound_public(['undifinded']);
      }
    } 
    async function getFriendsSearch_() {
      let res = await getFriendsSearch(userSearch, userData._id);
      if(res.length != 0){
        setUserFound_friend(res);
        console.log(props.setUserFound_friend);
        localStorage.setItem('setUserFound_friend', JSON.stringify(setUserFound_friend) );
      }else{
        setUserFound_friend(['undifinded']);
      }
    } 
    
    getPublicSearch_();
    getFriendsSearch_();
  },[userSearch])


  const [activeSection, setActiveSection] = useState("public");
  const handleHeaderClick = (section) => setActiveSection(section);

  return (
    <div className='searchPage'>
      <div className={profilePeopleVisibility? 'invisible': 'searchBar'}>
        <i className='fas fa-search'></i>
        <input id='search' 
                onChange={() =>{  
                  handleSearch()
                }} ref={searchRef}
                // className="form-control me-2 nav-item" 
                type="search" placeholder="Search .." aria-label="Search" 
        ></input>
        <div className='searchFilter'>
        <h2
          className={`header-item ${activeSection === "public" ? "active" : ""}`}
          onClick={() => handleHeaderClick("public")}
          >
              public
        </h2>
        <h2
          className={`header-item ${activeSection === "friend" ? "active" : ""}`}
          onClick={() => handleHeaderClick("friend")}
          >
          friend
        </h2>
        </div>
      </div>
      {activeSection === "public" && (
        <div className='sectionSearch'> <span
          className='pageName'>public search {userFound_public.length == 0 && userFound_public.includes("undifinded")? null
          :userFound_public.length == 0 && !userFound_public.includes("undifinded")? <i className='fas fa-spinner'></i>:
          null
         }</span>
        <br/>
        {userFound_public.includes('undifinded')? null: userFound_public.map((user) => (
          <div
            className="userFound"
            key={user.id}
            onClick={() => {
              let list = [];
              list.push(user);
              localStorage.setItem('userProfileClicked', JSON.stringify(list))
              localStorage.setItem("activePage", 'profilePeaple');
              setProfilePeopleVisibility(true)}}
            >
            <img id='profile' src={user.phoProfile? user.phoProfile: phoProfileLess}></img>          <h5 className="userName">{user.userName}</h5>
          </div>
        ))}
        </div>
      )}

      {userFound_friend.includes('undifinded')? null: activeSection === "friend" && (
      <div className='sectionSearch'> <span className='pageName'>friend search {userFound_friend.length === 0? <i className='fas fa-spinner'></i>: null} </span>
      <br/>
      {userFound_friend.map((user) => (
        <div
          className="userFound"
          key={user.id}
          onClick={() => {
            let list = [];
                list.push(user);
                localStorage.setItem('userProfileClicked', JSON.stringify(list))
                localStorage.setItem("activePage", 'profilePeaple');
                setProfilePeopleVisibility(true)}}
          >
          <img id='profile' src={user.phoProfile? user.phoProfile: "https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?w=166&h=180&c=7&r=0&o=5&pid=1.7"}></img>          <h5 className="userName">{user.userName}</h5>
        </div>
      ))}
      </div>
      )}
      

    <ProfilePeaple  visibility={profilePeopleVisibility} setVisibility={setProfilePeopleVisibility} />
    </div>
  );
}

export default Search;

















// import { parse } from "path";
// import { json } from "stream/consumers";
// import { useNavigate } from "react-router-dom";


// function Search(props){

//     const userData = JSON.parse(localStorage.getItem('userData'));
//     const userFound_public = JSON.parse(localStorage.getItem('userFound_public'));

//         const navigate = useNavigate();
//     return(
//         <div>
//             {userFound_public.map((user) => {
//                 return <div className="userFound_public"
//                 key={user.id}
//                 onClick={() => {
//                     navigate('/profile')
//                 }}>
//                     <img src={user.phoProfile}></img>
//                     <h5 className="userName">{user.userName}</h5>
//                 </div> 
//             })}
            
//         </div>
//     )
// }

// export default Search;
