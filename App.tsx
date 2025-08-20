import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { OllamaService, OllamaMessage } from './services/OllamaService';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentModel, setCurrentModel] = useState('llama3.2:1b');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  
  const ollamaService = useRef(new OllamaService()).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    initializeOllama();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const initializeOllama = async () => {
    try {
      setIsLoading(true);
      
      const connected = await ollamaService.checkConnection();
      setIsConnected(connected);

      if (connected) {
        const models = await ollamaService.getAvailableModels();
        const modelNames = models.map(m => m.name);
        setAvailableModels(modelNames);
        
        if (modelNames.length > 0) {
          const defaultModel = modelNames.find(m => m.includes('llama3.2:1b')) || modelNames[0];
          setCurrentModel(defaultModel);
          ollamaService.setDefaultModel(defaultModel);
        }

        addMessage(
          `🤖 Connected to Ollama!\nUsing model: ${currentModel}\nServer: ${ollamaService.getBaseUrl()}`,
          'assistant'
        );
      } else {
        addMessage(
          '❌ Cannot connect to Ollama server.\n\nPlease make sure:\n1. Ollama is installed\n2. Ollama server is running (ollama serve)\n3. Model is available (ollama list)',
          'assistant'
        );
      }
    } catch (error) {
      console.error('Initialization error:', error);
      addMessage('Error initializing Ollama connection.', 'assistant');
    } finally {
      setIsLoading(false);
    }
  };

  const addMessage = (content: string, role: 'user' | 'assistant') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !isConnected || isLoading) return;

    const userMessage = inputText.trim();
    setInputText('');
    addMessage(userMessage, 'user');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const conversationMessages: OllamaMessage[] = messages
        .slice(-10) // Keep last 10 messages for context
        .map(msg => ({
          role: msg.role,
          content: msg.content,
        }));
      
      // Add current user message
      conversationMessages.push({
        role: 'user',
        content: userMessage,
      });

      const response = await ollamaService.generateChatResponse(conversationMessages, currentModel);
      addMessage(response, 'assistant');
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addMessage(`❌ Error: ${errorMessage}`, 'assistant');
    } finally {
      setIsLoading(false);
    }
  };

  const retryConnection = async () => {
    await initializeOllama();
  };

  const renderMessage = (message: ChatMessage) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.role === 'user' ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <Text 
        style={[
          styles.messageText,
          message.role === 'user' ? styles.userMessageText : styles.aiMessageText,
        ]}
      >
        {message.content}
      </Text>
      <Text style={styles.timestamp}>
        {message.timestamp.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ollama Chat</Text>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isConnected ? '#4CAF50' : '#FF5722' },
            ]}
          />
          <Text style={styles.statusText}>
            {isConnected ? `${currentModel}` : 'Disconnected'}
          </Text>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 && !isLoading && (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>🦙 Ollama Chat</Text>
            <Text style={styles.welcomeText}>
              Fully offline AI chat powered by Ollama.
              {'\n\n'}No internet required after setup!
            </Text>
            {!isConnected && (
              <TouchableOpacity style={styles.retryButton} onPress={retryConnection}>
                <Text style={styles.retryButtonText}>Retry Connection</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        
        {messages.map(renderMessage)}
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.loadingText}>Thinking...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder={isConnected ? "Type your message..." : "Connect to Ollama first..."}
          multiline
          maxLength={1000}
          editable={isConnected && !isLoading}
          onSubmitEditing={sendMessage}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!isConnected || isLoading || !inputText.trim()) && styles.sendButtonDisabled,
          ]}
          onPress={sendMessage}
          disabled={!isConnected || isLoading || !inputText.trim()}
        >
          <Text style={styles.sendButtonText}>
            {isLoading ? '...' : 'Send'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  messagesContent: {
    paddingVertical: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 20,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  messageContainer: {
    marginVertical: 4,
    padding: 15,
    borderRadius: 18,
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 6,
  },
  aiMessage: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: 'white',
  },
  aiMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 5,
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  loadingText: {
    marginLeft: 10,
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 10,
    maxHeight: 120,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 22,
    justifyContent: 'center',
    minWidth: 60,
  },
  sendButtonDisabled: {
    backgroundColor: '#adb5bd',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
});