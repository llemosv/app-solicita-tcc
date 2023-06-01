import { useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FlatList, Heading, HStack, useToast, VStack } from 'native-base';

import { api } from '@services/api';

import { HomeHeader } from '@components/HomeHeader';

import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { Loading } from '@components/Loading';
import { CardPeople } from '@components/CardPeople';
import { Button } from '@components/Button';
import { TeacherDTO } from '@dtos/TeacherDTO';

export function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const [professores, setProfessores] = useState<TeacherDTO[] | null>(null);
  const [teacherSelected, setTeacherSelected] = useState<TeacherDTO | null>(
    null
  );

  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const handleSelectTeacher = useCallback((teacher: TeacherDTO) => {
    setTeacherSelected(teacher);
  }, []);

  function handleSendMessageTeacher() {
    if (teacherSelected) {
      navigation.navigate('solicitation', { teacher: teacherSelected });
    } else {
      return toast.show({
        title:
          'É necessário selecionar um professor para enviar a solicitação!',
        placement: 'bottom',
        bgColor: 'red.500',
      });
    }
  }

  async function getAllTeachers() {
    const response = await api.get('area/listTeacherArea');
    setProfessores(response.data);

    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      setTeacherSelected(null);
      getAllTeachers();
    }, [])
  );
  return (
    <VStack flex={1}>
      <HomeHeader />

      {isLoading ? (
        <Loading />
      ) : (
        <VStack px={8} pt={10}>
          <HStack justifyContent="space-between" mb={5}>
            <Heading color="gray.200" fontSize="md" fontFamily="heading">
              Professores disponíveis para orientação:
            </Heading>
          </HStack>

          <FlatList
            data={professores}
            style={{ maxHeight: 400 }}
            keyExtractor={(item) => String(item.id_pessoa)}
            renderItem={({ item }) => (
              <CardPeople
                item={item}
                onSelect={handleSelectTeacher}
                isSelected={teacherSelected?.id_pessoa === item.id_pessoa}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: professores?.length === 0 ? 1 : undefined,
            }}
          />

          <Button
            title="Enviar solicitação"
            onPress={handleSendMessageTeacher}
            isLoading={isLoading}
            mt={5}
          />
        </VStack>
      )}
    </VStack>
  );
}
