import React, { useEffect, useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import 'react-native-url-polyfill/auto'
import { BarCodeScanner } from "expo-barcode-scanner";


export default function SiteConfiguration({ navigation }) {

  const [errorMessage, seterrorMessage] = useState('')
  const [loading, setloading] = useState(false)
  const [QRCodeScannerModalViewStatus, setQRCodeScannerModalViewStatus] = useState(false)
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);




  const storeDataLocally = async (supabaseEnvironmentKey) => {
    try {
      await AsyncStorage.setItem(
        'environmentKeys',
        JSON.stringify(supabaseEnvironmentKey),
      );
    } catch (error) {
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
    
    setScanned(true)
    const supabaseEnvironmentKey = {
        "supabaseURI": data.split('&')[0].split('=')[1],
        "supabaseAnonKey": data.split('&')[1].split('=')[1]
    }
    storeDataLocally(supabaseEnvironmentKey)
    setScanned(false)
    navigation.navigate('LogInScreen')
  };

  const setAllToNone = () => {
    setQRCodeScannerModalViewStatus(!QRCodeScannerModalViewStatus)
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
      {/* <Image
        style={styles.logo}
        source={require('../../assets/icon.png')}
      /> */}
      <View style={styles.ScanQRCodeBtnView} >
        <Text style={styles.ORText}>Welcome to Supplier Portal</Text>
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
              <Text style={styles.cancelButtonText} onPress={()=>setScanned(false)}>Cancel</Text>
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
  ScanQRCodeBtnView: {
    flex: 1,
    alignItems: "center",
    marginTop: 20
  },
  ORText: {
    fontSize: 25,
    color: '#2e2e2d',
    textAlign: 'center', 
    fontWeight:'bold',
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
  qrCodeCamera: {
    height: 400,
    width: '100%'
  }
})