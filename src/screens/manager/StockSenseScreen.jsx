import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  FlatList,
  ScrollView,
} from "react-native";
import BackButton from "../../components/BackButton";

export default function StockSenseScreen({ navigation }) {
  const [messages, setMessages] = useState([
    {
      id: "1",
      type: "ai",
      text: "Hello! I am StockSense. I have analyzed your supermarket's latest data. How can I help you optimize your business today?",
    },
  ]);
  const [input, setInput] = useState("");
  const flatListRef = useRef(null);

  const SUGGESTED_QUERIES = [
    "🏆 Top cashier today?",
    "📅 Items expiring this week?",
    "💰 Total revenue in May?",
    "📦 Summary of stock levels",
  ];

  const sendMessage = (textToProcess) => {
    const text = typeof textToProcess === "string" ? textToProcess : input;
    if (!text.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      type: "user",
      text: text.trim(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Simulate AI typing response (optional, for realism)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: "ai",
          text: "I'm analyzing the live database for that information...",
        },
      ]);
    }, 1000);
  };

  const renderMessage = ({ item }) => {
    const isAi = item.type === "ai";
    return (
      <View style={[styles.messageWrapper, isAi ? styles.messageWrapperAi : styles.messageWrapperUser]}>
        {isAi && (
          <View style={styles.aiAvatar}>
            <Text style={styles.aiAvatarText}>🤖</Text>
          </View>
        )}
        <View style={[styles.bubble, isAi ? styles.aiBubble : styles.userBubble]}>
          <Text style={[styles.messageText, isAi ? styles.aiText : styles.userText]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <BackButton onPress={() => navigation?.goBack()} />
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>StockSense AI</Text>
              <View style={styles.statusContainer}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Live Database Connected</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Chat Area */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Bottom Section: Suggestions & Input */}
        <View style={styles.bottomContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsContainer}
          >
            {SUGGESTED_QUERIES.map((q, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.suggestionChip}
                onPress={() => sendMessage(q)}
              >
                <Text style={styles.suggestionText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.inputArea}>
            <TextInput
              style={styles.input}
              placeholder="Ask about your supermarket..."
              placeholderTextColor="#94A3B8"
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={200}
            />
            <TouchableOpacity
              style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
              onPress={sendMessage}
              disabled={!input.trim()}
            >
              <Text style={styles.sendIcon}>↑</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC", // Sleek light slate background
  },
  
  /* Header Styles */
  header: {
    flexDirection: "row",
    marginTop: 50,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitleContainer: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981", // Modern emerald green
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },

  /* Chat Styles */
  chatContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  messageWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  messageWrapperAi: {
    justifyContent: "flex-start",
  },
  messageWrapperUser: {
    justifyContent: "flex-end",
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E0E7FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  aiAvatarText: {
    fontSize: 14,
  },
  bubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    maxWidth: "80%",
  },
  aiBubble: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 4, // Tail effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: "#4F46E5", // Modern Indigo
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 4, // Tail effect
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  aiText: {
    color: "#1E293B",
  },
  userText: {
    color: "#FFFFFF",
  },

  /* Bottom Section (Input & Suggestions) */
  bottomContainer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  suggestionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  suggestionChip: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  suggestionText: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "500",
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 8 : 16,
    paddingTop: 4,
  },
  input: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
    color: "#0F172A",
    maxHeight: 100, // Allows multiline to grow slightly before scrolling
  },
  sendBtn: {
    backgroundColor: "#4F46E5",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    marginBottom: 2, // Aligns with bottom of input
  },
  sendBtnDisabled: {
    backgroundColor: "#CBD5E1",
  },
  sendIcon: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});