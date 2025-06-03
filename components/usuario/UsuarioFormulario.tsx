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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { usuarioService } from '../../services/usuario';
import { AuthStackParamList } from '../../types/navigation';
import ToastMessage, { ToastMessageRef } from '../Toast';
import { Usuario } from '../../models/usuario';

type UsuarioFormularioNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'UsuarioCadastro'
>;

const AnimatedTextInput = Animated.createAnimatedComponent(RNTextInput);

export const UsuarioFormulario: React.FC = () => {
  const [usuario, setUsuario] = useState<Omit<Usuario, 'id'>>({
    nmUsuario: '',
    nrSenha: '',
    nmEmail: '',
  });
  const [loading, setLoading] = useState(false);

  const nomeBorderAnim = useRef(new Animated.Value(0)).current;
  const emailBorderAnim = useRef(new Animated.Value(0)).current;
  const senhaBorderAnim = useRef(new Animated.Value(0)).current;
  const toastRef = useRef<ToastMessageRef>(null);

  const navigation = useNavigation<UsuarioFormularioNavigationProp>();

  const animateBorder = (anim: Animated.Value, value: number) => {
    Animated.timing(anim, {
      toValue: value,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleChange = (key: keyof Usuario, value: string) => {
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

  const handleSubmit = async () => {
    if (!usuario.nmUsuario || !usuario.nrSenha || !usuario.nmEmail.includes('@')) {
      toastRef.current?.show('Erro', 'Preencha todos os campos corretamente.', 'danger');
      if (!usuario.nmUsuario) animateBorder(nomeBorderAnim, 2);
      if (!usuario.nrSenha) animateBorder(senhaBorderAnim, 2);
      if (!usuario.nmEmail.includes('@')) animateBorder(emailBorderAnim, 2);
      return;
    }

    try {
      setLoading(true);
      await usuarioService.criar(usuario);
      toastRef.current?.show('Sucesso', 'Cadastro realizado com sucesso!', 'success');
      navigation.navigate('UsuarioLogin');
    } catch (error) {
      console.error(error);
      toastRef.current?.show('Erro', 'Erro ao cadastrar. Tente novamente.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigation.navigate('UsuarioLogin');
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
      <ToastMessage ref={toastRef} />
      <View style={styles.header}>
        <Text style={styles.title}>Cadastro de Usuário</Text>
        <Text style={styles.subtitle}>Crie sua conta no Co-Alert</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nome de Usuário</Text>
        <AnimatedTextInput
          style={[styles.input, { borderBottomColor: nomeColor }]}
          value={usuario.nmUsuario}
          onChangeText={(text) => handleChange('nmUsuario', text)}
          placeholder="Digite o nome de usuário"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Email</Text>
        <AnimatedTextInput
          style={[styles.input, { borderBottomColor: emailColor }]}
          value={usuario.nmEmail}
          onChangeText={(text) => handleChange('nmEmail', text)}
          placeholder="Digite o email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <AnimatedTextInput
          style={[styles.input, { borderBottomColor: senhaColor }]}
          value={usuario.nrSenha}
          onChangeText={(text) => handleChange('nrSenha', text)}
          placeholder="Digite a senha"
          placeholderTextColor="#999"
          secureTextEntry
        />

        <Pressable
          style={styles.buttonWrapper}
          onPress={handleSubmit}
        >
          <View style={styles.button}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Cadastrar</Text>
            )}
          </View>
        </Pressable>

        <Pressable style={styles.voltarWrapper} onPress={handleVoltar}>
          <Text style={styles.voltarText}>Já tem uma conta? Entre na sua conta</Text>
        </Pressable>
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
    backgroundColor: '#1b1b1b',
  },
  buttonWrapper: {
    borderColor: '#ff4c4c',
    borderWidth: 2,
    borderRadius: 8,
    marginTop: 10,
  },
  button: {
    padding: 12,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#ff4c4c',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
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
