import { Pressable, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

function IconButton({ icon, size, color, onPress }) {
  const navigation = useNavigation();

  function pressHandler() {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('GerenciarDespesa');
    }
  }

  return (
    <Pressable
      onPress={pressHandler}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={styles.buttonContainer}>
        <Ionicons name={icon} size={size} color={color} />
      </View>
    </Pressable>
  );
}

export default IconButton;

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 8,
    marginRight: 8,
  },
  pressed: {
    opacity: 0.7,
  },
});