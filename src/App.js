import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import TabBar from './src/components/TabBar';
import FavoritesScreen from './src/screens/FavoritesScreen';
import HomeScreen from './src/screens/HomeScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator tabBar={props => <TabBar {...props} />}>
        <Tab.Screen 
          name="AllUsers" 
          component={HomeScreen} 
          options={{ title: 'All Users' }}
        />
        <Tab.Screen 
          name="Favorites" 
          component={FavoritesScreen} 
          options={{ title: 'Favorites' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}