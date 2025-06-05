import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { usuarioService } from '../../services/usuario';
import { Usuario } from '../../models/usuario';
import { UsuarioStackParamList, RootStackParamList } from '../../types/navigation';
import { useToast } from '../../contexts/ToastContext';

type UsuarioDetalhesRouteProp = RouteProp<UsuarioStackParamList, 'UsuarioDetalhes'>;
type UsuarioDetalhesNavigationProp = StackNavigationProp<RootStackParamList>;

export const UsuarioDetalhes: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario>();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<UsuarioDetalhesNavigationProp>();
  const route = useRoute<UsuarioDetalhesRouteProp>();
  const { showToast } = useToast();
  const { id } = route.params;

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const response = await usuarioService.obterPorId(id);
        setUsuario(response.data);
      } catch (error) {
        console.error(error);
        showToast('Erro', 'Não foi possível carregar os dados do usuário.', 'danger');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    carregarUsuario();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff4c4c" />
      </View>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'MainApp', params: { screen: 'HomeScreen' } }],
              });
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.titulo}>Meu Perfil</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {usuario.nmUsuario?.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Nome:</Text>
            <Text style={styles.value}>{usuario.nmUsuario}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{usuario.nmEmail}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => navigation.navigate('UsuarioScreen', {
              screen: 'UsuarioFormulario',
              params: { id }
            })}
          >
            <Ionicons name="create" size={20} color="#fff" />
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  header: {
    backgroundColor: '#1c1c1c',
    padding: 16,
    marginTop: 40,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  titulo: {
    fontSize: 20,
    color: '#fff',
    marginLeft: 16,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ff4c4c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#fff',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  editButton: {
    backgroundColor: '#ff4c4c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 