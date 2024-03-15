import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import ChatRoomHeader from "../../components/ChatRoomHeader";
import MessageList from "../../components/MessageList";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Feather } from "@expo/vector-icons";
// import {CustomKeyboardView} from "../../components/CustomKeyboardView";
import { useAuth } from "../../context/authContext";
import { getRoomId, getRoomIdId, getUserId } from "../../utils/common";
import { Timestamp, addDoc, collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

// Assuming "neutral" is defined elsewhere in your project
const neutralColor = "#CCCCCC";

export default function ChatRoom() {
  const item = useLocalSearchParams(); //second user
  const {user} = useAuth(); // logged in user
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const textRef = useRef('');
  const inputRef = useRef(null);

  useEffect(() => {
    createRoomIfNotExists();

    let roomId = getRoomId(user?.userId, item?.userId);
    const docRef = doc(db, "rooms", roomId);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    let unsub = onSnapshot(q, (snapshot)=>{
      let allMessages = snapshot.docs.map(doc=>{
        return doc.data();
      });
      setMessages([...allMessages]);
    }); 
    return unsub;
  }, []);

  const createRoomIfNotExists = async () => {
    let roomId = getRoomId(user?.userId, item?.userId);
    await setDoc(doc(db, "rooms", roomId), {
      roomId, 
      createdAt: Timestamp.fromDate(new Date()),
    });
  }

  const handleSendMessage = async () => {
    let message = textRef.current.trim();
    if(message === '') return;
    try {
      let roomId = getRoomId(user?.userId, item?.userId);
      const docRef = doc(db, "rooms", roomId);
      const messageRef = collection(docRef, "messages");
      textRef.current = '';
      if(inputRef) inputRef?.current?.clear();

      const newDoc = await addDoc(messageRef, {
        userId: user?.userId,
        text: message,
        profileUrl: user?.profileUrl,
        senderName: user?.username,
        createdAt: Timestamp.fromDate(new Date())
      });

      console.log("Document written with ID: ", newDoc.id);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  }

  console.log("messages", messages);
  return (
    // <CustomKeyboardView>
      <View style={styles.container}>
        <StatusBar style="black" />
        <ChatRoomHeader user={item} router={router} />
        <View style={styles.separator} />
        <View style={styles.contentContainer}>
          <View style={styles.messageListContainer}>
            <MessageList messages={messages} currentUser={user}/>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.textInputContainer}>
              <TextInput
                ref={inputRef}
                onChangeText={value=>textRef.current = value}
                placeholder="Type a message"
                style={styles.textInput}
              />
              <TouchableOpacity onPress={handleSendMessage}  style={styles.sendButton}>
                <Feather name="send" size={hp(2.7)} color="#737373" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    // </CustomKeyboardView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  separator: {
    height: hp(3),
    borderBottomWidth: 1,
    borderBottomColor: neutralColor,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: neutralColor,
  },
  messageListContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: hp(1.7),
  },
  textInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: wp(3),
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: neutralColor,
    borderRadius: wp(5),
    paddingLeft: wp(5),
    paddingVertical: hp(1),
  },
  textInput: {
    flex: 1,
    fontSize: hp(2),
  },
  sendButton: {
    backgroundColor: neutralColor,
    padding: hp(0.7),
    borderRadius: wp(5),
    marginRight: 8, 
    paddingRight: 2,
  },
});
