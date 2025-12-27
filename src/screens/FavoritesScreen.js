
import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import UserCard from '../components/UserCard';
import { useFavorites } from '../context/FavoritesContext';
import { fetchAllUsers } from '../services/api';

const FavoritesScreen = ({ navigation }) => {
  const [favoriteUsers, setFavoriteUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const { favorites, toggleFavorite, isFavorite, loading: loadingFavorites } = useFavorites();

  const loadFavorites = useCallback(async () => {
    console.log('Loading favorite users...');
    setLoadingUsers(true);
    try {
      const allUsers = await fetchAllUsers();
      
      // Filter only favorite users using global context
      const favoritesList = allUsers
        .filter(user => isFavorite(user.id))
        .map(user => ({ ...user, isFavorite: true }));
      
      console.log(`Found ${favoritesList.length} favorite users`);
      setFavoriteUsers(favoritesList);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoadingUsers(false);
      setRefreshing(false);
    }
  }, [isFavorite]);

  // Load favorites when screen focuses or favorites change
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('Favorites screen focused, loading...');
      loadFavorites();
    });
    
    loadFavorites();
    
    return unsubscribe;
  }, [navigation, loadFavorites]);

  // Update when favorites change
  useEffect(() => {
    if (favoriteUsers.length > 0) {
      // Remove users that are no longer favorites
      const updatedFavorites = favoriteUsers.filter(user => isFavorite(user.id));
      if (updatedFavorites.length !== favoriteUsers.length) {
        console.log('Updating favorites list due to changes');
        setFavoriteUsers(updatedFavorites);
      }
    }
  }, [favorites]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadFavorites();
  }, [loadFavorites]);

  const handleFavoriteToggle = async (userId, currentIsFavorite) => {
    console.log(`Removing favorite ${userId} from favorites screen`);
    
    // Update global state
    await toggleFavorite(userId, currentIsFavorite);
    
    // Immediately update local state
    const updatedFavorites = favoriteUsers.filter(user => user.id !== userId);
    setFavoriteUsers(updatedFavorites);
  };

  const renderUserItem = ({ item }) => (
    <UserCard
      user={item}
      onToggleFavorite={() => handleFavoriteToggle(item.id, item.isFavorite)}
    />
  );

  const loading = loadingUsers || loadingFavorites;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mainTitle}>Mobile App Feature Specification
</Text>
        <Text style={styles.subTitle}>Preview of the UI layout</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.favoritesTitle}>Favorites</Text>
        <Text style={styles.favoritesCount}>
          {favoriteUsers.length} {favoriteUsers.length === 1 ? 'user' : 'users'} favorited
        </Text>
        
        <FlatList
          data={favoriteUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#232b50ff']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {loading ? 'Loading...' : 'No favorites yet.'}
              </Text>
              <Text style={styles.emptySubText}>
                Add some from the All Users tab!
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#232b50ff',
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  favoritesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  favoritesCount: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 5,
  },
  emptySubText: {
    color: '#999',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default FavoritesScreen;
