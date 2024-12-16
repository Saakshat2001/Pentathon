import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, Button } from 'react-native';

export default function Dashboard() {
  const [isChatOpen, setIsChatOpen] = useState(false); // State for controlling chat popup visibility
  const [message, setMessage] = useState(''); // State to store the chat message

  // Function to open chat popup
  const openChat = () => {
    setIsChatOpen(true);
  };

  // Function to close chat popup
  const closeChat = () => {
    setIsChatOpen(false);
  };

  // Function to handle message send (can be extended to send messages)
  const sendMessage = () => {
    console.log('Sent message: ', message);
    setMessage(''); // Clear the message input field after sending
    closeChat(); // Close the chat popup
  };

  return (
    <View style={styles.container}>
      {/* Dashboard Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Dashboard Card</Text>
        <Text style={styles.cardDescription}>This is a card component that can hold content.</Text>
      </View>

      {/* Chat Button at the Bottom Right */}
      <TouchableOpacity style={styles.chatButton} onPress={openChat}>
        <Text style={styles.chatButtonText}>💬</Text>
      </TouchableOpacity>

      {/* Chat Popup */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isChatOpen}
        onRequestClose={closeChat}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chat</Text>

            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type your message..."
            />

            <View style={styles.modalActions}>
              <Button title="Send" onPress={sendMessage} />
              <Button title="Close" onPress={closeChat} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
  },
  chatButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: '#0084FF',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  chatButtonText: {
    fontSize: 30,
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
