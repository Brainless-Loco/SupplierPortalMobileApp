import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Checkbox from 'expo-checkbox'
import { Pressable } from 'react-native'
// import 'react-native-url-polyfill/auto'
import { BarCodeScanner } from "expo-barcode-scanner";
// import { supabaseCreateClient } from '../../local/Supabase'

import { createClient } from '@supabase/supabase-js'


export default function LogIn({ navigation }) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, seterrorMessage] = useState('')
  const [loading, setloading] = useState(false)
  const [QRCodeScannerModalViewStatus, setQRCodeScannerModalViewStatus] = useState(false)
  const [isRememberMeChecked, setIsRememberMeChecked] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);


  const [supabaseURI, setsupabaseURI] = useState('')
  const [supabaseAnonKey, setsupabaseAnonKey] = useState('')



  useEffect(() => {
    const extractEnvironmentKeys = async ()=>{
      try{
        const environmentKeys = await AsyncStorage.getItem('environmentKeys');
      if (environmentKeys) {
        const environmentKeysData = JSON.parse(environmentKeys);
        setsupabaseURI(environmentKeysData.supabaseURI)
        setsupabaseAnonKey(environmentKeysData.supabaseAnonKey)
      }
      }catch(error){
        console.log(error)
      }
    }
    extractEnvironmentKeys()
  }, [])
  

  const loginUser = async () => {
    
    const supabase = createClient(supabaseURI, supabaseAnonKey, {
      auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
      },
    })

    setloading(true)
    setEmail(email.trim())

    const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      seterrorMessage(error.message)
    }
    else {
      const { email, role, id } = user
      if (isRememberMeChecked) {
        storeDataLocally(user)
      }
      retriveDataFromSupabase(id)
    }

    setloading(false)
  };

  const onLoginPress = () => {
    loginUser()
  }

  const storeDataLocally = async (user) => {
    try {
      await AsyncStorage.setItem(
        'userData',
        JSON.stringify(user),
      );
    } catch (error) {
      // Error saving data
      console.log(error)
    }
  }

  // For QR Code Scanner Permission
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    // setScanned(true);
    // alert(data);
    if(data.includes("&userID")==false) return;
    // console.log(data)
    const uuid = data.split("&userID=")[1].split("&token=")[0]
    if (uuid.length > 0) {
      setScanned(true)
      retriveDataFromSupabase(uuid)

    }
  };

  const retriveDataFromSupabase = async (uuid) => {
    try {
      console.log("reached")
      const supabase = createClient(supabaseURI, supabaseAnonKey, {
        auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
      })

      let { data } = await supabase
        .from('user_persons_view')
        .select('*')
        .eq('id', uuid);

      setAllToNone()
      navigation.replace("Dashboard", { userData: data[0] })
    }
    catch (e) {
      console.log(e)
    }
  }

  const setAllToNone = () => {
    setQRCodeScannerModalViewStatus(!QRCodeScannerModalViewStatus)
    setEmail('');
    setPassword('');
    seterrorMessage('');
    setScanned(false);
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }


  return (
    <ScrollView style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../../assets/icon.png')}
      />
      <TextInput
        style={styles.input} placeholder='E-mail' placeholderTextColor="#aaaaaa"
        onChangeText={(text) => { setEmail(text); seterrorMessage(''); }} value={email}
        underlineColorAndroid="transparent" autoCapitalize="none"
      />
      <TextInput
        style={styles.input} placeholderTextColor="#aaaaaa" secureTextEntry placeholder='Password'
        onChangeText={(text) => { setPassword(text); seterrorMessage('') }} value={password}
        underlineColorAndroid="transparent" autoCapitalize="none"
      />

      <Pressable style={styles.checkboxContainer} onPress={() => setIsRememberMeChecked(!isRememberMeChecked)}>
        <Checkbox
          style={styles.checkbox}
          value={isRememberMeChecked}
          onValueChange={() => setIsRememberMeChecked(!isRememberMeChecked)}
          color={isRememberMeChecked ? '#e80909' : undefined}
        />
        <Text style={styles.checkboxLabel}>Keep me logged in</Text>
      </Pressable>

      {errorMessage.length > 0 && <Text style={{ color: 'red', textAlign: 'center' }}>*{errorMessage}*</Text>}
      <TouchableOpacity
        disabled={password.length == 0 || email.length == 0}
        style={styles.button}
        onPress={onLoginPress}>
        <Text style={styles.buttonTitle}>
          {loading ? <ActivityIndicator size={18} color={"#fff"} /> : "Log in"}
        </Text>
      </TouchableOpacity>
      <View style={styles.underLogInView} >
        <Text style={styles.ORText}>Or</Text>
        <TouchableOpacity onPress={() => {
          setAllToNone()
        }} style={styles.QRLink}>
          <Text style={styles.QRLinkText}>Scan QR Code</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={QRCodeScannerModalViewStatus}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={styles.qrCodeCamera}
            />
            <TouchableOpacity style={styles.cancelButton}
              onPress={() => {
                setQRCodeScannerModalViewStatus(!QRCodeScannerModalViewStatus);

                setScanned(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>

      </Modal>
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingTop: 30
  },
  container2: {
    flex: 1,
    height: 500,
    width: 600,
    backgroundColor: 'green'
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    fontStyle: 'italic',
    marginBottom: 20
  },
  logo: {
    alignSelf: 'center',
    height: 150,
    width: 150,
    marginBottom: 50
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    color: '#5591ad',
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 15,
    paddingLeft: 16
  },
  button: {
    backgroundColor: '#e80505',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 5,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: 'center'
  },
  buttonTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: "bold"
  },
  underLogInView: {
    flex: 1,
    alignItems: "center",
    marginTop: 20
  },
  ORText: {
    fontSize: 16,
    color: '#2e2e2d',
    textAlign: 'center',
    marginBottom: 10
  },
  QRLink: {
    paddingVertical: 10,
    textAlign: 'center',
    width: '40%',
    borderWidth: 2,
    borderColor: 'red',
    borderRadius: 10,
  },
  QRLinkText: {
    textAlign: 'center',
    color: "#e80505",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '90%'
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  usernameText: {
    color: '#e80505',
  },
  cancelButton: {
    marginTop: 20,
    backgroundColor: '#e80505',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    width: '50%'
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: 15,
    width: '50%'
  },
  checkbox: {
    alignSelf: 'center',
  },
  checkboxLabel: {
    margin: 8,
  },
  qrCodeCamera: {
    height: 400,
    width: '100%'
  }
})