import { AppState } from 'react-native'
// import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASEURL
// const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASEANONKEY

const getSupabaseUri = async ()=>{
    try{
        const environmentKeys = await AsyncStorage.getItem('environmentKeys');
      if (environmentKeys) {
        const environmentKeysData = JSON.parse(environmentKeys);
        return environmentKeysData.supabaseURI
      }
    }catch(error){
      console.log(error)
    }
}
const getSupabaseAnonKey = async ()=>{
    
    try{
        const environmentKeys = await AsyncStorage.getItem('environmentKeys');
      if (environmentKeys) {
        const environmentKeysData = JSON.parse(environmentKeys);
        return environmentKeysData.supabaseAnonKey
      }
    }catch(error){
      console.log(error)
    }
}

export const supabaseCreateClient = (parameter1, parameter2)=>{
  console.log(parameter1)
    return createClient(getSupabaseUri(), getSupabaseAnonKey(), {
      auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
      },
  })
}
