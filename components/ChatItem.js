import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Image } from "expo-image";
import { blurhash, formatDate, getRoomId } from "../utils/common";
import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebaseConfig";

const ChatItem = ({ item, router, noBorder, currentUser }) => {

    const [lastMessage, setLastMessage] = useState(undefined);

    useEffect(() => {
      // createRoomIfNotExists();

      let roomId = getRoomId(currentUser?.userId, item?.userId);
      const docRef = doc(db, "rooms", roomId);
      const messagesRef = collection(docRef, "messages");
      const q = query(messagesRef, orderBy("createdAt", "desc"));

      let unsub = onSnapshot(q, (snapshot) => {
        let allMessages = snapshot.docs.map((doc) => {
          return doc.data();
        });
        setLastMessage(allMessages[0]? allMessages[0] : null);
      });
      return unsub;
    }, []);

    // console.log("last Message: ", lastMessage);


  const containerStyle = [
    styles.container,
    noBorder && { borderBottomWidth: 0 },
  ];

  const openChatRoom = () => {
    router.push({pathname: '/chatRoom', params: item});
  }

  const renderTime = () => {
    if(lastMessage){
      let date = lastMessage?.createdAt;
      return formatDate(new Date(date.seconds * 1000));
    }
  }

  const renderLastMessage = () => {
    if (typeof lastMessage === 'undefined') {
      // Add code here
      return "Loading...";
    }
    if(lastMessage){
      if(currentUser?.userId == lastMessage?.userId)
        return "You: " + lastMessage?.text;
      else
        return lastMessage?.text;
    }else{
      return "Say Hi 🙋‍♂️";
    }
  }

  return (
    <TouchableOpacity onPress={openChatRoom} style={containerStyle}>
      <Image source={{ uri: item?.profileUrl }} style={styles.avatar} placeholder={blurhash} transition={500} />

      <View style={styles.infoContainer}>
        <View style={styles.nameTimeContainer}>
          <Text style={styles.nameText}>{item?.username}</Text>
          <Text style={styles.timeText}>{renderTime()}</Text>
        </View>
        <Text style={styles.lastMessageText}>{renderLastMessage()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: wp(4),
    marginBottom: hp(4),
    paddingBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  avatar: {
    height: hp(6),
    width: hp(6),
    borderRadius: 100,
  },
  infoContainer: {
    flex: 1,
    marginLeft: wp(2),
  },
  nameTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameText: {
    fontSize: hp(1.8),
    fontWeight: "bold",
    color: "#333",
  },
  timeText: {
    fontSize: hp(1.6),
    fontWeight: "medium",
    color: "#888",
  },
  lastMessageText: {
    fontSize: hp(1.6),
    fontWeight: "medium",
    color: "#888",
  },
});

export default ChatItem;
