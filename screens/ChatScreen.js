import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// These imports load individual services into the firebase namespace.
import {AntDesign, FontAwesome, Ionicons, SimpleLineIcons} from "@expo/vector-icons"
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import { auth, db } from "../firebase";

import {Avatar} from 'react-native-elements'
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import firebase from 'firebase/compat/app';

export const ChatScreen = ({navigation, route}) => {
  const [input,setInput] = useState("");
  const [messages,setMessages] = useState([])
  useLayoutEffect(() => {
    navigation.setOptions({
      title:'Chat',
      headerBackTitleVisible: false,
      headerTitleAlign: "Left",
      headerTitle: () => (
        <View style={{
          flexDirection: "row",
          alignItems: "center",
        }}>
        <Avatar
        rounded
        source={{
            uri: messages[0]?.data.photoURL || "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",
        }} 
        />
          <Text style={{color:"white", marginLeft:10,fontWeight:"700"}}>{route.params.chatName}</Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity style={{marginLeft: 10}} onPress={navigation.goBack}>
           <AntDesign name="arrowleft" size={24} color="white"/>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={{
          flexDirection:"row",
          justifyContent: "space-between",
          width:80,
          marginRight: 20,
        }}>
        <TouchableOpacity style={{marginLeft: 10}}>
          <FontAwesome name="video-camera" size={24} color="white"/> 
        </TouchableOpacity>
        <TouchableOpacity style={{marginLeft: 10}}>
          <Ionicons name="call" size={24} color="white"/> 
        </TouchableOpacity>
        </View>
      )
    })
  }, [navigation,messages])
    const sendMessage = () =>{
      Keyboard.dismiss();
      db.collection('chats').doc(route.params.id).collection('messages').add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        displayName: auth.currentUser.displayName,
        email: auth.currentUser.email,
        photoURL: auth.currentUser.photoURL
      })
      setInput('');
    }

    useLayoutEffect(() => {
        const unsubscribe = db.collection('chats').doc(route.params.id).collection('messages').orderBy('timestamp','desc').onSnapshot(
          ((snapshot) => setMessages(snapshot.docs.map(doc=>({
            id: doc.id,
            data: doc.data()
          })))
        ))
        return unsubscribe;
    }, [route])
    return (
      <SafeAreaView style={{flex:1, backgroundColor:"white"}}>
        <StatusBar style="light"/>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}
        keyboardVerticalOffset={90}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <>
          <ScrollView contentContainerStyle={{padding: 15}}>
            {messages.map(({id,data})=>(
              data.email === auth.currentUser.email ? (
                <View key={id} style={styles.receiver}>
                  <Avatar 
                  position="absolute"
                  bottom={-15}
                  right={-5}
                  rounded
                  containerStyle={{
                    position:"absolute",
                    bottom: -15,
                    right: -5,
                  }}
                  source={{
                    uri: data.photoURL,
                  }}
                  size={30}
                  />
                  <Text style={styles.receiverText}>{data.message}</Text>
                  {/* <Text style={styles.receiverName}>{data.displayName}</Text> */}
                </View>
              ) : (
                <View key={id} style={styles.sender}>
                  <Avatar
                  rounded
                  source={{
                    uri: data.photoURL,
                  }}
                  containerStyle={{
                    position:"absolute",
                    bottom: -15,
                    left: -5,
                  }}
                  />
                  <Text style={styles.senderText}>{data.message}</Text>
                  <Text style={styles.senderName}>{data.displayName}</Text>
                </View>
              )
            ))}
          </ScrollView>
          <View style={styles.footer}>
            <TextInput 
              placeholder="Signal Message" 
              value={input} 
              onChangeText={text =>setInput(text)} 
              onSubmitEditing={sendMessage}
              style={styles.textInput}
              />
              <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                <Ionicons name="send" size={24} color="#2B68E6"/> 
              </TouchableOpacity>
          </View>
            </>
            </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container:{
    flex:1,

  },
  receiver:{
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBotom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  sender:{
    padding: 15,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-start",
    borderRadius: 20,
    marginRight: 15,
    marginBotom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  senderText:{
    color: "black",
    fontWeight:"500",
    marginLeft: 10,
    marginBottom: 15,
  },
  receiverText:{
    color: "black",
    fontWeight:"500",
    marginLeft: 10,
    marginBottom: 15,
  },
  senderName:{
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "white",
  },
  footer:{
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  }, 
  textInput:{
    bottom:0,
    height: 40,
    flex:1,
    marginRight: 15,
    borderColor: "transparent",
    backgroundColor: "#ECECEC",
    padding: 10,
    color: "grey",
    borderRadius: 30,

  }
})