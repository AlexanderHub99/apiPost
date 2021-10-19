import { getPosts, getPost } from "./service";

export class CreateNewPost {
  constructor() {
    this.createForm = document.querySelector('.create-form');
    this.btnDispatch = this.createForm.querySelector('.dispatch');
    this.postsContainer = document.querySelector('.posts-container');
    this.inputTitle = this.createForm.querySelector('.item-title');
    this.inputPost = this.createForm.querySelector('.item-post');
    this.pages = document.querySelector('.pages');
    this.search = document.querySelector('.search');
    this.popUp = document.querySelector('.pop-up');
    this.limitPosts = 10;
    this.currentPage = 1;
    this.totalCount = null;
    this.title = null;
    this.post = null;
    this.handler = (e) => {
      e.preventDefault();
      this.handlerRemovePost(e);
    }
    this.handlerNewPost = (e) => {
      e.preventDefault();
      this.handlerBtn();
    }
    this.handlerChangeTitle = (e) => {
      this.hendlerTitle(e);
    }
    this.handlerChangePost = (e) => {
      this.hendlerPost(e);
    }
    this.headerSearch = (e) => {
      this.handlerPostSearch(e);
    }

    this.hendlerGetPost = (e) => {
      this.hendlerPopUpPost(e);
    }
    this.hendlerPopUpBin = () => {
      this.hendlerPopUp();
    } 

    this.init();
  }

  init() {
    this.addEventClick();
    this.addEventChengeTitle();
    this.addEventChengePost();
    this.addEventSearch();
    this.addEventPopUp();
    this.initPosts();
  }

  handlerBtn() {
    if (this.title && this.post) {
      this.postsContainer.appendChild(this.createPost(new Date, this.title, this.post));
      this.inputTitle.value = '';
      this.inputPost.value = '';
    }
  }

  hendlerTitle(e) {
    const target = e.target;
    this.title = target.value;
  }
  hendlerPost(e) {
    const target = e.target;
    this.post = target.value;
    console.log(this.post)
  }

  handlerRemovePost(e) {
    const target = e.target;
    target.closest('.post').remove()
    this.eventRemovePost(target);
  }

  handlerPostSearch(e) {
    const target = e.target;
    const postFilter = this.posts.filter(post => String(post.id).includes(target.value));
    if (!postFilter.length) return;
      this.postsContainer.innerHTML = '';
      postFilter.forEach(({ id, title, body }) => this.postsContainer.appendChild(this.createPost(id, title, body)));
  }

  async hendlerPopUpPost(e) {
    const target = e.target;
    target.dataset.idPost;
    this.popUp.innerHTML = '';
    const headerPopUp = document.createElement('div')
    const bodyPopUp = document.createElement('div')
    headerPopUp.classList.add('header');
    bodyPopUp.classList.add('pop-up__body');
    const response = await getPost(target.dataset.idPost);
    const coments =  await response.json();
    const {id, title, body} =  this.posts.filter(({id}) => String(id).includes(target.dataset.idPost))[0];
    headerPopUp.appendChild(this.createPost(id, title, body));
    this.popUp.appendChild(headerPopUp);
    coments.forEach(comment => bodyPopUp.appendChild(this.createComments(comment)));
    this.popUp.appendChild(bodyPopUp);
    this.popUp.classList.add('pop-up--active');

  }

  hendlerPopUp () {
    this.popUp.addEventListener('click', this.popUp.classList.remove('pop-up--active'));
  }

  addEventClick() {
    this.btnDispatch.addEventListener('click', this.handlerNewPost, false);
  }

  addEventChengeTitle() {
    this.inputTitle.addEventListener('change', this.handlerChangeTitle, false);
  }

  addEventChengePost() {
    this.inputPost.addEventListener('change', this.handlerChangePost, false);
  }

  addEventPost(btn) {
    btn.addEventListener('click', this.handler, false);
  }

  eventRemovePost(btn) {
    btn.removeEventListener('click', this.handler, false);
  }

  eventGetPost(btn){
    btn.addEventListener('click', this.hendlerGetPost, false);
  }

  addEventSearch() {
    this.search.addEventListener('input', this.headerSearch, false);
  }

  addEventPopUp() {
    this.popUp.addEventListener('click', this.hendlerPopUpBin, false)
  }

  

  async initPosts() {
    const { posts, totalCount } = await this.requestPost(this.limitPosts, this.currentPage);
    this.postsContainer.innerHTML = '';
    if (!this.totalCount) this.pagination(totalCount);
    posts.forEach(({ id, title, body }) => this.postsContainer.appendChild(this.createPost(id, title, body)));
  }

  async requestPost(limit, page) {
    try {
      const response = await getPosts(limit, page);
      const posts = await response.json();
      const totalCount = response.headers.get("x-total-count");
      this.posts = posts;
      return { posts, totalCount };
    } catch (error) {
      console.error(error);
    }
  }

  pagination(totalCount) {
    const numberOfPages = Math.ceil(totalCount / this.limitPosts);
    this.totalCount = totalCount;


    for (let i = 1; i < numberOfPages; i++) {
      const btn = document.createElement('button');
      btn.classList.add('pages__number');
      btn.addEventListener('click', () => {
        this.currentPage = btn.innerText;
        this.initPosts();
      })
      btn.innerText = i;
      this.pages.appendChild(btn);
    }
  }

  createComments({email, id, name, body}){
    const container = document.createElement('div');
    const titleCom = document.createElement('h4');
    const bodyCom = document.createElement('p');
    const mailCom = document.createElement('p');
    titleCom.innerText = name;
    bodyCom.innerText = body;
    mailCom.innerText = email;
    container.classList.add('comment');

    container.appendChild(titleCom);
    container.appendChild(bodyCom);
    container.appendChild(mailCom);
    return container;
  }

  createPost(id, title, body) {
    const container = document.createElement('div');
    const titlePost = document.createElement('h4');
    const bodyPost = document.createElement('p');
    const btnRemovePost = document.createElement('button');
    const btnGetPost = document.createElement('button');
    container.classList.add('post');
    titlePost.classList.add('post__title');
    btnGetPost.dataset.idPost = id;
    titlePost.innerText = `${id}. ${title}`;
    bodyPost.innerText = body;
    bodyPost.classList.add('post__body');
    btnRemovePost.classList.add('post__btn');
    btnGetPost.classList.add('post__btn');
    btnRemovePost.innerText = 'удалить пост';
    btnGetPost.innerText = 'Перейти к посту';
    this.addEventPost(btnRemovePost);
    this.eventGetPost(btnGetPost);

    container.appendChild(titlePost);
    container.appendChild(bodyPost);
    container.appendChild(btnRemovePost);
    container.appendChild(btnGetPost);
    return container
  }
}