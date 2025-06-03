import { useState, forwardRef, useImperativeHandle } from 'react';
import { Dimensions, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { FontAwesome5 } from '@expo/vector-icons';

export type ToastMessageRef = {
  show: (text: string, description: string, type?: 'success' | 'danger' | 'info' | 'warning') => void;
};

const { width } = Dimensions.get('window');

const ToastMessage = forwardRef<ToastMessageRef>((_, ref) => {
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'success' | 'danger' | 'info' | 'warning'>('info');

  const translateY = useSharedValue(-120);
  const opacity = useSharedValue(0);

  const TOAST_TYPE = {
    success: { backgroundColor: '#2ecc71', icon: 'check-circle' },
    danger: { backgroundColor: '#e74c3c', icon: 'exclamation-circle' },
    info: { backgroundColor: '#3498db', icon: 'info-circle' },
    warning: { backgroundColor: '#f39c12', icon: 'exclamation-triangle' },
  };

  const show = (msg: string, desc: string, toastType: 'success' | 'danger' | 'info' | 'warning' = 'info') => {
    setText(msg);
    setDescription(desc);
    setType(toastType);

    opacity.value = withTiming(1, { duration: 200 });
    translateY.value = withTiming(0, { duration: 400 });

    setTimeout(() => {
      opacity.value = withTiming(0, { duration: 300 });
      translateY.value = withTiming(-120, { duration: 300 });
    }, 2500);
  };

  useImperativeHandle(ref, () => ({ show }));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const { backgroundColor, icon } = TOAST_TYPE[type];

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          width,
          padding: 16,
          paddingTop: 50,
          zIndex: 999,
          backgroundColor,
          flexDirection: 'row',
          alignItems: 'center',
        },
        animatedStyle,
      ]}
    >
      <FontAwesome5 name={icon} size={24} color="#FFF" style={{ marginRight: 12 }} />
      <View>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFF' }}>{text}</Text>
        <Text style={{ fontSize: 14, color: '#FFF' }}>{description}</Text>
      </View>
    </Animated.View>
  );
});

export default ToastMessage;