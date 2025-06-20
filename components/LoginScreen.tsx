import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'error' | 'success' | null>(null);

  const handleLogin = async () => {
    setMessage(null);
    setMessageType(null);
    if (!email || !password) {
      setMessage('All fields are required.');
      setMessageType('error');
      return;
    }
    if (!validateEmail(email)) {
      setMessage('Invalid email format.');
      setMessageType('error');
      return;
    }
    try {
      const existing = await AsyncStorage.getItem('users');
      const users = existing ? JSON.parse(existing) : [];
      const user = users.find((u: any) => u.email === email && u.password === password);
      if (user) {
        await AsyncStorage.setItem('loggedInUser', email);
        setMessage('Login successful!');
        setMessageType('success');
        setTimeout(() => {
          navigation.replace('Todo');
        }, 1000);
      } else {
        setMessage('Incorrect email or password.');
        setMessageType('error');
      }
    } catch (e) {
      setMessage('Login failed.');
      setMessageType('error');
    }
  };


  return (
    <View className="flex-1 bg-gray-900 px-6 justify-center">
      <Text className="text-3xl mb-8 text-center font-extrabold text-white tracking-wide">Log In</Text>
      {message && (
        <Text
          style={{
            color: messageType === 'error' ? '#f87171' : '#4ade80',
            backgroundColor: messageType === 'error' ? '#1e293b' : '#052e16',
            padding: 10,
            borderRadius: 8,
            marginBottom: 12,
            textAlign: 'center',
          }}
        >
          {message}
        </Text>
      )}
      <TextInput
        className="bg-gray-800 border border-gray-700 text-white p-4 mb-4 rounded-xl shadow-sm placeholder-gray-400"
        placeholder="Email"
        placeholderTextColor="#a1a1aa"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="bg-gray-800 border border-gray-700 text-white p-4 mb-6 rounded-xl shadow-sm placeholder-gray-400"
        placeholder="Password"
        placeholderTextColor="#a1a1aa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity className="bg-indigo-600 py-3 rounded-xl shadow-md mb-4 active:bg-indigo-700" onPress={handleLogin}>

  <Text className="text-white text-center text-lg font-semibold">Login</Text>
</TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text className="mt-2 text-indigo-400 text-center">Don't have an account? Sign up now</Text>
      </TouchableOpacity>
    </View>
  );
}