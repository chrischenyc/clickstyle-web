import { createStore, combineReducers } from 'redux';
import user from './user';
import profile from './profile';
import modal from './modal';
import ui from './ui';

const reducer = combineReducers({
  user,
  profile,
  modal,
  ui,
});

/* eslint-disable no-underscore-dangle */
export default createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
/* eslint-enable */
