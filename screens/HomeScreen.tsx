import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { postagemService } from '../services/postagem';
import { RootStackParamList } from '../types/navigation';
import { Postagem } from '../models/postagem';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const [trendingPosts, setTrendingPosts] = useState<Postagem[]>([]);
  const [nearbyPosts, setNearbyPosts] = useState<Postagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const carregarFeed = async () => {
    try {
      // In a real app, these would be separate API endpoints
      const trendingResponse = await postagemService.listarTodos();
      
      setTrendingPosts(trendingResponse.data);
      setNearbyPosts([]); // Set nearbyPosts to an empty array or handle it appropriately
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    carregarFeed();
  };

  useEffect(() => {
    carregarFeed();
  }, []);

  const renderPostItem = ({ item }: { item: Postagem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        if (item.idPostagem) {
          navigation.navigate('PostagemScreen', {
            screen: 'PostagemDetalhes',
            params: { id: item.idPostagem },
          });
        }
      }}
    >
      <View style={styles.cardHeader}>
        <Ionicons name="warning" size={24} color="#009b29" />
        <Text style={styles.cardTitle}>{item.nmTitulo}</Text>
      </View>
      <Text style={styles.cardContent}>{item.nmConteudo}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.location}>
          {item.localizacao?.nmCidade}, {item.localizacao?.nmEstado}
        </Text>
        <Text style={styles.date}>
          {new Date(item.dtEnvio!).toLocaleDateString('pt-BR')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#009b29" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar alertas..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={[
          { type: 'trending', title: 'Trending', data: trendingPosts },
          { type: 'nearby', title: 'Próximo a Você', data: nearbyPosts },
        ]}
        renderItem={({ item }) => (
          <View>
            {renderSectionHeader(item.title)}
            <FlatList
              data={item.data}
              renderItem={renderPostItem}
              keyExtractor={(post) => `${item.type}-${post.idPostagem}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}
        keyExtractor={(item) => item.type}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f0f',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#fff',
    fontSize: 16,
  },
  sectionHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  horizontalList: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    padding: 16,
    marginRight: 16,
    width: 300,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
    flex: 1,
  },
  cardContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    color: '#009b29',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
}); 