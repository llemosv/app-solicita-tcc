import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, TouchableOpacity } from 'react-native';
import { FlatList, Heading, HStack, Icon, useToast, VStack } from 'native-base';

import { Feather } from '@expo/vector-icons';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

import { AppNavigatorRoutesProps } from '@routes/app.routes';

import { Loading } from '@components/Loading';
import { api } from '@services/api';
import { TaskCard } from '@components/TaskCard';

type RouteParamsProps = {
  id_solicitacao: string;
};

export function Tasks() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTaks] = useState<TaskDTO[] | null>(null);

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const route = useRoute();
  const toast = useToast();

  const { id_solicitacao } = route.params as RouteParamsProps;

  function handleGoBack() {
    navigation.navigate('projects');
  }

  function handleNewTask() {
    navigation.navigate('newTask', { id_solicitacao });
  }

  async function searchTasks() {
    try {
      const response = await api.get(`/tasks/${id_solicitacao}`);

      setTaks(response.data);
    } catch (error: any) {
      toast.show({
        title: error.response.data.message,
        placement: 'bottom',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }
  function handleViewMessages(id_task: string) {
    console.log(id_task);
    navigation.navigate('tasksMessage', { id_task, id_solicitacao });
  }

  async function handleRefresh() {
    setIsRefreshing(true);
    await searchTasks();
  }

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);

      searchTasks();
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
            Tarefas
          </Heading>

          <TouchableOpacity onPress={handleNewTask}>
            <Icon as={FontAwesome5} name="plus" color="orange.500" size={4} />
          </TouchableOpacity>
        </HStack>
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <VStack p={8}>
          <FlatList
            data={tasks}
            style={{ maxHeight: 400 }}
            keyExtractor={(item: any) => item._id}
            renderItem={({ item }) => (
              <TaskCard data={item} onPress={handleViewMessages} />
            )}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
              />
            }
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{
              paddingBottom: 20,
            }}
          />
        </VStack>
      )}
    </VStack>
  );
}
