import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { categoriaDesastreService } from '../../services/categoriaDesastre';
import { CategoriaDesastre } from '../../models/categoriaDesastre';
import { CategoriaDesastreStackParamList } from '../../types/navigation';
import { useToast } from '../../contexts/ToastContext';
import { Ionicons } from '@expo/vector-icons';

type CategoriaDesastreFormularioNavigationProp = StackNavigationProp<
  CategoriaDesastreStackParamList,
  'CategoriaDesastreFormulario'
>;

type CategoriaDesastreFormularioRouteProp = RouteProp<
  CategoriaDesastreStackParamList,
  'CategoriaDesastreFormulario'
>;

export const CategoriaDesastreFormulario: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [categoria, setCategoria] = useState<Omit<CategoriaDesastre, 'idCategoriaDesastre'>>({
    nmTitulo: '',
    dsCategoria: '',
    nmTipo: '',
  });
  
  const navigation = useNavigation<CategoriaDesastreFormularioNavigationProp>();
  const route = useRoute<CategoriaDesastreFormularioRouteProp>();
  const { showToast } = useToast();
  const tituloInputRef = useRef<TextInput>(null);
  const descricaoInputRef = useRef<TextInput>(null);
  const isEditing = Boolean(route.params?.id);

  useEffect(() => {
    const carregarCategoria = async () => {
      if (isEditing && route.params?.id) {
        try {
          const response = await categoriaDesastreService.obterPorId(route.params.id);
          setCategoria({
            nmTitulo: response.data.nmTitulo || '',
            dsCategoria: response.data.dsCategoria || '',
            nmTipo: response.data.nmTipo || '',
          });
        } catch (error) {
          console.error(error);
          showToast('Erro', 'Não foi possível carregar os dados da categoria.', 'danger');
          navigation.goBack();
        }
      }
    };

    carregarCategoria();
  }, [route.params?.id]);

  const handleSubmit = async () => {
    if (!categoria.nmTitulo?.trim()) {
      showToast('Erro', 'O título é obrigatório.', 'danger');
      tituloInputRef.current?.focus();
      return;
    }

    if (!categoria.dsCategoria?.trim()) {
      showToast('Erro', 'A descrição é obrigatória.', 'danger');
      descricaoInputRef.current?.focus();
      return;
    }

    try {
      setLoading(true);
      if (isEditing && route.params?.id) {
        await categoriaDesastreService.atualizar(route.params.id, categoria);
        showToast('Sucesso', 'Categoria atualizada com sucesso!', 'success');
        navigation.goBack();
      } else {
        await categoriaDesastreService.criar(categoria);
        showToast('Sucesso', 'Categoria criada com sucesso!', 'success');
        navigation.goBack();
      }
    } catch (error) {
      console.error(error);
      showToast('Erro', `Não foi possível ${isEditing ? 'atualizar' : 'criar'} a categoria.`, 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.titulo}>{isEditing ? 'Editar Categoria' : 'Nova Categoria'}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título</Text>
            <TextInput
              ref={tituloInputRef}
              style={styles.input}
              value={categoria.nmTitulo}
              onChangeText={(text) => setCategoria({ ...categoria, nmTitulo: text })}
              placeholder="Digite o título da categoria"
              placeholderTextColor="#666"
              returnKeyType="next"
              onSubmitEditing={() => descricaoInputRef.current?.focus()}
              blurOnSubmit={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo</Text>
            <TextInput
              style={styles.input}
              value={categoria.nmTipo}
              onChangeText={(text) => setCategoria({ ...categoria, nmTipo: text })}
              placeholder="Digite o tipo da categoria"
              placeholderTextColor="#666"
              returnKeyType="next"
              onSubmitEditing={() => descricaoInputRef.current?.focus()}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              ref={descricaoInputRef}
              style={[styles.input, styles.textArea]}
              value={categoria.dsCategoria}
              onChangeText={(text) => setCategoria({ ...categoria, dsCategoria: text })}
              placeholder="Digite a descrição da categoria"
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="save" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>{isEditing ? 'Atualizar' : 'Salvar'}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131315',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1c1c1c',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    minHeight: 50,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2d2d2d',
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#ff4c4c',
    minHeight: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    flexDirection: 'row',
  },
  buttonDisabled: {
    backgroundColor: '#2d2d2d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 8,
  },
}); 