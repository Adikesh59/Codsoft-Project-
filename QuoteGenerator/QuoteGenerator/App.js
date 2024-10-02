

import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StatusBar,Linking } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; 
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Tts from 'react-native-tts';
import Snackbar from 'react-native-snackbar';
import Clipboard from '@react-native-clipboard/clipboard';

const { width, height } = Dimensions.get('window');

//Text to speach
Tts.setDefaultLanguage('en-GB');
Tts.setDefaultVoice('com.apple.ttsbundle.Moira-compact');
Tts.setDefaultRate(0.5);
Tts.setDefaultPitch(1.2);
//


export default function App() {
  const [quote, setQuote] = useState('Loading...');
  const [author, setAuthor] = useState('Loading...');
  const [isLoading,setIsLoading] = useState(false);
  const [isSpeaking,setIsSpeaking] = useState(false);

  const randomQuote = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json&jsonp=?");
      const result = await res.json();
      setQuote(result.quoteText);  // Correct field for the quote
      setAuthor(result.quoteAuthor || "Unknown");  // Correct field for the author
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching the quote:", error);
    }
  };

  useEffect(() => {
    randomQuote(); // Fetch a quote when the component loads
  }, []);

  //speak function
  const speakNow = () =>{
    Tts.stop();
    Tts.speak(quote + ' by ' + author);
    Tts.addEventListener('tts-start', (event) => setIsSpeaking(true));
    Tts.addEventListener('tts-finish', (event) => setIsSpeaking(false));
  }
  //

  
const copyToClipboard = ()=>{
  Clipboard.setString(quote);
  Snackbar.show({
    text: 'Quote copied!',
    duration: Snackbar.LENGTH_SHORT,
  });
}


   // Function to open WhatsApp and share the quote
   const shareOnWhatsApp = () => {
    const message = `"${quote}" - ${author}`;
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    
    Linking.openURL(url).catch((err) => {
      console.error("Error opening WhatsApp:", err);
      Snackbar.show({
        text: 'WhatsApp not installed!',
        duration: Snackbar.LENGTH_SHORT,
      });
    });
  };


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eaef2c' }}>
      <StatusBar barStyle={"light-content"} />
      <View style={{ width: width - 40, backgroundColor: '#fff', borderRadius: 20, padding: 20 }}>
        <Text style={{ textAlign: 'center', fontSize: 26, fontWeight: '600', color: '#333', marginBottom: 20 }}>
          Quote of the Day
        </Text>

        <FontAwesome5 name="quote-left" style={{ fontSize: 20, marginBottom: -12 }} color='#000' />
        <Text style={{
          color: '#000',
          fontSize: 16,
          lineHeight: 26,
          letterSpacing: 1.1,
          fontWeight: '400',
          textAlign: 'center',
          marginBottom: 10,
          paddingHorizontal: 30
        }}>
          {quote}
        </Text>
        <FontAwesome5 name="quote-right" style={{ fontSize: 20, textAlign: 'right', marginTop: -20, marginBottom: 20 }} color='#000' />

        <Text style={{ textAlign: 'right', fontWeight: '300', fontSize: 'italic', fontSize: 16, color: '#000' }}>
          -- {author}
        </Text>

        <TouchableOpacity onPress={randomQuote} style={{
          backgroundColor:isLoading ? 'rgba(83,114,240,0.7)': 'rgba(83,114,240,1)',
          padding: 20,
          borderRadius: 30,
          marginVertical: 20
        }}>
          <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center' }}>
            {isLoading ? "Loading..." : "New Quote"}</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <TouchableOpacity 
          onPress={speakNow}
          style={{ borderWidth: 2,
           borderColor: '#5372F0',
            borderRadius: 50,
             padding: 15,
             backgroundColor:isSpeaking ? '#5372F0' : '#fff' }}>
            <FontAwesome name="volume-up" size={22} color={isSpeaking ? '#fff' : '#5372F0'} />
          </TouchableOpacity>

          <TouchableOpacity 
          onPress={copyToClipboard}
          style={{ borderWidth: 2, borderColor: '#5372F0', borderRadius: 50, padding: 15 }}>
            <FontAwesome name="copy" size={22} color="#5372F0" />
          </TouchableOpacity>

          <TouchableOpacity 
          onPress={shareOnWhatsApp}
          style={{ borderWidth: 2, borderColor: '#5372F0', borderRadius: 50, padding: 15 }}>
            <FontAwesome name="whatsapp" size={22} color="#5372F0" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
