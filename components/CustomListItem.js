import {Avatar, ListItem} from 'react-native-elements'
import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { auth, db } from "../firebase";

export const CustomListItem = ({id,chatName, enterChat}) => {
  const [chatMessages,setChatMessages] = useState([])
  useEffect(() => {
    const unsubscribe = db.collection('chats').doc(id).collection('messages').orderBy('timestamp', 'desc').onSnapshot(snapshot => (
      setChatMessages(snapshot.docs.map(doc=>doc.data()))
    ))
    return unsubscribe;
  }, []);
  console.log(chatMessages)
  return (
    <ListItem onPress={() => enterChat(id,chatName)} key={id} bottomDivider>
      <Avatar
        rounded
        source={{
            uri: chatMessages?.[0]?.photoURL || "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",
        }} 
        />
        <ListItem.Content>
          <ListItem.Title style ={{fontWeight: "800", color: "black"}}>
            {chatName}
          </ListItem.Title>
          <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
            {chatMessages?.[0]?.displayName} : {chatMessages?.[0]?.message}
          </ListItem.Subtitle>
        </ListItem.Content>
    </ListItem>
  )
}

const styles = StyleSheet.create({})