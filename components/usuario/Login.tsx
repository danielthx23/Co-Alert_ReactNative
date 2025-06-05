import React, { useState, useRef } from 'react';
import { Image } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TextInput as RNTextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { usuarioService } from '../../services/usuario';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStackParamList, RootStackParamList } from '../../types/navigation';
import ToastMessage, { ToastMessageRef } from '../Toast';
import { LoginCredentials, Usuario, LoginResponse } from '../../models/usuario';

type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList & RootStackParamList,
  'UsuarioLogin'
>;

type LoginProps = {
  setUsuarioLogado: React.Dispatch<React.SetStateAction<Usuario | undefined>>;
};

const AnimatedTextInput = Animated.createAnimatedComponent(RNTextInput);

export const Login: React.FC<LoginProps> = ({ setUsuarioLogado }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [emailError, setEmailError] = useState('');
  const [senhaError, setSenhaError] = useState('');
  const [loading, setLoading] = useState(false);
  const toastRef = useRef<ToastMessageRef>(null);

  const navigation = useNavigation<LoginScreenNavigationProp>();

  const emailBorderAnim = useRef(new Animated.Value(0)).current;
  const senhaBorderAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const underlineAnim = useRef(new Animated.Value(0)).current;

  const animateBorder = (anim: Animated.Value, value: number) => {
    Animated.timing(anim, {
      toValue: value,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const onEmailChange = (text: string) => {
    setEmail(text);
    if (text === '') {
      setEmailError('');
      animateBorder(emailBorderAnim, 0);
    } else if (!text.includes('@')) {
      setEmailError('E-mail inválido');
      animateBorder(emailBorderAnim, 2);
    } else {
      setEmailError('');
      animateBorder(emailBorderAnim, 1);
    }
  };

  const onSenhaChange = (text: string) => {
    setSenha(text);
    if (text === '') {
      setSenhaError('');
      animateBorder(senhaBorderAnim, 0);
    } else {
      setSenhaError('');
      animateBorder(senhaBorderAnim, 1);
    }
  };

  const handleLogin = async () => {
    if (!email.includes('@')) {
      setEmailError('E-mail inválido');
      animateBorder(emailBorderAnim, 2);
      return;
    }
    if (!senha) {
      setSenhaError('Senha obrigatória');
      animateBorder(senhaBorderAnim, 2);
      return;
    }

    try {
      setLoading(true);
      const credentials: LoginCredentials = { nmEmail: email, nrSenha: senha };
      const response = await usuarioService.autenticar(credentials);
      const loginResponse = response.data as Usuario;
      setUsuarioLogado(loginResponse);
      toastRef.current?.show('Sucesso', 'Login efetuado com sucesso!', 'success');
      await AsyncStorage.setItem('user_token', loginResponse.tokenProvisorio || '');
      navigation.navigate('MainApp' as never);
    } catch (error) {
      toastRef.current?.show('Erro', 'E-mail ou senha incorretos.', 'danger')
      setSenhaError('E-mail ou senha incorretos');
      animateBorder(senhaBorderAnim, 2);
    } finally {
      setLoading(false);
    }
  };

  const emailBorderColor = emailBorderAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['#363636', '#32CD32', '#ff4c4c'], // padrão, válido, inválido
  });

  const senhaBorderColor = senhaBorderAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['#363636', '#32CD32', '#ff4c4c'],
  });

  const buttonBackground = buttonAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['#ff4c4c', '#5e1d1d', '#461212'],
  });

  const buttonTextColor = buttonAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['#ffffff', '#ffffff', '#ffffff'],
  });

  const underlineWidth = underlineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 220],
  });

  return (
    <View style={styles.container}>
      <ToastMessage ref={toastRef} />
      <View style={styles.form}>
        <Image
          source={require('../../assets/coalertlogo.png')}
          style={styles.logo}
        />

        <Text style={styles.title}>Co-Alert</Text>
        <Text style={styles.subtitle}>Sistema de Alerta de Desastres</Text>

        <Text style={styles.label}>E-mail</Text>
        <AnimatedTextInput
          style={[styles.input, { borderBottomColor: emailBorderColor }]}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#999"
          value={email}
          onChangeText={onEmailChange}
          onBlur={() => {
            if (email === '') animateBorder(emailBorderAnim, 0);
          }}
        />
        {emailError ? (
          <Text style={styles.error}>{emailError}</Text>
        ) : (
          <Text style={styles.spacer}>&nbsp;</Text>
        )}

        <Text style={styles.label}>Senha</Text>
        <AnimatedTextInput
          style={[styles.input, { borderBottomColor: senhaBorderColor }]}
          placeholder="Digite sua senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={senha}
          onChangeText={onSenhaChange}
          onBlur={() => {
            if (senha === '') animateBorder(senhaBorderAnim, 0);
          }}
        />
        {senhaError ? (
          <Text style={styles.error}>{senhaError}</Text>
        ) : (
          <Text style={styles.spacer}>&nbsp;</Text>
        )}

        <Pressable
          onPress={handleLogin}
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
          style={styles.buttonWrapper}
        >
          <Animated.View style={[styles.button, { backgroundColor: buttonBackground }]}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Animated.Text style={[styles.buttonText, { color: buttonTextColor }]}>Entrar</Animated.Text>
            )}
          </Animated.View>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('UsuarioCadastro')}
          onHoverIn={() =>
            Animated.spring(underlineAnim, {
              toValue: 1,
              speed: 12,
              bounciness: 8,
              useNativeDriver: false,
            }).start()
          }
          onHoverOut={() =>
            Animated.spring(underlineAnim, {
              toValue: 0,
              speed: 12,
              useNativeDriver: false,
            }).start()
          }
          style={styles.linkWrapper}
        >
          <Text style={styles.linkText}>Ainda não tem conta? Cadastre-se</Text>
          <Animated.View style={[styles.underline, { width: underlineWidth }]} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131315',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginInline: 'auto',
    marginBottom: 5,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    minWidth: 280,
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
    marginBottom: 32,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#d3d3d3',
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 2,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    color: '#ffffff',
  },
  error: {
    fontSize: 12,
    color: '#ff4c4c',
    marginBottom: 10,
  },
  spacer: {
    fontSize: 12,
    opacity: 0,
    marginBottom: 10,
  },
  buttonWrapper: {
    borderColor: '#ff4c4c',
    borderWidth: 2,
    borderRadius: 8,
    marginTop: 20,
  },
  button: {
    padding: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkWrapper: {
    alignItems: 'center',
    marginTop: 30,
  },
  linkText: {
    color: '#d3d3d3',
    fontSize: 14,
  },
  underline: {
    height: 2,
    backgroundColor: '#d3d3d3',
    marginTop: 2,
    borderRadius: 1,
  },
});
