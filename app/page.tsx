
'use client';
import './page.css';
import './home.css';
import React, { useState, useEffect } from "react";
import Header from "./components/header/header";
import Section from "./components/section/section";
import Conversation from './pages/conversation/page';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';


export default function Home() {


  const [activePage, setActivePage] = useState(localStorage.getItem('activePage'));
  const [activePageLogo, setActivePageLogo] = useState(localStorage.getItem('activePageLogo'));

  useEffect(() => {
    localStorage.setItem('phoProfileLess', 'https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?w=166&h=180&c=7&r=0&o=5&pid=1.7');
    localStorage.setItem('phoCoverLess', "https://th.bing.com/th/id/OIP.Skr-oJ6BWg_K65k5uDiMdgHaHa?rs=1&pid=ImgDetMain");
    const savedPage = localStorage.getItem('activePage');
    const savedLogo = localStorage.getItem('activePageLogo');
    if (savedPage && savedLogo) {
      setActivePage(savedPage);
      setActivePageLogo(savedLogo);
    }
  }, []);

  return (
    
    <BrowserRouter>
          <div className="main">
            <Header
              logo={activePageLogo}
              setActivePage={setActivePage}
              setActivePageLogo={setActivePageLogo}
            />
            <Section activePage={activePage} setActivePage={setActivePage} />
          </div>
    </BrowserRouter>
  );
}












// 'use client';
// import './page.css';
// import './home.css';
// import React, { useState, useEffect } from "react";
// import { BrowserRouter, Route } from 'react-router-dom';
// import Header from "./components/header/header";
// import Section from "./components/section/section";
// import Conversation from './pages/conversation/page';

// export default function Home() {
//   const [activePage, setActivePage] = useState(localStorage.getItem('activePage'));
//   const [activePageLogo, setActivePageLogo] = useState(localStorage.getItem('activePageLogo'));

//   useEffect(() => {
//     const savedPage = localStorage.getItem('activePage');
//     const savedLogo = localStorage.getItem('activePageLogo');
//     if (savedPage && savedLogo) {
//       setActivePage(savedPage);
//       setActivePageLogo(savedLogo);
//     }
//   }, []);

//   return (

//     <BrowserRouter>
//     <Route>
//       <div className="main">
//         <Header
//           logo={activePageLogo}
//           setActivePage={setActivePage}
//           setActivePageLogo={setActivePageLogo}
//         />
//         <Section activePage={activePage} setActivePage={setActivePage} />
//       </div>
//       <Route path="/conversation" element={<Conversation />} />
//     </Route>
//     </BrowserRouter>
//   );
// }





















// 'use client';
// import './page.css';
// import './home.css';
// import React, { useState, useEffect, useRef } from "react";
// import Header from "./components/header/header";
// import Section from "./components/section/section";

// export default function Home() {
//   const [activePage, setActivePage] = useState(localStorage.getItem('activePage'));
//   const [activePageLogo, setActivePageLogo] = useState(localStorage.getItem('activePageLogo'));

//   useEffect(() => {
//     const savedPage = localStorage.getItem('activePage');
//     const savedLogo = localStorage.getItem('activePageLogo');
//     if (savedPage && savedLogo) {
//       setActivePage(savedPage);
//       setActivePageLogo(savedLogo);
//     }
//   }, []);

  
//   return (
    
//     <div className="main">
//       <Header
//         logo={activePageLogo}
//         setActivePage={setActivePage}
//         setActivePageLogo={setActivePageLogo}
//       />
//       <Section activePage={activePage} setActivePage={setActivePage} />
//     </div>
//   );
// }
