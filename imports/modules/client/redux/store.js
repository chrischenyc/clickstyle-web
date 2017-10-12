import { createStore, combineReducers } from 'redux';
import userReducer from './user';

const reducer = combineReducers({
  user: userReducer,
});

/* eslint-disable no-underscore-dangle */
export default createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
/* eslint-enable */
