
let AsyncStorage: any;

try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
  
  if (!AsyncStorage) {
    AsyncStorage = require('@react-native-async-storage/async-storage').AsyncStorage;
  }
  
  if (!AsyncStorage) {
    AsyncStorage = require('@react-native-async-storage/async-storage');
  }
} catch (error) {
  console.warn('AsyncStorage not found, using memory fallback');
  
  const memoryStore: Record<string, string> = {};
  AsyncStorage = {
    getItem: async (key: string) => memoryStore[key] || null,
    setItem: async (key: string, value: string) => { memoryStore[key] = value; },
    removeItem: async (key: string) => { delete memoryStore[key]; },
  };
}

const FAVORITES_KEY = 'user_favorites';

export const getFavorites = async (): Promise<number[]> => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const saveFavorite = async (userId: number): Promise<void> => {
  try {
    const favorites = await getFavorites();
    if (!favorites.includes(userId)) {
      favorites.push(userId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error saving favorite:', error);
  }
};

export const removeFavorite = async (userId: number): Promise<void> => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter(id => id !== userId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error('Error removing favorite:', error);
  }
};

export const toggleFavorite = async (userId: number, isCurrentlyFavorite: boolean): Promise<void> => {
  if (isCurrentlyFavorite) {
    await removeFavorite(userId);
  } else {
    await saveFavorite(userId);
  }
};
