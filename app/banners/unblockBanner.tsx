import { addInvitation } from '../crud.mjs';
import './banners.css';

function UnblockBanner({visibility, setVisibility, blocked, setRelationCondition}){

    let userData = null;
    try{
      userData = localStorage.getItem('userData') != undefined? 
      JSON.parse(localStorage.getItem('userData'))
      : localStorage.setItem('userData', null);
    }catch(err){
      console.log(err);
    }

    const handleUnblock = async() => {
        const relation = await addInvitation(userData._id, blocked._id)
        setRelationCondition(relation.condition)
        setVisibility(false)
    }
    return(
        <div className={visibility? 'unblockBanner_Page banner': 'invisible'}>
            <div className='container'>
                <i className=' fas fa-times cancel' onClick={() => {setVisibility(false)}}></i>
                <p>Are you sure you want to unblock {blocked? blocked.userName: null}</p>
                <div className='confirmation'>
                    <span className='yes' onClick={handleUnblock}>yes</span>
                    <span className='no' onClick={() => {setVisibility(false)}}>no</span>
                </div>
            </div>
        </div>
    )
}

export default UnblockBanner;