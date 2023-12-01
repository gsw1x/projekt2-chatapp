import React, { useState, createContext, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Chat from './screens/Chat';
import Home from './screens/Home';

// React navigációs stack inicializálása
const Stack = createNativeStackNavigator();

// Authentikált felhasználói állapot kezelése a Context API segítségével
const AuthenticatedUserContext = createContext({});

// AuthenticatedUserProvider komponens definiálása, ami az authentikált felhasználói állapotot tartalmazza
const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

// ChatStack komponens definiálása a Chat és Home képernyőkkel
function ChatStack() {
  return (
    <Stack.Navigator defaultScreenOptions={Home}>
      <Stack.Screen name='Home' component={Home} />
      <Stack.Screen name='Chat' component={Chat} />
    </Stack.Navigator>
  );
}

// AuthStack komponens definiálása a bejelentkezési és regisztrációs képernyőkkel
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='Signup' component={Signup} />
    </Stack.Navigator>
  );
}

// RootNavigator komponens definiálása, ami ellenőrzi az authentikációt és megjeleníti a megfelelő képernyőt
function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged visszaad egy unsubscribe függvényt
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async authenticatedUser => {
        // Ha van authentikált felhasználó, beállítjuk az állapotot, különben null-ra állítjuk
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );
    
    // Az auth listener leiratkozása a komponens unmountolásakor
    return unsubscribeAuth;
  }, [user]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* Ha van felhasználó, akkor a ChatStack, különben az AuthStack jelenik meg */}
      {user ? <ChatStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

// App komponens definiálása, ami a AuthenticatedUserProvider-rel engedi lefutni a RootNavigator-t
export default function App() {
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
}
