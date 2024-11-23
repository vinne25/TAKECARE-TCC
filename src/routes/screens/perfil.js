import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
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
          const docRef = doc(db, 'Babas', user.uid);
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
        const docRef = doc(db, 'Babas', user.uid);
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

        // Converte a URI para blob
        const img = await fetch(pickedUri);
        const blob = await img.blob();

        // Define o caminho com a pasta "imagens" e armazena a foto de perfil
        const imageRef = ref(storage, `image/${user.uid}`);
        await imageRef.put(blob); // Usa `put` para enviar o blob
        
        // Obtém a URL de download
        const downloadUrl = await getDownloadURL(imageRef);
        
        // Atualiza o URL da imagem no Firestore
        await updateDoc(doc(db, 'Babas', user.uid), { profileImage: downloadUrl });
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
      // Aqui você pode redirecionar o usuário para a tela de login ou outras ações, dependendo da sua navegação.
    } catch (error) {
      Alert.alert('Erro', 'Falha ao sair da conta.');
      console.error(error);
    }
  };

  const addHabilidade = () => {
    if (habilidadeInput.trim()) {
      const newHabilidades = [...userData.habilidades, habilidadeInput.trim()];
      setUserData({ ...userData, habilidades: newHabilidades });
      setHabilidadeInput('');
    }
  };

  const removeHabilidade = (habilidade) => {
    const newHabilidades = userData.habilidades.filter(h => h !== habilidade);
    setUserData({ ...userData, habilidades: newHabilidades });
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
              value={userData.descricao}
              onChangeText={(text) => setUserData({ ...userData, descricao: text })}
              placeholder="Sobre mim"
              multiline
              style={styles.inputMultiline}
            />
          </>
        ) : (
          <>
            <Text>{userData.name || 'Nome do Usuário'}</Text>
            <Text>{userData.idade ? `${userData.idade} anos` : 'Idade não informada'}</Text>
            <Text>{userData.descricao || 'Sobre mim não informado'}</Text>
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
          (userData.habilidades || []).map((habilidade, index) => (
            <View key={index} style={styles.habilidadeContainer}>
              <Text>{habilidade}</Text>
              <TouchableOpacity onPress={() => removeHabilidade(habilidade)} style={styles.removeButton}>
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
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
          (userData.caracteristicas || []).map((caracteristica, index) => (
            <Text key={index}>{caracteristica}</Text>
          ))
        )}

        {/* Botões de Ação */}
        {isEditing ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleUpdate} style={styles.saveButton}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
        )}
      </View>
      {/* Logout */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
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
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  inputMultiline: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#00aaff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  habilidadeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  removeButton: {
    backgroundColor: '#e57373',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: '#2196f3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
};

export default Perfil;
