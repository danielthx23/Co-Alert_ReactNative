import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useNavigation, useRoute, RouteProp, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { postagemService } from '../../services/postagem';
import { localizacaoService } from '../../services/localizacao';
import { PostagemStackParamList, DrawerParamList } from '../../types/navigation';
import { Postagem } from '../../models/postagem';
import { Localizacao } from '../../models/localizacao';
import { useToast } from '../../contexts/ToastContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usuarioService } from '../../services/usuario';
import { categoriaDesastreService } from '../../services/categoriaDesastre';
import { CategoriaDesastre } from '../../models/categoriaDesastre';

type PostagemFormularioNavigationProp = CompositeNavigationProp<
  StackNavigationProp<PostagemStackParamList, 'PostagemFormulario'>,
  DrawerNavigationProp<DrawerParamList>
>;

type PostagemFormularioRouteProp = RouteProp<PostagemStackParamList, 'PostagemFormulario'>;

interface PostagemCreate {
  nmTitulo: string;
  nmConteudo: string;
  idCategoriaDesastre: number | null;
  idLocalizacao: number | null;
  idUsuario: number | null;
  dtEnvio: Date;
  nrLikes: number;
}

export const PostagemFormulario: React.FC = () => {
  const navigation = useNavigation<PostagemFormularioNavigationProp>();
  const route = useRoute<PostagemFormularioRouteProp>();
  const { showToast } = useToast();
  const isEditing = Boolean(route.params?.id);

  const [loading, setLoading] = useState(false);
  const [usuarioLogadoId, setUsuarioLogadoId] = useState<number | null>(null);
  const [categorias, setCategorias] = useState<CategoriaDesastre[]>([]);
  const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([]);
  const [showCategoriaDropdown, setShowCategoriaDropdown] = useState(false);
  const [showLocalizacaoDropdown, setShowLocalizacaoDropdown] = useState(false);
  const [postagem, setPostagem] = useState<PostagemCreate>({
    nmTitulo: route.params?.postagem?.nmTitulo || '',
    nmConteudo: route.params?.postagem?.nmConteudo || '',
    idCategoriaDesastre: route.params?.postagem?.categoriaDesastre?.idCategoriaDesastre || null,
    idLocalizacao: route.params?.postagem?.localizacao?.idLocalizacao || null,
    idUsuario: route.params?.postagem?.usuario?.idUsuario || null,
    dtEnvio: route.params?.postagem?.dtEnvio ? new Date(route.params.postagem.dtEnvio) : new Date(),
    nrLikes: route.params?.postagem?.nrLikes || 0,
  });

  const carregarDados = async () => {
    try {
      // Carregar usuário logado
      const userToken = await AsyncStorage.getItem('user_token');
      if (userToken) {
        const [nmEmail, nrSenha] = userToken.split(',');
        const response = await usuarioService.autenticar({ nmEmail, nrSenha });
        setUsuarioLogadoId(response.data.idUsuario);
        setPostagem(prev => ({ ...prev, idUsuario: response.data.idUsuario }));
      }

      // Carregar categorias
      const categoriasResponse = await categoriaDesastreService.listarTodos();
      setCategorias(categoriasResponse.data);

      // Carregar localizações
      const localizacoesResponse = await localizacaoService.listarTodos();
      setLocalizacoes(localizacoesResponse.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      showToast('Erro', 'Não foi possível carregar os dados necessários.', 'danger');
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarDados();
    });

    return unsubscribe;
  }, [navigation]);

  const handleSubmit = async () => {
    if (!postagem.nmTitulo || !postagem.nmConteudo || !postagem.idCategoriaDesastre || !postagem.idLocalizacao || !postagem.idUsuario) {
      showToast('Erro', 'Preencha todos os campos obrigatórios.', 'danger');
      return;
    }

    try {
      setLoading(true);
      if (isEditing && route.params?.id) {
        if (route.params.id !== undefined) {
          await postagemService.atualizar(route.params.id, {
            ...postagem,
            categoriaDesastreId: postagem.idCategoriaDesastre,
            localizacaoId: postagem.idLocalizacao,
            usuarioId: postagem.idUsuario,
          });
        } else {
          throw new Error('ID is undefined');
        }
        showToast('Sucesso', 'Alerta atualizado com sucesso!', 'success');
        navigation.navigate('PostagemDetalhes', { id: route.params.id });
      } else {
        const response = await postagemService.criar({
          ...postagem,
          categoriaDesastreId: postagem.idCategoriaDesastre,
          localizacaoId: postagem.idLocalizacao,
          usuarioId: postagem.idUsuario,
        });
        showToast('Sucesso', 'Alerta criado com sucesso!', 'success');
        navigation.goBack();
        navigation.reset({
          index: 0,
          routes: [{ name: 'PostagemListagem' }],
        });
      }
    } catch (error) {
      console.error(error);
      showToast('Erro', `Não foi possível ${isEditing ? 'atualizar' : 'criar'} o alerta.`, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const renderCategoriaDropdown = () => (
    <View style={styles.dropdownContainer}>
      <View style={styles.inputRow}>
        <TouchableOpacity
          style={[styles.input, styles.selector, styles.inputFlex]}
          onPress={() => {
            setShowCategoriaDropdown(!showCategoriaDropdown);
            setShowLocalizacaoDropdown(false);
          }}
        >
          <Text style={[styles.selectorText, !postagem.idCategoriaDesastre && styles.placeholder]}>
            {postagem.idCategoriaDesastre
              ? categorias.find(c => c.idCategoriaDesastre === postagem.idCategoriaDesastre)?.nmTitulo
              : 'Selecione uma categoria'}
          </Text>
          <Ionicons 
            name={showCategoriaDropdown ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#666" 
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CategoriaDesastreScreen', { screen: 'CategoriaDesastreFormulario' })}
        >
          <Ionicons name="add-circle-outline" size={24} color="#ff4c4c" />
        </TouchableOpacity>
      </View>
      {showCategoriaDropdown && (
        <View style={styles.dropdownList}>
          {categorias.length > 0 ? (
            categorias.map((categoria) => (
              <TouchableOpacity
                key={categoria.idCategoriaDesastre}
                style={[
                  styles.dropdownItem,
                  postagem.idCategoriaDesastre === categoria.idCategoriaDesastre && styles.dropdownItemSelected
                ]}
                onPress={() => {
                  if (categoria.idCategoriaDesastre) {
                    setPostagem({ 
                      ...postagem, 
                      idCategoriaDesastre: categoria.idCategoriaDesastre 
                    });
                  }
                  setShowCategoriaDropdown(false);
                }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  postagem.idCategoriaDesastre === categoria.idCategoriaDesastre && styles.dropdownItemTextSelected
                ]}>
                  {categoria.nmTitulo}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="alert-circle-outline" size={24} color="#666" />
              <Text style={styles.emptyStateText}>Nenhuma categoria disponível</Text>
              <Text style={styles.emptyStateSubtext}>Clique no botão + para criar uma nova categoria</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderLocalizacaoDropdown = () => (
    <View style={styles.dropdownContainer}>
      <View style={styles.inputRow}>
        <TouchableOpacity
          style={[styles.input, styles.selector, styles.inputFlex]}
          onPress={() => {
            setShowLocalizacaoDropdown(!showLocalizacaoDropdown);
            setShowCategoriaDropdown(false);
          }}
        >
          <Text style={[styles.selectorText, !postagem.idLocalizacao && styles.placeholder]}>
            {postagem.idLocalizacao
              ? (() => {
                  const loc = localizacoes.find(l => l.idLocalizacao === postagem.idLocalizacao);
                  return loc ? `${loc.nmCidade}, ${loc.nmEstado}` : 'Selecione uma localização';
                })()
              : 'Selecione uma localização'}
          </Text>
          <Ionicons 
            name={showLocalizacaoDropdown ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#666" 
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('LocalizacaoScreen', { screen: 'LocalizacaoFormulario' })}
        >
          <Ionicons name="add-circle-outline" size={24} color="#ff4c4c" />
        </TouchableOpacity>
      </View>
      {showLocalizacaoDropdown && (
        <View style={styles.dropdownList}>
          {localizacoes.length > 0 ? (
            localizacoes.map((localizacao) => (
              <TouchableOpacity
                key={localizacao.idLocalizacao}
                style={[
                  styles.dropdownItem,
                  postagem.idLocalizacao === localizacao.idLocalizacao && styles.dropdownItemSelected
                ]}
                onPress={() => {
                  if (localizacao.idLocalizacao) {
                    setPostagem({ 
                      ...postagem, 
                      idLocalizacao: localizacao.idLocalizacao 
                    });
                  }
                  setShowLocalizacaoDropdown(false);
                }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  postagem.idLocalizacao === localizacao.idLocalizacao && styles.dropdownItemTextSelected
                ]}>
                  {`${localizacao.nmCidade}, ${localizacao.nmEstado}`}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="alert-circle-outline" size={24} color="#666" />
              <Text style={styles.emptyStateText}>Nenhuma localização disponível</Text>
              <Text style={styles.emptyStateSubtext}>Clique no botão + para criar uma nova localização</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

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
          <Text style={styles.titulo}>Novo Alerta</Text>
        </View>
      </View>

      <ScrollView style={styles.content} scrollEnabled={!showCategoriaDropdown && !showLocalizacaoDropdown}>
        <View style={styles.form}>
          <View style={[styles.inputGroup, { zIndex: 4 }]}>
            <Text style={styles.label}>Título</Text>
            <TextInput
              style={styles.input}
              value={postagem.nmTitulo}
              onChangeText={(text) => setPostagem({ ...postagem, nmTitulo: text })}
              placeholder="Digite o título do alerta"
              placeholderTextColor="#666"
            />
          </View>

          <View style={[styles.inputGroup, { zIndex: 3 }]}>
            <Text style={styles.label}>Conteúdo</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={postagem.nmConteudo}
              onChangeText={(text) => setPostagem({ ...postagem, nmConteudo: text })}
              placeholder="Digite o conteúdo do alerta"
              placeholderTextColor="#666"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <View style={[styles.inputGroup, { zIndex: 2 }]}>
            <Text style={styles.label}>Categoria</Text>
            {renderCategoriaDropdown()}
          </View>

          <View style={[styles.inputGroup, { zIndex: 1 }]}>
            <Text style={styles.label}>Localização</Text>
            {renderLocalizacaoDropdown()}
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
                <Ionicons name="send" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>{isEditing ? 'Editar postagem' :'Publicar postagem'}</Text>
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
    position: 'relative',
  },
  inputGroup: {
    marginBottom: 20,
    position: 'relative',
    zIndex: 3,
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
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  selectorText: {
    color: '#fff',
    fontSize: 16,
  },
  placeholder: {
    color: '#666',
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
  dropdownContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#2d2d2d',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d2d',
  },
  dropdownItemSelected: {
    backgroundColor: '#ff4c4c20',
  },
  dropdownItemText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdownItemTextSelected: {
    color: '#ff4c4c',
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputFlex: {
    flex: 1,
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: '#1c1c1c',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 8,
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyStateSubtext: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
}); 