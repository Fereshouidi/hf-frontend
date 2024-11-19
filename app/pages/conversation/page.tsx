"use client";

import './conversation.css';
import logoJPG from '../../images/logo.jpg';
import { useEffect, useRef, useState } from 'react';
import { getUserById, addMessage, getMessagesByConversationId, setVue, getRelation } from '../../crud.mjs';
import io from "socket.io-client";
import calculateTimeDifference, { calculateTime } from '../../calcTime';
import ProfilePeaple from '../profilePeaple/page';
import '../profilePeaple/profilePeople.css';

const socket = io('http://192.168.1.103:3002');

const Conversation = () => {

    type UserData = {
  _id: string;
  // أضف الخصائص الأخرى إذا كانت موجودة
};

    //const [correspondantData, setCorrespondantData] = useState<UserData | null>(null);

    const userData = localStorage.getItem('userData') != undefined? JSON.parse(localStorage.getItem('userData')): null;
    const ActiveConversation = JSON.parse(localStorage.getItem("conversation"));
    const phoProfileLess = localStorage.getItem('phoProfileLess');
    const phoCoverLess = localStorage.getItem('phoCoverLess');

    const [correspondantData, setCorrespondantData] = useState();
    const [relation, setRelation] = useState({});
    const [conversationMessages, setConversationMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isClicked, setIsClicked] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(true); // البداية على افتراض أن المستخدم في الأسفل
    const [loadingSendImg, setLoadingSendImg] = useState(false);
    const chatContainerRef = useRef(null);
    const [profilePeapleVisible_, setProfilePeapleVisible_] = useState(false);



    const handlePhoProfileClicked = () => {
        let list = [];
        list.push(correspondantData);
        localStorage.setItem('userProfileClicked', JSON.stringify(list))
        localStorage.setItem("activePage", 'profilePeaple');
        setProfilePeapleVisible_(true)
      }
      

    const handleCorrespondantData = async () => {
        const messages = await getMessagesByConversationId(ActiveConversation._id);
        setConversationMessages(messages);
        console.log(ActiveConversation._id, userData._id);
        console.log(await setVue(ActiveConversation._id, userData._id));
        for (let i = 0; i < ActiveConversation.participants.length; i++) {
            if (ActiveConversation.participants[i] !== userData._id) {
                const correspondant = await getUserById(ActiveConversation.participants[i]);
                setCorrespondantData(correspondant);
                const relation = await getRelation(userData._id, correspondant._id)
                setRelation(relation.relation);
            }
        }
        
    };

    useEffect(() => {
        handleCorrespondantData();

        socket.off('receiveMessage');

        socket.on('receiveMessage', (message) => {
            setConversationMessages((prevMessages) => {
                if (!prevMessages.some(msg => msg._id === message._id)) {
                    return [...prevMessages, message];
                }
                return prevMessages;
            });
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, []);

    const handleMessageInput = (event) => {
        setMessageInput(event.target.value);
    };

    const handleImageSelected = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedFile({ file, imageUrl });
        } else {
            alert('No file selected');
        }
    };

    const sendMessage = async () => {
        setLoadingSendImg(true);
        setIsClicked(true);
        setTimeout(() => {
            setIsClicked(false);
        }, 100);

        if (messageInput || selectedFile) {
            try {
                const messageData = await addMessage(ActiveConversation._id, userData._id, messageInput, selectedFile?.file);
                socket.emit('sendMessage', messageData);
                if(conversationMessages){
                    setConversationMessages((prevMessages) => [...prevMessages, messageData]);
                }else{
                    setConversationMessages([messageData]);
                }
                setMessageInput('');
                setSelectedFile(null);
                scrollToBottom();
            } catch (error) {
                console.error('Error sending message:', error);
            }
        } else {
            alert("You can't send an empty message");
        }
        setLoadingSendImg(false);
    };

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (chatContainerRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
                setIsAtBottom(scrollHeight - scrollTop <= clientHeight + 1); // دقة أعلى للتحقق من القاع
            }
        };

        const chatContainer = chatContainerRef.current;
        chatContainer.addEventListener('scroll', handleScroll);

        return () => {
            chatContainer.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const showImageSelected = (imageUrl) => {
        setSelectedFile({imageUrl});
        console.log(selectedFile)
    }



    return (
        <>
        <div className='conversationPage'>
            <div id='logo_'>
                <a href={"/"}><i className='fas fa-arrow-left'></i></a>
                <img src={logoJPG.src} alt="Logo" />
            </div>

            <div className='conversationSection' ref={chatContainerRef}>
               


                {conversationMessages && conversationMessages.length !== 0 && conversationMessages.map((message) => (
                    
                        <div
                            key={message._id}
                            id={'messageDiv'}
                            dir='auto'
                            className={
                                message.senderId === userData._id
                                ? 'userMessage'
                                : correspondantData && correspondantData._id && message.senderId === correspondantData._id
                                ? 'correspondantMessage'
                                : 'userMessage'

                            }
                        >

                            <p>{message.message ? message.message : null}</p>
                            {message.image && (
                                <img onClick={() => {showImageSelected (message.image)}}
                                    src={message.image} 
                                    alt="Message attachment"
                                    style={message.message? {marginTop: '10px'}: null} 
                                />
                            )}

                        <span className='messageDate'>
                            {message.createdAt ? calculateTime(message.createdAt) : null}
                        </span>
                    </div>
                ))}


                <div className='correspondantDataContainer'>
                    <span onClick={handlePhoProfileClicked} className='correspondantData'>
                        <img
                            className='phoProfile'
                            src= {correspondantData? correspondantData.phoProfile: phoProfileLess}
                            alt='Correspondant'
                        />
                        <span className='name'>
                            {correspondantData ? correspondantData.userName : 'Loading...'}
                        </span>
                    </span>
                </div>

                <i
                    className={isAtBottom ? 'invisible' : 'fas fa-arrow-down'}
                    onClick={scrollToBottom}
                ></i>
            </div>

            <div className={selectedFile ? 'imgShow' : 'invisible'}>
                <i
                    className='fas fa-times cancel'
                    onClick={() => setSelectedFile(null)}
                ></i>
                <img
                    src={selectedFile ? selectedFile.imageUrl : null}
                    alt="Selected"
                />
                <span className={loadingSendImg? 'loading': 'invisible' } >
                    <i className={'fas fa-spinner' } ></i>
                    loading
                </span>
                
            </div>

            <div className='inputBare'>
                {relation.condition != 'block'? 
                <>
                <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageSelected}
                />
                <label htmlFor="fileInput">
                    <i className="fas fa-image addFile" />
                </label>
                <textarea
                    id='inputMessage'
                    value={messageInput}
                    onChange={handleMessageInput}
                    placeholder='Message ...'
                />
                <i
                    id={isClicked ? 'btnSendClicked' : 'btnSend'}
                    className="fas fa-paper-plane sendButton"
                    onClick={sendMessage}
                ></i>
                </>
                : 
                <p>you can't send any message to {correspondantData.userName}</p>}
            </div>

        </div>
    
    
        <ProfilePeaple 
            visibility={profilePeapleVisible_}
            setVisibility={setProfilePeapleVisible_}
            top='var(--logo-bar-height)'
        />

    </>
    );
};

export default Conversation;








// "use client";

// import './conversation.css';
// import logoJPG from '../../images/logo.jpg';
// import { Link } from 'react-router-dom';
// import Chats from '../chats/page';
// import { useEffect, useRef, useState } from 'react';
// import { getUserById, addMessage, getMessagesByConversationId, urlCode } from '../../crud.mjs';
// import io from "socket.io-client";


// const socket = io('http://192.168.111.117:3002');

// const Conversation = () => {

//     const userData = JSON.parse(localStorage.getItem('userData'));
//     const ActiveConversation = JSON.parse(localStorage.getItem("conversation"));

//     const [correspondantData, setCorrespondantData] = useState();
//     const [conversationMessages, setConversationMessages] = useState([]);

    
//     const handleCorrespondantData = async() => {
//         const messages = await getMessagesByConversationId(ActiveConversation._id);
//         socket.on("receiveMessage", (message) => {
//             setConversationMessages((prevMessages) => [...prevMessages, message]);
//           });
//         setConversationMessages(messages);
       
//         for (let i = 0; i < ActiveConversation.participants.length; i++){
//             if( ActiveConversation.participants[i] != userData._id){
//                 const correspondant = await getUserById(ActiveConversation.participants[i])
//                 if(conversationMessages.length != correspondant.length){
//                     setCorrespondantData(correspondant);
//                     console.log(correspondant)
//                 }
//             }
//         }
//     }

//     useEffect( () => {

      
//     handleCorrespondantData();
//     socket.on("receiveMessage", handleCorrespondantData);

//         return () => {
//             socket.off("receiveMessage");
//           };

         
//     }, [])
    
//     const messageRef = useRef();
//     const [messageInput, setMessageInput] = useState();
//     const handleMessageInput = (event) => {
//         setMessageInput(messageRef.current.value);
//     }

//     const [selectedFile, setSelectedFile] = useState(null);
//     const handleImageSelected = (event) => {
//         const file = event.target.files[0];
//         if(file){
//             const imageUrl = URL.createObjectURL(file);
//             setSelectedFile({file, imageUrl});
//         }else{
//             alert('tmch')
//         }
//     }

//     const [isClicked, setIsClicked] = useState(false);
//     const sendMessage = async() => {
//         let sendButton = document.getElementById('sendButton');
//         setIsClicked(true)
//         setTimeout(() => {
//             setIsClicked(false)
//         }, 100)
//         let messageInput_ = document.getElementById('inputMessage').value;
//         console.log(ActiveConversation._id, userData._id, messageInput);
//         if(messageInput_ != ''){
//             console.log(selectedFile)
//             const messageData = await addMessage(ActiveConversation._id, userData._id, messageInput_, selectedFile.file);
//             socket.emit('sendMessage', messageData);
//             setConversationMessages((prevMessages) => [...prevMessages, messageData]); 
//             setMessageInput('');
//             console.log(messageData)
//             scrollToBottom();
//         }else{
//             alert("you can't send empty message !")
//         }
        
//     }

//     const chatContainerRef = useRef(null);
//     const [isAtBottom, setIsAtBottom] = useState(false);

//     useEffect(() => {
//         const handleScroll = () => {
//             if (chatContainerRef.current) {
//                 const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
//                 setIsAtBottom(scrollHeight - scrollTop === clientHeight);
//             }
//         };
    
//         const chatContainer = chatContainerRef.current;
//         chatContainer.addEventListener('scroll', handleScroll);
    
//         return () => {
//             chatContainer.removeEventListener('scroll', handleScroll);
//         };
//     }, []);
    

//     const scrollToBottom = () => {
//         if (chatContainerRef.current) {
//             chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//         }
//     };
    
   
//     const getImageUrl = (imageBuffer) => {
//         if (imageBuffer && imageBuffer.data) {
//           const blob = new Blob([new Uint8Array(imageBuffer.data)], { type: imageBuffer.type });
//           return URL.createObjectURL(blob);
//         }
//         return null;
//       };
      

//     return(

        
//         <div className='conversationPage'>

//             <div id='logo_'>
//             <a href={"/"}><i className='fas fa-arrow-left'></i></a> 
//                 <img src={logoJPG.src}/>
//             </div>
                       

//             <div className='conversationSection' ref={chatContainerRef} >

//             <div className='correspondantDataContainer'>
//                 <span className='correspondantData'>
//                         <img className='phoProfile' src='https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?w=166&h=180&c=7&r=0&o=5&pid=1.7' />
//                         <span className='name'>{correspondantData? correspondantData.userName: null}</span> 
//                 </span> 
//             </div>
                 
//                  {conversationMessages && conversationMessages.length != 0 && conversationMessages.map((message) => {
//                     return <div key={message._id} className={
//                         message && message.senderId == userData._id? 'userMessage'
//                         :correspondantData && message.senderId == correspondantData._id? 'correspondantMessage'
//                         : 'userMessage'
//                     }>
//                         <p>{message.message? message.message: null}</p>
//                         <img>{message.image?  getImageUrl(message.image): null}</img>

//                          </div>
//                  })}
                 



//                  <i className={isAtBottom? 'invisible': 'fas fa-arrow-down'} onClick={scrollToBottom}></i>

//             </div>

//             <div className={selectedFile? 'imgShow': 'invisible'} >
//                 <i className='fas fa-times cancel' onClick={()=>{setSelectedFile('')} }></i>
//                 <img src={selectedFile?  selectedFile.imageUrl: null}></img>
//             </div>

//             <div className='inputBare'>
//                 <input
//                     type="file"
//                     id="fileInput"
//                     accept="image/*"
//                     style={{ display: "none" }}
//                     onChange={(event) => {handleImageSelected(event)} }
//                 />
//                 <label htmlFor="fileInput">
//                     <i className="fas fa-image addFile" />
//                 </label>
//                     <textarea id='inputMessage' ref={messageRef} onChange={(event) => handleMessageInput(event)} type="text" placeholder='Message ...'/>
//                     <i id={isClicked? 'btnSendClicked': 'btnSend'} className="fas fa-paper-plane sendButton" onClick={sendMessage}></i>
//             </div>
//         </div>
//     )
// }
// export default Conversation;
