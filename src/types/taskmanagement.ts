//src/types/taskmanagement.ts
import {z} from 'zod' 

export const TaskSchema = z.object({
        id: z.number(),
        title: z.string(),
        description: z.string(),
        status: z.string(),
        priority: z.string(),
        dueDate: z.string(),
        assignee: z.string(),
    })


export const ProjectSchema = z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        tasks: z.array(TaskSchema),
    })

export interface Task {
        id: number;
        title: string;
        description: string;
        status: string;
        priority: string;
        dueDate: string;
        assignee: string;
    }


export interface Project {
        id: number;
        name: string;
        description: string;
        tasks: Task[];
    }