import { combinedReducers } from 'redux';
import authReducer from './authReducers';

export default combinedReducers({
    auth: authReducer
});