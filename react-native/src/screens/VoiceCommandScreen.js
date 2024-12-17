import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { PorcupineManager } from '@picovoice/porcupine-react-native';
import Voice from '@react-native-voice/voice';
import RNFS from 'react-native-fs';
import Tts from 'react-native-tts';
import NotificationScreen from './Notifications';
import RNCalendarEvents from 'react-native-calendar-events';
import axios from 'axios';
import { postData } from '../../service/apiService';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withNavigation } from '@react-navigation/native';



Sound.setCategory('Playback');




export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentKeyword: 'Hey Peter',
      isListening: false,
      speechResult: '',
      response: '', // To store the system's response
    };
  }
  
  // beepSound = new Sound('../../android/app/src/main/assets/beep.mp3', Sound.MAIN_BUNDLE, (error) => {
  beepSound = new Sound('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('Failed to load the sound', error);
    }
  });

  playBeep = () => {
    this.beepSound.play((success) => {
      if (success) {
        console.log('Successfully played beep sound');
      } else {
        console.log('Playback failed due to audio decoding errors');
      }
    });
  };

  async componentDidMount() {
    const { navigation } = this.props;
    navigation.setOptions({
      headerRight: () => (
        <Icon
          name="bell"
          size={25}
          color="black"
          style={{ marginRight: 15 }}
          onPress={() => this.props.navigation.navigate('NotificationScreen')}
        />
      ),
    });
    // Initialize Tts settings
    Tts.setDefaultRate(0.5); // Set default rate
    Tts.setDefaultPitch(0.5); // Set default pitch
    
    // Get available voices and set a specific voice
    Tts.getInitStatus().then(() => {
      Tts.voices().then((voices) => {
        console.log('Available voices:', voices);  // Log all available voices
        // Find a male voice or set the default one
        const maleVoice = "en-US-SMTl03";  // Replace with your desired voice id
        Tts.setDefaultVoice(maleVoice);  // Set the default voice
        console.log('Voice set to:', maleVoice);
      });
    });

    const detectionCallback = (keywordIndex) => {
      if (keywordIndex >= 0) {
        console.log('Wake word detected!');
        this.startListening(); // Start speech recognition after detecting the wake word
      }
    };

    const processErrorCallback = (error) => {
      console.error('Error: ', error.message);
    };

    try {
      // Path to the .ppn file in the raw folder for Android
      const keywordPath = `${RNFS.DocumentDirectoryPath}/heypeter.ppn`;
      await RNFS.copyFileRes('heypeter.ppn', keywordPath);

      // Initialize Porcupine Manager for custom wake word detection
      this._porcupineManager = await PorcupineManager.fromKeywordPaths(
        'bZR+44KUdwZWYBXvi1dkNMGtr120ffLcOVGrzDiMtVfP+yH0FMdEBw==', // AccessKey from Picovoice Console
        [keywordPath], // Custom keyword path
        detectionCallback,
        processErrorCallback
      );

      // Start wake word detection
      await this._porcupineManager.start();
      console.log('Listening for wake word...');
    } catch (error) {
      console.error('Error starting Porcupine manager:', error);
    }
  }

  startListening = async () => {
    try {
      console.log('Starting speech recognition...');
      
      // Stop any previous speech recognition
      await Voice.stop();
      await Voice.destroy();

      // Start speech recognition with a specific language code (e.g., 'en-US')
      await Voice.start('en-US');
       console.log('Voice services started');
       
      // Handle recognized speech results
      Voice.onSpeechResults = this.onSpeechResults;
      Voice.onSpeechError = this.onSpeechError;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  };

  onSpeechResults = (e) => {
    console.log('Speech Results:', e);
    const recognizedText = e.value[0].toLowerCase(); // Get the first recognized result, convert to lowercase for easy comparison
    this.setState({ speechResult: recognizedText });

    // Check recognized speech and respond accordingly
    if (recognizedText.includes('hello')) {
      this.setState({ response: 'Hello, how can I assist you today?' });
      Tts.speak('Hello, how can I assist you today?'); // Speak the response
      this.sendPostRequest('hello'); // Make the POST request when user says hello
    } else if (recognizedText.includes('what is the temperature')) {
      this.setState({ response: 'The temperature is 20 degrees.' });
      Tts.speak('The temperature is 20 degrees.'); // Speak the response
    } else if (recognizedText.includes('tell me about yourself')) {
      this.setState({ response: 'I am Peter, a virtual assistant created to help you with various tasks related to Pentair app' });
      Tts.speak('I am Peter, a virtual assistant created to help you with various tasks related to Pentair app.'); // Speak the response
    } else if( (recognizedText.includes('navigate') || recognizedText.includes('navigation')) && (recognizedText.includes("notification") || recognizedText.includes("notifications")) ){
      this.setState({ response: 'Sure' });
      Tts.speak('Sure'); // Speak the response
     this.props.navigation.navigate('NotificationScreen')
    } else if(recognizedText.includes("play")) {
      this.playBeep()
    } else if( (recognizedText.includes("sync") || recognizedText.includes("sink")) && ( recognizedText.includes("calendar") || recognizedText.includes("calendars")) ) {
      // console.log("calendar data syncing...")
      Tts.speak('Sure, Syncing your calendar data');
      this.syncCalendarData()
    } 
    else {
      this.setState({ response: 'Sorry, I didn\'t understand that.' });
      Tts.speak('Sorry, I didn\'t understand that.'); // Speak the response
    }
  };

  onSpeechError = (e) => {
    console.error('Speech Error:', e.error);
  };

  // Function to send a POST request when user says "hello"
  sendPostRequest = async (message) => {
    const sessionId = "123123123-123123123-435454-12313";  // The session ID
    
    try {
      // Making the POST request
      const response = await fetch('https://x4s7hmcja2.execute-api.us-west-2.amazonaws.com/sandbox/lexinvoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionId,  // Send the session ID in the request body
          messages: [{ content: message }], // Send the message in the body
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json(); // Get the JSON response
      console.log('Server Response:', data);

      // Read the response aloud
      if (data && data.messages) {
        this.setState({ response: data.messages });
        Tts.speak(data.messages[0]);  // Speak the response from the server
      } else {
        this.setState({ response: 'No message received from server.' });
        Tts.speak('No message received from server.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      this.setState({ response: 'Failed to fetch data from server.' });
      Tts.speak('Failed to fetch data from server.');
    }
  };

  componentWillUnmount() {
    if (this.state.isListening) {
      this._porcupineManager?.stop();
    }
    Voice.destroy().then(Voice.removeAllListeners);
    Tts.stop(); // Stop any ongoing speech when the component unmounts
  }

  syncCalendarData = () => {
    const startDate = new Date().toISOString(); // Current date
    const endDate = new Date(new Date().setDate(new Date().getDate() + 20)).toISOString(); // 7 days from now

    RNCalendarEvents.fetchAllEvents(startDate, endDate)
      .then(events => {
        console.log('Fetched events:', events);

        // axios.get('https://x4s7hmcja2.execute-api.us-west-2.amazonaws.com/sandbox/uploadEvents')

        postData(events)
      })
      .catch(error => console.error('Error fetching events:', error));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Wake Word Activated!</Text>
        <Text style={styles.resultText}>
          {this.state.speechResult || 'Say something after the wake word...'}
        </Text>
        <Text style={styles.responseText}>
          {this.state.response || 'I am waiting for your command.'}
        </Text>

        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resultText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  responseText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
