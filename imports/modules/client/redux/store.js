import { createStore, combineReducers, compose } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import user from './user';
import ui from './ui';
import cart from './cart';

const reducer = combineReducers({
  user,
  cart,
  ui,
  loadingBar,
});

const persistedState = localStorage.getItem('stylesquad.cart')
  ? { cart: JSON.parse(localStorage.getItem('stylesquad.cart')) }
  : {};

/* eslint-disable no-underscore-dangle */
const store = createStore(
  reducer,
  persistedState,
  compose(window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()),
);
/* eslint-enable */

store.subscribe(() => {
  localStorage.setItem('stylesquad.cart', JSON.stringify(store.getState().cart));
});

export default store;
