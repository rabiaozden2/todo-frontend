import re

def fix_file(filepath, replacements):
    with open(filepath, 'r') as f:
        content = f.read()
    for old, new in replacements:
        content = content.replace(old, new)
    with open(filepath, 'w') as f:
        f.write(content)

# Fix page.tsx
fix_file('src/app/[locale]/page.tsx', [
    ("import { useRouter } from 'next/navigation';\n", ""),
    ("import { fetchTasksRequest, addTaskRequest, updateTaskRequest, deleteTaskRequest, Task } from '../store/slices/todoSlice';", "import { fetchTasksRequest, addTaskRequest, updateTaskRequest, deleteTaskRequest, Task } from '../../store/slices/todoSlice';"),
    ("import { logout } from '../store/slices/authSlice';", "import { logout } from '../../store/slices/authSlice';"),
    ("import { RootState } from '../store/store';", "import { RootState } from '../../store/store';")
])

# Fix login/page.tsx
fix_file('src/app/[locale]/login/page.tsx', [
    ("../../../../store/", "../../../store/")
])

# Fix register/page.tsx
fix_file('src/app/[locale]/register/page.tsx', [
    ("../../../../store/", "../../../store/")
])
