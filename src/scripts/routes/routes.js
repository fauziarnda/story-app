import AboutPage from '../pages/about/about-page.js';
import AddStoryPage from '../pages/addStory/add-story-page.js';
import BookmarkPage from '../pages/bookmark/bookmark.js';
import HomePage from '../pages/home/home-page.js';
import LandingPage from '../pages/landing/landing-page.js';
import LoginPage from '../pages/login/login-page.js';
import LogoutPage from '../pages/logout/logout.js';
import RegisterPage from '../pages/register/register-page.js';

const routes = {
  '/': () => new LandingPage(),
  '/home': () => new HomePage(),
  '/about': () => new AboutPage(),
  '/login': () => new LoginPage(),
  '/register': () => new RegisterPage(),
  '/logout': () => new LogoutPage(),
  '/addStory': () => new AddStoryPage(),
  '/bookmarks': () => new BookmarkPage(),
};

export default routes;
