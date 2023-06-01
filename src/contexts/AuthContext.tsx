import { createContext, ReactNode, useEffect, useState } from 'react';
import { api } from '@services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  id: string;
  email: string;
  name: string;
  tipo_pessoa: string;
};

export type AuthContextDataProps = {
  signed: boolean;
  user: User | null;
  login: (loginDTO: any) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<null | User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storagedUser = await AsyncStorage.getItem('@AppSolicitaTcc:user');
      const storagedToken = await AsyncStorage.getItem('@AppSolicitaTcc:token');
      if (storagedUser && storagedToken) {
        setUser(JSON.parse(storagedUser));
        api.defaults.headers.Authorization = `Baerer ${storagedToken}`;
        setLoading(false);
      }
      setLoading(false);
    }

    loadStorageData();
  }, []);

  async function login(loginDTO: any) {
    const { data } = await api.post('/login', loginDTO);

    setUser(data.user);

    api.defaults.headers.Authorization = `Baerer ${data.token}`;

    await AsyncStorage.setItem(
      '@AppSolicitaTcc:user',
      JSON.stringify(data.user)
    );
    await AsyncStorage.setItem('@AppSolicitaTcc:token', data.token);
  }

  async function logout() {
    await AsyncStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        signed: Boolean(user),
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
