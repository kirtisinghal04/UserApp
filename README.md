create its updated readme
📱 User Favorites App
A beautiful React Native mobile application for managing and favoriting users from an external API. Features a modern UI with background images, real-time search, and favorite management across multiple tabs.

✨ Features
🌐 API Integration
Base URL: https://reqres.in/api/users

Pagination: Automatically fetches all pages (2 pages total)

Mock Data: Falls back to mock users if API fails

🎨 UI Design
Background Images: Beautiful gradient backgrounds from Unsplash API

Prominent Name Display: User names are prominently featured on each card

Glass-morphism Design: Modern semi-transparent UI elements

Responsive Layout: Works on all screen sizes

🧭 Navigation
Two Tabs:

All Users: Complete user list with search functionality

Favorites: Filtered view of favorited users

Custom Tab Bar: Stylish tab navigation with active state indicators

🔍 Search Functionality
Real-time Search: Filters users by name as you type

Clear Search: Easy clear button to reset search

No Index Display: Clean list without numbers

❤️ Favorite Management
Star Button: Tap star icon to add/remove favorites

Real-time Sync: Changes reflect immediately across both tabs

Persistent Storage: Favorites saved locally using AsyncStorage

Global State: Shared favorite state using React Context

📸 Screenshots
Home Screen:

Purple gradient header

Search bar

User cards with avatar, name, email, and star button

Real-time filtering

Favorites Screen:

Same beautiful background

Favorites counter

Only favorited users

Remove favorites directly

🏗️ Project Structure
UserFavoritesApp/
├── App.js                          # Main app component with navigation
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── index.js                        # App entry point
├── src/
│   ├── components/
│   │   ├── TabBar.js              # Custom tab navigation
│   │   ├── UserCard.js            # User card with favorite button
│   │   └── SearchBar.js           # Search input component
│   ├── screens/
│   │   ├── HomeScreen.js          # All users screen
│   │   └── FavoritesScreen.js     # Favorites screen
│   ├── services/
│   │   └── api.ts                 # API service with user fetching
│   ├── utils/
│   │   └── storage.ts             # AsyncStorage for favorites
│   └── context/
│       └── FavoritesContext.js     # Global state management
🚀 Installation
Prerequisites
Node.js (v14 or newer)

npm or yarn

Expo CLI (optional)

Steps
1.Clone or extract the project
# If you have the ZIP file
unzip UserFavoritesApp.zip
cd UserFavoritesApp
2.Install dependencies
npm install
# or
yarn install
3.Install Expo Go on your phone (for mobile testing)
iOS: App Store
Android: Play Store
4.Run the app
npx expo start
5.Choose your preview method:
Mobile: Scan QR code with Expo Go app
Web: Press w in terminal or open http://localhost:8081
Android Emulator: Press a in terminal
iOS Simulator: Press i in terminal (macOS only)

Switching Tabs
->Tap All Users to see all users
->Tap Favorites to see only favorited users
->Blue underline indicates active tab

🔧 Technical Details
Dependencies
json
{
  "expo": "~50.0.0",
  "react": "18.2.0",
  "react-native": "0.73.0",
  "@react-navigation/native": "^6.1.0",
  "@react-navigation/bottom-tabs": "^6.5.0",
  "react-native-vector-icons": "^10.0.0",
  "axios": "^1.6.0",
  "@react-native-async-storage/async-storage": "1.21.0"
}

🔄 State Flow

graph LR
    A[User Action] --> B[Toggle Favorite]
    B --> C[Update Storage]
    C --> D[Update Context]
    D --> E[Update HomeScreen]
    D --> F[Update FavoritesScreen]
    E --> G[UI Refresh]
    F --> G





