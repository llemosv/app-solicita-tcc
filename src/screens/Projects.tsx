import { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Heading, VStack, SectionList, Text, useToast } from 'native-base';

import { api } from '@services/api';

import { ProjectCard } from '@components/ProjectCard';
import { ScreenHeader } from '@components/ScreenHeader';
import { Loading } from '@components/Loading';
import { TouchableOpacity } from 'react-native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { useAuth } from '@hooks/useAuth';

export function Projects() {
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<any>([]);

  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleNavigateSolicitation() {
    navigation.navigate('home');
  }

  const handleNavigateToTasks = useCallback((itemId: string) => {
    navigation.navigate('tasks', { id_solicitacao: itemId });
  }, []);

  async function getProjects() {
    try {
      setIsLoading(true);

      const response = await api.get(`solicitation/${user?.id}`, {
        params: {
          solicitacao_aceita: true,
        },
      });

      const newData = [
        {
          title: 'Projetos em andamento:',
          data: response.data.map((result: any) => ({
            id: result.id,
            projeto: result.descricao,
            orientador: result.orientador,
            aluno: result.nome,
          })),
        },
      ];

      setProjects(newData);
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
      getProjects();
    }, [])
  );

  return (
    <VStack flex={1}>
      <ScreenHeader title="Projetos" />

      {isLoading ? (
        <Loading />
      ) : (
        <SectionList
          sections={projects}
          keyExtractor={(item: any) => String(item.id)}
          renderItem={({ item }) => (
            <ProjectCard data={item} onPress={handleNavigateToTasks} />
          )}
          renderSectionHeader={({ section }: any) => (
            <Heading
              color="gray.200"
              fontSize="md"
              mt={10}
              mb={3}
              fontFamily="heading"
            >
              {section.title}
            </Heading>
          )}
          px={8}
          contentContainerStyle={
            projects.length === 0 && { flex: 1, justifyContent: 'center' }
          }
          ListEmptyComponent={() => (
            <>
              <Text color="gray.100" textAlign="center">
                Você ainda não possui nenhuma orientação em andamento.
              </Text>
              <TouchableOpacity
                onPress={handleNavigateSolicitation}
                style={{ marginTop: 10 }}
              >
                <Text color="orange.200" textAlign="center">
                  Solicitar orientação
                </Text>
              </TouchableOpacity>
            </>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </VStack>
  );
}
