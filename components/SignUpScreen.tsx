import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
  };

  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'error' | 'success' | null>(null);

  const handleSignUp = async () => {
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
    if (!validatePassword(password)) {
      setMessage('Password must be at least 6 characters, with at least one letter and one number.');
      setMessageType('error');
      return;
    }
    try {
      const existing = await AsyncStorage.getItem('users');
      let users = existing ? JSON.parse(existing) : [];
      if (users.some((u: any) => u.email === email)) {
        setMessage('This email is already registered.');
        setMessageType('error');
        return;
      }
      users.push({ email, password });
      await AsyncStorage.setItem('users', JSON.stringify(users));
      setMessage('Registration successful! You can log in now.');
      setMessageType('success');
      setTimeout(() => {
        navigation.replace('Login');
      }, 1500);
    } catch (e) {
      setMessage('Failed to register.');
      setMessageType('error');
    }
  };


  return (
    <View className="flex-1 bg-gray-900 px-6 justify-center">
      <Text className="text-3xl mb-8 text-center font-extrabold text-white tracking-wide">Create Account</Text>
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
      <TouchableOpacity className="bg-indigo-600 py-3 rounded-xl shadow-md mb-4 active:bg-indigo-700" onPress={handleSignUp}>

  <Text className="text-white text-center text-lg font-semibold">Sign Up</Text>
</TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text className="mt-2 text-indigo-400 text-center">Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}