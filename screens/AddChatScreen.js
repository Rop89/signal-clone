import {Button, Input} from 'react-native-elements'
import React, {useLayoutEffect, useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { AntDesign } from '@expo/vector-icons'
import { db } from '../firebase'

export const AddChatScreen = ({ navigation }) => {
  const [input, setInput] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a new chat",
      headerBackTitle: "Chats",
    })
  }, [navigation]);
  
  const createChat = async () => {
    console.log(input)
    await db.collection('chats').add({
      chatName:input,
    }).then(() => {
      console.log('sent')
      navigation.goBack()
    }).catch(error => alert(error));
  }
  
  return (
    <View style={styles.container}>
      <Input
      placeholder='Enter a chat name' 
      value={input} 
      onChangeText={(text) =>setInput(text)}
      onSubmitEditing={createChat}
      leftIcon={
        <AntDesign name="wechat" size={24} color="black" />
      }
      />
      <Button disabled={!input} onPress={createChat} title="Create new Chat"/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:"white",
    padding: 30,
    height: "100%"
  },
});
