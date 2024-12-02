import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, ActivityIndicator, Image, Text, Dimensions, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { SvgXml } from 'react-native-svg';
import logomarker from '../../../assets/Imagem/logotk.png'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';

const { width } = Dimensions.get('window'); // Pega a largura da tela

const lupaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0BBEE5" width="35px" height="35px"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`;


const App = () => {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [favoritos, setFavoritos] = useState([]); // Estado para armazenar favoritos do usuário

  useEffect(() => {
    // Carregar os dados das babás
    const unsubscribe = firestore()
      .collection("Babas")
      .onSnapshot(querySnapshot => {
        const locations = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          valor: doc.data().valor,
          avaliacao: doc.data().avaliacao,
          experiencia: doc.data().experiencia,
          descricao: doc.data().descricao,
          location: doc.data().location,
          profileImage: doc.data().profileImage,
        }));
        setDados(locations);
        setLoading(false);
      }, error => {
        console.error("Erro ao buscar dados: ", error);
        setLoading(false);
      });

    // Carregar favoritos do usuário
    const userId = auth().currentUser?.uid;
    if (userId) {
      firestore()
        .collection('Favoritos')
        .where('userId', '==', userId)
        .get()
        .then(querySnapshot => {
          const favoritosData = querySnapshot.docs.map(doc => doc.data().babáId);
          setFavoritos(favoritosData);
        });
    }

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    const userId = auth().currentUser?.uid;
    if (userId) {
      firestore()
        .collection('Favoritos')
        .where('userId', '==', userId)
        .get()
        .then(querySnapshot => {
          const favoritosData = querySnapshot.docs.map(doc => doc.data().babáId);
          setFavoritos(favoritosData); // Atualiza a lista de favoritos
        });
    }
  }, [favoritos]);


  const handleMarkerPress = (item) => {
    setSelectedItem(item);
  };

  const handleFavoritePress = (babáId) => {
    const userId = auth().currentUser?.uid; // Obtém o ID do usuário autenticado

    if (!userId) {
      console.log('Usuário não autenticado!');
      return;
    }

    // Verificar se a babá já está nos favoritos do usuário
    firestore()
      .collection('Favoritos')
      .where('userId', '==', userId)
      .where('babáId', '==', babáId)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          // Adicionar a babá aos favoritos
          firestore()
            .collection('Favoritos')
            .add({
              userId: userId,
              babáId: babáId,
              name: selectedItem.name,
              valor: selectedItem.valor,
              avaliacao: selectedItem.avaliacao,
              experiencia: selectedItem.experiencia,
              descricao: selectedItem.descricao,
              profileImage: selectedItem.profileImage,
              location: selectedItem.location,
              criadoEm: firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
              console.log('Babá adicionada aos favoritos!');
              setFavoritos(prev => [...prev, babáId]); // Atualizar o estado de favoritos
            })
            .catch(error => {
              console.error('Erro ao adicionar aos favoritos:', error);
            });
        } else {
          // A babá já está nos favoritos, podemos removê-la
          querySnapshot.forEach(doc => {
            firestore()
              .collection('Favoritos')
              .doc(doc.id)
              .delete()
              .then(() => {
                console.log('Babá removida dos favoritos!');
                setFavoritos(prev => prev.filter(id => id !== babáId)); // Atualizar o estado de favoritos
              })
              .catch(error => {
                console.error('Erro ao remover dos favoritos:', error);
              });
          });
        }
      })
      .catch(error => {
        console.error('Erro ao verificar favoritos:', error);
      });
  };

  const formatExperiencia = (anos) => {
    return anos === 1 ? `${anos} Ano` : `${anos} Anos`;
  };

  const heartEmptySvg = `
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0BBEE5" width="30px" height="30px">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/>
    </svg>
  `;

  const heartFilledSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0BBEE5" width="30px" height="30px">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  `;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barra de busca com fundo azul claro e bordas arredondadas */}
      <GooglePlacesAutocomplete
        placeholder="Pesquise por um local..."
        fetchDetails={true}
        onPress={(data, details) => onPlaceSelected(details)}
        query={{
          key: 'AIzaSyDEzsQamuWnHogy2K_0lgoV68AKJpYstls',
          language: 'pt',
        }}
        onFail={(error) => console.error(error)}
        debounce={200}
        styles={{
          container: styles.searchContainer,
          textInput: styles.searchInput,
        }}
        renderLeftButton={() => (
          <SvgXml xml={lupaSvg} width={34} height={34} style={styles.searchIcon} />
        )}
      />

      <MapView
        style={styles.mapa}
        initialRegion={{
          latitude: -23.510116260446033,
          longitude: -46.865254653521944,
          latitudeDelta: 0.0091,
          longitudeDelta: 0.0135,
        }}
      >
        {dados.map(item => (
          item.location?.latitude && item.location?.longitude && (
            <Marker
              key={item.id}
              coordinate={{
                latitude: item.location.latitude,
                longitude: item.location.longitude,
              }}
              onPress={() => handleMarkerPress(item)}
              icon={logomarker}
            />
          )
        ))}
      </MapView>

      {/* Exibe o cartão apenas se um item estiver selecionado */}
      {selectedItem && (
        <View style={styles.cardContainer}>
          <Card
            name={selectedItem.name}
            valor={selectedItem.valor}
            avaliacao={selectedItem.avaliacao}
            experiencia={selectedItem.experiencia}
            descricao={selectedItem.descricao}
            profileImage={selectedItem.profileImage}
            onFavoritePress={handleFavoritePress}
            babáId={selectedItem.id}
            formatExperiencia={formatExperiencia}
            isFavorited={favoritos.includes(selectedItem.id)}
            heartEmptySvg={heartEmptySvg}
            heartFilledSvg={heartFilledSvg}
          />
        </View>
      )}
    </View>
  );
};

const starSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0BBEE5" width="19px" height="19px">
  <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-6.91-.58L12 2 9.91 8.66 3 9.24l5.46 4.73L5.82 21z"/>
</svg>
`;


const Card = ({ name, valor, avaliacao = 0, experiencia, descricao, profileImage, onFavoritePress, babáId, formatExperiencia, isFavorited, heartEmptySvg, heartFilledSvg }) => {
  const starRating = avaliacao > 0 ? avaliacao : "(0)";
  return (
    <View style={styles.card}>
      <Image source={{ uri: profileImage }} style={styles.image} />
      <View style={styles.containerInformacoes}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.descricao}>
          {descricao ? descricao.substring(0, 100) + '...' : "Sem descrição disponível."}
        </Text>
        <Text style={styles.experiencia}>
          <Text style={styles.boldText}>Experiência:</Text> {formatExperiencia(experiencia)}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.avaliacaoContainer}>
            <Text style={styles.avaliacao}>
              <Text style={styles.boldText}></Text> {starRating}
            </Text>
          </Text>
           <SvgXml xml={starSvg} width={19} height={19} style={styles.starIcon} />
          <Text style={styles.preco}>
            <Text style={styles.boldText}>R$:</Text> {valor}
          </Text>
        </View>
        <TouchableOpacity style={styles.favoriteButton} onPress={() => onFavoritePress(babáId)}>
          <SvgXml xml={isFavorited ? heartFilledSvg : heartEmptySvg} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapa: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF80',
  },
  cardContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: '#FFFFFF80',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
    elevation: 5,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 5, height: 1 },
    padding: 10,
    height: 170,
  },
  image: {
    width: 100,
    aspectRatio: 1,
    borderRadius: 10,
    marginRight: 10,
  },
  containerInformacoes: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: 'black',
    marginBottom: 5,
  },
  experiencia: {
    fontSize: 14,
    color: '#555',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  preco: {
    fontSize: 22,
    color: '#333',
    marginTop:-5,
  },
  avaliacao: {
    fontSize: 13,
    color: '#333',
  },
  boldText: {
    fontWeight: 'bold',
  },
  descricao: {
    fontSize: 14,
    color: '#777',
    marginTop: 10,
    height: 60,
    overflow: 'hidden',
  },
  favoriteButton: {
    position: 'absolute',
    top: -5,
    right: 0,
    padding: 2,
  },
  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 1,
    marginHorizontal: 10,
  },
  searchInput: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    paddingLeft: 50,
    backgroundColor: 'rgba(173, 216, 230, 0.8)',
    color: 'black',
  },
  searchIcon: {
    position: 'absolute',
    left: 15,
    top: 10,
    zIndex: 2,
  },
  avaliacaoContainer: {
    flexDirection: 'row',
    paddingTop:0,
  },
  starIcon: {
    marginLeft:-130,
  },

});

export default App;
