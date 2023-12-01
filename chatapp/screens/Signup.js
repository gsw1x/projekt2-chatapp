import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
//Háttérkép importálása
const backImage = require("../assets/backImage.jpg");

//A komponens definiálása 
export default function Signup({navigation}){
    //Állapotváltozók az email és jelszó tárolására
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //Regisztráció kezelése
    const onHandleLogin = () => {
        if (email !== "" && password !== "") {
            createUserWithEmailAndPassword(auth, email, password)
            .then(() => console.log("Regisztráció sikeres"))
            .catch((err) => Alert.alert("Bejelentkezési hiba", err.message));
        }
    };

    //Email és jelszó inputok 
    return(
        <View style={styles.container}>
            <Image source={backImage} style={styles.backImage}/>
            <View style={styles.whiteSheet}/>
            <SafeAreaView style={styles.form}>
                <Text style={styles.title}>REGISZTRÁCIÓ</Text>
                <TextInput 
                style={styles.input}
                placeholder="Enter email"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoFocus={true}
                value={email}
                onChangeText={(text) => setEmail(text)}
                />
                <TextInput 
                style={styles.input}
                placeholder="Enter password"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={true}
                textContentType="password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                />
            <TouchableOpacity style={styles.button} onPress={onHandleLogin}>
                <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 18}}>Regisztrálj</Text>
            </TouchableOpacity>
            <View style={{marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}>
                <Text style={{color: 'darkgray', fontWeight: '600', fontSize: 14}}>Van már fiókod?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={{color: 'lightgreen', fontWeight: '600', fontSize: 14}}> Lépj Be</Text>
                </TouchableOpacity>
            </View>
            </SafeAreaView>
        </View>
    )
};

//UI és Design 
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: "white",
        alignSelf: "center",
        paddingBottom: 24,
    },
    input:{
        backgroundColor: "#F6F7F8",
        height: 58,
        marginBottom: 20,
        fontSize: 16,
        borderRadius: 10,
        padding: 12,
    },
    backImage: {
        width: "100%",
        height: 340,
        position: "absolute",
        top: 0,
        resizeMode: 'cover'
    },
    whiteSheet: {
        width: '100%',
        minHeight: '75%',
        position: "absolute",
        bottom: 0,
        backgroundColor: '#fff',
    },
    form: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 30,
    },
    button: {
        backgroundColor: 'lightgreen',
        height: 58,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
});  