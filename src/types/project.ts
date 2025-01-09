export interface Project {
  id: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  created_by?: string;
}

export interface ProjectFormProps {
  onClose?: () => void;
  addProject: (project: Project) => void;
  editProject?: Project | null;
  updateProject?: (project: Project) => void;
  setEditProject: React.Dispatch<React.SetStateAction<Project | null>>;
}

export interface AddEditProject {
  name: string;
  projectId?: string;
  start_date: string;
  end_date: string;
  description: string;
  status: string;
  organizationId: number;
}
