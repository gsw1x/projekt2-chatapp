import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
const backImage = require("../assets/backImage.jpg");

// Definiáljuk a Login komponenst
export default function Login({navigation}){

    // Állapotváltozók az email és jelszó tárolására
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Funkció a bejelentkezés gomb lenyomásának kezelésére
    const onHandleLogin = () => {
        // Ellenőrizzük, hogy az email és a jelszó nem üres
        if (email !== "" && password !== "") {
            // Firebase hitelesítés használata az email és jelszó alapján történő bejelentkezéshez
            signInWithEmailAndPassword(auth, email, password)
            .then(() => console.log("Bejelentkezés sikeres."))// Sikeres bejelentkezés esetén naplózás
            .catch((err) => Alert.alert("Bejelentkezési hiba", err.message));// Hiba esetén figyelmeztetés megjelenítése
        }
    };

    // A UI és Design elemek megjelenítése
    return(
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.container}>
                <Image source={backImage} style={styles.backImage}/>
                <View style={styles.whiteSheet}/>
                <SafeAreaView style={styles.form}>
                    <Text style={styles.title}>BEJELENTKEZÉS</Text>
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
                    <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 18}}>Belépés</Text>
                </TouchableOpacity>
                <View style={{marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}>
                    <Text style={{color: 'darkgray', fontWeight: '600', fontSize: 14}}>Nincs még fiókod?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                    <Text style={{color: 'lightgreen', fontWeight: '600', fontSize: 14}}> Regisztrálj</Text>
                </TouchableOpacity>
                </View>
                </SafeAreaView>
            </View>
        </KeyboardAvoidingView>
    )
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        alignSelf: "center",
        paddingBottom: 25,
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
        resizeMode: 'cover',
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