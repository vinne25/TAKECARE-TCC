import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';

const PerfilUsuarios = () => {
  const [userData, setUserData] = useState({});
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [idadeInput, setIdadeInput] = useState('');
  const [quantosFilhos, setQuantosFilhos] = useState('');
  const [idadesFilhos, setIdadesFilhos] = useState('');
  const [cuidadoExtra, setCuidadoExtra] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'Usuarios', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists) {
            const data = docSnap.data();
            setUserData({
              ...data,
            });
            setIdadeInput(data.idade || '');
            setQuantosFilhos(data.quantosFilhos || '');
            setIdadesFilhos(data.idadesFilhos || '');
            setCuidadoExtra(data.cuidadoExtra || '');
            if (data.profileImage) {
              setImageUri(data.profileImage);
            }
          } else {
            Alert.alert('Aviso', 'Os dados do usuário não foram encontrados.');
          }
        } catch (error) {
          setError('Erro ao buscar os dados do usuário.');
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleUpdate = async () => {
    if (!userData.descricao) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    if (user) {
      setLoading(true);
      try {
        const docRef = doc(db, 'Usuarios', user.uid);
        const updatedData = {
          ...userData,
          idade: idadeInput,
          quantosFilhos,
          idadesFilhos,
          cuidadoExtra,
        };

        await updateDoc(docRef, updatedData);

        setUserData(updatedData);
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
        setIsEditing(false);
      } catch (error) {
        Alert.alert('Erro', 'Falha ao atualizar o perfil.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo' }, async (response) => {
      if (response.didCancel) {
        return;
      }
      if (response.error) {
        Alert.alert('Erro', 'Erro ao carregar imagem.');
        return;
      }

      try {
        const pickedUri = response.assets[0].uri;
        setImageUri(pickedUri);

        const img = await fetch(pickedUri);
        const blob = await img.blob();

        const imageRef = ref(storage, `image/${user.uid}`);
        await imageRef.put(blob);
        
        const downloadUrl = await getDownloadURL(imageRef);
        
        await updateDoc(doc(db, 'Usuarios', user.uid), { profileImage: downloadUrl });
        Alert.alert('Sucesso', 'Imagem de perfil atualizada!');
      } catch (error) {
        Alert.alert('Erro', 'Falha ao carregar a imagem.');
        console.error(error);
      }
    });
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      Alert.alert('Sucesso', 'Você saiu da conta.');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao sair da conta.');
      console.error(error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00aaff" />;
  }

  if (error) {
    return <Text style={{ color: 'red' }}>{error}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: 'white' }}>
      {/* Foto de Perfil, Nome e Idade */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <TouchableOpacity onPress={handleImagePick}>
          <Image
            source={imageUri ? { uri: imageUri } : require('../../../assets/Imagem/logotk.png')}
            style={{ width: 80, height: 80, borderRadius: 40, marginRight: 15 }}
          />
        </TouchableOpacity>
        <View>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#333' }}>
            {userData.name || 'Nome do Usuário'}
          </Text>
          <Text style={{ color: '#00796b' }}>
            {userData.idade ? `${userData.idade} anos` : 'Idade não informada'}
          </Text>
        </View>
      </View>

      {/* Informações Pessoais */}
      <Text style={styles.title}>Informações Pessoais</Text>
      {isEditing ? (
        <>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            value={userData.descricao}
            onChangeText={(text) => setUserData({ ...userData, descricao: text })}
            placeholder="Sobre mim"
            style={styles.input}
          />
          <Text style={styles.label}>Idade</Text>
          <TextInput
            value={idadeInput}
            onChangeText={setIdadeInput}
            placeholder="Idade"
            keyboardType="numeric"
            style={styles.input}
          />
        </>
      ) : (
        <>
          <Text>Descrição: {userData.descricao || 'Não informado'}</Text>
          <Text>Idade: {userData.idade || 'Não informada'}</Text>
        </>
      )}

      {/* Crianças */}
      <Text style={styles.title}>Crianças</Text>
      {isEditing ? (
        <>
          <Text style={styles.label}>Quantos filhos?</Text>
          <TextInput
            value={quantosFilhos}
            onChangeText={setQuantosFilhos}
            placeholder="Quantos filhos?"
            keyboardType="numeric"
            style={styles.input}
          />
          <Text style={styles.label}>Idades dos filhos</Text>
          <TextInput
            value={idadesFilhos}
            onChangeText={setIdadesFilhos}
            placeholder="Idades dos filhos"
            style={styles.input}
          />
          <Text style={styles.label}>Cuidado Extra</Text>
          <TextInput
            value={cuidadoExtra}
            onChangeText={setCuidadoExtra}
            placeholder="Cuidado Extra"
            style={styles.input}
          />
        </>
      ) : (
        <>
          <Text>Filhos: {quantosFilhos || 'Não informado'}</Text>
          <Text>Idades dos filhos: {idadesFilhos || 'Não informado'}</Text>
          <Text>Cuidado Extra: {cuidadoExtra || 'Não informado'}</Text>
        </>
      )}

      {/* Botão Editar/Sair */}
      {isEditing ? (
        <TouchableOpacity onPress={handleUpdate} style={styles.button}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity onPress={() => setIsEditing(true)} style={[styles.button, { width: 100, alignSelf: 'center' }]}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={{ flex:1 ,padding: 10, justifyContent: 'flex-end', alignItems: 'center', }}>
      <Image
        source={require('../../../assets/Imagem/sair.png')}
        style={{ width: 60, height: 60 }}
      />
    </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = {
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  label: {
    fontSize: 20,
    color: '#555',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 18,
    marginBottom: 10,
    backgroundColor: '#fff',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#0BBEE5',
    borderRadius: 18,
    padding: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    borderRadius: 18,
    padding: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  logoutText: {
    fontSize: 20,
    color: '#fff',
  },
};

export default PerfilUsuarios;
