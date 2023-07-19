import React from 'react';
import { Text, View, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import Voice from '@react-native-community/voice';
import axios from 'axios';
import { launchCamera} from 'react-native-image-picker';

const App = () => {
  const [result, setResult] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [disease, setDisease] = useState('');
  const[fileuri,setFileuri] =useState('');
  useEffect(() => {
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);
  const speechStartHandler = e => {
    console.log('speechStart successful', e);
  };

  const speechEndHandler = e => {
    setLoading(false);
    console.log('stop handler', e);
  };

  const speechResultsHandler = e => {
    const text = e.value[0];
    setResult(text);
  };

  const startRecording = async () => {
    setLoading(true);
    try {
      await Voice.start('en-Us');

    } catch (error) {
      console.log('error', error);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setLoading(false);
    } catch (error) {
      console.log('error', error);
    }
  };

  const clear = () => {
    setResult('');
    // OpenCamera();

  };
 

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: result })
  };

  const DetectDisease = async () => {
    try {
      await fetch(
        'https://a3fc-103-49-166-213.ngrok-free.app/human_disease_detection', requestOptions)
        .then(response => {
          response.json()
            .then(data => {
              setDisease(data);
            });
        })
    }
    catch (error) {
      console.error(error);
    }
  }


   
    OpenCamera = () => {
      let options = {
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
      launchCamera(options, response => {
        console.log('Response = ', response);
        console.log('latest');
     
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else {
          console.log('response', JSON.stringify(response));
          setFileuri(response.assets[0].uri);
         
          console.log('lets see inside file uri')
        }
      });
      startRecording(); 
    };
  
   console.log('diseases are',disease.data);
  
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.headingText}>Disease Detector</Text>
        <View style={styles.textInputStyle}>
          <TextInput
            value={result}
            multiline={true}
            placeholder="say something!"
            style={{
              flex: 1,
              height: '100%',
            }}
            onChangeText={text => setResult(text)}
          />
        </View>
        <View style={styles.btnContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="black" />
          ) : (
            <TouchableOpacity onPress={startRecording} style={styles.speak}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Speak</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.stop} onPress={clear}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>clear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.stop} onPress={OpenCamera}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Video</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.clear} onPress={DetectDisease}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Find Disease</Text>
        </TouchableOpacity>
        <View>
        {disease ? <Text style={styles.disease}>NaiveBayes: {disease.data.NaiveBayes}</Text> : <Text style={styles.disease}>Disease...</Text>}
        {disease ? <Text style={styles.disease}>DecisionTree: {disease.data.DecisionTree}</Text> : <Text style={styles.disease}></Text>}
        {disease ? <Text style={styles.disease}>CNN: {disease.data.cnn}</Text> : <Text style={styles.disease}></Text>}
        {disease ? <Text style={styles.disease}>RandoemForest:{disease.data.randomforest}</Text> : <Text style={styles.disease}></Text>}
       </View>
      </SafeAreaView>
    </View>
  );
};
export default App;

 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  headingText: {
    alignSelf: 'center',
    marginVertical: 26,
    fontWeight: 'bold',
    fontSize: 26,
  },
  textInputStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 300,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    shadowOpacity: 0.4,
  },
  speak: {
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
  },
  stop: {
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
  },
  clear: {
    backgroundColor: '#00A36C',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'row',
    with: '50%',
    justifyContent: 'space-evenly',
    marginTop: 24,
  },
  disease:{
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    color:'black',
    fontSize:15,
    margin:5  
  },
  diseaseType:{
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    color:'red',
    fontSize:15,
   
  }
});














