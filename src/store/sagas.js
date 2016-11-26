import { takeLatest, takeEvery } from 'redux-saga';
import { call, put, fork } from 'redux-saga/effects';
import api from '../utils/api';
import Actions from '../constants/actions';
import __ from 'lodash';
import store from './store';

import { replace } from 'react-router-redux';

function *fetchUserInfo() {
    try {
        const user = yield call(() => api.json('/api/user'));
        yield put({type: Actions.USER_CHANGED, user: user.logged ? user : null});
    } catch(err) {
        yield put({type: Actions.USER_CHANGED_FAILED, message: err});
    }
}

function *fetchUserInfoSaga() {
    yield* takeLatest(Actions.REQUEST_USER_INFO, fetchUserInfo);
}

function *addUser(action) {
    try {
        const body = __.pick(action, ['username', 'password']);
        yield call(() => api.post('/api/register', body));
        yield put({type: Actions.NAVIGATE_LOCATION, location: '/'});
    } catch(err) {
        yield put({type: Actions.REGISTER_FAILED, message: err});
    }
}

function *addUserSaga() {
    yield* takeEvery(Actions.ADD_USER, addUser);
}

function *deleteUser(action) {
    try {
        yield call(() => api.del(`/api/users/${action.id}`));
        yield put({type: Actions.REQUEST_USER_LIST});
    } catch(e) {
        yield put({type: Actions.DELETE_USER_FAILURE, message: e});
    }
}

function *deleteUserSaga() {
    yield* takeEvery(Actions.DELETE_USER, deleteUser);
}

function *updateGroup(action) {
    try {
        const body = __.pick(action, ['id', 'group']);
        yield call(() => api.post('/api/users/promote', body));
        yield put({type: Actions.REQUEST_USER_LIST});
    } catch(e) {
        yield put({type: Actions.UPDATE_GROUP_FAILURE, message: e});
    }
}

function *updateGroupSaga() {
    yield* takeEvery(Actions.UPDATE_GROUP, updateGroup);
}

function *logOut() {
    yield call(() => api.post('/api/logout'));
    yield put({type: Actions.REQUEST_USER_INFO});
}

function *logOutSaga() {
    yield* takeEvery(Actions.LOGOUT, logOut);
}

function *fetchUserList() {
    try {
        const users = yield call(() => api.json('/api/users'));
        yield put({type: Actions.USER_LIST_LOADED, users: users});
    } catch(err) {
        yield put({type: Actions.USER_LIST_FAILED, message: err});
    }
}

function *fetchUserListSaga() {
    yield* takeLatest(Actions.REQUEST_USER_LIST, fetchUserList);
}

function *deleteCategory(action) {
    try {
        yield call(() => api.del(`/api/category/${action.id}`));
        yield put({type: Actions.REQUEST_CATEGORIES_LIST});
    } catch(e) {
        yield put({type: Actions.DELETE_CATEGORY_FAILURE});
    }
}

function *deleteCategorySaga() {
    yield* takeEvery(Actions.DELETE_CATEGORY, deleteCategory);
}

function *updateCategoryImage(action) {
    const body = __.pick(action, ['id', 'image']);
    yield call(() => api.post('/api/category/change/image', body));
}

function *updateCategoryImageSaga() {
    yield* takeEvery(Actions.UPDATE_CATEGORY_IMAGE, updateCategoryImage);
}

function *addCategory(action) {
    try {
        const body = __.pick(action, ['name', 'image']);
        yield call(() => api.post('/api/category', body));
        yield put({type: Actions.REQUEST_CATEGORIES_LIST});
    } catch(e) {
        yield put({type: Actions.ADD_CATEGORY_FAILED, error: e});
    }
}

function *addCategorySaga() {
    yield* takeEvery(Actions.ADD_CATEGORY, addCategory);
}

function *fetchGear() {
    try {
        const gear = yield call(() => api.json('/api/gear'));
        yield put({type: Actions.GEAR_LIST, gear: gear});
    } catch(e) {
        yield put({type: Actions.GEAR_LIST_FAILURE, error: e});
    }
}

function *fetcgGearSaga() {
    yield* takeEvery(Actions.REQUEST_GEAR_LIST, fetchGear);
}

function *deleteGear(action) {
    try {
        yield call(() => api.del(`/api/gear/${action.id}`));
        yield put({type: Actions.REQUEST_GEAR_LIST});
    } catch(e) {
        yield put({type: Actions.DELETE_GEAR_FAILED, error: e});
    }
}

function *deleteGearSaga() {
    yield* takeEvery(Actions.DELETE_GEAR, deleteGear);
}

function *addGear(action) {
    try {
        const body = __.pick(action, ['gearType', 'gearName']);
        yield call(() => api.post('/api/gear', body));
        yield put({type: Actions.REQUEST_GEAR_LIST});
    } catch(e) {
        yield put({type: Actions.ADD_GEAR_FAILED, error: e});
    }
}

function *addGearSaga() {
    yield* takeEvery(Actions.ADD_GEAR, addGear);
}

function *addGearToImage(action) {
    try {
        const body = __.pick(action, ['gearArray', 'id']);
        yield call(() => api.post('/api/upload/details', body));
        yield put({type: Actions.NAVIGATE_LOCATION, location: '/upload/filters/' + body.id});
    } catch(e) {
        yield put({type: Actions.IMAGE_GEAR_FAILED, error: e});
    }
}
function *addGearToImageSaga() {
    yield* takeEvery(Actions.ADD_IMAGE_GEAR, addGearToImage);
}

function *fetchImageGearList(action) {
    try {
        const gear = yield call(() => api.json(`/api/image/${action.id}/gear`));
        yield put({type: Actions.GEAR_LIST, gear: gear});
    } catch(e) {
        yield put({type: Actions.GEAR_LIST_FAILURE, error: e});
    }
}

function *fetchImageGearListSaga() {
    yield* takeEvery(Actions.REQUEST_IMAGE_GEAR, fetchImageGearList);
}

function *fetchImageDetails(action) {
    try {
        const details = yield call(() => api.json(`/api/image/${action.id}/details`));
        yield put({type: Actions.IMAGE_DETAILS_LIST, details: details});
    } catch(e) {
        yield put({type: Actions.IMAGE_DETAILS_FAILED, error: e});
    }
}

function *fetchImageDetailsSaga() {
    yield* takeEvery(Actions.REQUEST_IMAGE_DETAILS, fetchImageDetails);
}

function *addImageFilters(action) {
    try {
        const body = __.pick(action, ['filterArray', 'id']);
        yield call(() => api.post('/api/upload/filters', body));
        yield put({type: Actions.NAVIGATE_LOCATION, location: '/image/' + body.id});
    } catch(e) {
        yield put({type: Actions.ADD_GEAR_FAILED});
    }
}

function *addImageFiltersSaga() {
    yield* takeEvery(Actions.ADD_IMAGE_FILTERS, addImageFilters);
}

function *fetchImageFilters(action) {
    const data = yield call(() => api.json(`/api/image/${action.id}/filters`));
    yield put({type: Actions.IMAGE_FILTERS_LOADED, filters: data});
}

function *fetchImageFiltersSaga() {
    yield* takeEvery(Actions.REQUEST_IMAGE_FILTERS, fetchImageFilters);
}

function *navigateToLocation(action) {
    yield call(() => store.dispatch(replace(action.location)));
}

function *navigateToLocationSaga() {
    yield* takeEvery(Actions.NAVIGATE_LOCATION, navigateToLocation);
}

export default function *root() {
    yield [
        fork(fetchUserInfoSaga),
        fork(addUserSaga),
        fork(logOutSaga),
        fork(fetchUserListSaga),
        fork(deleteUserSaga),
        fork(updateGroupSaga),
        fork(deleteCategorySaga),
        fork(updateCategoryImageSaga),
        fork(addCategorySaga),
        fork(fetcgGearSaga),
        fork(deleteGearSaga),
        fork(addGearSaga),
        fork(addGearToImageSaga),
        fork(fetchImageGearListSaga),
        fork(fetchImageDetailsSaga),
        fork(addImageFiltersSaga),
        fork(fetchImageFiltersSaga),
        fork(navigateToLocationSaga)
    ];
}
