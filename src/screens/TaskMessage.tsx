import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, TouchableOpacity } from 'react-native';
import {
  FlatList,
  Heading,
  HStack,
  Icon,
  Text,
  useToast,
  VStack,
} from 'native-base';

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
import { useAuth } from '@hooks/useAuth';
import { TaskMessageDTO } from '@dtos/TaskMessageDTO';
import { TaskMessageCard } from '@components/TaskMessageCard';

type RouteParamsProps = {
  id_task: string;
  id_solicitacao: string;
};

export function TaskMessage() {
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [taskMessage, setTaskMessage] = useState<TaskMessageDTO[] | null>(null);

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const route = useRoute();
  const toast = useToast();

  const { id_task, id_solicitacao } = route.params as RouteParamsProps;

  function handleGoBack() {
    navigation.navigate('tasks', { id_solicitacao });
  }

  function handleNewTask() {
    navigation.navigate('newTaskMessage', { id_task, id_solicitacao });
  }

  async function searchTasksMessage() {
    try {
      const response = await api.get(`/tasks/message/${id_task}`);

      setTaskMessage(response.data);
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

  async function handleRefresh() {
    setIsRefreshing(true);
    await searchTasksMessage();
  }
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      searchTasksMessage();
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
            Mensagens
          </Heading>

          <TouchableOpacity>
            <TouchableOpacity onPress={handleNewTask}>
              <Icon as={FontAwesome5} name="plus" color="orange.500" size={4} />
            </TouchableOpacity>
          </TouchableOpacity>
        </HStack>
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <VStack px={8} py={5}>
          <FlatList
            data={taskMessage}
            style={{ maxHeight: '100%' }}
            keyExtractor={(item: any) => item._id}
            renderItem={({ item }) => <TaskMessageCard data={item} />}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
              />
            }
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{
              paddingBottom: '100%',
            }}
            ListEmptyComponent={() => (
              <HStack
                justifyContent="center"
                display="flex"
                height="full"
                mt="1/2"
                alignItems="center"
              >
                <Heading
                  color="gray.100"
                  fontSize="lg"
                  flexShrink={1}
                  fontFamily="heading"
                >
                  Nenhuma mensagem encontrada!
                </Heading>
              </HStack>
            )}
          />
        </VStack>
      )}
    </VStack>
  );
}
