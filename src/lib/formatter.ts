import { NewUser } from "@/types";
import { Project } from "@/types/project";
import { Task } from "@/types/task";
import { TimeLog } from "@/types/timeLog";
import { dataFallback } from "@/utils/datafallback";
import { formatDate } from "@/utils/timeFormatHandler";
import { formatUnixDate } from "@/utils/unixdate";
import moment from "moment";

export const formatUsers = (users: NewUser[]) =>
  users.map((user: any) => ({
    id: user.user_id,
    first_name: dataFallback(user.user_first_name) || "N/A",
    last_name: dataFallback(user.user_last_name) || "N/A",
    email: user.user_email,
    role: "employee",
    hire_date: "2024-12-16T10:06:26.129Z",
    status: "active",
    is_invite: true,
    created_at: dataFallback(formatUnixDate(new Date(user.user_created_at).getTime())) || "N/A",
    last_login: dataFallback(user.user_last_login ? formatUnixDate(new Date(user.user_last_login).getTime()) : "Never"),
    organization_id: user.organization_id,
    organization_name: user.organization_name,
  }));

export const formatProjects = (projects: Project[], id: number) =>
  projects.map((project: Project) => ({
    id: project.id,
    name: dataFallback(project.name) || "N/A",
    description: dataFallback(project.description) || "N/A",
    start_date: formatDate(dataFallback(project.start_date ?? "")).formattedDate,
    end_date: formatDate(dataFallback(project.end_date ?? "")).formattedDate,
    created_by: dataFallback(project.created_by) || "N/A",
    projectStatus: project.status,
    organizationId: id,
  }));

export const formatTasks = (tasks: Task[], id: number) =>
  tasks.map((task: Task) => ({
    id: task.id,
    title: dataFallback(task.title) || "N/A",
    assigned_user_name: task.assigned_user_name || "Beharudin Musa",
    assigned_to: task.assigned_to || -1,
    description: dataFallback(task.description) || "N/A",
    due_date: formatDate(dataFallback(task.due_date ?? "")).formattedDate,
    priority: dataFallback(task.priority) || "N/A",
    time_tracked: task.time_tracked || 0,
    taskStatus: task.status,
    organization_id: id,
    project_id: task.project_id || "",
    project_name: task.project_name || "N/A",
  }));

export const formatTimeLogs = (timeLogs: TimeLog[], id: number) =>
  timeLogs.map((project: TimeLog) => ({
    id: project.id,
    name: dataFallback(project.name) || "Beharudin Musa",
    pauses: project.pauses,
    total_active_time: project.total_active_time || 0,
    start_time: project.start_time,
    end_time: project.end_time,
    TimeLogStatus: project.TimeLogStatus,
    organizationId: id,
    created_at: moment(project.created_at).format("MMMM do, yyyy"),
  }));
