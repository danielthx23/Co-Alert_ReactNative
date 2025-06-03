import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  UsuarioScreen: undefined;
  MainApp: undefined;
  HomeScreen: undefined;
  PostagemScreen: undefined;
  LocalizacaoScreen: undefined;
  CategoriaDesastreScreen: undefined;
  ComentarioScreen: undefined;
};

export type AuthStackParamList = {
  UsuarioLogin: undefined;
  UsuarioCadastro: undefined;
};

export type PostagemStackParamList = {
  PostagemListagem: undefined;
  PostagemFormulario: { id?: number } | undefined;
  PostagemDetalhes: { id: number };
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

export type ComentarioStackParamList = {
  ComentarioListagem: undefined;
  ComentarioFormulario: { id?: number } | undefined;
  ComentarioDetalhes: { id: number };
};

export type DrawerParamList = {
  HomeScreen: undefined;
  PostagemScreen: NavigatorScreenParams<PostagemStackParamList>;
  CategoriaDesastreScreen: NavigatorScreenParams<CategoriaDesastreStackParamList>;
  LocalizacaoScreen: NavigatorScreenParams<LocalizacaoStackParamList>;
  ComentarioScreen: NavigatorScreenParams<ComentarioStackParamList>;
}; 