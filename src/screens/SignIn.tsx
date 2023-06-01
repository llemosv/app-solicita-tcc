import { Controller, useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import {
  VStack,
  Image,
  Text,
  Center,
  Heading,
  ScrollView,
  useToast,
} from 'native-base';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { useAuth } from '@hooks/useAuth';

import logo from '@assets/logo.png';

import { AppError } from '@utils/AppError';

import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { useState } from 'react';

type FormData = {
  email: string;
  senha: string;
};

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const toas = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  function handleNewAccount() {
    navigation.navigate('signUp');
  }

  async function handleSignIn(data: FormData) {
    try {
      setIsLoading(true);
      await login(data);
      setIsLoading(false);
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : 'Não foi possível entrar. Tente novamente mais tarde.';

      toas.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
      setIsLoading(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={10} pb={16}>
        <Center my={24}>
          <Image
            source={logo}
            defaultSource={logo}
            alt=""
            resizeMode="contain"
            //position="absolute"
          />
        </Center>

        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Acesse a conta
          </Heading>

          <Controller
            control={control}
            name="email"
            rules={{ required: 'Informe o e-mail' }}
            render={({ field: { onChange } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="senha"
            rules={{ required: 'Informe a senha' }}
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.senha?.message}
              />
            )}
          />

          <Button
            title="Acessar"
            onPress={handleSubmit(handleSignIn)}
            isLoading={isLoading}
          />
        </Center>

        <Center mt={24}>
          <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
            Ainda não tem acesso?
          </Text>

          <Button
            title="Criar Conta"
            variant="outline"
            onPress={handleNewAccount}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
}
