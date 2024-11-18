import { addInvitation, blockFriend, deleteFriend } from '../crud.mjs';
import './banners.css';

function BlockBanner({visibility, setVisibility, blocked, element}){

    let userData = null;
    try{
      userData = localStorage.getItem('userData') != undefined? 
      JSON.parse(localStorage.getItem('userData'))
      : localStorage.setItem('userData', null);
    }catch(err){
      console.log(err);
    }

    const handleBlock = async() => {
        setVisibility(false)
        element.className = 'invisible';
        const updateUserFriends = await deleteFriend(userData._id, blocked._id);
        const updatedRelation = await blockFriend(userData._id, blocked._id)
    }


    return(
        <div className={visibility? 'blockBanner_Page banner': 'invisible'}>
            <div className='container'>
                <i className=' fas fa-times cancel' onClick={() => {setVisibility(false)}}></i>
                <p>Are you sure you want to block {blocked? blocked.userName: null}</p>
                <div className='confirmation'>
                    <span className='yes' onClick={handleBlock}>yes</span>
                    <span className='no' onClick={() => {setVisibility(false)}}>no</span>
                </div>
            </div>
        </div>
    )
}

export default BlockBanner;