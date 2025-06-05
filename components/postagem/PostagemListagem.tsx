import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { postagemService } from '../../services/postagem';
import { Postagem } from '../../models/postagem';
import { PostagemCard } from './PostagemCard';
import { RootStackParamList, PostagemStackParamList } from '../../types/navigation';

type PostagemListagemNavigationProp = StackNavigationProp<PostagemStackParamList>;

export const PostagemListagem: React.FC = () => {
  const [postagens, setPostagens] = useState<Postagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fabScale = useState(new Animated.Value(1))[0];
  const navigation = useNavigation<PostagemListagemNavigationProp>();

  const carregarPostagens = async () => {
    try {
      const response = await postagemService.listarTodos();
      setPostagens(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    carregarPostagens();
  };

  useEffect(() => {
    carregarPostagens();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarPostagens();
    });

    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }: { item: Postagem }) => (
    <PostagemCard
      postagem={item}
      onPress={() => {
        if (item.idPostagem) {
          navigation.navigate('PostagemDetalhes', { id: item.idPostagem });
        }
      }}
    />
  );

  const handlePressIn = () => {
    Animated.spring(fabScale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(fabScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  if (loading) {
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
          placeholder="Buscar postagens..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={postagens}
        renderItem={renderItem}
        keyExtractor={(item) => item.idPostagem?.toString() || ''}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => navigation.navigate('PostagemFormulario', { id: undefined })}
        style={styles.fabContainer}
      >
        <Animated.View style={[styles.fab, { transform: [{ scale: fabScale }] }]}>
          <Ionicons name="add" size={24} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
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
  list: {
    padding: 16,
    paddingBottom: 80, // Add padding to avoid FAB overlap
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    borderRadius: 28,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ff4c4c',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 