import { call, put, takeEvery, select } from 'redux-saga/effects';
import { 
  fetchTasksRequest, fetchTasksSuccess, fetchTasksFailure, 
  addTaskRequest, addTaskSuccess,
  updateTaskRequest, updateTaskSuccess,
  deleteTaskRequest, deleteTaskSuccess 
} from '../slices/todoSlice';
import { RootState } from '../store';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api';

const getToken = (state: RootState) => state.auth.token;

function* fetchTasksSaga(): any {
  try {
    const token = yield select(getToken);
    const response = yield call(fetch, `${API_URL}/tasks`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = yield response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch');
    yield put(fetchTasksSuccess(data || []));
  } catch (error: any) {
    yield put(fetchTasksFailure(error.message));
  }
}

function* addTaskSaga(action: ReturnType<typeof addTaskRequest>): any {
  try {
    const token = yield select(getToken);
    const body: any = { title: action.payload.title };
    if (action.payload.due_date) {
      body.due_date = action.payload.due_date;
    }
    if (action.payload.category) {
      body.category = action.payload.category;
    }
    const response = yield call(fetch, `${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body),
    });
    const data = yield response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to add');
    yield put(addTaskSuccess(data));
  } catch (error: any) {
    yield put(fetchTasksFailure(error.message));
  }
}

function* updateTaskSaga(action: ReturnType<typeof updateTaskRequest>): any {
  try {
    const token = yield select(getToken);
    const body: any = {};
    if (action.payload.status !== undefined) body.status = action.payload.status;
    if (action.payload.title !== undefined) body.title = action.payload.title;
    if (action.payload.category !== undefined) body.category = action.payload.category;
    if (action.payload.due_date !== undefined) body.due_date = action.payload.due_date;
    
    const response = yield call(fetch, `${API_URL}/tasks/${action.payload.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body),
    });
    const data = yield response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to update');
    yield put(updateTaskSuccess(data));
  } catch (error: any) {
    yield put(fetchTasksFailure(error.message));
  }
}

function* deleteTaskSaga(action: ReturnType<typeof deleteTaskRequest>): any {
  try {
    const token = yield select(getToken);
    const response = yield call(fetch, `${API_URL}/tasks/${action.payload}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      const data = yield response.json();
      throw new Error(data.error || 'Failed to delete');
    }
    yield put(deleteTaskSuccess(action.payload));
  } catch (error: any) {
    yield put(fetchTasksFailure(error.message));
  }
}

export function* watchTodoSagas() {
  yield takeEvery(fetchTasksRequest.type, fetchTasksSaga);
  yield takeEvery(addTaskRequest.type, addTaskSaga);
  yield takeEvery(updateTaskRequest.type, updateTaskSaga);
  yield takeEvery(deleteTaskRequest.type, deleteTaskSaga);
}
