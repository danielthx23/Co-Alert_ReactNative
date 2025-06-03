import { Alert } from 'react-native';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export const showToast = (type: ToastType, message: string) => {
  let title = '';
  
  switch (type) {
    case 'success':
      title = 'Sucesso';
      break;
    case 'error':
      title = 'Erro';
      break;
    case 'info':
      title = 'Informação';
      break;
    case 'warning':
      title = 'Atenção';
      break;
  }

  Alert.alert(title, message);
}; 