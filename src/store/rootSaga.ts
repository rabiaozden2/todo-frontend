import { all } from 'redux-saga/effects';
import { watchTodoSagas } from './sagas/todoSaga';
import { watchAuthSagas } from './sagas/authSaga';

export default function* rootSaga() {
  yield all([
    watchTodoSagas(),
    watchAuthSagas(),
  ]);
}
