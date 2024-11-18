"use client";

import { useEffect, useRef, useState } from "react";
import './accountEdit.css';
import logoJPG from '../../../images/logo.jpg';
import { updateUserName, updateDiscription, updatePhoProfile, updatePhoCover, sendActivationCode, updatePassword } from "../../../crud.mjs";
import { generateActivationCode } from "../../../randomNum";


export default function AccountEdit(){
    
    const phoProfileLess = localStorage.getItem('phoProfileLess');
    const phoCoverLess = localStorage.getItem('phoCoverLess');

    const userData = JSON.parse(localStorage.getItem('userData'))
    const activity = localStorage.getItem('activity');
    const editNameRef = useRef();
    
    useEffect(() => {
        setEditPhoCover(userData.phoCover? {imageUrl: userData.phoCover}: {imageUrl: phoCoverLess});
        setEditPhoProfile(userData.phoProfile? {imageUrl: userData.phoProfile}: {imageUrl: phoProfileLess})
        if(editNameRef.current){
            editNameRef.current.focus();
        }
    },[])
    
    const [userName, setUserName] = useState(userData ? userData.userName : '');
    const handleInputUserName = (event) => {
        setUserName(event.target.value)
    }

    const [editPhoCover, setEditPhoCover] = useState({});
    const handleChangePhoCover = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setEditPhoCover({file, imageUrl});
        } else {
            alert('No file selected');
        }
    };

    const [editPhoProfile, setEditPhoProfile] = useState({});
    const handleChangePhoProfile = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
             setEditPhoProfile({file, imageUrl});
        } else {
            alert('No file selected');
        }
    };
    
    const [discription, setDiscription] = useState(userData ? userData.discription : '');
    const handleInputDiscription = (event) => {
        setDiscription(event.target.value)
    }

    const handleInputHeight = (event) => {
        event.target.style.height = 'auto';
        event.target.style.height =  (event.target.scrollHeight) + 'px';
    }

    const sendNewUserName = async() => {
        const userDataUpdating = await updateUserName(userData._id, userName);
        localStorage.setItem('userData', JSON.stringify(userDataUpdating));
        alert('updating name is done !')
    }

    const sendNewPhoProfile = async() => { 
        try{     
            const userDataUpdating = await updatePhoProfile(userData._id, editPhoProfile.file);
            if(userDataUpdating){
                localStorage.setItem('userData', JSON.stringify(await userDataUpdating));
                alert('updating pho-cover is done !')    
            }else{
                alert('something went wrong !')   
            }
        }catch(err){
            console.log(err);
            alert('something went wrong !');
        }
    }

    const sendNewPhoCover = async() => { 
        try{     
            const userDataUpdating = await updatePhoCover(userData._id, editPhoCover.file);
            if(userDataUpdating){
                localStorage.setItem('userData', JSON.stringify(await userDataUpdating));
                alert('updating pho-cover is done !')    
            }else{
                alert('something went wrong !')   
            }
        }catch(err){
            console.log(err);
            alert('something went wrong !');
        }
    }

    const sendNewDiscription = async() => {
        const userDataUpdating = await updateDiscription(userData._id, discription);
        localStorage.setItem('userData', JSON.stringify(userDataUpdating));
        alert('updating discription is done !')
    }
    



    const [inputPassword ,setInputData] = useState({oldPassword:'', newPassword:'', repassword:''});

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputData(prevInputs => ({ ...prevInputs, [name]: value }));
      };

    const passwordMatches = () => {
        if(inputPassword.newPassword === inputPassword.repassword){
            return true;
        }else{
            return false;
        }
    }

    const isOldPasswordCorrect = () => {
        if(userData.password == inputPassword.oldPassword){
            return true;
        }else{
            return false;
            
        }
    }

    const [verificationCode, setVerificationCode] = useState(0);
    const verifyEmail = () => {
        try{
            const codeVerification = generateActivationCode()
            setVerificationCode(codeVerification);
            sendActivationCode(userData.email, codeVerification);
        }catch(err){
            console.log(err);
        }
    }

    const submate_buttonClicked = async() => {
        if(isOldPasswordCorrect()){
            if(passwordMatches()){
                try{
                    verifyEmail();
                    setVerificationDisplay(true);
                }catch(err){
                    alert('your email is not valid !')
                }
            }else{
                alert('password does not matches !')
            }
        }else{
            alert('your old password is incorrect !')
        }
    }

    const [passwordType, setPasswordType] = useState(false);
    const handlePasswordInput = () => {
        setPasswordType(!passwordType);
    }

    const [verificationDisplay, setVerificationDisplay] = useState(false);

    const resendClicked = () => {
        const element = document.getElementById('resend');
        element.style.color = 'var(--primary-color)';
        setTimeout(() => {
            element.style.color = 'black';
        },100)
        verifyEmail();
    }

    
    const submateVerificationBTN_clicked = async() => {
        try{
            const userUpdated = await updatePassword(userData._id, inputPassword.newPassword);
            localStorage.setItem('userData', JSON.stringify(userUpdated));
            alert("password changed successfully !")
            setVerificationDisplay(false);
        }catch(err){
            console.log(err);
        }
    }

    const [inputUserVerificationCode, setInputUserVerificationCode] = useState(0);
    const handleInputUserVerificationCode = (event) => {
        setInputUserVerificationCode(event.target.value)
    }

    return(
        <div className="accountEditPage">

            <div id='logo_'>
                <a href={"/"}><i className='fas fa-arrow-left'></i></a>
                <img src={logoJPG.src} alt="Logo" />
            </div>

            <div id="edit_UserName_cart" className={activity === 'userName' ? "cart" : 'invisible'}>
                <h2>Edit your account name</h2>
                <input
                    type="text" 
                    value={userName} 
                    ref={editNameRef}
                    onChange={(event) => {handleInputUserName(event)}} 
                />
                <button onClick={sendNewUserName}>DONE</button>
            </div>

            <div id="edit_phoCover_cart" className={activity=='phoCover'? "cart ": 'invisible'}>
                <h2>Edit your pho-cover</h2>
                <input 
                       type="file"
                       id="phoCoverInput"
                       accept="image/*"
                       className="invisible"
                       onChange={(event) => {handleChangePhoCover(event)} }
                />
                <label htmlFor="phoCoverInput">
                    <img 
                        className="phoCover"
                        src={editPhoCover.imageUrl}
                    />
                </label>
                <button onClick={() => {sendNewPhoCover()}}>DONE</button>
                {/* <p className="alert">Double click the button to edit the image ..</p> */}
            </div>

            <div id="edit_phoProfile_cart" className={activity=='phoProfile'? "cart ": 'invisible'}>
                <h2>Edit your pho-profile</h2>
                <input 
                       type="file"
                       id="phoProfileInput"
                       accept="image/*"
                       className="invisible"
                       onChange={(event) => {handleChangePhoProfile(event)} }
                />
                <label htmlFor="phoProfileInput">
                    <img 
                        className="phoProfile"
                        src={editPhoProfile.imageUrl}
                    />
                </label>
                <button onClick={() => {sendNewPhoProfile()}}>DONE</button>
                {/* <p className="alert">Double click the button to edit the image ..</p> */}
            </div>

            <div id="edit_discription_cart" className={activity=='discription'? "cart ": 'invisible'}>
                <h2>Edit your discription :</h2>
                <textarea
                    id="inputDiscription"
                    value={discription} 
                    ref={editNameRef}
                    onChange={(event) => {handleInputDiscription(event)}} 
                    onInput={(event) => {handleInputHeight(event)}}
                />
                <button  onClick={sendNewDiscription}>DONE</button>
            </div>

            <div id="edit_password_cart" className={activity=='password'? "cart ": 'invisible'}>
                <h2>Edit your password :</h2>
                <div className="input-container">
                    <input name="oldPassword" onChange={handleInputChange} type={passwordType? 'password': 'text'} placeholder="Old password ..."></input>
                    <div className="password-i">
                        <i onClick={handlePasswordInput} className={!passwordType? 'fas fa-eye': 'invisible'}></i>
                        <i onClick={handlePasswordInput} className={passwordType? 'fas fa-eye-slash': 'invisible'}></i>
                    </div>
                </div>                
                <div className="input-container">
                    <input name="newPassword" onChange={handleInputChange} type={passwordType? 'password': 'text'} placeholder="New password ..."></input>
                    <div className="password-i">
                        <i onClick={handlePasswordInput} className={!passwordType? 'fas fa-eye': 'invisible'}></i>
                        <i onClick={handlePasswordInput} className={passwordType? 'fas fa-eye-slash': 'invisible'}></i>
                    </div>
                </div>
                <div className="input-container">
                    <input name="repassword" onChange={handleInputChange} type={passwordType? 'password': 'text'} placeholder="Retype the new password ..."></input>
                    <div className="password-i">
                        <i onClick={handlePasswordInput} className={!passwordType? 'fas fa-eye': 'invisible'}></i>
                        <i onClick={handlePasswordInput} className={passwordType? 'fas fa-eye-slash': 'invisible'}></i>
                    </div>
                </div>
                <button id="submate" onClick={submate_buttonClicked}>submate</button>
            </div>

            <div className={verificationDisplay? 'verifyBanner': 'invisible'}>
                <div className="container">
                    <i className=" fas fa-times cancel" onClick={() => {setVerificationDisplay(false)}}></i>
                    <p>Whrite verification code :</p>
                    <input type="number" name="verificationCode" id="verificationCode" placeholder="verification code..." onChange={(event) => {handleInputUserVerificationCode(event)}} />
                    <p className="resend" id="resend" onClick={resendClicked}>send again !</p>
                    <button className="submateBTN" onClick={submateVerificationBTN_clicked}>submate</button>
                </div>
            </div>

        </div>
    )
}