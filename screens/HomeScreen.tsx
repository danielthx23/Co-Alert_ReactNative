import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainerRef } from '@react-navigation/native';
import { postagemService } from '../services/postagem';
import { categoriaDesastreService } from '../services/categoriaDesastre';
import { Postagem } from '../models/postagem';
import { CategoriaDesastre } from '../models/categoriaDesastre';
import { PostagemCard } from '../components/postagem/PostagemCard';

import { RootStackParamList } from '../types/navigation';

type HomeScreenProps = {
  navigationRef: React.RefObject<NavigationContainerRef<RootStackParamList> | null>;
};

export const HomeScreen = ({ navigationRef }: HomeScreenProps) => {
  const [trendingPosts, setTrendingPosts] = useState<Postagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<number | null>(null);
  const [categorias, setCategorias] = useState<CategoriaDesastre[]>([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);

  const carregarCategorias = async () => {
    try {
      const response = await categoriaDesastreService.listarTodos();
      setCategorias(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingCategorias(false);
    }
  };

  const carregarFeed = async () => {
    try {
      const response = await postagemService.listarTodos();
      let posts = response.data;

      // Filtrar por categoria se selecionada
      if (selectedCategoria) {
        posts = posts.filter(post => post.categoriaDesastreId === selectedCategoria);
      }

      // Filtrar por busca se houver
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        posts = posts.filter(post =>
          post.nmTitulo.toLowerCase().includes(query) ||
          post.nmConteudo.toLowerCase().includes(query)
        );
      }

      // Ordenar posts por número de likes (trending)
      posts = posts && posts.sort((a, b) => {
        const likesA = a.nrLikes || 0;
        const likesB = b.nrLikes || 0;
        return likesB - likesA;
      });

      setTrendingPosts(posts);
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
    carregarCategorias();
  }, []);

  useEffect(() => {
    carregarFeed();
  }, [selectedCategoria, searchQuery]);

  const renderPostItem = ({ item }: { item: Postagem }) => (
    <PostagemCard
      postagem={item}
      onPress={() => {
        if (item.idPostagem) {
          navigationRef.current?.navigate('MainApp', {
            screen: 'PostagemScreen',
            params: {
              screen: 'PostagemDetalhes',
              params: { id: item.idPostagem }
            }
          });
        }
      }}
    />
  );

  if (loading || loadingCategorias) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff4c4c" />
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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriasContainer}
        contentContainerStyle={styles.categoriasContent}
      >
        <TouchableOpacity
          style={[
            styles.categoriaChip,
            selectedCategoria === null && styles.categoriaChipSelected
          ]}
          onPress={() => setSelectedCategoria(null)}
        >
          <Text
            style={[
              styles.categoriaText,
              selectedCategoria === null && styles.categoriaTextSelected
            ]}
          >
            Todos
          </Text>
        </TouchableOpacity>

        {categorias && categorias.map(categoria => (
          <TouchableOpacity
            key={categoria.idCategoriaDesastre}
            style={[
              styles.categoriaChip,
              selectedCategoria === categoria.idCategoriaDesastre && styles.categoriaChipSelected
            ]}
            onPress={() => setSelectedCategoria(categoria.idCategoriaDesastre)}
          >
            <Text
              style={[
                styles.categoriaText,
                selectedCategoria === categoria.idCategoriaDesastre && styles.categoriaTextSelected
              ]}
            >
              {categoria.nmTitulo}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {selectedCategoria
            ? `${categorias.find(c => c.idCategoriaDesastre === selectedCategoria)?.nmTitulo}`
            : 'Trending'}
        </Text>
      </View>

      <FlatList
        data={trendingPosts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.idPostagem?.toString() || ''}
        contentContainerStyle={styles.list}
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
    backgroundColor: '#131315',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#131315',
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
  categoriasContainer: {
    marginBottom: 8,
    maxHeight: 35,
  },
  categoriasContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoriaChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1c1c1c',
    marginRight: 2,
  },
  categoriaChipSelected: {
    backgroundColor: '#ff4c4c',
  },
  categoriaText: {
    color: '#d3d3d3',
    fontSize: 14,
  },
  categoriaTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
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
  list: {
    padding: 16,
  },
}); 