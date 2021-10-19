import '../sass/style.css';
import '../sass/style.scss';

import {CreateNewPost} from './components';



class App {
  constructor() {
    this.CreateNewPost = new CreateNewPost();
  }


}



new App();