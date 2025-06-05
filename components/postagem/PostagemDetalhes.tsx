import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  Animated,
  Pressable,
  Modal,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { postagemService } from '../../services/postagem';
import { comentarioService } from '../../services/comentario';
import { likeService } from '../../services/like';
import { PostagemStackParamList } from '../../types/navigation';
import { Postagem } from '../../models/postagem';
import { Comentario } from '../../models/comentario';
import { Like } from '../../models/like';
import ToastMessage, { ToastMessageRef } from '../../components/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usuarioService } from '../../services/usuario';
import { useToast } from '../../contexts/ToastContext';

type PostagemDetalhesNavigationProp = StackNavigationProp<PostagemStackParamList>;
type PostagemDetalhesRouteProp = RouteProp<PostagemStackParamList, 'PostagemDetalhes'>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface LikeResponse {
  totalLikes: number;
  isLiked: boolean;
}

export const PostagemDetalhes: React.FC = () => {
  const [postagem, setPostagem] = useState<Postagem>();
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [loading, setLoading] = useState(true);
  const [novoComentario, setNovoComentario] = useState('');
  const [respondendoA, setRespondendoA] = useState<Comentario | null>(null);
  const [usuarioLogadoId, setUsuarioLogadoId] = useState<number | null>(null);
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const inputBorderAnim = useRef(new Animated.Value(0)).current;
  const [postLikes, setPostLikes] = useState<LikeResponse>({ totalLikes: 0, isLiked: false });
  const [comentarioLikes, setComentarioLikes] = useState<{ [key: number]: LikeResponse }>({});
  const [allLikes, setAllLikes] = useState<Like[]>([]);
  const [comentarioEditando, setComentarioEditando] = useState<Comentario | null>(null);
  const [menuAberto, setMenuAberto] = useState<number | null>(null);
  const [textoEditando, setTextoEditando] = useState('');
  const { showToast } = useToast();

  const navigation = useNavigation<PostagemDetalhesNavigationProp>();
  const route = useRoute<PostagemDetalhesRouteProp>();
  const { id } = route.params;

  useEffect(() => {
    const carregarUsuarioLogado = async () => {
      try {
        const userToken = await AsyncStorage.getItem('user_token');
        if (userToken) {
          const [nmEmail, nrSenha] = userToken.split(',');
          const response = await usuarioService.autenticar({ nmEmail, nrSenha });
          setUsuarioLogadoId(response.data.idUsuario);
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      }
    };

    carregarUsuarioLogado();
  }, []);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        if (!usuarioLogadoId) return;

        // Carregar likes do usuário primeiro
        const likesResponse = await likeService.obterPorUsuario(usuarioLogadoId);
        setAllLikes(likesResponse.data || []);

        // Carregar postagem
        const postagemResponse = await postagemService.obterPorId(id);
        setPostagem(postagemResponse.data);

        // Obter estado do like da postagem
        const postLikesResponse = await likeService.obterPorPostagem(id, usuarioLogadoId);
        setPostLikes({
          totalLikes: postLikesResponse.data.totalLikes,
          isLiked: likesResponse.data?.some(like => like.postagemId === id) || false
        });

        // Carregar comentários
        const comentariosResponse = await comentarioService.listarPorPostagem(id);
        const comentariosData = comentariosResponse.data || [];
        setComentarios(comentariosData);
        
        // Obter estado dos likes dos comentários
        const newLikes: { [key: number]: LikeResponse } = {};
        
        if (comentariosData.length > 0) {
          await Promise.all(comentariosData.map(async (comentario) => {
            if (comentario.idComentario) {
              try {
                const comentarioLikesResponse = await likeService.obterPorComentario(comentario.idComentario, usuarioLogadoId);
                newLikes[comentario.idComentario] = {
                  totalLikes: comentarioLikesResponse.data.totalLikes,
                  isLiked: likesResponse.data?.some(like => like.comentarioId === comentario.idComentario) || false
                };
              } catch (error) {
                console.error(`Erro ao carregar likes do comentário ${comentario.idComentario}:`, error);
                newLikes[comentario.idComentario] = {
                  totalLikes: 0,
                  isLiked: false
                };
              }
            }
          }));
        }
        
        setComentarioLikes(newLikes);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showToast('Erro', 'Não foi possível carregar os dados. Tente novamente mais tarde.', 'danger');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [id, usuarioLogadoId]);

  const handleDelete = () => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este alerta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await postagemService.deletar(id);
              showToast('Sucesso', 'Postagem excluída com sucesso!', 'success');
              navigation.goBack();
              navigation.reset({
                index: 0,
                routes: [{ name: 'PostagemListagem' }],
              });
            } catch (error) {
              console.error(error);
              showToast('Erro', 'Não foi possível excluir a postagem.', 'danger');
            }
          },
        },
      ]
    );
  };

  const handleLike = async () => {
    if (!postagem?.idPostagem || !usuarioLogadoId) return;

    try {
      const response = await likeService.toggle({
        postagemId: postagem.idPostagem,
        usuarioId: usuarioLogadoId
      });
      setPostLikes(response.data);
      
      // Atualizar allLikes
      const userLikesResponse = await likeService.obterPorUsuario(usuarioLogadoId);
      setAllLikes(userLikesResponse.data);
    } catch (error) {
      console.error(error);
      showToast('Erro', 'Não foi possível dar like.', 'danger');
    }
  };

  const handleLikeComentario = async (comentarioId: number) => {
    if (!usuarioLogadoId) return;

    try {
      const response = await likeService.toggle({
        comentarioId: comentarioId,
        usuarioId: usuarioLogadoId
      });
      setComentarioLikes(prev => ({
        ...prev,
        [comentarioId]: response.data
      }));
      
      // Atualizar allLikes
      const userLikesResponse = await likeService.obterPorUsuario(usuarioLogadoId);
      setAllLikes(userLikesResponse.data);
    } catch (error) {
      console.error(error);
      showToast('Erro', 'Não foi possível dar like no comentário.', 'danger');
    }
  };

  const handleComentario = async () => {
    if (!novoComentario.trim() || !postagem?.idPostagem || !usuarioLogadoId) return;

    try {
      setEnviandoComentario(true);
      await comentarioService.criar({
        nmConteudo: novoComentario,
        postagemId: postagem.idPostagem,
        usuarioId: usuarioLogadoId,
        idComentarioParente: respondendoA?.idComentario
      });
      setNovoComentario('');
      setRespondendoA(null);

      // Recarregar comentários e seus likes
      const comentariosResponse = await comentarioService.listarPorPostagem(id);
      setComentarios(comentariosResponse.data);
      
      if (usuarioLogadoId) {
        const newLikes: { [key: number]: LikeResponse } = {};
        await Promise.all(comentariosResponse.data.map(async (comentario) => {
          if (comentario.idComentario) {
            const comentarioLikesResponse = await likeService.obterPorComentario(comentario.idComentario, usuarioLogadoId);
            newLikes[comentario.idComentario] = {
              totalLikes: comentarioLikesResponse.data.totalLikes,
              isLiked: allLikes.some(like => like.comentarioId === comentario.idComentario)
            };
          }
        }));
        setComentarioLikes(newLikes);
      }

      showToast('Sucesso', 'Comentário adicionado!', 'success');
    } catch (error) {
      console.error(error);
      showToast('Erro', 'Não foi possível adicionar o comentário.', 'danger');
    } finally {
      setEnviandoComentario(false);
    }
  };

  const toggleExpandComment = (comentarioId: number) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(comentarioId)) {
        newSet.delete(comentarioId);
      } else {
        newSet.add(comentarioId);
      }
      return newSet;
    });
  };

  const formatarData = (data: Date | string | undefined) => {
    if (!data) return 'Data inválida';
    
    // Força a interpretação da data como UTC
    const timestamp = data instanceof Date ? data.getTime() : Date.parse(data + 'Z');
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Data inválida';
    
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (now.toDateString() === date.toDateString()) {
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        if (diffInMinutes < 1) return 'agora';
        return `há ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
      }
      return `há ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
    }

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleEditarComentario = async (idComentario?: number) => {
    if (!comentarioEditando?.idComentario || !textoEditando.trim()) return;

    try {
      comentarioEditando.idComentario = idComentario;

      await comentarioService.atualizar({
        idComentario: comentarioEditando.idComentario,
        nmConteudo: textoEditando,
        usuarioId: usuarioLogadoId || 0,
        postagemId: postagem?.idPostagem || 0, 
        ...(comentarioEditando.idComentarioParente && { idComentarioParente: comentarioEditando.idComentarioParente })
      });

      // Recarregar comentários
      const response = await comentarioService.listarPorPostagem(id);
      setComentarios(response.data);
      
      setComentarioEditando(null);
      setTextoEditando('');
      showToast('Sucesso', 'Comentário atualizado!', 'success');
    } catch (error) {
      console.error(error);
      showToast('Erro', 'Não foi possível atualizar o comentário.', 'danger');
    }
  };

  const handleDeletarComentario = (comentario: Comentario) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este comentário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!comentario.idComentario) return;
              await comentarioService.excluir(comentario.idComentario);
              
              // Recarregar comentários
              const response = await comentarioService.listarPorPostagem(id);
              setComentarios(response.data);
              
              setMenuAberto(null);
              showToast('Sucesso', 'Comentário excluído!', 'success');
            } catch (error) {
              console.error(error);
              showToast('Erro', 'Não foi possível excluir o comentário.', 'danger');
            }
          },
        },
      ]
    );
  };

  const renderComentario = (comentario: Comentario, isResposta = false) => {
    const respostas = comentarios.filter(c => c.idComentarioParente === comentario.idComentario);
    const hasRespostas = respostas.length > 0;
    const isExpanded = expandedComments.has(comentario.idComentario || 0);
    const isComentarioDoUsuario = comentario.usuario?.idUsuario === usuarioLogadoId;
    const isEditando = comentarioEditando?.idComentario === comentario.idComentario;

    return (
      <View key={comentario.idComentario} style={[styles.comentario, isResposta && styles.resposta]}>
        <View style={styles.comentarioHeader}>
          <Text style={styles.usuarioNome}>{comentario.usuario?.nmUsuario}</Text>
          <View style={styles.headerRight}>
            <Text style={styles.comentarioData}>
              {formatarData(comentario.dtEnvio)}
            </Text>
            {isComentarioDoUsuario && !isEditando && (
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setMenuAberto(menuAberto === comentario.idComentario ? null : comentario.idComentario || null)}
              >
                <Ionicons name="ellipsis-vertical" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {menuAberto === comentario.idComentario && (
          <View style={styles.menuDropdown}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setComentarioEditando(comentario);
                setTextoEditando(comentario.nmConteudo || '');
                setMenuAberto(null);
              }}
            >
              <Ionicons name="create-outline" size={20} color="#fff" />
              <Text style={styles.menuItemText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemDanger]}
              onPress={() => handleDeletarComentario(comentario)}
            >
              <Ionicons name="trash-outline" size={20} color="#ff4c4c" />
              <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
        {isEditando ? (
          <View>
            <TextInput
              style={styles.editInput}
              value={textoEditando}
              onChangeText={setTextoEditando}
              multiline
              autoFocus
            />
            <View style={styles.editButtons}>
              <TouchableOpacity
                style={[styles.editButton, styles.editButtonCancel]}
                onPress={() => {
                  setComentarioEditando(null);
                  setTextoEditando('');
                }}
              >
                <Text style={styles.editButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editButton, styles.editButtonSave]}
                onPress={() => handleEditarComentario(comentario.idComentario)}
              >
                <Text style={styles.editButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={styles.comentarioConteudo}>{comentario.nmConteudo}</Text>
        )}
        <View style={styles.comentarioAcoes}>
          <TouchableOpacity
            style={styles.acaoButton}
            onPress={() => comentario.idComentario && handleLikeComentario(comentario.idComentario)}
          >
            <Ionicons
              name={comentario.idComentario && comentarioLikes[comentario.idComentario]?.isLiked ? 'heart' : 'heart-outline'}
              size={20}
              color={comentario.idComentario && comentarioLikes[comentario.idComentario]?.isLiked ? '#ff4c4c' : '#666'}
            />
            <Text style={styles.acaoText}>
              {comentario.idComentario ? comentarioLikes[comentario.idComentario]?.totalLikes || 0 : 0}
            </Text>
          </TouchableOpacity>
          {!isResposta && (
            <TouchableOpacity
              style={styles.acaoButton}
              onPress={() => setRespondendoA(comentario)}
            >
              <Ionicons name="return-up-back" size={20} color="#666" />
              <Text style={styles.acaoText}>Responder</Text>
            </TouchableOpacity>
          )}
        </View>
        {hasRespostas && (
          <TouchableOpacity
            style={styles.acaoButton}
            onPress={() => comentario.idComentario && toggleExpandComment(comentario.idComentario)}
          >
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#666"
            />
            <Text style={styles.acaoText}>
              {isExpanded ? 'Ocultar respostas' : `Ver ${respostas.length} ${respostas.length === 1 ? 'resposta' : 'respostas'}`}
            </Text>
          </TouchableOpacity>
        )}
        {isExpanded && respostas.map(resposta => renderComentario(resposta, true))}
      </View>
    );
  };

  const buttonBackground = buttonAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['#ff4c4c', '#5e1d1d', '#461212'],
  });

  const inputBorderColor = inputBorderAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['#363636', '#363636', '#ff4c4c'],
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff4c4c" />
      </View>
    );
  }

  if (!postagem) {
    return null;
  }

  const isAuthor = postagem.usuario?.idUsuario === usuarioLogadoId;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => {
                navigation.goBack();
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'PostagemListagem' }],
                });
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.titulo}>{postagem.nmTitulo}</Text>
          </View>
          <View style={styles.metaInfo}>
            <Text style={styles.autor}>por {postagem.usuario?.nmUsuario}</Text>
            <Text style={styles.data}>
              {formatarData(postagem.dtEnvio)}
            </Text>
          </View>
        </View>

        <Text style={styles.conteudo}>{postagem.nmConteudo}</Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Categoria:</Text>
            <Text style={styles.value}>
              {postagem.categoriaDesastre?.nmTitulo ?? 'Categoria não disponível'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Localização:</Text>
            <Text style={styles.value}>
              {postagem.localizacao
                ? `${postagem.localizacao.nmCidade}, ${postagem.localizacao.nmEstado}`
                : 'Localização não disponível'}
            </Text>
          </View>
        </View>

        <View style={styles.acoes}>
          <TouchableOpacity style={styles.acaoButton} onPress={handleLike}>
            <Ionicons
              name={postLikes.isLiked ? 'heart' : 'heart-outline'}
              size={24}
              color={postLikes.isLiked ? '#ff4c4c' : '#666'}
            />
            <Text style={styles.acaoText}>{postLikes.totalLikes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acaoButton}>
            <Ionicons name="chatbubble-outline" size={24} color="#666" />
            <Text style={styles.acaoText}>{comentarios.length || 0}</Text>
          </TouchableOpacity>
        </View>

        {isAuthor && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => navigation.navigate('PostagemFormulario', { 
                id,
                postagem: {
                  idPostagem: postagem.idPostagem,
                  nmTitulo: postagem.nmTitulo,
                  nmConteudo: postagem.nmConteudo,
                  categoriaDesastreId: postagem.categoriaDesastre?.idCategoriaDesastre ?? 0,
                  localizacaoId: postagem.localizacao?.idLocalizacao ?? 0,
                  localizacao: postagem.localizacao,
                  categoriaDesastre: postagem.categoriaDesastre,
                  usuario: postagem.usuario,
                  usuarioId: postagem.usuario?.idUsuario ?? 0,
                  dtEnvio: postagem.dtEnvio,
                  nrLikes: postagem.nrLikes
                }
              })}
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
        )}

        <View style={styles.comentariosContainer}>
          <Text style={styles.comentariosTitulo}>Comentários</Text>
          {respondendoA && (
            <View style={styles.respondendoContainer}>
              <Text style={styles.respondendoText}>
                Respondendo a {respondendoA.usuario?.nmUsuario}
              </Text>
              <TouchableOpacity onPress={() => setRespondendoA(null)}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.comentarioInput}>
            <Animated.View style={[styles.inputContainer, { borderColor: inputBorderColor }]}>
              <TextInput
                style={styles.input}
                placeholder="Escreva um comentário..."
                placeholderTextColor="#666"
                value={novoComentario}
                onChangeText={setNovoComentario}
                multiline
              />
            </Animated.View>
            <AnimatedPressable
              style={[styles.enviarButton, { backgroundColor: buttonBackground }]}
              onPress={handleComentario}
              disabled={!novoComentario.trim() || enviandoComentario}
              onPressIn={() =>
                Animated.timing(buttonAnim, {
                  toValue: 2,
                  duration: 150,
                  useNativeDriver: false,
                }).start()
              }
              onPressOut={() =>
                Animated.timing(buttonAnim, {
                  toValue: 0,
                  duration: 150,
                  useNativeDriver: false,
                }).start()
              }
            >
              {enviandoComentario ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.enviarButtonText}>Enviar</Text>
              )}
            </AnimatedPressable>
          </View>

          {comentarios.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubble-outline" size={48} color="#666" />
              <Text style={styles.emptyStateText}>Nenhum comentário ainda</Text>
              <Text style={styles.emptyStateSubtext}>Seja o primeiro a comentar!</Text>
            </View>
          ) : (
            comentarios
              .filter(c => !c.idComentarioParente)
              .map(comentario => renderComentario(comentario))
          )}
        </View>
      </View>
    </ScrollView>
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
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  autor: {
    color: '#666',
    fontSize: 14,
  },
  data: {
    color: '#666',
    fontSize: 14,
  },
  conteudo: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  infoContainer: {
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 12,
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
  acoes: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#1c1c1c',
    padding: 12,
    borderRadius: 8,
  },
  acaoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  acaoText: {
    color: '#666',
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  comentariosContainer: {
    marginTop: 16,
  },
  comentariosTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  respondendoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1c1c1c',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  respondendoText: {
    color: '#666',
    fontSize: 14,
  },
  comentarioInput: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 8,
    overflow: 'hidden',
  },
  input: {
    backgroundColor: '#1c1c1c',
    padding: 12,
    color: '#fff',
    fontSize: 16,
    minHeight: 50,
  },
  enviarButton: {
    backgroundColor: '#ff4c4c',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  enviarButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  comentario: {
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    padding: 12,
    paddingInline: 18,
    marginBottom: 8,
  },
  resposta: {
    marginLeft: 8,
    marginTop: 12,
    marginBottom: 0,
  },
  comentarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  usuarioNome: {
    color: '#fff',
    fontWeight: 'bold',
  },
  comentarioData: {
    color: '#666',
    fontSize: 12,
  },
  comentarioConteudo: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  comentarioAcoes: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuButton: {
    padding: 4,
  },
  menuDropdown: {
    position: 'absolute',
    right: 8,
    top: 40,
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    padding: 4,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 8,
    borderRadius: 4,
  },
  menuItemText: {
    color: '#fff',
    fontSize: 14,
  },
  menuItemDanger: {
    backgroundColor: '#2a1515',
  },
  menuItemTextDanger: {
    color: '#ff4c4c',
  },
  editInput: {
    backgroundColor: '#2d2d2d',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 14,
    minHeight: 50,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginBottom: 8,
  },
  editButtonCancel: {
    backgroundColor: '#2a2a2a',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  editButtonSave: {
    backgroundColor: '#ff4c4c',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    marginTop: 16,
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  emptyStateSubtext: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
}); 