import { useNavigation } from '@react-navigation/native';

import IconButton from './IconButton';

export default function HeaderAddButton() {
  const navigation = useNavigation();

  return (
    <IconButton
      icon="add-circle"
      size={24}
      color="#fff"
      onPress={() => navigation.navigate('GerenciarDespesa' as never)}
    />
  );
}
