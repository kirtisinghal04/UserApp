
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getFavorites, toggleFavorite as toggleFavoriteStorage } from '../utils/storage';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favoriteIds = await getFavorites();
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (userId, isCurrentlyFavorite) => {
    try {
      // Update storage
      await toggleFavoriteStorage(userId, isCurrentlyFavorite);
      
      // Update global state
      if (isCurrentlyFavorite) {
        setFavorites(prev => prev.filter(id => id !== userId));
      } else {
        setFavorites(prev => [...prev, userId]);
      }
      
      return !isCurrentlyFavorite;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return isCurrentlyFavorite;
    }
  };

  const isFavorite = (userId) => {
    return favorites.includes(userId);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <FavoritesContext.Provider value={{
      favorites,
      loading,
      loadFavorites,
      toggleFavorite,
      isFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};
