import Immutable from 'immutable';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { routerReducer, routerMiddleware, push } from 'react-router-redux';
import Actions from '../constants/actions';
import { createAction } from '../utils/ActionCreator';
import api from '../utils/api';
import { browserHistory } from 'react-router';
import { reducer as UserReducer } from './Users';
import createSagaMiddleware from 'redux-saga';
import mySaga from './sagas';

const initialState = Immutable.Map({
    newestImages: Immutable.List(),
    categories: Immutable.List(),
    categoriesImages: Immutable.List(),
    gearList: Immutable.List(),
    userImages: Immutable.List(),
    imageLoadingIcon: false,
    telescope: Immutable.List(),
    mount: Immutable.List(),
    imagingCamera: Immutable.List(),
    guideCamera: Immutable.List(),
    filter: Immutable.List(),
    misc: Immutable.List()
});

/* eslint-disable no-use-before-define */

export function reducer(state = initialState, action) {
    switch (action.type) {
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
    case Actions.ADD_IMAGE:
        state.set('imageLoadingIcon', true);
        api.postImage(action.image, action.name)
        .then(id => store.dispatch(push('/upload/' + id.id)));
        return state;
    case Actions.REQUEST_CATEGORIES_IMAGES_LIST:
        api.json('/api/categories/images/' + action.id)
        .then(categoriesImages => store.dispatch(createAction(Actions.CATEGORIES_IMAGES_LIST_LOADED, {categoriesImages})));
        return state;
    case Actions.CATEGORIES_IMAGES_LIST_LOADED:
        return state.set('categoriesImages', Immutable.List(action.categoriesImages));
    case Actions.REQUEST_GEAR_LIST:
        api.json('/api/gear').then(gear => store.dispatch(createAction(Actions.GEAR_LIST, {gear})));
        return state;
    case Actions.GEAR_LIST:

        /*return state.set('gearList', Immutable.List(action.gear));*/
        action.gear.forEach(gear =>
            state.set(gear.gear_type, state.get(gear.gear_type).push(gear))
        );
        return state;
    case Actions.REQUEST_USER_IMAGES_LIST:
        api.json('/api/image/user/' + action.username)
        .then(images => store.dispatch(createAction(Actions.USER_IMAGES_LIST_LOADED, {images})));
        return state;
    case Actions.USER_IMAGES_LIST_LOADED:
        return state.set('userImages', Immutable.List(action.images));
    case Actions.NAVIGATE_TO_INDEX:
        store.dispatch(push('/' + action.message.username));
        return state;
    default:
        return state;
    }
}

/* eslint-enable no-use-before-define */

const reducers = combineReducers({
    main: reducer,
    routing: routerReducer,
    users: UserReducer
});
const middleware = routerMiddleware(browserHistory);
const sagaMiddleware = createSagaMiddleware();

/*eslint-disable no-underscore-dangle*/
const store = createStore(
    reducers,
    compose(applyMiddleware(middleware), applyMiddleware(sagaMiddleware), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
);

/*eslint-enable no-underscore-dangle*/

sagaMiddleware.run(mySaga);

export default store;

store.subscribe(() =>
  console.log('store change', store.getState())
);
