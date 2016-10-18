import { createStore, combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import Immutable from 'immutable';
import { Maybe } from 'monet';
import Actions from '../constants/actions';
import { createAction } from '../utils/ActionCreator';
import api from '../utils/api';

const initialState = Immutable.Map({
    user: Maybe.None(),
    newestImages: Immutable.List(),
    categories: Immutable.List()
});

/* eslint-disable no-use-before-define */

function reducer(state = initialState, action) {
    switch (action.type) {
    case Actions.REQUEST_USER_INFO:
        api.json('/api/user').then(user =>
            store.dispatch(createAction(Actions.USER_CHANGED, {user: user.logged ? user : null}))
        );
        return state;
    case Actions.USER_CHANGED:
        if(action.user) {
            return state.set('user', Maybe.Some(action.user));
        } else {
            return state.set('user', Maybe.None());
        }
    case Actions.REQUEST_NEWEST_IMAGES_LIST:
        api.json('/api/image/newest').then(newestImages => store.dispatch(createAction(Actions.NEWEST_IMAGES_LIST_LOADED, {newestImages})));
        return state;
    case Actions.NEWEST_IMAGES_LIST_LOADED:
        return state.set('newestImages', Immutable.List(action.newestImages));
    case Actions.REQUEST_CATEGORIES_LIST:
        api.json('/api/categories').then(categories => store.dispatch(createAction(Actions.CATEGORIES_LIST_LOADED, {categories})));
        return state;
    case Actions.CATEGORIES_LIST_LOADED:
        return state.set('categories', Immutable.List(action.categories));
    default:
        return state;
    }
}

/* eslint-enable no-use-before-define */

const reducers = combineReducers({
    main: reducer,
    routing: routerReducer
});

const store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;

store.subscribe(() =>
  console.log('store change', store.getState())
);
