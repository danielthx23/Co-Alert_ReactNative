import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { postagemService } from '../../services/postagem';
import { PostagemStackParamList } from '../../types/navigation';
import { Postagem } from '../../models/postagem';

type PostagemListagemNavigationProp = StackNavigationProp<
  PostagemStackParamList
>;

type Filters = {
  categoria?: number;
  localizacao?: number;
  dataInicio?: Date;
  dataFim?: Date;
};

export const PostagemListagem: React.FC = () => {
  const [postagens, setPostagens] = useState<Postagem[]>([]);
  const [filteredPostagens, setFilteredPostagens] = useState<Postagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({});
  const [showFilters, setShowFilters] = useState(false);
  const navigation = useNavigation<PostagemListagemNavigationProp>();

  const carregarPostagens = async () => {
    try {
      const response = await postagemService.listarTodos();
      setPostagens(response.data);
      setFilteredPostagens(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPostagens();
  }, []);

  useEffect(() => {
    let filtered = [...postagens];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.nmTitulo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.nmConteudo?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply other filters
    if (filters.categoria) {
      filtered = filtered.filter(
        (post) => post.categoriaDesastre?.idCategoriaDesastre === filters.categoria
      );
    }

    if (filters.localizacao) {
      filtered = filtered.filter(
        (post) => post.localizacao?.idLocalizacao === filters.localizacao
      );
    }

    if (filters.dataInicio) {
      filtered = filtered.filter(
        (post) => new Date(post.dtEnvio!) >= filters.dataInicio!
      );
    }

    if (filters.dataFim) {
      filtered = filtered.filter(
        (post) => new Date(post.dtEnvio!) <= filters.dataFim!
      );
    }

    setFilteredPostagens(filtered);
  }, [searchQuery, filters, postagens]);

  const renderItem = ({ item }: { item: Postagem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        if (item.idPostagem) {
          navigation.navigate('PostagemDetalhes', { id: item.idPostagem });
        }
      }}
    >
      <View style={styles.cardHeader}>
        <Ionicons name="warning" size={24} color="#009b29" />
        <Text style={styles.title}>{item.nmTitulo}</Text>
      </View>
  
      <Text style={styles.conteudo}>{item.nmConteudo}</Text>
  
      {item.usuario && (
        <Text style={styles.meta}>
          Usuário: <Text style={styles.metaValue}>{item.usuario.nmUsuario}</Text>
        </Text>
      )}
  
      {item.categoriaDesastre && (
        <Text style={styles.meta}>
          Categoria: <Text style={styles.metaValue}>{item.categoriaDesastre.nmTitulo}</Text>
        </Text>
      )}
  
      {item.localizacao && (
        <Text style={styles.meta}>
          Localização: <Text style={styles.metaValue}>{item.localizacao.nmCidade}</Text>
        </Text>
      )}
  
      <Text style={styles.data}>
        {new Date(item.dtEnvio!).toLocaleDateString('pt-BR')}
      </Text>
    </TouchableOpacity>
  );

  const FiltersModal = () => (
    <Modal
      visible={showFilters}
      transparent
      animationType="slide"
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtros</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Add filter options here */}
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              setFilters({});
              setShowFilters(false);
            }}
          >
            <Text style={styles.modalButtonText}>Limpar Filtros</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar postagens..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="filter" size={24} color="#009b29" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredPostagens}
        renderItem={renderItem}
        keyExtractor={(item) => item.idPostagem?.toString() || ''}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('PostagemFormulario')}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <FiltersModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
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
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f0f',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  meta: {
    fontSize: 12,
    color: '#888',
  },
  metaValue: {
    color: '#fff',
    fontWeight: 'bold',
  },
  conteudo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  data: {
    fontSize: 12,
    color: '#009b29',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#009b29',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1c1c1c',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalButton: {
    backgroundColor: '#009b29',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 