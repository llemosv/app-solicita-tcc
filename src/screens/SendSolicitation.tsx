import { useState } from 'react';
import { TextInput, TouchableOpacity } from 'react-native';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

import { AppNavigatorRoutesProps } from '@routes/app.routes';

import { Button } from '@components/Button';
import { Loading } from '@components/Loading';
import { Input } from '@components/Input';
import { api } from '@services/api';
import { useAuth } from '@hooks/useAuth';
import { AppError } from '@utils/AppError';

type RouteParamsProps = {
  teacher: any;
};
type FormData = {
  theme: string;
};

export function SendSolicitation() {
  const { user } = useAuth();

  const [sendingRegister, setSendingRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const route = useRoute();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { teacher } = route.params as RouteParamsProps;

  function handleGoBack() {
    navigation.goBack();
  }

  async function handleSolicitation(data: FormData) {
    try {
      setIsLoading(true);

      const response = await api.post('/solicitation', {
        id_aluno_solicitante: user?.id,
        id_professor_orientador: teacher.id_pessoa,
        nome_projeto: data.theme,
        descricao: content,
      });

      setContent('');
      setIsLoading(false);

      navigation.navigate('projects');
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : 'Erro ao enviar solicitação. Tente novamente.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
      setIsLoading(false);
    }
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
            Enviar solicitação
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
              {teacher.nome}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <VStack p={8}>
          <Box bg="gray.800" rounded="md" pb={4} px={4}>
            <HStack
              alignItems="center"
              justifyContent="space-around"
              mb={2}
              mt={5}
            >
              <Controller
                control={control}
                name="theme"
                rules={{ required: 'Informe o tema.' }}
                render={({ field: { onChange } }) => (
                  <Input
                    placeholder="Tema do Projeto"
                    //keyboardType="theme-project"
                    autoCapitalize="none"
                    onChangeText={onChange}
                    errorMessage={errors.theme?.message}
                  />
                )}
              />
            </HStack>
            <HStack alignItems="center" justifyContent="space-around" mb={7}>
              <TextInput
                multiline
                textAlignVertical="top"
                style={{
                  paddingTop: 15,
                  paddingBottom: 15,
                  paddingLeft: 10,
                  paddingRight: 10,
                  borderRadius: 4,
                  fontSize: 16,
                  color: '#E1E1E6',
                  backgroundColor: '#202024',
                  minWidth: '100%',
                }}
                value={content}
                onChangeText={setContent}
                placeholderTextColor="#7C7C8A"
                placeholder="Envie uma mensagem para o orientador"
              />
            </HStack>

            <Button
              title="Solicitar orientação"
              isLoading={sendingRegister}
              onPress={handleSubmit(handleSolicitation)}
            />
          </Box>
        </VStack>
      )}
    </VStack>
  );
}
