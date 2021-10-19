export const getPosts = (limit, page) => {
  return fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`);
} 


export const getPost = (id) => {
  return fetch(`https://jsonplaceholder.typicode.com/comments?postId=${id}`);
}