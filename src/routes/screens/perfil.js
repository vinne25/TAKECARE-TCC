import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert, FlatList } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';

const Perfil = () => {
  const [userData, setUserData] = useState({});
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [habilidadeInput, setHabilidadeInput] = useState('');
  const [caracteristicaInput, setCaracteristicaInput] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Controle de modo de edição

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
              habilidades: data.habilidades || [],  // Garantir que habilidades sejam um array
              caracteristicas: data.caracteristicas || [], // Garantir que características sejam um array
            });
            if (data.profileImage) {
              setImageUri(data.profileImage); // Atualiza a URL da imagem de perfil
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
    if (user) {
      setLoading(true);
      try {
        const docRef = doc(db, 'Usuarios', user.uid);
        await updateDoc(docRef, {
          habilidades: userData.habilidades,
          caracteristicas: userData.caracteristicas,
          ...userData,
        });
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
        setIsEditing(false); // Após atualizar, mudar para modo de visualização
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

        // Upload da imagem no Firebase Storage
        const imageRef = ref(storage, `profileImages/${user.uid}`);
        const img = await fetch(pickedUri);
        const bytes = await img.blob();

        await uploadBytes(imageRef, bytes);
        const downloadUrl = await getDownloadURL(imageRef);

        // Atualizando o URL da imagem no Firestore
        await updateDoc(doc(db, 'Usuarios', user.uid), { profileImage: downloadUrl });
        Alert.alert('Sucesso', 'Imagem de perfil atualizada!');
      } catch (error) {
        Alert.alert('Erro', 'Falha ao carregar a imagem.');
        console.error(error);
      }
    });
  };

  const addHabilidade = () => {
    if (habilidadeInput.trim()) {
      const newHabilidades = [...userData.habilidades, habilidadeInput.trim()];
      setUserData({ ...userData, habilidades: newHabilidades });
      setHabilidadeInput('');
    }
  };

  const addCaracteristica = () => {
    if (caracteristicaInput.trim()) {
      const newCaracteristicas = [...userData.caracteristicas, caracteristicaInput.trim()];
      setUserData({ ...userData, caracteristicas: newCaracteristicas });
      setCaracteristicaInput('');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00aaff" />;
  }

  if (error) {
    return <Text style={{ color: 'red' }}>{error}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: '#f7f7f7' }}>
      <View style={{ backgroundColor: '#ffffff', padding: 20, borderRadius: 10, elevation: 3 }}>
        {/* Header with Profile Image and Name */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
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

        {/* Título e Campos de Informações Pessoais */}
        <Text style={styles.title}>Informações Pessoais</Text>
        {isEditing ? (
          <>
            <TextInput
              value={userData.name}
              onChangeText={(text) => setUserData({ ...userData, name: text })}
              placeholder="Nome"
              style={styles.input}
            />
            <TextInput
              value={userData.idade}
              onChangeText={(text) => setUserData({ ...userData, idade: text })}
              placeholder="Idade"
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              value={userData.about}
              onChangeText={(text) => setUserData({ ...userData, about: text })}
              placeholder="Sobre mim"
              multiline
              style={styles.inputMultiline}
            />
          </>
        ) : (
          <>
            <Text>{userData.name || 'Nome do Usuário'}</Text>
            <Text>{userData.idade ? `${userData.idade} anos` : 'Idade não informada'}</Text>
            <Text>{userData.about || 'Sobre mim não informado'}</Text>
          </>
        )}

        {/* Título e Seção de Habilidades */}
        <Text style={styles.title}>Habilidades</Text>
        {isEditing ? (
          <View style={styles.section}>
            <TextInput
              value={habilidadeInput}
              onChangeText={setHabilidadeInput}
              placeholder="Adicionar Habilidade"
              style={[styles.input, { flex: 1 }]}
            />
            <TouchableOpacity onPress={addHabilidade} style={styles.button}>
              <Text style={styles.buttonText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          userData.habilidades.map((habilidade, index) => (
            <Text key={index}>{habilidade}</Text>
          ))
        )}

        {/* Título e Seção de Características */}
        <Text style={styles.title}>Características</Text>
        {isEditing ? (
          <View style={styles.section}>
            <TextInput
              value={caracteristicaInput}
              onChangeText={setCaracteristicaInput}
              placeholder="Adicionar Característica"
              style={[styles.input, { flex: 1 }]}
            />
            <TouchableOpacity onPress={addCaracteristica} style={styles.button}>
              <Text style={styles.buttonText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          userData.caracteristicas.map((caracteristica, index) => (
            <Text key={index}>{caracteristica}</Text>
          ))
        )}

        {/* Botão de Atualização */}
        {isEditing && (
          <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
            <Text style={styles.buttonText}>Atualizar Perfil</Text>
          </TouchableOpacity>
        )}

        {/* Botão para alternar entre modo de edição e visualização */}
        {!isEditing && (
          <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.toggleEditButton}>
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = {
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  inputMultiline: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 5,
    height: 80,
    marginBottom: 10,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#00796b',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  updateButton: {
    backgroundColor: '#00796b',
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  toggleEditButton: {
    backgroundColor: '#00796b',
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
};

export default Perfil;
