import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { OPENAI_API_KEY } from '@env';

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: 'Hi, I’m here for you. You can talk to me or ask for help 💜',
    },
  ]);
  const [input, setInput] = useState('');
  const navigation = useNavigation();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages((prev) => [userMsg, ...prev]);
    setInput('');

    const aiReply = await getAIResponse(input);
    const botMsg = {
      id: Date.now().toString() + '_bot',
      sender: 'bot',
      text: aiReply,
    };

    setMessages((prev) => [botMsg, ...prev]);
  };

  const getAIResponse = async (userInput) => {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: userInput }],
        }),
      });

      const data = await res.json();
      console.log('OpenAI response:', data);

      if (data.error) {
        console.error('OpenAI API Error:', data.error);
        return "Sorry, something went wrong.";
      }

      const aiMessage = data?.choices?.[0]?.message?.content;
      if (!aiMessage) {
        return "I'm here for you.";
      }

      return aiMessage.trim();
    } catch (err) {
      console.error('Fetch error:', err);
      return "Sorry, I couldn't reach the AI right now. Try again later.";
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.botBubble,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  const dialEmergency = () => {
    Linking.openURL('tel:10111').catch(() =>
      Alert.alert('Error', 'Unable to open dialer.')
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>SafeSpace Chat</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Community')}>
          <Text style={styles.exit}>Exit</Text>
        </TouchableOpacity>
      </View>

      {/* Emergency Contacts */}
      <View style={styles.emergencyBox}>
        <Text style={styles.emergencyTitle}>🚨 Emergency Contacts</Text>
        <Text style={styles.emergencyText}>📞 SAPS: 10111</Text>
        <Text style={styles.emergencyText}>📞 GBV Helpline: 0800 428 428</Text>
        <Text style={styles.emergencyText}>📞 POWA: 011 642 4345</Text>
        <Text style={styles.emergencyText}>📱 Emergency SMS: *120*7867#</Text>
      </View>

      {/* Panic Button */}
      <TouchableOpacity style={styles.panicButton} onPress={dialEmergency}>
        <Ionicons name="alert-circle" size={20} color="#fff" />
        <Text style={styles.panicText}>Panic Button (Call 10111)</Text>
      </TouchableOpacity>

      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        inverted
        contentContainerStyle={{ padding: 10 }}
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 22, fontWeight: 'bold' },
  exit: { color: '#ff5c5c', fontWeight: 'bold' },
  emergencyBox: {
    backgroundColor: '#fff3f3',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    borderColor: '#ffcccc',
    borderWidth: 1,
  },
  emergencyTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16,
  },
  emergencyText: {
    fontSize: 14,
    marginVertical: 2,
  },
  panicButton: {
    flexDirection: 'row',
    backgroundColor: '#ff4444',
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 10,
  },
  panicText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  messageBubble: {
    marginVertical: 6,
    padding: 10,
    borderRadius: 10,
    maxWidth: '85%',
  },
  userBubble: {
    backgroundColor: '#d1c4e9',
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: '#f3e5f5',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f8f8',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#800080',
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
