import { combineReducers } from 'redux';
import login from './login';
import userInfo from './userInfo';
import footerTabBar from './footerTabBar';

const rootReducer = combineReducers(
  {
    login,
    userInfo,
    footerTabBar
  }
);

export default rootReducer;
