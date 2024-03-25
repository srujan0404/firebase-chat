import { ActivityIndicator, Text, View, StyleSheet } from 'react-native'
import React from 'react'

export default function StartPage() {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="gray"/>
    </View>
  )
}

const styles = StyleSheet.create({})