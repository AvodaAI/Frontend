// src/app/org/[id]/(auth)/projects/page.tsx
"use client";
import { AddProjectModal } from "@/app/components/modals/AddProjectModal";
import { EditProjectModal } from "@/app/components/modals/EditProjectModal";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Project } from "@/types/project";
import { getProjects } from "@/utils/services/projectServices";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Projects from "./components/Projects";


export default function ProjectsPage() {
  const { id: org_id } = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await getProjects(Number(org_id))
      const data = await res.json();
      if (res.ok) {
        setProjects(data?.data);
      } else {
        setError(data.error || "Error fetching organizations");
        throw new Error(data.error || "Error fetching organizations");
      }
    };
    fetchProjects();
  }, []);

  const handleAddProject = () => {
    setEditProject(null);
    setIsDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditProject(project);
    setIsDialogOpen(true);
  };

  const addProject = (project: Project) => {
    setProjects((prev) => [project, ...prev]);
  };

  const handleUpdateProject = (updatedPro: Project) => {
    setProjects(projects.map((project) => (project.id === updatedPro.id ? updatedPro : project)));
    setIsDialogOpen(false);
  };

  return (
    <div className="container max-w-7xl px-5">
      <AddProjectModal />
      <EditProjectModal />
      <div className="flex flex-col gap-6">
        {!error && (
          <div className="rounded-lg"><Projects />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
