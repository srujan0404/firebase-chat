import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import ChatRooomHeader from "../../components/ChatRoomHeader";
import MessageList from "../../components/MessageList";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Feather } from "@expo/vector-icons";

export default function ChatRoom() {
  const item = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState([]);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="light" />
      <ChatRooomHeader user={item} router={router} />
      <View
        style={{
          height: hp(3),
          borderBottomWidth: 1,
          borderBottomColor: "neutral-200",
        }}
      />
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          backgroundColor: "neutral-100",
          overflow: "visible",
        }}
      >
        <View style={{ flex: 1 }}>
          <MessageList messages={messages} />
        </View>
        <View style={{ marginBottom: hp(1.7), paddingTop: hp(2) }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginHorizontal: wp(3),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: "neutral-300",
                padding: hp(2),
                borderRadius: hp(1),
              }}
            >
              <TextInput
                placeholder="Type your message"
                style={{ flex: 1, fontSize: hp(2) }}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: "neutral-200",
                  padding: hp(2),
                  borderRadius: hp(1),
                  marginRight: 1,
                }}
              >
                <Feather name="send" size={hp(2.7)} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
