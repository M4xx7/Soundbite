import React from 'react';
import { View, Button, Alert } from 'react-native';
import { API_BASE_URL } from '../config/api';

export default function TestScreen() {
  const testPing = async () => {
    try {
      console.log("Sending ping to:", `${API_BASE_URL}/jobs/test-ping`);
      const res = await fetch(`${API_BASE_URL}/jobs/test-ping`, {
        method: 'POST',
      });
      const data = await res.json();
      console.log("Ping response:", data);
      Alert.alert("Success!", JSON.stringify(data));
    } catch (err) {
      console.error("Ping failed:", err);
      Alert.alert("Error", String(err));
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Test Railway Ping" onPress={testPing} />
    </View>
  );
}
