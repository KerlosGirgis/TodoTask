import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TodoScreen() {
  const [task, setTask] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'error' | 'success' | null>(null);
  const [tasks, setTasks] = useState<{ id: string; title: string; date: string; time: string }[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    const loadTasks = async () => {
      const stored = await AsyncStorage.getItem('tasks');
      if (stored) setTasks(JSON.parse(stored));
    };
    loadTasks();
  }, []);

  const saveTasks = async (newTasks: any) => {
    setTasks(newTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const addTask = () => {
    setMessage(null);
    setMessageType(null);
    if (task.trim() === "") {
      setMessage('Please enter a task');
      setMessageType('error');
      return;
    }
    const taskDate = date.toLocaleDateString();
    const taskTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newTask = { id: Date.now().toString(), title: task, date: taskDate, time: taskTime };
    const newTasks = [...tasks, newTask];
    saveTasks(newTasks);
    setTask("");
    setMessage('Task added successfully!');
    setMessageType('success');
    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 1000);
  };

  const deleteTask = (id: string) => {
    const newTasks = tasks.filter((item) => item.id !== id);
    saveTasks(newTasks);
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const onChangeTime = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) setDate(selectedTime);
  };


  return (
    <View className="flex-1 bg-gray-900 pt-16 px-5">
      <Text className="text-3xl font-extrabold mb-8 text-center text-white tracking-wide">Tasks</Text>
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

      <View className="mb-3">
        <Text className="text-white mb-2">Task Date: {date.toLocaleDateString()}</Text>
        <TouchableOpacity className="bg-gray-700 rounded-xl p-2 mb-2" onPress={() => setShowDatePicker(true)}>
          <Text className="text-white text-center">Pick Date</Text>
        </TouchableOpacity>
        <Text className="text-white mb-2">Task Time: {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        <TouchableOpacity className="bg-gray-700 rounded-xl p-2 mb-2" onPress={() => setShowTimePicker(true)}>
          <Text className="text-white text-center">Pick Time</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display="default"
            onChange={onChangeTime}
          />
        )}
      </View>
      <View className="flex-row mb-5">
        <TextInput
          className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-xl p-4 mr-2 shadow-sm placeholder-gray-400"
          placeholder="Insert a new task"
          placeholderTextColor="#a1a1aa"
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity className="bg-indigo-600 rounded-xl px-5 justify-center items-center shadow-md active:bg-indigo-700" onPress={addTask}>
          <Text className="text-white text-2xl font-bold">+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: { id: string; title: string; date: string; time: string } }) => (
          <View className="flex-row items-center mb-3 bg-gray-800 p-3 rounded-xl">
            <View className="flex-1">
              <Text className="text-white text-lg font-semibold">{item.title}</Text>
              <Text className="text-gray-400 text-xs">{item.date} at {item.time}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Text className="text-red-400 font-bold text-lg">Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
