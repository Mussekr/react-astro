import { takeLatest, takeEvery } from 'redux-saga';
import { call, put, fork } from 'redux-saga/effects';
import api from '../utils/api';
import Actions from '../constants/actions';
import __ from 'lodash';

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
        yield put({type: Actions.REGISTER_SUCCESS});
    } catch(err) {
        yield put({type: Actions.REGISTER_FAILED, message: err});
    }
}

function *addUserSaga() {
    yield* takeEvery(Actions.ADD_USER, addUser);
}

function *logOut() {
    yield call(() => api.post('/api/logout'));
    yield put({type: Actions.REQUEST_USER_INFO});
}

function *logOutSaga() {
    yield* takeEvery(Actions.LOGOUT, logOut);
}

export default function *root() {
    yield [
        fork(fetchUserInfoSaga),
        fork(addUserSaga),
        fork(logOutSaga)
    ];
}
