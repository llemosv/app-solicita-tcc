import { Heading, HStack, Icon, Text, VStack } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export function TaskCard({ data, onPress }: any) {
  const handlePress = () => {
    onPress(data._id);
  };

  return (
    <HStack
      mb={3}
      bg="gray.600"
      rounded="md"
      alignItems="center"
      justifyContent="space-between"
      px={3}
      py={17}
    >
      <Heading
        color="white"
        fontSize="md"
        textTransform="capitalize"
        fontFamily="heading"
      >
        {data.name}
      </Heading>
      <TouchableOpacity onPress={handlePress}>
        <Icon
          as={FontAwesome5}
          name="chevron-right"
          color="gray.100"
          size={4}
        />
      </TouchableOpacity>
    </HStack>
  );
}
