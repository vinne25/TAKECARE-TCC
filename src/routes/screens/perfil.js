import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';

const Perfil = () => {
  const [userData, setUserData] = useState({});
  const [imageUri, setImageUri] = useState(null);
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const docRef = doc(db, 'Usuarios', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleUpdate = async () => {
    if (user) {
      const docRef = doc(db, 'Usuarios', user.uid);
      await updateDoc(docRef, userData);
    }
  };

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo' }, async (response) => {
      if (!response.didCancel && !response.error) {
        const pickedUri = response.assets[0].uri;
        setImageUri(pickedUri);

        // Upload da imagem no Firebase Storage
        const imageRef = ref(storage, `profileImages/${user.uid}`);
        const img = await fetch(pickedUri);
        const bytes = await img.blob();

        // Upload da imagem e obter o URL de download
        await uploadBytes(imageRef, bytes);
        const downloadUrl = await getDownloadURL(imageRef);

        // Atualizando o URL da imagem no Firestore
        await updateDoc(doc(db, 'Usuarios', user.uid), { profileImage: downloadUrl });
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity onPress={handleImagePick}>
          <Image
            source={imageUri ? { uri: imageUri } : require('../../../assets/Imagem/logotk.png')}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
        </TouchableOpacity>
        <TextInput
          value={userData.name}
          onChangeText={(text) => setUserData({ ...userData, name: text })}
          placeholder="Nome"
        />
        <TextInput
          value={userData.idade}
          onChangeText={(text) => setUserData({ ...userData, age: text })}
          placeholder="Idade"
          keyboardType="numeric"
        />
        <TextInput
          value={userData.about}
          onChangeText={(text) => setUserData({ ...userData, about: text })}
          placeholder="Sobre mim"
          multiline
        />
        <TouchableOpacity onPress={handleUpdate} style={{ backgroundColor: '#00aaff', padding: 10, borderRadius: 5 }}>
          <Text style={{ color: 'white' }}>Atualizar Perfil</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Perfil;
