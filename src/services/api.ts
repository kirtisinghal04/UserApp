import axios from 'axios';

const BASE_URL = 'https://reqres.in/api';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface ApiResponse {
  data: User[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface AppUser {
  id: number;
  name: string;
  email: string;
  avatar: string;
  isFavorite: boolean;
}

export const fetchAllUsers = async (): Promise<AppUser[]> => {
  try {
    const users: User[] = [];
    let page = 1;
    let totalPages = 1;
    
    const firstPage = await axios.get<ApiResponse>(`${BASE_URL}/users?page=${page}`);
    users.push(...firstPage.data.data);
    totalPages = firstPage.data.total_pages;
    
    for (let p = 2; p <= totalPages; p++) {
      const response = await axios.get<ApiResponse>(`${BASE_URL}/users?page=${p}`);
      users.push(...response.data.data);
    }
    
    return users.map(user => ({
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      avatar: user.avatar,
      isFavorite: false
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    return getMockUsers();
  }
};

const getMockUsers = (): AppUser[] => {
  return [
    { id: 1, name: 'George Bluth', email: 'george.bluth@reqres.in', avatar: 'https://reqres.in/img/faces/1-image.jpg', isFavorite: false },
    { id: 2, name: 'Janet Weaver', email: 'janet.weaver@reqres.in', avatar: 'https://reqres.in/img/faces/2-image.jpg', isFavorite: false },
    { id: 3, name: 'Emma Wong', email: 'emma.wong@reqres.in', avatar: 'https://reqres.in/img/faces/3-image.jpg', isFavorite: false },
    { id: 4, name: 'Eve Holt', email: 'eve.holt@reqres.in', avatar: 'https://reqres.in/img/faces/4-image.jpg', isFavorite: false },
    { id: 5, name: 'Charles Morris', email: 'charles.morris@reqres.in', avatar: 'https://reqres.in/img/faces/5-image.jpg', isFavorite: false },
    { id: 6, name: 'Tracey Ramos', email: 'tracey.ramos@reqres.in', avatar: 'https://reqres.in/img/faces/6-image.jpg', isFavorite: false },
    { id: 7, name: 'Michael Lawson', email: 'michael.lawson@reqres.in', avatar: 'https://reqres.in/img/faces/7-image.jpg', isFavorite: false },
    { id: 8, name: 'Lindsay Ferguson', email: 'lindsay.ferguson@reqres.in', avatar: 'https://reqres.in/img/faces/8-image.jpg', isFavorite: false },
    { id: 9, name: 'Tobias Funke', email: 'tobias.funke@reqres.in', avatar: 'https://reqres.in/img/faces/9-image.jpg', isFavorite: false },
    { id: 10, name: 'Byron Fields', email: 'byron.fields@reqres.in', avatar: 'https://reqres.in/img/faces/10-image.jpg', isFavorite: false },
    { id: 11, name: 'George Edwards', email: 'george.edwards@reqres.in', avatar: 'https://reqres.in/img/faces/11-image.jpg', isFavorite: false },
    { id: 12, name: 'Rachel Howell', email: 'rachel.howell@reqres.in', avatar: 'https://reqres.in/img/faces/12-image.jpg', isFavorite: false },
  ];
};