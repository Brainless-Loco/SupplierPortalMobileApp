import { View, Text, StyleSheet, Image, Pressable, Alert, Platform, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Notifications from 'expo-notifications'
import Detailes from './Detailes';

Notifications.setNotificationHandler({
  handleNotification : async()=>
  {
    return{
      shouldPlaySound : false,
      shouldSetBadge : false,
      shouldShowAlert : true
    }
  }
});

const Notification =()=>
{

  const [notificationData, setNotificationData]=  useState([])
  useEffect(()=>{
    const setupPushNotification = async()=>
    {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status
      if(finalStatus!=='granted')
      {
        const { status} = Notifications.requestPermissionsAsync();
        finalStatus = status
      }

      if(finalStatus!=='granted')
      {
        Alert.alert('Permission required!!!!!')
        return;
      }
      
      
    const pushTokenData = await Notifications.getExpoPushTokenAsync({
        projectId : "a3efcda9-308a-426a-9e08-438eb3d4d951"
      });

      console.log(pushTokenData);

      if(Platform.OS === 'android')
      {
        Notifications.setNotificationChannelAsync('default',
        {
          name : 'default',
          importance : Notifications.AndroidImportance.DEFAULT
        })
      }
    }


    handleScedule()

    setupPushNotification()
  },[])


  useEffect(()=>{
    const subscription =Notifications.addNotificationReceivedListener((notification) =>
    {

      // console.log("notification recieved");
      const newData = [...notificationData]
      newData.push(notification)
      setNotificationData(newData);
      // console.log(notification);
    });

    const subscription2 = Notifications.addNotificationResponseReceivedListener((res)=>
    {
      // console.log("response");
      // console.log(res);
    })


    return () =>
    {
      subscription.remove();
      subscription2.remove();
    }

    
  },[setNotificationData])

  const handleScedule = () =>
  {
    Notifications.scheduleNotificationAsync({
      content : {
        title : 'Times up',
        body : 'Clock is stopped !!!!!!',
      },
      trigger : 
      {
        seconds : 2
      }
    })
  }

  const sendPushNotificationHandler = () =>
  {
    fetch('https://exp.host/--/api/v2/push/send' ,
    {
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({
        to :'ExponentPushToken[2aWVy0FyK1fS3_YoT7ikoK]',
        title : 'House Stark',
        body : "Winter is Comming!!!!!",
        data : {
          name : "john Snow"
        }
      })
    }).then(res=>res.json()).then(data => console.log("data",data))
  }


  
  return (
    <View style={style.container}>
      <Image style={style.img} source={require("../../../../assets/pix1.png")}/>
      <Text style={style.header}>Your Notifications</Text>

      <Pressable android_ripple={{color : '#ccc'}} style={style.sendBtn} onPress={sendPushNotificationHandler}>
        <Text style={style.btnText}>Send Notification</Text>
      </Pressable>

      <ScrollView>
        {notificationData.map(data => <Detailes key={data.request.identifier} data={data.request.content}/>)}
      </ScrollView>
    </View>
  )
}



const style = StyleSheet.create(
  {
    container : {
      flex : 1,
      alignItems : 'center'
    },
    header : {
      fontWeight : 'bold',
      fontSize : 20,
      marginTop : "10%",
      marginBottom : '5%'

    },
    img : 
    {
      width : 150,
      height : 150,
      resizeMode : 'stretch',
      marginTop : '20%',
      marginBottom : '5%'
    },
    scheduleBtn : 
    {
      width : 250,
      height : 50,
      backgroundColor : '#124076',
      alignItems : 'center',
      justifyContent : 'center',
      marginBottom : '%5',
      marginTop : '10%'
    },
    btnText : 
    {
      color : '#fff'
    },
    sendBtn : 
    {
      backgroundColor : '#0C2D57',
      width : 250,
      height : 50,
      alignItems : 'center',
      justifyContent : 'center',
      marginBottom : '%5',
      marginTop : '10%'

    }
  }
)

export default Notification