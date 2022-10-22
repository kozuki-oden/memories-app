import axios from 'axios';

//backed routes//API ENDPOINTS

const API = axios.create({ baseURL: 'http://localhost:5000' });


//function happens on each one of our request
API.interceptors.request.use((req) => {
  //we need this to send the token to backend
  //so that backend middleware can identify that we are 
  //actually logged in
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }

  return req;
});

export const fetchPosts = () => API.get('/posts');
export const createPost = (newPost) => API.post('/posts', newPost);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);

export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);
