import Actions from '../constants/actions';
import api from '../utils/api';
import { createAction } from '../utils/ActionCreator';
import Immutable from 'immutable';

const initialState = Immutable.Map({
    newestImages: Immutable.List(),
    categories: Immutable.List()
});

/* eslint-disable no-use-before-define */

export function reducer(state = initialState, action) {
    switch (action.type) {
    case Actions.REQUEST_NEWEST_IMAGES_LIST:
        api.json('/api/image/newest').then(images => store.dispatch(createAction(Actions.NEWEST_IMAGES_LIST_LOADED, {images})));
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
