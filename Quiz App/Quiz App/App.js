import React, { useRef, useState } from 'react';

import { EnglishQuestions } from './components.js/EnglishQuestions';

import QuestionItem from './components.js/QuestionItem';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  Modal

} from 'react-native';
const {height,width}=Dimensions.get('window');
const App=()=>{

  const [currentIndex,setCurrentIndex]=useState(1);
  const [questions,setQuestions]= useState(EnglishQuestions);
  const listRef = useRef();
  const [modalVisible,setModalVisible] = useState(false);

  const Reset=()=>{
    const tempData=questions;
    tempData.map((item,ind)=>{
        item.marked = -1;

    });
    let temp=[];
    tempData.map(item=>{
      temp.push(item)
    });
    setQuestions(temp);

  }

  const getTestScore=()=>{
    let marks = 0;
    questions.map(item=>{
      if(item.marked!==-1){
        marks=marks+5;
      }
    });
    return marks;
  };

  const OnSelectOption=(index,x)=>{
    const tempData=questions;
    tempData.map((item,ind)=>{
      if(index==ind){
        if(item.marked!==-1){
        item.marked = -1;
        }else{
        item.marked = x;

        }
      }
    });
    let temp=[];
    tempData.map(item=>{
      temp.push(item)
    });
    setQuestions(temp);


  };
  return(

    <View style={{flex:1}}>
     <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:20,alignItems:'center'}}>
     <Text 
      style={{
        fontSize:20,
        fontWeight:'600',
        
        marginLeft:20,
        color:'#000'

      }}>
      English Questions :{' ' + currentIndex + '/' + EnglishQuestions.length}
      </Text>
      <Text style={{marginRight:20,fontSize:20,fontWeight:'600',color:'black',}}
      onPress={()=>{
        Reset()
        listRef.current.scrollToIndex({animated:true,index:0});
      }
      }>Reset</Text>
     </View>

      <View style={{marginTop:30}}>
        <FlatList
        ref={listRef}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        horizontal
        onScroll={e=>{
          const x = (e.nativeEvent.contentOffset.x / width)+1;
          setCurrentIndex((x).toFixed(0));
        }}
        data={questions}
        renderItem={({item,index})=>{
          return <QuestionItem data={item} selectedOption={(x)=>{
              OnSelectOption(index,x)
          }} />;
        }}
        />

      </View>
      <View style={{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        position:'absolute',
        bottom:50,
        width:'100%'
      }}>
        <TouchableOpacity
        style={{
          backgroundColor: currentIndex>1?'purple':'grey',
          height:50,
          width:100,
          borderRadius:10,
          marginLeft:20,
          justifyContent:'center',
          alignItems:'center'
        }} onPress={()=>{
          if(currentIndex>1){
            listRef.current.scrollToIndex({
              animated:true,
              index:parseInt(currentIndex)-1-1, 
            });
          }
          
        }}>
          <Text style={{color:'#fff',fontWeight:'bold'}}>Previous</Text>
        </TouchableOpacity>

         {currentIndex==10?
         (<TouchableOpacity
          style={{
            backgroundColor:'green',
            height:50,
            width:100,
            borderRadius:10,
            marginLeft:20,
            justifyContent:'center',
            alignItems:'center',
            marginRight:20
          }} 
            
          onPress={()=>{
            setModalVisible(true);
          }}>
            <Text style={{color:'#fff',fontWeight:'bold'}}>Submit</Text>
          </TouchableOpacity>):

         (<TouchableOpacity
          style={{
            backgroundColor:'purple',
            height:50,
            width:100,
            borderRadius:10,
            marginLeft:20,
            justifyContent:'center',
            alignItems:'center',
            marginRight:20
          }} 
            
          onPress={()=>{
            if(questions[currentIndex-1].marked!==-1){
              if(currentIndex < questions.length){
                listRef.current.scrollToIndex({
                  animated:true,
                  index:currentIndex, 
                });
              }  
            }
            
          }}>
            <Text style={{color:'#fff',fontWeight:'bold'}}> Next </Text>
          </TouchableOpacity>)}

        

      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={{flex:1,backgroundColor:'rgba(0,0,0,.5)',justifyContent:'center',alignItems:'center'}}>
          <View style={{backgroundColor:'#fff',width:'90%',borderRadius:10}}>

          <Text style={{fontSize:40,fontWeight:'800',alignSelf:'center',marginTop:20}}>
          Test Score</Text>
            <Text style={{fontSize:40,fontWeight:'800',alignSelf:'center',marginTop:20,color:'green'}}>
              {getTestScore()}</Text>
              <TouchableOpacity
               style={{
                backgroundColor:'red',
                height:50,
                width:100,
                borderRadius:10,
                marginLeft:20,
                justifyContent:'center',
                alignItems:'center',
                marginRight:20,
                alignSelf:'center' 
              }} 
              onPress={()=>setModalVisible(false)}>
            <Text style={{color:'#fff',fontWeight:'bold'}}>Close</Text>
          </TouchableOpacity>

          </View>
          
          
            
        </View>
      </Modal>

    </View>


  );
};

export default App;