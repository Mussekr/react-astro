import { takeLatest, takeEvery } from 'redux-saga';
import { call, put, fork } from 'redux-saga/effects';
import api from '../utils/api';
import Actions from '../constants/actions';
import __ from 'lodash';

/*import { push } from 'react-router-redux';*/

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
        const post = yield call(() => api.post('/api/register', body));
        yield put({type: Actions.NAVIGATE_TO_INDEX, message: post});
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
        yield call(() => api.delete(`/api/category/${action.id}`));
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
        fork(addCategorySaga)
    ];
}
