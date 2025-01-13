// src/app/org/[id]/(auth)/projects/page.tsx
"use client";
import { Button } from "@components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { useEffect, useState } from "react";
import { ProjectsTable } from "./components/ProjectTable";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { ProjectForm } from "./components/ProjectForm";
import { useParams } from "next/navigation";
import { getProjects } from "@/utils/services/projectServices";
import { Project } from "@/types/project";
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
    <div className="container max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddProject}>Add New Project</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editProject ? "Edit Project" : "Add New Project"}</DialogTitle>
              </DialogHeader>
              <ProjectForm addProject={addProject} onClose={() => setIsDialogOpen(false)} editProject={editProject} setEditProject={setEditProject} updateProject={handleUpdateProject} />
            </DialogContent>
          </Dialog>
        </div>

        {!error && (
          <div className="rounded-lg">
            <ProjectsTable projects={projects} setProjects={setProjects} handleEditProject={handleEditProject} />
            <Projects />
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
