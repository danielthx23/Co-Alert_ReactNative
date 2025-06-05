import { NavigatorScreenParams } from '@react-navigation/native';
import { Postagem } from '../models/postagem';

export type RootStackParamList = {
  UsuarioScreen: NavigatorScreenParams<UsuarioStackParamList>;
  MainApp: NavigatorScreenParams<DrawerParamList>;
  PostagemDetalhes: { id: number };
};

export type UsuarioStackParamList = {
  UsuarioLogin: undefined;
  UsuarioCadastro: undefined;
  UsuarioDetalhes: { id: number };
  UsuarioFormulario: { id: number };
};

export type AuthStackParamList = {
  UsuarioLogin: undefined;
  UsuarioCadastro: undefined;
};

export type PostagemStackParamList = {
  PostagemListagem: undefined;
  PostagemDetalhes: {
    id: number;
  };
  PostagemFormulario: {
    id?: number;
    postagem?: Postagem;
  };
};

export type LocalizacaoStackParamList = {
  LocalizacaoListagem: undefined;
  LocalizacaoFormulario: { id?: number } | undefined;
  LocalizacaoDetalhes: { id: number };
};

export type CategoriaDesastreStackParamList = {
  CategoriaDesastreListagem: undefined;
  CategoriaDesastreFormulario: { id?: number } | undefined;
  CategoriaDesastreDetalhes: { id: number };
};

export type DrawerParamList = {
  HomeScreen: undefined;
  PostagemScreen: NavigatorScreenParams<PostagemStackParamList>;
  CategoriaDesastreScreen: NavigatorScreenParams<CategoriaDesastreStackParamList>;
  LocalizacaoScreen: NavigatorScreenParams<LocalizacaoStackParamList>;
  UsuarioScreen: NavigatorScreenParams<UsuarioStackParamList>;
}; 