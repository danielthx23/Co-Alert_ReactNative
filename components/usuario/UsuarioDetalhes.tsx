import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { usuarioService } from '../../services/usuario';
import { Usuario } from '../../models';

type RouteParams = {
  id: number;
};

export const UsuarioDetalhes: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario>();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as RouteParams;

  const carregarUsuario = async () => {
    try {
      const response = await usuarioService.obterPorId(id);
      setUsuario(response.data);
    } catch (error) {
      console.error(error);
      // Toast will show error message
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUsuario();
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este usuário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await usuarioService.deletar(id);
              // Toast will show success message
              navigation.goBack();
            } catch (error) {
              console.error(error);
              // Toast will show error message
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#009b29" />
      </View>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person" size={64} color="#009b29" />
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Nome de Usuário:</Text>
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
          onPress={() => navigation.navigate('UsuarioFormulario', { id })}
        >
          <Ionicons name="create" size={20} color="#fff" />
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Ionicons name="trash" size={20} color="#fff" />
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#1c1c1c',
  },
  content: {
    padding: 16,
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
    fontSize: 18,
    color: '#fff',
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 8,
  },
  editButton: {
    backgroundColor: '#009b29',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 