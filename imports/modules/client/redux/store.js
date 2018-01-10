import { createStore, combineReducers, compose } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import user from './user';
import profile from './profile';
import ui from './ui';
import cart from './cart';

const reducer = combineReducers({
  user,
  profile,
  cart,
  ui,
  loadingBar,
});

/* eslint-disable no-underscore-dangle */
export default createStore(
  reducer,
  compose(window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()),
);
/* eslint-enable */
