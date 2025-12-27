
import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  ImageBackground,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import SearchBar from '../components/SearchBar';
import UserCard from '../components/UserCard';
import { useFavorites } from '../context/FavoritesContext';
import { fetchAllUsers } from '../services/api';

const HomeScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const { favorites, toggleFavorite, isFavorite, loading: loadingFavorites } = useFavorites();

  // Background image from Unsplash API
  const backgroundImage = { 
    uri: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&auto=format&fit=crop' 
  };

  const loadUsers = useCallback(async () => {
    console.log('Loading users...');
    setLoadingUsers(true);
    try {
      const usersData = await fetchAllUsers();
      
      // Mark favorites using global context
      const usersWithFavorites = usersData.map(user => ({
        ...user,
        isFavorite: isFavorite(user.id)
      }));
      
      console.log('Users loaded with favorite status');
      
      setUsers(usersWithFavorites);
      setFilteredUsers(
        searchQuery.trim() === '' 
          ? usersWithFavorites 
          : usersWithFavorites.filter(user =>
              user.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
      );
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoadingUsers(false);
      setRefreshing(false);
    }
  }, [searchQuery, isFavorite]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Update users when favorites change
  useEffect(() => {
    if (users.length > 0) {
      const updatedUsers = users.map(user => ({
        ...user,
        isFavorite: isFavorite(user.id)
      }));
      
      setUsers(updatedUsers);
      setFilteredUsers(
        searchQuery.trim() === '' 
          ? updatedUsers 
          : updatedUsers.filter(user =>
              user.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
      );
    }
  }, [favorites]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadUsers();
  }, [loadUsers]);

  const handleFavoriteToggle = async (userId, currentIsFavorite) => {
    console.log(`Toggling favorite for user ${userId}`);
    
    // Update global state
    const newFavoriteStatus = await toggleFavorite(userId, currentIsFavorite);
    
    // Update local state immediately
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, isFavorite: newFavoriteStatus };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    
    // Update filtered users
    if (searchQuery.trim() === '') {
      setFilteredUsers(updatedUsers);
    } else {
      const filtered = updatedUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const renderUserItem = ({ item }) => (
    <UserCard
      user={item}
      onToggleFavorite={() => handleFavoriteToggle(item.id, item.isFavorite)}
    />
  );

  const loading = loadingUsers || loadingFavorites;

  return (
    <ImageBackground 
      source={backgroundImage} 
      style={styles.background}
      blurRadius={2}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.mainTitle}>User Favorites App</Text>
            <Text style={styles.subTitle}>Preview of the UI layout</Text>
          </View>
          
          <View style={styles.content}>
            <SearchBar 
              value={searchQuery}
              onChangeText={handleSearch}
              placeholder="Search by name..."
            />
            
            <FlatList
              data={filteredUsers}
              renderItem={renderUserItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#232b50ff']}
                  tintColor="#232b50ff"
                />
              }
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  {loading ? 'Loading users...' : 'No users found'}
                </Text>
              }
            />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  header: {
    backgroundColor: 'rgba(34, 46, 97, 0.9)',
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 50,
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default HomeScreen;
