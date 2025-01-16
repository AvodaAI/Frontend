export interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority?: string;
  taskStatus?: string;
  time_tracked?: number;
  assigned_user_email?: string;
  assigned_user_id?: number;
  organizationId?: number;
  assigned_user_name?: string;
  assigned_to?: number;
}

export interface Users {
  email: string;
  id: number;
}

export interface EditTask {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority?: string;
  status?: string;
  time_tracked?: number;
  assigned_to?: number;
}

export interface TaskFormProps {
  onClose?: () => void;
  addTask: (task: Task) => void;
  editTask?: Task | null;
  updateTask?: (task: Task) => void;
  setEditTask: React.Dispatch<React.SetStateAction<Task | null>>;
  users: {
    email: string;
    id: number;
  }[];
}

export interface AddEditTaskPayload {
  taskId?: string;
  title: string;
  description?: string;
  due_date?: string;
  priority?: string;
  status?: string;
  time_tracked?: string;
  organizationId: number;
  assigned_to?: number;
}
