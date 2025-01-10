export interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority?: string;
  status?: string;
  assign_to?: string;
  time_tracked?: number;
}

export interface TaskFormProps {
  onClose?: () => void;
  addTask: (task: Task) => void;
  editTask?: Task | null;
  updateTask?: (task: Task) => void;
  setEditTask: React.Dispatch<React.SetStateAction<Task | null>>;
}

export interface AddEditTask {
  taskId?: string;
  title: string;
  description?: string;
  due_date?: string;
  priority?: string;
  status?: string;
  assign_to?: string;
  time_tracked?: string;
  organizationId: number;
}
