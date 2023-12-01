import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback
} from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { useFocusEffect } from '@react-navigation/native';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, database } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../colors';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { updateDoc, arrayUnion, doc } from 'firebase/firestore';
import useIsOnline  from './useIsOnline';


const storage = getStorage();


export default function Chat() {
    const [messages, setMessages] = useState([]);
    const isOnline = useIsOnline();
    const navigation = useNavigation();
    

    const onSignOut = () => {
      signOut(auth).catch(error => console.log(error));
    };

    useFocusEffect(
      useCallback(() => {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity
              style={{
                marginRight: 10
              }}
              onPress={onSignOut}>
              <AntDesign name="logout" size={24} color={colors.gray} style={{marginRight: 10}}/>
            </TouchableOpacity>
          )
        })
    }, [navigation])
    )

  useEffect(() => {
    
      const collectionRef = collection(database, 'chats');
      const q = query(collectionRef, orderBy('createdAt','desc'));
  
      const unsubscribe = onSnapshot(q, snapshot => {
        console.log('snapshot');
        setMessages(
          snapshot.docs.map(doc => ({
            _id: doc.id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user
          }))
        )
      });
      return () => unsubscribe();
  }, []);
    
  
  const pickImageAsync = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
   
    let imgURI = null;
    const hasStoragePermissionGranted = status === "granted";
   
   if(!hasStoragePermissionGranted) return null;
   
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 4],
      quality: 1,
    });
   
    if (!result.canceled) {
      imgURI = result.uri;
    }
   
    return imgURI;
   };

  useEffect(() => {
    const processImageAndUpload = async () => {
      const imgURI = await pickImageAsync();
      if (imgURI) {
        const imgPermanentURL = await uploadImageToStorage(imgURI);
        const newMessage = {
          _id: Math.random().toString(36).substring(7),
          createdAt: new Date(),
          user: {
            _id: auth?.currentUser?.email,
            avatar: 'https://i.pravatar.cc/300',
          },
          image: imgPermanentURL,
        };
  
        // Feltöltjük a képet, és frissítjük a Firestore-t
        await addDoc(collection(database, 'chats'), newMessage);
  
        setMessages((previousMessages) => GiftedChat.append(previousMessages, [newMessage]));
      }
    };
  
    processImageAndUpload();
  }, []);
  

  const uploadImageToStorage = async (imgURI) => {
    const path = `chats/${Math.random().toString(36).substring(7)}`;
    const storageRef = ref(storage, path);
    const metadata = { contentType: "image/jpg" };

    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", imgURI, true);
      xhr.send(null);
    });

    await uploadBytes(storageRef, blob, 'data_url', metadata);

    blob.close();

    const url = await getDownloadURL(storageRef);

    return url;
  };

 
  const onSend = useCallback(
    async (messages = []) => {
      const newMessages = messages.map(async (message) => {
        const { _id, createdAt, text, user, image } = message;

        // Ellenőrizzük, hogy online vagyunk-e
        if (!isOnline) {
          // Offline üzenet esetén csak a Firestore-hoz adunk hozzá
          const offlineMessage = {
            _id,
            createdAt,
            text,
            user,
            image,
          };

          //Az offline üzenet hozzáadása a Firestore-hoz
          await addDoc(collection(database, 'offlineChats'), offlineMessage);

          return offlineMessage;
        }

        // Online esetén a kép feltöltése és Firestore frissítése
        if (image) {
          const imgPermanentURL = await uploadImageToStorage(image);
          const newMessage = {
            _id,
            createdAt,
            text: '', // Üres szöveg, mert a kép miatt nem lesz szükség a szövegmezőre
            user,
            image: imgPermanentURL,
          };

          //Az új üzenet hozzáadása a Firestore-hoz
          await addDoc(collection(database, 'chats'), newMessage);

          await updateDoc(doc(collection(database, 'chats'), newMessage._id), { image: imgPermanentURL });

          return newMessage;
        } else {
          // Ha ez egy text üzenet
          const newMessage = {
            _id,
            createdAt,
            text,
            user,
          };

          // Az új üzenet hozzáadása
          await addDoc(collection(database, 'chats'), newMessage);

          return newMessage;
        }
      });

      // Várjuk meg, hogy az összes üzenet feldolgozódjon, mielőtt frissítjük a state-et
      const processedMessages = await Promise.all(newMessages);
      setMessages((previousMessages) => GiftedChat.append(previousMessages, processedMessages));
    },
    [isOnline]
  );

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: 'lightgreen', 
          },
          left: {
            backgroundColor: '#f1f1f1', 
          },
        }}
      />
    );
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: auth?.currentUser?.email,
        avatar: 'https://i.pravatar.cc/300',
      }}
      messagesContainerStyle={{
        backgroundColor: '#fff',
      }}
      renderActions={() => (
        <FontAwesome
          name="image"
          size={24}
          color={colors.primary}
          bottom={10}
          marginLeft={10}
          onPress={async () => {
            const imgURI = await pickImageAsync();
            if (imgURI) {
              const imageMessage = {
                _id: Math.random().toString(36).substring(7),
                createdAt: new Date(),
                user: {
                  _id: auth?.currentUser?.email,
                  avatar: 'https://i.pravatar.cc/300',
                },
                image: imgURI,
              };
              onSend([imageMessage]);
            }
          }}
        />
      )}
      renderBubble={renderBubble} // Hozzáadott renderBubble prop
    />
  );
}