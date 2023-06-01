import { useContext } from 'react';

import { useTheme, Box } from 'native-base';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

import { useAuth } from '@hooks/useAuth';

import { AuthRoutes } from './auth.routes';
import { AppRoutes } from './app.routes';
import { Loading } from '@components/Loading';

export function Routes() {
  const { colors } = useTheme();

  const { signed, loading } = useAuth();

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

  if (loading) {
    return <Loading />;
  }

  return (
    <Box flex={1} bg="gray.700">
      <NavigationContainer theme={theme}>
        {signed ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
}
