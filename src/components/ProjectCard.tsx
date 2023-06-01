import { Heading, HStack, Text, VStack } from 'native-base';
import { Touchable, TouchableOpacity } from 'react-native';

export function ProjectCard({ data, onPress }: any) {
  const handlePress = () => {
    onPress(data.id);
  };
  return (
    <HStack
      mb={3}
      bg="gray.600"
      rounded="md"
      alignItems="center"
      justifyContent="space-between"
    >
      <TouchableOpacity
        style={{
          width: '100%',
          paddingLeft: 13,
          paddingRight: 13,
          paddingTop: 9,
          paddingBottom: 9,
        }}
        onPress={handlePress}
      >
        <Heading
          color="white"
          fontSize="md"
          textTransform="capitalize"
          fontFamily="heading"
        >
          {data.projeto}
        </Heading>
        <VStack
          mt={5}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Text color="gray.300" fontSize="sm" numberOfLines={1}>
            Orientador: {data.orientador}
          </Text>

          <Text color="gray.300" fontSize="sm">
            Aluno: {data.aluno}
          </Text>
        </VStack>
      </TouchableOpacity>
    </HStack>
  );
}
