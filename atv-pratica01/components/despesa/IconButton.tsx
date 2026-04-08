import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

type IconButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  size: number;
  color: string;
  onPress: () => void;
};

export default function IconButton({ icon, size, color, onPress }: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={size} color={color} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
  },
  pressed: {
    opacity: 0.7,
  },
  iconContainer: {
    padding: 6,
  },
});
