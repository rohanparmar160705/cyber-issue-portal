"use client";

import { X, AlertCircle, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { ProjectAPI, ProjectResponse } from "@/api/api";
import { toast } from "sonner";
import { z } from "zod";

const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters").max(50),
  description: z.string().min(10, "Description must be at least 10 characters"),
  clientName: z
    .string()
    .min(2, "Client name must be at least 2 characters")
    .optional()
    .or(z.literal("")),
  status: z.enum(["ACTIVE", "COMPLETED", "ON_HOLD"]).default("ACTIVE"),
});

type ProjectErrors = {
  name?: string;
  description?: string;
  clientName?: string;
};

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  project?: ProjectResponse | null;
}

export const ProjectModal = ({
  isOpen,
  onClose,
  onSuccess,
  project,
}: ProjectModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [status, setStatus] = useState<string>("ACTIVE");

  const [errors, setErrors] = useState<ProjectErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (project) {
        setName(project.name);
        setDescription(project.description);
        setClientName(project.clientName || "");
        setStatus(project.status);
      } else {
        resetForm();
      }
    }
  }, [isOpen, project]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setClientName("");
    setStatus("ACTIVE");
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      name,
      description,
      clientName: clientName === "" ? undefined : clientName,
      status: status as any,
    };

    const result = projectSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: ProjectErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof ProjectErrors;
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (project) {
        await ProjectAPI.updateProject(project.id, payload);
        toast.success("Project updated successfully");
      } else {
        await ProjectAPI.createProject(payload);
        toast.success("Security project initiated");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="bg-[#0A0A0A] border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
        <header className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold italic uppercase tracking-tight text-glow">
            {project ? "Configure" : "Initialize"}{" "}
            <span className="text-primary not-italic">Project</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-neutral-500 hover:text-white"
          >
            <X size={20} />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar"
        >
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Q4 Infrastructure Audit"
              className={`w-full bg-black border ${
                errors.name ? "border-red-500/50" : "border-white/10"
              } p-3 rounded-lg focus:border-primary outline-none transition-all placeholder:text-neutral-800 text-sm font-medium`}
            />
            {errors.name && (
              <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide flex items-center mt-1">
                <AlertCircle size={10} className="mr-1" /> {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              Client / Department
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Finance Sector"
              className={`w-full bg-black border ${
                errors.clientName ? "border-red-500/50" : "border-white/10"
              } p-3 rounded-lg focus:border-primary outline-none transition-all placeholder:text-neutral-800 text-sm font-medium`}
            />
            {errors.clientName && (
              <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide flex items-center mt-1">
                <AlertCircle size={10} className="mr-1" /> {errors.clientName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              Project Status
            </label>
            <div className="relative group">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-black border border-white/10 p-3 pr-10 rounded-lg focus:border-primary outline-none text-sm font-medium appearance-none cursor-pointer group-hover:border-white/20 transition-colors"
              >
                <option value="ACTIVE">Active (In Testing)</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none group-focus-within:text-primary transition-colors"
                size={16}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              Security Scope
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Define project boundaries, technical scope, and objectives..."
              rows={4}
              className={`w-full bg-black border ${
                errors.description ? "border-red-500/50" : "border-white/10"
              } p-3 rounded-lg focus:border-primary outline-none transition-all placeholder:text-neutral-800 text-sm font-medium resize-none`}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide flex items-center mt-1">
                <AlertCircle size={10} className="mr-1" /> {errors.description}
              </p>
            )}
          </div>
        </form>

        <footer className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-2.5 bg-primary text-black rounded-lg text-sm font-bold hover:bg-white transition-all active:scale-95 disabled:opacity-50 shadow-[0_0_20px_rgba(0,255,178,0.15)]"
          >
            {isSubmitting
              ? "Processing..."
              : project
              ? "Update Project"
              : "Initiate Project"}
          </button>
        </footer>
      </div>
    </div>
  );
};
