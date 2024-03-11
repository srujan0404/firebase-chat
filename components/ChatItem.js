import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Image } from "expo-image";
import { blurhash } from "../utils/common";

const ChatItem = ({ item, router, noBorder }) => {
  const containerStyle = [
    styles.container,
    noBorder && { borderBottomWidth: 0 },
  ];

  const openChatRoom = () => {
    router.push({pathname: '/chatRoom', params: item});
  }
  return (
    <TouchableOpacity onPress={openChatRoom} style={containerStyle}>
      <Image source={{ uri: item?.profileUrl }} style={styles.avatar} placeholder={blurhash} transition={500} />

      <View style={styles.infoContainer}>
        <View style={styles.nameTimeContainer}>
          <Text style={styles.nameText}>{item?.username}</Text>
          <Text style={styles.timeText}>Time</Text>
        </View>
        <Text style={styles.lastMessageText}>Last Message</Text>
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
