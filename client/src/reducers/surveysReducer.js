import { FETCH_SURVEYS } from '../actions/types';
import { stat } from 'fs';

export default function(state = [], action) {
    switch(action.type) {
        case FETCH_SURVEYS:
            return action.payload;
        default:
            return state;
    }
}