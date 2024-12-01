import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { AlignRight } from 'react-native-feather';

const Perfil = () => {
  const [userData, setUserData] = useState({});
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [habilidadeInput, setHabilidadeInput] = useState('');
  const [caracteristicaInput, setCaracteristicaInput] = useState('');
  const [idadeInput, setIdadeInput] = useState('');
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
              habilidades: data.habilidades || [], // Garantir que habilidades sejam um array
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
    if (!userData.descricao) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }
  
    if (user) {
      setLoading(true);
      try {
        const docRef = doc(db, 'Babas', user.uid);
        const updatedData = {
          ...userData,
          idade: idadeInput, // Usa o valor do input
          avaliacao: userData.avaliacao || null,
        };
  
        await updateDoc(docRef, updatedData);
  
        setUserData(updatedData); // Atualiza o estado local
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
              habilidades: data.habilidades || [],
              caracteristicas: data.caracteristicas || [],
            });
            setIdadeInput(data.idade || ''); // Inicializa o campo de idade
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
        await uploadBytes(imageRef, blob);

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
    const newHabilidades = userData.habilidades.filter((h) => h !== habilidade);
    setUserData({ ...userData, habilidades: newHabilidades });
  };

  const addCaracteristica = () => {
    if (caracteristicaInput.trim()) {
      const newCaracteristicas = [...userData.caracteristicas, caracteristicaInput.trim()];
      setUserData({ ...userData, caracteristicas: newCaracteristicas });
      setCaracteristicaInput('');
    }
  };

  const removeCaracteristica = (caracteristica) => {
    const newCaracteristicas = userData.caracteristicas.filter((c) => c !== caracteristica);
    setUserData({ ...userData, caracteristicas: newCaracteristicas });
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
          <Text>
            R$ {userData.valor || 'Não informado'}
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
          <Text style={styles.label}>Experiência</Text>
          <TextInput
            value={userData.experiencia}
            onChangeText={(text) => setUserData({ ...userData, experiencia: text })}
            placeholder="Experiência (em anos)"
            keyboardType="numeric"
            style={styles.input}
          />
          <Text style={styles.label}>Valor</Text>
          <TextInput
            value={userData.valor}
            onChangeText={(text) => setUserData({ ...userData, valor: text })}
            placeholder="Valor do serviço (R$)"
            keyboardType="numeric"
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
          <Text>Experiência: {userData.experiencia || 'Não informado'}</Text>
          <Text>Avaliação: {userData.avaliacao || 'Sem avaliações'}</Text>
        </>
      )}
{/* Habilidades */}
<Text style={styles.title}>Habilidades</Text>
<View style={styles.listContainer}>
  {userData.habilidades.map((habilidade, index) => (
    <View key={index} style={styles.chip}>
      <Text>{habilidade}</Text>
      {isEditing && (
        <TouchableOpacity onPress={() => removeHabilidade(habilidade)}>
          <Text style={{ color: 'red' }}>Remover</Text>
        </TouchableOpacity>
      )}
    </View>
  ))}
</View>
{isEditing && (
  <View style={{ flexDirection: 'row', marginTop: 10 }}>
    <TextInput
      value={habilidadeInput}
      onChangeText={setHabilidadeInput}
      placeholder="Nova habilidade"
      style={styles.input}
    />
    <TouchableOpacity onPress={addHabilidade}>
      <Text style={{ color: '#0BBEE5', marginLeft: 10, fontSize: 18, marginTop: 12 }}>Adicionar</Text>
    </TouchableOpacity>
  </View>
)}

{/* Características */}
<Text style={styles.title}>Características</Text>
<View style={styles.listContainer}>
  {userData.caracteristicas.map((caracteristica, index) => (
    <View key={index} style={styles.chip}>
      <Text>{caracteristica}</Text>
      {isEditing && (
        <TouchableOpacity onPress={() => removeCaracteristica(caracteristica)} style={{}}>
        <Text style={{ color: 'red'}}>Remover</Text>
      </TouchableOpacity>      
      )}
    </View>
  ))}
</View>
{isEditing && (
  <View style={{ flexDirection: 'row', marginTop: 10 }}>
    <TextInput
      value={caracteristicaInput}
      onChangeText={setCaracteristicaInput}
      placeholder="Nova característica"
      style={styles.input}
    />
    <TouchableOpacity onPress={addCaracteristica}>
      <Text style={{ color: '#0BBEE5', marginLeft: 10, fontSize: 18, marginTop: 12 }}>Adicionar</Text>
    </TouchableOpacity>
  </View>
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
  inputSmall: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#0BBEE5',
    borderRadius: 18,
    flex:1 ,
    padding: 10,  
    alignItems: 'center',
    marginTop: 15,
  },
  buttonSmall: {
    backgroundColor: '#0BBEE5',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    flex:1 , 
    alignItems: 'center',
    color: '#fff',
    fontSize: 18,
  },
  addContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  chip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 5,
    backgroundColor: '#E1E1E1',
    borderRadius: 20,
    
  },
  listContainer: {
    flexDirection: 'column', 
    marginBottom: 10,
  },
};

export default Perfil;
