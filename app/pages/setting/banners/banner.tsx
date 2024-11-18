import { useEffect, useState } from "react";

const Banner = (props) => {

    // const [singInPage , setSingInPage] = useState(false);
    // const [logIn , setLogIn] = useState(false);
    const handleSingInPage = () => {
      props.setSingInPage(true);
      props.setVisibility(false);
    }
    
    const [topPosition, setTopPosition] = useState('-100px')
    useEffect(() => {
        const timer = setTimeout(() => {
            setTopPosition('5px')
        },1)
    })

    return(
        <div id="banner-container" className={props.visibility? 'banner-container': 'invisible' } style={{top: topPosition}} >
            <div id='accountLess-banner' className={props.visibility? 'accountLess-banner': 'invisible' } style={{marginTop: topPosition}} >
              {/* <i id='cancel' onClick={ ()=>{ 
                    props.setVisibility(false);
              }} className="fas fa-times cancel"></i> */}
              <div className="banner-text">
                <h2>{props.text}</h2>
                <h5 id="sign-in-link" onClick={handleSingInPage} >sign in </h5></div>
            </div>
        </div>
    )
}
export default Banner;