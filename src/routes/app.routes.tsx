import { Platform } from 'react-native';
import { useTheme } from 'native-base';
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';

import HomeSvg from '@assets/home.svg';
import HistorySvg from '@assets/history.svg';
import ProfileSvg from '@assets/profile.svg';

import { Home } from '@screens/Home';
import { SendSolicitation } from '@screens/SendSolicitation';
import { Projects } from '@screens/Projects';
import { Profile } from '@screens/Profile';
import { TeacherDTO } from '@dtos/TeacherDTO';
import { Tasks } from '@screens/Task';
import { TaskMessage } from '@screens/TaskMessage';
import { NewTaskMessage } from '@screens/NewTaskMessage';
import { NewTask } from '@screens/NewTask';
import { useAuth } from '@hooks/useAuth';
import { HomeTeacher } from '@screens/HomeTeacher';
import { AcceptSolicitation } from '@screens/AcceptSolicitation';
import { SolicitationDTO } from '@dtos/SolicitationDTO';

type AppRoutes = {
  home: undefined;
  homeTeacher: undefined;

  solicitation: {
    teacher: TeacherDTO;
  };
  acceptSolicitation: {
    solicitation: SolicitationDTO;
  };
  profile: undefined;
  projects: undefined;
  tasks: {
    id_solicitacao: string;
  };
  newTask: {
    id_solicitacao: string;
  };
  tasksMessage: {
    id_task: string;
    id_solicitacao: string;
  };
  newTaskMessage: {
    id_task: string;
    id_solicitacao: string;
  };
};

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {
  const { user } = useAuth();

  const { sizes, colors } = useTheme();

  const iconSize = sizes[6];

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.orange[500],
        tabBarInactiveTintColor: colors.gray[200],
        tabBarStyle: {
          backgroundColor: colors.gray[600],
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? 'auto' : 96,
          paddingBottom: sizes[7],
          paddingTop: sizes[7],
        },
      }}
    >
      {user?.tipo_pessoa === 'Professor' ? (
        <Screen
          name="homeTeacher"
          component={HomeTeacher}
          options={{
            tabBarIcon: ({ color }) => (
              <HomeSvg fill={color} width={iconSize} height={iconSize} />
            ),
          }}
        />
      ) : (
        <Screen
          name="home"
          component={Home}
          options={{
            tabBarIcon: ({ color }) => (
              <HomeSvg fill={color} width={iconSize} height={iconSize} />
            ),
          }}
        />
      )}

      <Screen
        name="projects"
        component={Projects}
        options={{
          tabBarIcon: ({ color }) => (
            <HistorySvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />

      <Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <ProfileSvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />

      <Screen
        name="solicitation"
        component={SendSolicitation}
        options={{ tabBarButton: () => null }}
      />

      <Screen
        name="acceptSolicitation"
        component={AcceptSolicitation}
        options={{ tabBarButton: () => null }}
      />

      <Screen
        name="tasks"
        component={Tasks}
        options={{ tabBarButton: () => null }}
      />

      <Screen
        name="newTask"
        component={NewTask}
        options={{ tabBarButton: () => null }}
      />

      <Screen
        name="tasksMessage"
        component={TaskMessage}
        options={{ tabBarButton: () => null }}
      />

      <Screen
        name="newTaskMessage"
        component={NewTaskMessage}
        options={{ tabBarButton: () => null }}
      />
    </Navigator>
  );
}
