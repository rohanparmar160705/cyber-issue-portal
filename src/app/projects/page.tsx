"use client";

import {
  Plus,
  Search,
  Filter,
  AlertCircle,
  Trash2,
  Edit,
  Briefcase,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useEffect, useState } from "react";
import { ProjectAPI, ProjectResponse } from "@/api/api";
import { toast } from "sonner";
import { ProjectModal } from "@/components/projects/ProjectModal";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<ProjectResponse | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await ProjectAPI.getAllProjects();
      setProjects(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        "Are you sure? This will not delete the issues inside but will detach them."
      )
    )
      return;
    try {
      await ProjectAPI.deleteProject(id);
      toast.success("Project dismantled");
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete project");
    }
  };

  const handleEdit = (project: ProjectResponse) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.clientName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white pt-24 pb-12">
        <main className="container mx-auto px-6 max-w-7xl">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <ShieldCheck className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  Cyber Project Portfolio
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight mb-2 uppercase italic leading-none">
                Security{" "}
                <span className="text-primary not-italic">Engagements</span>
              </h1>
              <p className="text-neutral-500 text-sm font-medium">
                Active security audits and vulnerability assessment projects.
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedProject(null);
                setIsModalOpen(true);
              }}
              className="flex items-center space-x-2 bg-primary text-black px-8 py-4 rounded-xl font-bold text-sm hover:bg-white transition-all active:scale-95 shadow-[0_0_30px_rgba(0,255,178,0.15)] group"
            >
              <Plus
                size={18}
                className="transition-transform group-hover:rotate-90"
              />
              <span>Initiate Engagement</span>
            </button>
          </header>

          <div className="bg-[#0A0A0A]/50 border border-white/5 rounded-2xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-sm">
            <div className="relative w-full md:w-1/2">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600"
                size={18}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, clients, or scopes..."
                className="w-full bg-black/50 border border-white/10 pl-12 pr-4 py-4 rounded-xl text-sm outline-none focus:border-primary transition-all placeholder:text-neutral-800"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden md:block">
                <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
                  Total Engagements
                </p>
                <p className="text-xl font-black text-white">
                  {projects.length}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl h-64 animate-pulse"
                  ></div>
                ))
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl hover:border-primary/30 transition-all relative overflow-hidden flex flex-col h-full shadow-lg"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-all"></div>

                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div
                      className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${
                        project.status === "ACTIVE"
                          ? "bg-primary/10 text-primary border-primary/20"
                          : project.status === "COMPLETED"
                          ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          : "bg-neutral-500/10 text-neutral-500 border-neutral-500/20"
                      }`}
                    >
                      {project.status}
                    </div>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white transition-colors"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {project.name}
                  </h3>
                  <p className="text-neutral-500 text-sm mb-6 line-clamp-3 font-medium flex-grow leading-relaxed italic">
                    {project.description}
                  </p>

                  <div className="space-y-4 pt-6 mt-auto border-t border-white/5 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-neutral-400 font-bold uppercase tracking-widest">
                        <Briefcase size={12} className="mr-2 text-primary/50" />
                        Client
                      </div>
                      <span className="text-xs font-black text-white">
                        {project.clientName || "External"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-neutral-400 font-bold uppercase tracking-widest">
                        <Calendar size={12} className="mr-2 text-primary/50" />
                        Created
                      </div>
                      <span className="text-xs font-black text-white">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                        Linked Findings
                      </span>
                      <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-black text-primary">
                        {project.issueCount || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-24 text-center">
                <div className="flex flex-col items-center">
                  <Briefcase className="w-16 h-16 text-neutral-900 mb-6" />
                  <h4 className="text-2xl font-bold mb-2">Portfolio Empty</h4>
                  <p className="text-neutral-500 text-sm max-w-sm mx-auto font-medium">
                    No security engagements found. Initialize your first project
                    to start tracking vulnerabilities.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>

        <ProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchProjects}
          project={selectedProject}
        />
      </div>
    </ProtectedRoute>
  );
}

