import Actions from '../constants/actions';
import Immutable from 'immutable';
import { Maybe } from 'monet';
import { push } from 'react-router-redux';

const initialState = Immutable.Map({
    user: Maybe.None(),
    registerError: Immutable.List()
});


export function reducer(state = initialState, action) {
    switch (action.type) {
    case Actions.USER_CHANGED:
        if(action.user) {
            return state.set('user', Maybe.Some(action.user));
        } else {
            return state.set('user', Maybe.None());
        }
    case Actions.USER_CHANGED_FAILED:
        return state;
    case Actions.REGISTER_SUCCESS:
        push('/');
        return state;
    case Actions.REGISTER_FAILED:
        return state.set('registerError', action.message);
    default:
        return state;
    }
}
