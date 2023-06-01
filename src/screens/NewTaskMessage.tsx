import { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  Box,
  Heading,
  HStack,
  Icon,
  Text,
  useToast,
  VStack,
} from 'native-base';
import { Controller, useForm } from 'react-hook-form';

import { Feather } from '@expo/vector-icons';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

import { AppNavigatorRoutesProps } from '@routes/app.routes';

import { Button } from '@components/Button';
import { Loading } from '@components/Loading';
import { InputText } from '@components/TextInput';

import { api } from '@services/api';
import { useAuth } from '@hooks/useAuth';
import { AppError } from '@utils/AppError';

type RouteParamsProps = {
  id_task: string;
  id_solicitacao: string;
};
type FormData = {
  message: string;
};

export function NewTaskMessage() {
  const { user } = useAuth();

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

  const { id_task, id_solicitacao } = route.params as RouteParamsProps;

  function handleGoBack() {
    navigation.navigate('tasksMessage', { id_task, id_solicitacao });
  }

  async function handleNewMessage(data: FormData) {
    try {
      setIsLoading(true);
      await api.post('/tasks/message', {
        id_task,
        id_author: user?.id,
        message: data.message,
      });

      handleGoBack();
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : 'Erro ao enviar mensagem. Tente novamente.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }
  useFocusEffect(
    useCallback(() => {
      reset();
    }, [])
  );

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
            Nova Mensagem
          </Heading>

          <HStack w="auto" alignItems="center">
            <Icon
              as={FontAwesome5}
              name="chalkboard-teacher"
              color="gray.100"
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
            <HStack alignItems="center" justifyContent="space-around" mt={5}>
              <Controller
                control={control}
                name="message"
                rules={{ required: 'Informe a mensagem.' }}
                render={({ field: { onChange } }) => (
                  <InputText
                    onChangeText={onChange}
                    errorMessage={errors.message?.message}
                    placeholder="Mensagem"
                  />
                )}
              />
            </HStack>

            <Button
              title="Enviar mensagem"
              isLoading={sendingRegister}
              mt={2}
              onPress={handleSubmit(handleNewMessage)}
            />
          </Box>
        </VStack>
      )}
    </VStack>
  );
}
