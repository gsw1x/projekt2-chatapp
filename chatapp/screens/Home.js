import React, {useState} from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import colors from '../colors';
import { Entypo } from '@expo/vector-icons';
import { useEffect } from "react";
const catImageUrl = "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=49ed3252c0b2ffb49cf8b508892e452d";
const backImage = require("../assets/backImage.jpg");


const Home = () => {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
          headerLeft: () => (
            <FontAwesome name="search" size={24} color={colors.gray} style={{ marginLeft: 10 }} />
          ),
          headerRight: () => (
            <Image
              source={{ uri: catImageUrl }}
              style={{
                width: 40,
                height: 40,
                marginRight: 10,
              }}
            />
          ),
          headerTitle: "Home",
          headerTitleAlign: "center",
        });
      }, [navigation]);

    return (
        <View style={styles.container}>
          
            <Image source={backImage} style={styles.backImage}/>
            <Text style={styles.title}>KÜLDJ ÜZENETET!</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Chat")} style={styles.chatButton}>
                    <Entypo name="chat" size={24} color={colors.lightGray} />
                </TouchableOpacity>
        </View>
    );
    };

    export default Home;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            backgroundColor: "#dfeed1",
        },
        backImage: {
                width: "100%",
                height: 350,
                position: "absolute",
                bottom: 0,
                resizeMode: 'cover',
        },
        title: {
            fontSize: 36,
            fontWeight: 'bold',
            color: '#2f4d3e',
            alignSelf: "center",
            justifyContent: "center",
            marginBottom: 500,
        },
        chatButton: {
            backgroundColor: colors.primary,
            height: 70,
            width: 70,
            borderRadius: 100,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: colors.primary,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: .9,
            shadowRadius: 8,
            marginBottom:20,
            marginRight: 20,
        }
    });