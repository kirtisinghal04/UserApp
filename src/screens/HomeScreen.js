
import { useEffect, useState, useCallback } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    RefreshControl
} from 'react-native';
import SearchBar from '../components/SearchBar';
import UserCard from '../components/UserCard';
import { fetchAllUsers } from '../services/api';
import { useFavorites } from '../context/FavoritesContext';

const HomeScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const { favorites, toggleFavorite, isFavorite, loading: loadingFavorites } = useFavorites();

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
    <SafeAreaView style={styles.container}>
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
              colors={['#667eea']}
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {loading ? 'Loading users...' : 'No users found'}
            </Text>
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
    backgroundColor: '#667eea',
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
  listContainer: {
    paddingBottom: 20,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 50,
    fontStyle: 'italic',
  },
});

export default HomeScreen;
