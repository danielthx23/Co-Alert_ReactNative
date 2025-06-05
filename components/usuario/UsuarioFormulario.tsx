import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TextInput as RNTextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { usuarioService } from '../../services/usuario';
import { UsuarioStackParamList } from '../../types/navigation';
import { Usuario } from '../../models/usuario';
import { useToast } from '../../contexts/ToastContext';

type UsuarioFormularioNavigationProp = StackNavigationProp<UsuarioStackParamList>;
type UsuarioFormularioRouteProp = RouteProp<UsuarioStackParamList, 'UsuarioFormulario'>;

const AnimatedTextInput = Animated.createAnimatedComponent(RNTextInput);

export const UsuarioFormulario: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState<Omit<Usuario, 'idUsuario'>>({
    nmUsuario: '',
    nmEmail: '',
    nrSenha: '',
  });

  const navigation = useNavigation<UsuarioFormularioNavigationProp>();
  const route = useRoute<UsuarioFormularioRouteProp>();
  const { showToast } = useToast();
  const isEditing = Boolean(route.params?.id);

  const nomeBorderAnim = useRef(new Animated.Value(0)).current;
  const emailBorderAnim = useRef(new Animated.Value(0)).current;
  const senhaBorderAnim = useRef(new Animated.Value(0)).current;

  const animateBorder = (anim: Animated.Value, value: number) => {
    Animated.timing(anim, {
      toValue: value,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleChange = (key: keyof Omit<Usuario, 'idUsuario'>, value: string) => {
    setUsuario({ ...usuario, [key]: value });

    if (key === 'nmEmail') {
      if (!value.includes('@')) {
        animateBorder(emailBorderAnim, 2);
      } else {
        animateBorder(emailBorderAnim, 1);
      }
    } else if (key === 'nrSenha') {
      animateBorder(senhaBorderAnim, value ? 1 : 0);
    } else if (key === 'nmUsuario') {
      animateBorder(nomeBorderAnim, value ? 1 : 0);
    }
  };

  React.useEffect(() => {
    const carregarUsuario = async () => {
      if (isEditing && route.params?.id) {
        try {
          const response = await usuarioService.obterPorId(route.params.id);
          setUsuario({
            nmUsuario: response.data.nmUsuario || '',
            nmEmail: response.data.nmEmail || '',
            nrSenha: '',
          });
          animateBorder(nomeBorderAnim, 1);
          animateBorder(emailBorderAnim, 1);
        } catch (error) {
          console.error(error);
          showToast('Erro', 'Não foi possível carregar os dados do usuário.', 'danger');
          navigation.goBack();
        }
      }
    };

    carregarUsuario();
  }, [route.params?.id]);

  const handleSubmit = async () => {
    if (!usuario.nmUsuario || !usuario.nmEmail.includes('@') || (!usuario.nrSenha && !isEditing)) {
      showToast('Erro', 'Preencha todos os campos corretamente.', 'danger');
      if (!usuario.nmUsuario) animateBorder(nomeBorderAnim, 2);
      if (!usuario.nmEmail.includes('@')) animateBorder(emailBorderAnim, 2);
      if (!usuario.nrSenha && !isEditing) animateBorder(senhaBorderAnim, 2);
      return;
    }

    try {
      setLoading(true);
      if (isEditing && route.params?.id) {
        await usuarioService.atualizar(route.params.id, usuario);
        showToast('Sucesso', 'Perfil atualizado com sucesso!', 'success');
        navigation.goBack();
      } else {
        await usuarioService.criar(usuario);
        showToast('Sucesso', 'Usuário criado com sucesso!', 'success');
        navigation.navigate('UsuarioLogin');
      }
    } catch (error) {
      console.error(error);
      showToast('Erro', `Não foi possível ${isEditing ? 'atualizar' : 'criar'} o usuário.`, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigation.goBack();
  };

  const nomeColor = nomeBorderAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['#363636', '#32CD32', '#ff4c4c'],
  });

  const emailColor = emailBorderAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['#363636', '#32CD32', '#ff4c4c'],
  });

  const senhaColor = senhaBorderAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['#363636', '#32CD32', '#ff4c4c'],
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{isEditing ? 'Editar Perfil' : 'Cadastro de Usuário'}</Text>
        <Text style={styles.subtitle}>
          {isEditing ? 'Atualize seus dados' : 'Crie sua conta no Co-Alert'}
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nome de Usuário</Text>
        <AnimatedTextInput
          style={[styles.input, { borderLeftColor: nomeColor }]}
          value={usuario.nmUsuario}
          onChangeText={(text) => handleChange('nmUsuario', text)}
          placeholder="Digite o nome de usuário"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Email</Text>
        <AnimatedTextInput
          style={[styles.input, { borderLeftColor: emailColor }]}
          value={usuario.nmEmail}
          onChangeText={(text) => handleChange('nmEmail', text)}
          placeholder="Digite o email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>{isEditing ? 'Nova Senha (opcional)' : 'Senha'}</Text>
        <AnimatedTextInput
          style={[styles.input, { borderLeftColor: senhaColor }]}
          value={usuario.nrSenha}
          onChangeText={(text) => handleChange('nrSenha', text)}
          placeholder={isEditing ? "Digite a nova senha" : "Digite a senha"}
          placeholderTextColor="#999"
          secureTextEntry
        />

        <View style={styles.buttonGroup}>
          {isEditing && (
            <Pressable
              style={[styles.buttonWrapper, styles.buttonWrapperCancel]}
              onPress={handleVoltar}
            >
              <View style={[styles.button, styles.buttonCancel]}>
                <Text style={[styles.buttonText, styles.buttonTextCancel]}>Cancelar</Text>
              </View>
            </Pressable>
          )}
          <Pressable
            style={[styles.buttonWrapper, isEditing && styles.buttonWrapperConfirm]}
            onPress={handleSubmit}
          >
            <View style={styles.button}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{isEditing ? 'Atualizar' : 'Cadastrar'}</Text>
              )}
            </View>
          </Pressable>
        </View>

        {!isEditing && (
          <Pressable style={styles.voltarWrapper} onPress={handleVoltar}>
            <Text style={styles.voltarText}>Já tem uma conta? Entre na sua conta</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#131315',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff4c4c',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#d3d3d3',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#d3d3d3',
    marginBottom: 5,
  },
  input: {
    borderLeftWidth: 2,
    padding: 10,
    paddingInline: 14,
    marginTop: 2,
    marginBottom: 20,
    fontSize: 16,
    color: '#ffffff',
    backgroundColor: '#1c1c1c',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  buttonWrapper: {
    borderColor: '#ff4c4c',
    borderWidth: 2,
    borderRadius: 8,
    flex: 1,
  },
  buttonWrapperCancel: {
    borderColor: '#2d2d2d',
  },
  buttonWrapperConfirm: {
    flex: 2,
  },
  button: {
    padding: 12,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#ff4c4c',
  },
  buttonCancel: {
    backgroundColor: '#2d2d2d',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonTextCancel: {
    color: '#999',
  },
  voltarWrapper: {
    alignItems: 'center',
    marginTop: 30,
  },
  voltarText: {
    color: '#d3d3d3',
    fontSize: 14,
  },
});
