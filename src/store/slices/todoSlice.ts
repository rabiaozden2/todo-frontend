import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  id: string;
  title: string;
  status: string;
  category?: string;
  created_at?: string;
  due_date?: string | null;
}

interface TodoState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  tasks: [],
  loading: false,
  error: null,
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    fetchTasksRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTasksSuccess(state, action: PayloadAction<Task[]>) {
      state.loading = false;
      state.tasks = action.payload;
    },
    fetchTasksFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addTaskRequest(state, _action: PayloadAction<{ title: string; category?: string; due_date?: string | null }>) {
      state.loading = true;
    },
    addTaskSuccess(state, action: PayloadAction<Task>) {
      state.loading = false;
      state.tasks.unshift(action.payload);
    },
    updateTaskRequest(state, _action: PayloadAction<{ id: string; status?: string; title?: string; category?: string; due_date?: string | null }>) {
      state.loading = true;
    },
    updateTaskSuccess(state, action: PayloadAction<Task>) {
      state.loading = false;
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTaskRequest(state, _action: PayloadAction<string>) {
      state.loading = true;
    },
    deleteTaskSuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
  },
});

export const {
  fetchTasksRequest,
  fetchTasksSuccess,
  fetchTasksFailure,
  addTaskRequest,
  addTaskSuccess,
  updateTaskRequest,
  updateTaskSuccess,
  deleteTaskRequest,
  deleteTaskSuccess,
} = todoSlice.actions;

export default todoSlice.reducer;
