import Actions from '../constants/actions';
import Immutable from 'immutable';
import { Maybe } from 'monet';

const initialState = Immutable.Map({
    user: Maybe.None(),
    registerError: Immutable.List(),
    users: Immutable.List()
});

/*
    TODO: UPDATE_GROUP_FAILURE, DELETE_USER_FAILURE
*/

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
    case Actions.REGISTER_FAILED:
        return state.set('registerError', action.message);
    case Actions.USER_LIST_LOADED:
        return state.set('users', action.users);
    default:
        return state;
    }
}
