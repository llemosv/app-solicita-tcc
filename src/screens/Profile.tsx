import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  Center,
  ScrollView,
  VStack,
  Skeleton,
  Text,
  Heading,
  useToast,
} from 'native-base';
import { Controller, useForm } from 'react-hook-form';

import defaulUserPhotoImg from '@assets/userPhotoDefault.png';

import { useAuth } from '@hooks/useAuth';

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { Input } from '@components/Input';
import { Button } from '@components/Button';

const PHOTO_SIZE = 33;

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  old_password: string;
  confirm_password: string;
};

export function Profile() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [photoIsLoading, setPhotoIsLoading] = useState(false);

  const toast = useToast();
  const { user } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      name: user?.name,
      email: user?.email,
    },
  });

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt={6} px={10}>
          {photoIsLoading ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
              startColor="gray.500"
              endColor="gray.400"
            />
          ) : (
            <UserPhoto
              source={defaulUserPhotoImg}
              alt="Foto do usuário"
              size={PHOTO_SIZE}
            />
          )}

          <TouchableOpacity>
            <Text
              color="orange.500"
              fontWeight="bold"
              fontSize="md"
              mt={2}
              mb={8}
            >
              Alterar Foto
            </Text>
          </TouchableOpacity>

          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="E-mail"
                isDisabled
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          <Heading
            color="gray.200"
            fontSize="md"
            mb={2}
            alignSelf="flex-start"
            mt={12}
            fontFamily="heading"
          >
            Alterar senha
          </Heading>

          <Controller
            control={control}
            name="old_password"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Senha antiga"
                secureTextEntry
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Nova senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Confirme a nova senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.confirm_password?.message}
              />
            )}
          />

          <Button
            title="Atualizar"
            mt={4}
            //onPress={handleSubmit(handleProfileUpdate)}
            isLoading={isUpdating}
          />
        </Center>
      </ScrollView>
    </VStack>
  );
}
