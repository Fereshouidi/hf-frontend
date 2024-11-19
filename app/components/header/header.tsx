'use client';
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.min.js';
import './header.css';
import './header-media.css';
import { getPublicSearch } from "../../crud.mjs";
import { parse } from "path";
import { BrowserRouter } from "react-router-dom";
import logoJPG from './logo.jpg';




const Header = ({ logo, setActivePage, setActivePageLogo },props) => {

  let userData = null;
  try{
    userData = localStorage.getItem('userData') != undefined? 
    JSON.parse(localStorage.getItem('userData'))
    : localStorage.removeItem('userData');
  }catch(err){
    console.log(err);
  }
    

  useEffect(() => {
    const savedPage = localStorage.getItem('activePage');
    if (savedPage) {
      document.getElementById(savedPage)?.classList.add('active-page');
    }
  }, []);

  const handleActivePage = (itemClicked) => {
    setActivePage(itemClicked.page);
    setActivePageLogo(itemClicked.logo);
    localStorage.setItem("activePage", itemClicked.page);
    localStorage.setItem("activePageLogo", itemClicked.logo);

    const navItems = document.getElementsByClassName('nav-item');
    for (let i = 0; i < navItems.length; i++) {
      navItems[i].classList.remove('active-page');
    }

    document.getElementById(itemClicked.page).classList.add('active-page');
  };

  
  const searchRef = useRef<HTMLInputElement>(null);
  const [userSearch, setUserSearch] = useState('');
  const handleSearch = () => {
    searchRef.current? setUserSearch(searchRef.current.value): setUserSearch('');
  }
  const [userFound, setUserFound] = useState([]);
  
  useEffect(() => {
    async function f() {
      let res = await getPublicSearch(userSearch);
      setUserFound(res);
      console.log(props.userFound);
      localStorage.setItem('userFound', JSON.stringify(userFound) );
    } f();
  },[userSearch])

  // import '../../images/logo.jpg'
  
  
  return (    
 <header>

    <div id='logo'>
    <img src={logoJPG.src}/>
    </div>

    <div className="container">

  <div id='pageName'>{logo}</div>

    <div id='navigation'>
      <span id='profile' className="nav-item" onClick={() => handleActivePage({ page: "profile", logo: 'Profile' })}>
        <div className="container_">
          <span className="itemName">Profile</span> <img src= {userData && userData.phoProfile 
         ? userData.phoProfile 
         : 'https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?w=166&h=180&c=7&r=0&o=5&pid=1.7'}></img>
        </div>
      </span >
      <span id='setting' className="nav-item" onClick={() => handleActivePage({ page: "setting", logo: 'Setting' })}>
      <span className="itemName">Setting</span>  <i className="fa-solid fa-gear"></i>
      </span>
      <span id='people' className="nav-item" onClick={() => handleActivePage({ page: "people", logo: 'People' })}>
      <span className="itemName">People</span>  <i className="fa-solid fa-user-group"></i>
      </span>
      <span id='chats' className="nav-item" onClick={() => handleActivePage({ page: "chats", logo: 'Chats' })}>
      <span className="itemName">Chats</span>  <i className="fa-solid fa-comment"></i>
      </span>
      <span 
      id='search' className="nav-item"
        onClick={() =>{  
          handleActivePage({ page: "search", logo: 'Search' });
          handleSearch()
       }} ref={searchRef}
      >
        <span className="itemName">Search</span> <i className="fas fa-search"></i>
      </span>

    </div>

    </div>
    

  </header>




// <header>
//         <a className="navbar-brand" href="#">{logo}</a>
      
//           <ul id="ul" className="navbar-nav me-auto mb-2 mb-lg-0">
//             <li id='profile' className="nav-item" onClick={() => handleActivePage({ page: "profile", logo: 'Profile' })}>
//               <div className="container">
//                 {/* <i className="fa-solid fa-chevron-down"></i> */}
//                 <a className="nav-link active" aria-current="page" href="#">{'profile'}</a>
//                 <img src="https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?w=166&h=180&c=7&r=0&o=5&pid=1.7"/>
//               </div>
//             </li>
//             <li id='setting' className="nav-item" onClick={() => handleActivePage({ page: "setting", logo: 'Setting' })}>
//               <div className="container">
//                 <a className="nav-link active" aria-current="page" href="#">{'setting'}</a>
//                 <i className="fa-solid fa-gear"></i>
//               </div>
//             </li>
//             <li id='people' className="nav-item" onClick={() => handleActivePage({ page: "people", logo: 'People' })}>
//               <div className="container">
//                 <a className="nav-link active" aria-current="page" href="#">{'people'}</a>
//                 <i className="fa-solid fa-user-group"></i>
//               </div>
//             </li>
//             <li id='chats' className="nav-item" onClick={() => handleActivePage({ page: "chats", logo: 'Chats' })}>
//               <div className="container">
//                 <Link href='#' className="nav-link active" aria-current="page">{'chats'}</Link>
//                 <i className="fa-solid fa-comment"></i>
//               </div>
//             </li>
          
//             <input id='search' 
//               onChange={() =>{  
//                 handleActivePage({ page: "search", logo: 'Search' });
//                 handleSearch()
//               }} ref={searchRef}
//               className="form-control me-2 nav-item" 
//               type="search" placeholder="Search" aria-label="Search" />
//             </ul>
//     </header>
   
  );
};

export default Header;
