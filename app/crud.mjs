import axios from 'axios';

const tunnelUrl = 'https://poor-jobs-remain.loca.lt/api/';
const ipUrl = 'http://192.168.1.104:3002/api';
export const urlCode = ipUrl;


export const rfreshUser = async(userId) => {
    try{
        const response = await axios.post( urlCode + '/get/userById', {userId})
        console.log(response.data);
        return response.data;
    }catch(err){
        console.log(err);
    }
}

export const addUser = async (data) => {
    try {
        const response = await axios.post(urlCode + '/set/user', data);
        return response.data; 
    } catch (error) {
        console.error('Error adding user:', error);
        throw error; 
    }
};

export const getAllUsers = async () => {
    try {
        const response = await axios.get(urlCode + '/get/users'); 
        return response.data; 
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; 
    }
};

export const getUserBy_Email_Password = async ({email, password}) => {
    try {
        const response = await axios.post(urlCode + '/get/user',{email, password}); 
        return response.data; 
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; 
    }
};

export const getPublicSearch = async (searchQuery ) => {
    try {
        if(searchQuery){
            const response = await axios.post(urlCode + '/search',{searchQuery }); 
            return response.data;
        } else{
            const allUsers = await getAllUsers();
            return allUsers;
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; 
    }
};
""
export const getFriendsSearch = async (searchQuery, userId ) => {
    try {
        if(searchQuery){
            console.log('hm');
            const response = await axios.post(urlCode + '/search/fromFriends',{ searchQuery, userId }); 
            return response.data;
        }else{            
            const allFriends = await getAllFriends(userId);
            return allFriends;
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        alert( error); 
    }
};

export const getAllFriends = async (userId) => {
    try{
        const response = await axios.post(urlCode + '/get/allFriends' , {userId})
        console.log(response.data);
        return response.data;
    }catch(err){
        console.log(err);
    }
}

export const getUserById = async(id) => {
    try {
        const response = await axios.post(urlCode + '/get/user/byId',{id }); 
        return response.data; 
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; 
    }
}

export const acceptInvit = async (senderId,receiverId) => {
    try {
        const response = await axios.put(urlCode + '/accept/invitation', {
            senderId: senderId,
            receiverId: receiverId,
        });

        if (response.status === 201) {
            console.log('Friend added successfully:', response.data);
            return response.data;
        } else {
            console.error('Error adding friend:', response.data.message || 'Unknown error');
        }
    } catch (error) {
        console.error('Error message:', error.response ? error.response.data.message : error.message);
    }
};

export const addFriend = async (user, friend) => {
    try {
        const response = await axios.put(urlCode + '/add/relation', {
            user: user,
            friend: friend
        });

        if (response.status === 201) {
            console.log('Friend added successfully:', response.data);
            return response.data;
        } else {
            console.error('Error adding friend:', response.data.message || 'Unknown error');
        }
    } catch (error) {
        console.error('Error message:', error.response ? error.response.data.message : error.message);
    }
};

export const addInvitation = async(senderId, receiverId) => {
    try {
        const response = await axios.put(urlCode + '/add/invitation', {
            senderId: senderId,
            receiverId: receiverId
        });
        return response.data; 
    } catch (error) {
        alert(error)
        console.error('Error adding user:', error);
        throw error; 
    }
}

export const getInvitation = async(senderId, receiverId) => {
    try {
        const response = await axios.post(urlCode + '/get/invitation',{
            senderId: senderId,
            receiverId: receiverId
         }); 
        return response.data; 
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; 
    }
}

export const getInvitationBySender = async(senderId) => {
    try {
        const response = await axios.post(urlCode + '/get/invitations/bySender',{
            userInvitationsSend: senderId
         }); 
        return response.data; 
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; 
    }
}

export const getInvitationByReceiverer = async(receiverId) => {
    try {
        const response = await axios.post(urlCode + '/get/invitations/byReceiver',{
            userInvitationsReceiver: receiverId
         }); 
        return response.data; 
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; 
    }
}

export const rejectInvitation = async(senderId, receiverId) => {
    try {
        const response = await axios.delete(urlCode + '/reject/invitation', {
            data: {
                senderId: senderId,
                receiverId: receiverId
            }
        });
        return response.data; 
    } catch (error) {
        console.error('Error adding user:', error);
        throw error; 
    }
}

export const deleteFriend = async(activeAccount_id, friendForDelete_id) => {
    try {
        const response = await axios.post(urlCode + '/delete/friend', {
            activeAccount_id: activeAccount_id,
            friendForDelete_id: friendForDelete_id
        });
        console.log(response.data);
        return response.data;  
    } catch (err) {
        console.error('Error deleting friend:', err); 
        throw err; 
    }
};

export const addConversation = async(userId1, userId2) => {
    try{
        const response = await axios.post(urlCode + '/add/conversation', {
            userId1: userId1,
            userId2: userId2
        })
        console.log(response.data);
        return response.data
        
    }catch(err){
        console.log('error : ' + err)
    }
}

export const getConversations_ = async (userId) => {
    try{
        const response = await axios.post(urlCode + '/get/conversations', {
            userId: userId
        })
        console.log(response.data)
        return response.data;
    }catch(err){
        console.log('error : ' + err)
    }
}

export const getConversations = async (userId) => {
    try{
        const response = await axios.post(urlCode + '/get/conversationsData', { userId })
        return response.data;
    }catch(err){
        console.log('error : ' + err)
    }
}

export const addMessage = async (conversationId, senderId, message, imageFile) => {
    // console.log(imageFile);
  try {
    const formData = new FormData();
    formData.append('conversationId', conversationId);
    formData.append('senderId', senderId);
    if(message){
        formData.append('message', message);}
    if (imageFile) {
      formData.append('image', imageFile); // إرسال الصورة كـ file
      console.log(imageFile);
    }
    
   // console.log('File name:', imageFile.name);
   // console.log('File size:', imageFile.size);


    const response = await axios.post( urlCode + '/add/message', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (err) {
    console.error('Error sending message:', err);
  }
};

export const getMessagesByConversationId = async(conversationId) => {
    try{
        const response = await axios.post(urlCode + '/get/messages', {
            conversationId: conversationId,
        })
        console.log(response.data)
        return response.data;
    }catch(err){
        console.log(err);
    }
}

export const getLastMessage = async(conversationId) => {
    try{

        const response = await axios.post(urlCode + '/get/message', {
            conversationId: conversationId,
        })
        console.log(response.data);
        return response.data;

    }catch(err){
        console.log(err);
    }
}

export const setVue = async(conversationId, userId) => {
    try{

        console.log(conversationId, userId);
        const response = await axios.put(urlCode + '/set/vue' , {
            conversationId: conversationId,
            userId: userId
        })
        console.log(response.data);
        return response.data;

    }catch(err){
        console.log(err);        
    }
}

export const getConversationCondition = async(conversationId, correspondantId) => {
    try{
        const response = await axios.post(urlCode + `/get/conversationCondition`, {
            conversationId: conversationId,
             correspondantId: correspondantId
        })
        console.log(response.data.condition.hasViewed)
        return response.data.condition.hasViewed

    }catch(err){
        console.log(err);
        
    }
}

export const updateUserName = async(userId, newUserName) => {
    try{
        const response = await axios.put(urlCode + '/update/userName', {
            userId,
            newUserName
        })
        console.log(response.data);
        return response.data;
    }catch(err){
        console.log(err);
    }
}

export const updateDiscription = async(userId, newDiscription) => {
    try{
        const response = await axios.put(urlCode + '/update/discription', {
            userId,
            newDiscription
        })
        console.log(response.data);
        return response.data;
    }catch(err){
        console.log(err);
    }
}

export const updatePhoProfile = async(userId, imageFile) => {

    //console.log(userId, imageFile);
    
    try {
        const formData = new FormData();
        formData.append('userId', userId);
        if (imageFile) {
          formData.append('image', imageFile); // إرسال الصورة كـ file
          console.log(imageFile);
        }
        
        const response = await axios.put(urlCode + '/update/phoProfile', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        console.log(response.data);
        return response.data;
        
    }catch(err){
        console.log(err);
    }
}

export const updatePhoCover = async(userId, imageFile) => {

    //console.log(userId, imageFile);
    
    try {
        const formData = new FormData();
        formData.append('userId', userId);
        if (imageFile) {
          formData.append('image', imageFile); // إرسال الصورة كـ file
          console.log(imageFile);
        }
        
        const response = await axios.put(urlCode + '/update/phoCover', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        console.log(response.data);
        return response.data;
        
    }catch(err){
        console.log(err);
    }
}

export const addLike = async(like_from, like_to) => {
    try{
        console.log(like_from, like_to)
        
        const response = await axios.put(urlCode + '/add/like', {
            like_from,
            like_to
        })
        console.log(response.data)
        return response.data;
    }catch(err){
        console.log(err);
        
    }
}

export const getIsLiked = async(like_from, like_to) => {
    try{
        const response = await axios.post(urlCode + '/get/isLiked', {
            like_from,
            like_to
        })
        console.log(response.data)
        return response.data;
    }catch(err){
        console.log(err);
    }
}

export const getPopularestFriends = async(userId) => {
    try{
        const response = await axios.post(urlCode + '/get/popularestFriends', {
            userId
        })
        console.log(response.data);
        return response.data;
        
    }catch(err){
        console.log(err);
    }
}

export const sendActivationCode = async(to, activationCode) => {
    console.log(to, activationCode);
    
    try{
        const response = await axios.post(urlCode + '/send/activationCode', { to, activationCode })
        console.log(response.date);
        return response.data;
    }catch(err){
        console.log(err);
    }
}

export const updatePassword = async(userId, newPassword) => {
    try{
        const response = await axios.put(urlCode + '/update/password', {userId, newPassword})
        return response.data;
    }catch(err){
        console.log(err);
    }
}

export const addRelation = async(userId, friendId) =>  {
    try{
        const response = await axios.post(urlCode + '/add/relation', {userId, friendId})
        return response.data
    }catch(err){
        console.log(err);
    }
}

export const getRelation = async(userId, friendId) =>  {
    try{
        const response = await axios.post(urlCode + '/get/relation', {userId, friendId})
        //alert(response.data.relation.condition);
        return response.data
    }catch(err){
        console.log(err);
        console.log(err)
    }
}

export const blockFriend = async(blockerId, blockedId) => {
    try{
        const response = await axios.post(urlCode + '/blockFiend', {blockerId, blockedId})
        //alert(response.data);
        return response.data;
    }catch(err){
        console.log();
        alert(err)
    }
}


// 'fareshouidi299@gmail.com'