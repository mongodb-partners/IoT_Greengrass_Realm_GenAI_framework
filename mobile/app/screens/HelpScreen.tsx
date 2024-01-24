import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Button,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeApiCall } from '../utils/helpers';
import { SUPPORT_ASSISTANT_API } from '../../sync.config.js';

type MessageType = {
  text: string;
  type: 'user' | 'bot';
};

const customHeaders = {
  // 'Authorization': 'Bearer YourAccessToken',
  // 'Custom-Header': 'YourCustomValue',
};

export function HelpScreen({ route }) {
  const jobId = route.params.jobId;
  const [message, setMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const history = await AsyncStorage.getItem(jobId);
      if (history !== null) {
        setChatHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const saveChatHistory = async (history: MessageType[]) => {
    try {
      await AsyncStorage.setItem(jobId, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const sendMessage = async () => {
    setLoading(true);
    const userMessage: MessageType = { text: message, type: 'user' };
    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);
    setMessage('');

    const postData = {
      question: message,
    };


    makeApiCall<{}>(SUPPORT_ASSISTANT_API.url, 60000, postData, 'POST', customHeaders)
      .then((data) => {
        //console.log('API Response:', data);
        const botResponse: MessageType = {
          text: data?.answer,
          type: 'bot',
        };
        updatedHistory.push(botResponse);
        setChatHistory(updatedHistory);
        saveChatHistory(updatedHistory);
        setLoading(false);
        scrollViewRef.current?.scrollToEnd();
      })
      .catch((error) => {
        //console.log('API Response:', error);
        const botResponse: MessageType = {
          text: 'I apologize, but it seems there is a connection issue at the moment. Please try again later.',
          type: 'bot',
        };
        updatedHistory.push(botResponse);
        setChatHistory(updatedHistory);
        saveChatHistory(updatedHistory);
        setLoading(false);
        scrollViewRef.current?.scrollToEnd();
      });
    scrollViewRef.current?.scrollToEnd();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.contentContainer}
        onContentSizeChange={(contentWidth, contentHeight) => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }}
      >
        {chatHistory.map((item, index) => (
          <View
            key={index}
            style={[styles.chatBubble, item.type === 'user' ? styles.userChatBubble : styles.otherChatBubble]}
          >
            <Text>{item.text}</Text>
          </View>
        ))}
      </ScrollView>
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="blue" />
      ) : (
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={message}
              onChangeText={(text) => setMessage(text)}
              editable={!loading}
            />
            <Button title="Send" onPress={sendMessage} disabled={loading} />
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 16,
  },
  chatBubble: {
    padding: 10,
    margin: 5,
    borderRadius: 8,
    maxWidth: '70%',
  },
  userChatBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#0084FF',
    borderBottomRightRadius: 0,
  },
  otherChatBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
    borderBottomLeftRadius: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    fontSize: 18,
    padding: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

//export default HelpScreen;
