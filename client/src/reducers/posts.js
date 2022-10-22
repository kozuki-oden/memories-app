import { FETCH_ALL, CREATE, UPDATE, DELETE, LIKE } from '../constants/actionTypes';
//post is the state, initially is empty array
export default (posts = [], action) => {
  switch (action.type) {
    case FETCH_ALL:
      return action.payload; //returns actual posts
    case LIKE:
      return posts.map((post) => (post._id === action.payload._id ? action.payload : post));
    case CREATE:
      return [...posts, action.payload]; //new post stored in payload
    case UPDATE:
      return posts.map((post) => (post._id === action.payload._id ? action.payload : post));
    case DELETE:
      //returns only those posts where id is not equal to action.payload
      return posts.filter((post) => post._id !== action.payload);
    default:
      return posts;
  }
};

