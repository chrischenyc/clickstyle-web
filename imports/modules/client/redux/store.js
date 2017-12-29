import { createStore, combineReducers } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import user from './user';
import profile from './profile';
import modal from './modal';
import ui from './ui';
import cart from './cart';

const reducer = combineReducers({
  user,
  profile,
  cart,
  modal,
  ui,
  loadingBar,
});

/* eslint-disable no-underscore-dangle */
export default createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
/* eslint-enable */
