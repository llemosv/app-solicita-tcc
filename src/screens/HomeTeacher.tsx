import { useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FlatList, Heading, HStack, Text, useToast, VStack } from 'native-base';

import { api } from '@services/api';

import { HomeHeader } from '@components/HomeHeader';

import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { Loading } from '@components/Loading';
import { CardPeople } from '@components/CardPeople';
import { Button } from '@components/Button';
import { useAuth } from '@hooks/useAuth';
import { SolicitationDTO } from '@dtos/SolicitationDTO';

export function HomeTeacher() {
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const [solicitations, setSolicitations] = useState<SolicitationDTO[] | null>(
    null
  );
  const [solicitationSelected, setSolicitationSelected] =
    useState<SolicitationDTO | null>(null);

  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const handleSelectSolicitation = useCallback(
    (solicitation: SolicitationDTO) => {
      setSolicitationSelected(solicitation);
    },
    []
  );

  function handleAnswerSolicitation() {
    if (solicitationSelected) {
      navigation.navigate('acceptSolicitation', {
        solicitation: solicitationSelected,
      });
    } else {
      return toast.show({
        title: 'É necessário selecionar uma solicitação!',
        placement: 'bottom',
        bgColor: 'red.500',
      });
    }
  }

  async function getPendingSolicitations() {
    try {
      setIsLoading(true);

      const response = await api.get(`solicitation/${user?.id}`, {
        params: {
          solicitacao_aceita: false,
        },
      });

      setSolicitations(response.data);
    } catch (error: any) {
      toast.show({
        title: error.response.data.message,
        placement: 'bottom',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      setSolicitations(null);
      setSolicitationSelected(null);
      getPendingSolicitations();
    }, [])
  );
  console.log(solicitations);
  return (
    <VStack flex={1}>
      <HomeHeader />

      {isLoading ? (
        <Loading />
      ) : (
        <VStack px={8} pt={10}>
          {solicitations ? (
            <>
              <HStack justifyContent="space-between" mb={5}>
                <Heading color="gray.200" fontSize="md" fontFamily="heading">
                  Solicitações de orientação recebidas:
                </Heading>
              </HStack>

              <FlatList
                data={solicitations}
                style={{ maxHeight: 400 }}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                  <CardPeople
                    item={item}
                    onSelect={handleSelectSolicitation}
                    isSelected={solicitationSelected?.id === item.id}
                  />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  flexGrow: solicitations?.length === 0 ? 1 : undefined,
                }}
              />

              <Button
                title="Responder solicitação"
                onPress={handleAnswerSolicitation}
                isLoading={isLoading}
                mt={5}
              />
            </>
          ) : (
            <HStack justifyContent="center" height="lg" alignItems="center">
              <Text color="gray.100" textAlign="center" fontSize="md">
                Você não possui nenhuma solicitação.
              </Text>
            </HStack>
          )}
        </VStack>
      )}
    </VStack>
  );
}
