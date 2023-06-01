import { Heading, HStack, Icon, Text, VStack } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function TaskMessageCard({ data }: any) {
  return (
    <HStack
      mb={3}
      display="flex"
      flexDirection="column"
      bg="gray.600"
      rounded="md"
      alignItems="center"
      //justifyContent="space-between"
      px={4}
      py={17}
    >
      <VStack
        display="flex"
        flexDirection="row"
        width="100%"
        justifyContent="space-between"
      >
        <Text color="gray.300" fontSize="sm" numberOfLines={1}>
          Autor: {data.id_author.nome}
        </Text>

        <Text color="gray.300" fontSize="sm">
          Data:{' '}
          {format(new Date(data.createdAt), 'dd/MM/yyyy HH:mm', {
            locale: ptBR,
          })}
        </Text>
      </VStack>

      <Heading
        mt={5}
        color="gray.200"
        fontSize="sm"
        textTransform="capitalize"
        fontFamily="heading"
        width="100%"
        justifyContent="flex-start"
      >
        <Text color="gray.100" fontWeight="bold" fontSize="md">
          Mensagem:{' '}
        </Text>
        {data.message}
      </Heading>
    </HStack>
  );
}
