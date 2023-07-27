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
        'https://0c09-2401-4900-5300-a78e-6851-8732-a6e5-13de.ngrok-free.app/human_disease_detection', requestOptions)
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






// import React, {useState,useEffect} from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   Image,
//   Platform,
//   PermissionsAndroid,
//   TextInput,
//   ActivityIndicator,
//   RefreshControl
// } from 'react-native';
// import {
//   launchCamera,
//   launchImageLibrary
// } from 'react-native-image-picker';
// import Voice from '@react-native-community/voice';

//   const App = () => {
//   const [filePath, setFilePath] = useState('');
//   const [result, setResult] = useState('');
//   const [isLoading, setLoading] = useState(false);
//   const [disease, setDisease] = useState('');
//   const[fileuri,setFileuri] =useState('');
//   const [refreshing, setRefreshing] = React.useState(false);

//   const onRefresh = React.useCallback(() => {
//     setRefreshing(true);
//   }, []);

//   useEffect(() => {
//     Voice.onSpeechStart = speechStartHandler;
//     Voice.onSpeechEnd = speechEndHandler;
//     Voice.onSpeechResults = speechResultsHandler;
//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//     };
//   }, []);
//   const speechStartHandler = e => {
//     console.log('speechStart successful', e);
//   };

//   const speechEndHandler = e => {
//     setLoading(false);
//     console.log('stop handler', e);
//   };

//   const speechResultsHandler = e => {
//     const text = e.value[0];
//     setResult(text);
//   };

//   const startRecording =  () => {
//     // setLoading(true);
//     try {
//        Voice.start('en-Us');
//       captureImage('video');
//     } catch (error) {
//       console.log('error', error);
//     }
   
//   };

//   const stopRecording = async () => {
//     try {
//       await Voice.stop();
//       setLoading(false);
//     } catch (error) {
//       console.log('error', error);
//     }
//   };

//   const clear = () => {
//     setResult('');
//     // OpenCamera();
//     onRefresh();
//   };
 
//   const requestOptions = {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ message: result })
//   };

//   const DetectDisease = async () => {
//     try {
//       await fetch(
//         'https://7121-103-49-166-213.ngrok-free.app/human_disease_detection', requestOptions)
//         .then(response => {
//           response.json()
//             .then(data => {
//               setDisease(data);
//             });
//         })
//     }
//     catch (error) {
//       console.error(error);
//     }
//   }

//   const captureImage = async (type) => {
    
//     console.log("launch camera for video is clicked..");
//     let options = {
//       mediaType: type,
//       maxWidth: 300,
//       maxHeight: 550,
//       quality: 1,
//       videoQuality: 'low',
//       durationLimit: 30, //Video max duration in seconds
//       saveToPhotos: true,
//     };
 
      
//       launchCamera(options, (response) => {
//         console.log('Response = ', response);
        
//         if (response.didCancel) {
//           alert('User cancelled camera picker');
//           return;
//         } else if (response.errorCode == 'camera_unavailable') {
//           alert('Camera not available on device');
//           return;
//         } else if (response.errorCode == 'permission') {
//           alert('Permission not satisfied');
//           return;
//         } else if (response.errorCode == 'others') {
//           alert(response.errorMessage);
//           return;
//         }
//         console.log('base64 -> ', response.base64);
//         console.log('uri -> ', response.uri);
//         console.log('width -> ', response.width);
//         console.log('height -> ', response.height);
//         console.log('fileSize -> ', response.fileSize);
//         console.log('type -> ', response.type);
//         console.log('fileName -> ', response.fileName);
//         setFilePath(response.assets[0].uri);
//         // startRecording();
//       });
      
//   };

//   const chooseFile = (type) => {
//     let options = {
//       mediaType: type,
//       maxWidth: 300,
//       maxHeight: 550,
//       quality: 1,
//     };
//     launchImageLibrary(options, (response) => {
//       console.log('Response = ', response);

//       if (response.didCancel) {
//         alert('User cancelled camera picker');
//         return;
//       } else if (response.errorCode == 'camera_unavailable') {
//         alert('Camera not available on device');
//         return;
//       } else if (response.errorCode == 'permission') {
//         alert('Permission not satisfied');
//         return;
//       } else if (response.errorCode == 'others') {
//         alert(response.errorMessage);
//         return;
//       }
//       console.log('cheack the responce',response.assets[0].uri);
//       console.log('base64 -> ', response.base64);
//       console.log('uri -> ', response.uri);
//       console.log('width -> ', response.width);
//       console.log('height -> ', response.height);
//       console.log('fileSize -> ', response.fileSize);
//       console.log('type -> ', response.type);
//       console.log('fileName -> ', response.fileName);
//       setFilePath(response.assets[0].uri);
//     });
//   };
// console.log('file path is',filePath);
//   return (
//     <SafeAreaView style={{flex: 1}}>
//       <Text style={styles.titleText}>
//         Disease Detector
//       </Text>
//       <View style={styles.container}>
//           {filePath?<Image
//           source={{uri:filePath}}
//           style={styles.imageStyle}
//         />:
//       <Text>image is being displayed.</Text>}
//         <Text style={styles.textStyle}>{filePath.uri}</Text>
//           {/* <TouchableOpacity
//           activeOpacity={0.5}
//           style={styles.buttonStyle}
//           onPress={() => captureImage('video')}>
//           <Text style={styles.textStyle}>
//             Video
//           </Text>
//         </TouchableOpacity> */}
        
//       </View>
//       <View style={styles.textInputStyle}>
//            <TextInput
//             value={result}
//             multiline={true}
//             placeholder="say something!"
//             style={{
//               flex: 1,
//               height: '100%',
//             }}
//             onChangeText={text => setResult(text)}
//           />
//         </View>

//         <View style={styles.btnContainer}>
//          {isLoading ? (
//             <ActivityIndicator size="large" color="black" />
//           ) : (
//             <TouchableOpacity onPress={startRecording} style={styles.speak}>
//               <Text style={{  fontWeight: 'bold' }}>Speak</Text>
//             </TouchableOpacity>
//           )}
//           <TouchableOpacity style={styles.stop} onPress={clear}>
//             <Text style={{ fontWeight: 'bold' }}>clear</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity style={styles.stop} onPress={stopRecording}>
//             <Text style={{ fontWeight: 'bold' }}>stop</Text>
//           </TouchableOpacity>
//         </View>
//         <TouchableOpacity style={styles.clear} onPress={DetectDisease}>
//           <Text style={{ fontWeight: 'bold' }}>Find Disease</Text>
//         </TouchableOpacity>
//         <View>
//         {disease ? <Text style={styles.disease}>NaiveBayes: {disease.data.NaiveBayes}</Text> : <Text style={styles.disease}>Disease...</Text>}
//         {disease ? <Text style={styles.disease}>DecisionTree: {disease.data.DecisionTree}</Text> : <Text style={styles.disease}></Text>}
//         {disease ? <Text style={styles.disease}>CNN: {disease.data.cnn}</Text> : <Text style={styles.disease}></Text>}
//         {disease ? <Text style={styles.disease}>RandoemForest:{disease.data.randomforest}</Text> : <Text style={styles.disease}></Text>}
//        </View>
//     </SafeAreaView>
//   );
// };

// export default App;

// const styles = StyleSheet.create({
//   container: {
//     height:100,
//     padding: 10,
//     backgroundColor: 'white',
//     alignItems: 'center',
    
//   },
//   titleText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     paddingVertical: 20,
//   },
//   textStyle: {
//     padding: 10,
//     color: 'black',
//     textAlign: 'center',
//   },
//   buttonStyle: {
//     alignItems: 'center',
//     backgroundColor: '#DDDDDD',
//     padding: 5,
//     marginVertical: 10,
//     width: 100,
//   },
//   imageStyle: {
//     width: 200,
//     height: 200,
//     margin: 5,
//   },
 
//       headingText: {
//         alignSelf: 'center',
//         marginVertical: 26,
//         fontWeight: 'bold',
//         fontSize: 26,
//       },
//       textInputStyle: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         backgroundColor: 'white',
//         height: 100,
//         borderRadius: 20,
//         paddingVertical: 16,
//         paddingHorizontal: 16,
//         shadowOffset: { width: 0, height: 1 },
//         shadowRadius: 2,
//         elevation: 2,
//         shadowOpacity: 0.4,
//       },
//       speak: {
//         backgroundColor: '#DDDDDD',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 8,
//         borderRadius: 8,
//       },
//       stop: {
//         backgroundColor: '#DDDDDD',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 8,
//         borderRadius: 8,
//       },
//       clear: {
//         backgroundColor: '#DDDDDD',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 10,
//         borderRadius: 8,
//         marginTop: 15,
//       },
//       btnContainer: {
//         display: 'flex',
//         flexDirection: 'row',
//         with: '50%',
//         justifyContent: 'space-evenly',
//         marginTop: 24,
//       },
//       disease:{
//         display:'flex',
//         justifyContent:'center',
//         alignItems:'center',
//         color:'black',
//         fontSize:15,
//         margin:5  
//       },
//       diseaseType:{
//         display:'flex',
//         justifyContent:'center',
//         alignItems:'center',
//         color:'red',
//         fontSize:15,
       
//       }
// });










