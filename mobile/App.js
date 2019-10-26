import React from 'react';
import { SafeAreaView, ScrollView, Text, StatusBar } from 'react-native';

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic" />
        <Text>Hello world!</Text>
      </SafeAreaView>
    </>
  );
}
