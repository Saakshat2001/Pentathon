import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const NotificationScreen = ({ navigation }) => {
  // Sample notifications data
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'New Message', details: 'You have received a new message from John.' },
    { id: '2', title: 'System Update', details: 'A new system update is available for your device.' },
    { id: '3', title: 'Reminder', details: 'Don’t forget to check the upcoming event today.' },
  ]);

  // If notifications array is empty, show the "No alerts" message
  useEffect(() => {
    if (notifications.length === 0) {
      console.log('No notifications available');
    }
  }, [notifications]);

  // Render individual notification
  const renderNotification = ({ item }) => (
    <TouchableOpacity style={styles.notificationContainer}>
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationDetails}>{item.details}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
     
        <TouchableOpacity  style={{marginLeft: 5}}  >
          <Icon name="arrow-left"  size={25} color="#000" />
        </TouchableOpacity>

      </View>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <Text style={styles.noNotificationsText}>No alerts</Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.notificationList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationList: {
    paddingBottom: 20,
  },
  notificationContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationDetails: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  noNotificationsText: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default NotificationScreen;
