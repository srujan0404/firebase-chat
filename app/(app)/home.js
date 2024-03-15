import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/authContext'
import { StatusBar } from 'expo-status-bar';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
// import { ActivityIndicator } from 'react-native-web';
import ChatList from '../../components/ChatList';
import Loading from '../../components/Loading';
import { getDocs, query, where } from 'firebase/firestore';
import { usersRef } from '../../firebaseConfig';

export default function Home() {
  const {logout, user} = useAuth();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if(user?.uid){
      getUsers();
    }
  }, [])
  const getUsers = async () => {
    //fetch users form firebase
    const q = query(usersRef, where('userId', '!=', user?.uid));
    
    const querySnapshot = await getDocs(q);
    let data = [];

    querySnapshot.forEach(doc=>{
      data.push({...doc.data()});
    });

    setUsers(data);
  }
  
    useEffect(() => {
      createRoomIfNotExists();

      let roomId = getRoomId(user?.userId, item?.userId);
      const docRef = doc(db, "rooms", roomId);
      const messagesRef = collection(docRef, "messages");
      const q = query(messagesRef, orderBy("createdAt", "asc"));

      let unsub = onSnapshot(q, (snapshot) => {
        let allMessages = snapshot.docs.map((doc) => {
          return doc.data();
        });
        setMessages([...allMessages]);
      });
      return unsub;
    }, []);

  return (
    <View className="flex-1 bg-white">
      <StatusBar style='light'/>
      {
        users.length > 0 ? (
          <ChatList users={users}/>
        ) : (
          <View className="flex items-center" style= {{top: hp(30)}}>
            <ActivityIndicator size='large'/>
          </View>
        )
      }
    </View>
  );
}