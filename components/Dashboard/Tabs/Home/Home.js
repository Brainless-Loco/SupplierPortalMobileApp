import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ScrollView } from 'react-native'

export default function Home() {
  const userDataKey = 'userData'; // Assuming this is the key you used
  const readData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        const data = JSON.parse(value);
        return data;
      } else {
        console.log('No data');
        return null;
      }
    } catch (error) {
      console.error('Error reading data:', error);
    }
  };

  const readUserData = async () => {
    const data = await readData(userDataKey);
    if (data) {
      // Use the retrieved data (e.g., display in UI)
      console.log('Retrieved user data:', data);
    }
  };

  readUserData();

  return (
    <ScrollView style={styles.container}>
      <Text>{'hi'}</Text>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#efefef'
  }
})