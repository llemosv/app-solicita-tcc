import { useState } from 'react';
import { TextInput, TouchableOpacity } from 'react-native';
import {
  Box,
  Heading,
  HStack,
  Icon,
  Switch,
  Text,
  useToast,
  VStack,
} from 'native-base';
import { Controller, useForm } from 'react-hook-form';

import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

import { AppNavigatorRoutesProps } from '@routes/app.routes';

import { Button } from '@components/Button';
import { Loading } from '@components/Loading';
import { Input } from '@components/Input';
import { api } from '@services/api';
import { useAuth } from '@hooks/useAuth';
import { AppError } from '@utils/AppError';
import { InputText } from '@components/TextInput';

type RouteParamsProps = {
  solicitation: any;
};
type FormData = {
  message: string;
};

export function AcceptSolicitation() {
  const { user } = useAuth();

  const [isAccepted, setIsAccepted] = useState(false);

  const [sendingRegister, setSendingRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const route = useRoute();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const { solicitation } = route.params as RouteParamsProps;

  function handleGoBack() {
    navigation.goBack();
  }
  console.log(solicitation);
  async function handleAnswer(data: FormData) {
    try {
      setIsLoading(true);

      await api.put(`/solicitation/${solicitation.id}`, {
        accept: isAccepted,
      });

      setIsLoading(false);
      reset();
      navigation.navigate('projects');
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : 'Erro ao responder solicitação. Tente novamente.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
      setIsLoading(false);
    }
  }

  function handleSwitchChange(value: boolean) {
    setIsAccepted(value);
  }
  return (
    <VStack flex={1}>
      <VStack px={8} bg="gray.600" pt={12}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={Feather} name="arrow-left" color="orange.500" size={6} />
        </TouchableOpacity>

        <HStack
          justifyContent="space-between"
          mt={4}
          mb={8}
          alignItems="center"
        >
          <Heading
            color="gray.100"
            fontSize="lg"
            flexShrink={1}
            fontFamily="heading"
          >
            Aceitar solicitação
          </Heading>

          <HStack w="auto" alignItems="center">
            <Icon
              as={FontAwesome5}
              name="chalkboard-teacher"
              color="orange.500"
              size={4}
              mr={3}
            />

            <Text color="gray.200" textTransform="capitalize">
              {user?.name}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <VStack p={8}>
          <Box bg="gray.800" rounded="md" pb={4} px={4}>
            <HStack alignItems="center" justifyContent="center" mb={2} mt={5}>
              <Text color="gray.100" mr={5}>
                Recusar
              </Text>
              <Switch
                isChecked={isAccepted}
                onToggle={handleSwitchChange}
                colorScheme="orange"
              />
              <Text color="gray.100" ml={4}>
                Aceitar
              </Text>
            </HStack>
            <HStack alignItems="center" justifyContent="space-around" mb={7}>
              <Controller
                control={control}
                name="message"
                rules={{ required: 'Informe a mensagem.' }}
                render={({ field: { onChange } }) => (
                  <InputText
                    onChangeText={onChange}
                    errorMessage={errors.message?.message}
                    placeholder="Deixe sua mensagem para o aluno"
                  />
                )}
              />
            </HStack>

            <Button
              title="Responder solicitação"
              isLoading={sendingRegister}
              onPress={handleSubmit(handleAnswer)}
            />
          </Box>
        </VStack>
      )}
    </VStack>
  );
}
