import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function DonationScreen() {
    const navigation = useNavigation();
  return (
     <View style={styles.container}>
       {/* Header with drawer icon */}
       <View style={styles.header}>
         <TouchableOpacity onPress={() => navigation.openDrawer()}>
           <Ionicons name="menu" size={30} color="#000" />
         </TouchableOpacity>
        
       </View>
 
       {/* Main content */}
       <View style={styles.content}>
         <Text>Community!</Text>
       </View>
     </View>
   );
 };
 

 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#fff',
   },
   header: {
     paddingTop: 50,
     paddingHorizontal: 20,
     flexDirection: 'row',
     alignItems: 'center',
     gap: 16,
   },
   title: {
     fontSize: 22,
     fontWeight: 'bold',
   },
   content: {
     flex: 1,
     alignItems: 'center',
     justifyContent: 'center',
   },
 });
