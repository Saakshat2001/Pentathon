import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications from the API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('https://x4s7hmcja2.execute-api.us-west-2.amazonaws.com/sandbox/notifications?userId=user01');
        const data = await response.json();
        // Filter for the notification with code 'SJS-178'
        const filteredNotifications = data.filter(notification => notification.notification_code === 'SJS-178');
        setNotifications(filteredNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Render the event details and suggestions
  const renderNotification = ({ item }) => {
    // Parse the suggestions from JSON string
    const suggestions = JSON.parse(item.suggestions)?.suggestions || [];

    return (
      <View style={styles.notificationCard}>
        {suggestions.map((suggestion, index) => (
          <View key={index} style={styles.suggestionCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.eventTitle}>{suggestion.eventTitle}</Text>
              <Text style={styles.eventDate}>{suggestion.recommendedSchedule}</Text>
            </View>

            <Text style={styles.actionableAdvice}>{suggestion.actionableAdvice}</Text>

            <ScrollView style={styles.suggestionList}>
              {suggestion.steps.map((step, idx) => (
                <View key={idx} style={styles.suggestionItem}>
                  <Text style={styles.suggestionAction}>{step.action}</Text>
                  <Text style={styles.suggestionReminder}>{step.reminder}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : notifications.length === 0 ? (
        <Text style={styles.noNotificationsText}>No new notifications</Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.notification_code}
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
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
  },
  noNotificationsText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold',
  },
  notificationCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  eventDate: {
    fontSize: 14,
    color: '#555',
    textAlign: 'right',
  },
  actionableAdvice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 10,
  },
  suggestionList: {
    marginTop: 10,
    paddingLeft: 15,
  },
  suggestionItem: {
    marginBottom: 10,
  },
  suggestionAction: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  suggestionReminder: {
    fontSize: 14,
    color: '#007AFF',
  },
});

export default NotificationScreen;


// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView, Linking } from 'react-native';

// const NotificationScreen = ({ navigation }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch notifications from the API
//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const response = await fetch('https://x4s7hmcja2.execute-api.us-west-2.amazonaws.com/sandbox/notifications?userId=user');
//         const data = await response.json();
//         setNotifications(data); // Show all notifications
//       } catch (error) {
//         console.error('Error fetching notifications:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();
//   }, []);

//   // Handle opening an alarm when clicking on a reminder
//   const handleAlarmClick = (reminder) => {
//     const alarmTime = reminder.match(/\d{4}-\d{2}-\d{2}/); // Extract date (example: 2024-12-23)
//     if (alarmTime) {
//       const date = new Date(alarmTime[0]);
//       const alarmTimeFormatted = date.toISOString();

//       // Open the native alarm app if possible (open via linking)
//       Linking.openURL(`alarm://${alarmTimeFormatted}`).catch(err => console.error("Failed to open alarm app", err));
//     } else {
//       console.log("No valid date found for alarm.");
//     }
//   };

//   // Render the event details and suggestions
//   const renderNotification = ({ item }) => {
//     // Parse the suggestions from the JSON string
//     const suggestions = JSON.parse(item.suggestions)?.suggestions || [];

//     return (
//       <View style={styles.notificationCard}>
//         {suggestions.map((suggestion, index) => (
//           <View key={index} style={styles.suggestionCard}>
//             <View style={styles.cardHeader}>
//               <Text style={styles.eventTitle}>{suggestion.eventTitle}</Text>
//               <Text style={styles.eventDate}>{suggestion.scheduledDate}</Text>
//             </View>

//             <Text style={styles.actionableAdvice}>{suggestion.actionableAdvice}</Text>

//             {suggestion.steps && (
//               <ScrollView style={styles.suggestionList}>
//                 {suggestion.steps.map((step, idx) => (
//                   <View key={idx} style={styles.suggestionItem}>
//                     <Text style={styles.suggestionAction}>• {step}</Text>
//                   </View>
//                 ))}
//               </ScrollView>
//             )}

//             {suggestion.followUpQuestion && (
//               <TouchableOpacity onPress={() => handleAlarmClick(suggestion.followUpQuestion)}>
//                 <Text style={styles.reminderQuestion}>{suggestion.followUpQuestion}</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         ))}
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <Text style={styles.loadingText}>Loading...</Text>
//       ) : notifications.length === 0 ? (
//         <Text style={styles.noNotificationsText}>No new notifications</Text>
//       ) : (
//         <FlatList
//           data={notifications}
//           renderItem={renderNotification}
//           keyExtractor={(item) => item.notification_code}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     padding: 20,
//   },
//   loadingText: {
//     fontSize: 18,
//     textAlign: 'center',
//     color: '#333',
//   },
//   noNotificationsText: {
//     fontSize: 18,
//     textAlign: 'center',
//     color: 'red',
//     fontWeight: 'bold',
//   },
//   notificationCard: {
//     backgroundColor: '#fff',
//     padding: 15,
//     marginVertical: 10,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   eventTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   eventDate: {
//     fontSize: 14,
//     color: '#555',
//     textAlign: 'right',
//   },
//   actionableAdvice: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#333',
//     marginTop: 10,
//   },
//   suggestionList: {
//     marginTop: 10,
//     paddingLeft: 15,
//   },
//   suggestionItem: {
//     marginBottom: 10,
//   },
//   suggestionAction: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 5,
//   },
//   reminderQuestion: {
//     fontSize: 14,
//     color: '#007AFF',
//     marginTop: 10,
//     textDecorationLine: 'underline',
//   },
// });

// export default NotificationScreen;
