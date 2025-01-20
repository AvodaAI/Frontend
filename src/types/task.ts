export interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority?: string;
  taskStatus?: string;
  status?: string;
  time_tracked?: number;
  assigned_user_email?: string;
  assigned_user_id?: number;
  organization_id?: number;
  assigned_user_name?: string;
  assigned_to?: number;
  project_id?: string;
  project_name?: string;
}

export interface Users {
  first_name: string;
  last_name: string;
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
  tasks: {
    title: string;
    description?: string;
    due_date?: string;
    priority?: string;
    status?: string;
    time_tracked?: string;
    assigned_to?: number;
    project_name?: string;
    project_id?: string;
  }[];
  organization_id: number;
}
