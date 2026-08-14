import { call, put, takeEvery } from 'redux-saga/effects';
import { 
  loginRequest, 
  loginSuccess, 
  loginFailure, 
  registerRequest, 
  registerSuccess, 
  registerFailure 
} from '../slices/authSlice';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

function* handleLogin(action: ReturnType<typeof loginRequest>): any {
  try {
    const response = yield call(fetch, `${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action.payload),
    });

    const data = yield response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    yield put(loginSuccess({ user: data.user, token: data.token }));
    window.location.href = '/';
  } catch (error: any) {
    yield put(loginFailure(error.message));
  }
}

function* handleRegister(action: ReturnType<typeof registerRequest>): any {
  try {
    const response = yield call(fetch, `${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action.payload),
    });

    const data = yield response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    yield put(registerSuccess());
    window.location.href = '/login';
  } catch (error: any) {
    yield put(registerFailure(error.message));
  }
}

export function* watchAuthSagas() {
  yield takeEvery(loginRequest.type, handleLogin);
  yield takeEvery(registerRequest.type, handleRegister);
}
