import { HStack, Heading, Icon, Image, Text, VStack, View } from 'native-base';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import defaulUserPhotoImg from '@assets/userPhotoDefault.png';
import { MaterialIcons } from '@expo/vector-icons';

export function CardPeople({ item, onSelect, isSelected }: any) {
  const [expanded, setExpanded] = useState(false);

  const iconArrow = expanded ? 'keyboard-arrow-right' : 'keyboard-arrow-down';

  function handleSelectTeacher() {
    console.log(item);

    onSelect(item);
  }

  function handleToggleAccordion() {
    setExpanded(!expanded);
  }

  return (
    <HStack
      key={item.id}
      display="flex"
      flexDirection="column"
      bg="gray.500"
      alignItems="center"
      p={2}
      py={3}
      pr={4}
      rounded="md"
      mb={3}
    >
      <View
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        width="full"
      >
        <Image
          source={defaulUserPhotoImg}
          alt="Imagem do exercício"
          w={10}
          h={10}
          rounded="3xl"
          mr={4}
          resizeMode="center"
        />

        <VStack flex={1}>
          <Heading fontSize="lg" color="white" fontFamily="heading">
            {item.nome}
          </Heading>
        </VStack>

        <View flexDirection="row" alignItems="center">
          <TouchableOpacity onPress={handleSelectTeacher}>
            <Icon
              as={MaterialIcons}
              name="check"
              color={isSelected ? 'orange.500' : 'gray.200'}
              size={7}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleToggleAccordion}>
            <Icon
              as={MaterialIcons}
              name={iconArrow}
              color="gray.200"
              size={7}
            />
          </TouchableOpacity>
        </View>
      </View>
      {expanded && (
        <View px={2} py={5} width="full" mt={2}>
          <Text style={{ fontWeight: 'bold', color: 'white' }}>
            {item.descricao}
          </Text>
        </View>
      )}
    </HStack>
  );
}
