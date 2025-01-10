// src/app/org/[id]/(auth)/projects/components/ProjectForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { useParams } from "next/navigation";
import { addProjectService, updateProjectService } from "@/utils/services/projectServices";
import { Project, ProjectFormProps } from "@/types/project";

export function ProjectForm({ onClose, addProject, editProject, updateProject, setEditProject }: ProjectFormProps) {
  const { id: org_id } = useParams();
  const [project, setProject] = useState<Project>({
    id: "",
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (editProject) {
      setProject(editProject);
    }
  }, [editProject]);

  const validateFields = () => {
    const errors: { [key: string]: string } = {};

    if (!project.name?.trim()) errors.name = "Project name is required";
    if (!project.start_date) errors.start_date = "Start date is required";
    if (project.end_date && project.start_date && new Date(project.end_date) < new Date(project.start_date)) {
      errors.end_date = "End date must be after start date";
    }
    if (!project.status) {
      errors.status = "Status is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setFieldErrors({});

    if (!validateFields()) return;
    try {
      if (editProject && updateProject) {
        const res = await updateProjectService({
          name: project.name,
          description: project.description ?? "",
          end_date: project.end_date ?? "",
          organizationId: Number(org_id),
          projectId: project.id,
          start_date: project.start_date ?? "",
          status: project.status ?? "",
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || data.message || "Failed to add Project");
        }

        updateProject(project);
        setEditProject(null);
      } else {
        const res = await addProjectService({
          name: project.name,
          description: project.description ?? "",
          end_date: project.end_date ?? "",
          organizationId: Number(org_id),
          start_date: project.start_date ?? "",
          status: project.status ?? "",
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || data.message || "Failed to add Project");
        }

        const { project: newProject } = await res.json();
        addProject(newProject);
      }

      setSuccess(true);
      setProject({
        id: "",
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        status: "",
      });
      setSuccess(true);
      if (onClose) {
        setTimeout(onClose, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            value={project.name}
            onChange={(e) => setProject({ ...project, name: e.target.value })}
            className={fieldErrors.name ? "border-red-500" : ""}
          />
          {fieldErrors.name && <p className="text-sm text-red-500 mt-1">{fieldErrors.name}</p>}
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            value={project.description || ""}
            onChange={(e) => setProject({ ...project, description: e.target.value })}
            className={fieldErrors.description ? "border-red-500" : ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            type="date"
            value={project.start_date ? project.start_date.split("T")[0] : ""}
            onChange={(e) => setProject({ ...project, start_date: e.target.value })}
            className={fieldErrors.start_date ? "border-red-500" : ""}
          />
          {fieldErrors.start_date && <p className="text-sm text-red-500 mt-1">{fieldErrors.start_date}</p>}
        </div>
        <div>
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            type="date"
            value={project.end_date ? project.end_date.split("T")[0] : ""}
            onChange={(e) => setProject({ ...project, end_date: e.target.value })}
            min={project.start_date ? new Date(project.start_date).toISOString().split("T")[0] : undefined}
            className={fieldErrors.end_date ? "border-red-500" : ""}
          />
          {fieldErrors.end_date && <p className="text-sm text-red-500 mt-1">{fieldErrors.end_date}</p>}
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={project.status || ""}
          onChange={(e) => setProject({ ...project, status: e.target.value })}
          className={fieldErrors.status ? "border-red-500" : ""}
        >
          <option value="" disabled>
            Select status
          </option>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
        </select>
        {fieldErrors.status && <p className="text-sm text-red-500 mt-1">{fieldErrors.status}</p>}
      </div>

      <Button type="submit" disabled={!project.name || !project.start_date || !project.status}>
        {editProject ? "Update Project" : "Add Project"}
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="success">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{editProject ? "Project updated successfully!" : "Project added successfully!"}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
