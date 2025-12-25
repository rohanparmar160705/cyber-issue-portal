"use client";

import { X, AlertCircle, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import {
  IssueAPI,
  IssueResponse,
  ProjectAPI,
  ProjectResponse,
} from "@/api/api";
import { toast } from "sonner";
import { z } from "zod";

const issueSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.enum(["CLOUD_SECURITY", "RETEAM_ASSESSMENT", "VAPT"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]).default("OPEN"),
  projectId: z.number().optional(),
});

type IssueErrors = {
  title?: string;
  description?: string;
  type?: string;
  priority?: string;
  projectId?: string;
};

interface IssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  issue?: IssueResponse | null;
}

export const IssueModal = ({
  isOpen,
  onClose,
  onSuccess,
  issue,
}: IssueModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<string>("VAPT");
  const [priority, setPriority] = useState<string>("MEDIUM");
  const [status, setStatus] = useState<string>("OPEN");
  const [projectId, setProjectId] = useState<number | "">("");
  const [projects, setProjects] = useState<ProjectResponse[]>([]);

  const [errors, setErrors] = useState<IssueErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
      if (issue) {
        setTitle(issue.title);
        setDescription(issue.description);
        setType(issue.type);
        setPriority(issue.priority);
        setStatus(issue.status);
        setProjectId(issue.projectId || "");
      } else {
        resetForm();
      }
    }
  }, [isOpen, issue]);

  const fetchProjects = async () => {
    try {
      const data = await ProjectAPI.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setType("VAPT");
    setPriority("MEDIUM");
    setStatus("OPEN");
    setProjectId("");
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      title,
      description,
      type: type as any,
      priority: priority as any,
      status: status as any,
      projectId: projectId === "" ? undefined : Number(projectId),
    };

    const result = issueSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: IssueErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof IssueErrors;
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (issue) {
        await IssueAPI.updateIssue(issue.id, payload);
        toast.success("Security issue updated");
      } else {
        await IssueAPI.createIssue(payload);
        toast.success("Security issue reported");
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

      <div className="bg-[#0A0A0A] border border-white/10 w-full max-w-xl rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
        <header className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold italic uppercase tracking-tight text-glow">
            {issue ? "Update" : "Report"}{" "}
            <span className="text-primary not-italic">Vulnerability</span>
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
              Vulnerability Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Critical SQL Injection in Auth Endpoint"
              className={`w-full bg-black border ${
                errors.title ? "border-red-500/50" : "border-white/10"
              } p-3 rounded-lg focus:border-primary outline-none transition-all placeholder:text-neutral-800 text-sm font-medium`}
            />
            {errors.title && (
              <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide flex items-center mt-1">
                <AlertCircle size={10} className="mr-1" /> {errors.title}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                Assessment Type
              </label>
              <div className="relative group">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-black border border-white/10 p-3 pr-10 rounded-lg focus:border-primary outline-none text-sm font-medium appearance-none cursor-pointer group-hover:border-white/20 transition-colors"
                >
                  <option value="VAPT">VAPT</option>
                  <option value="CLOUD_SECURITY">Cloud Security</option>
                  <option value="RETEAM_ASSESSMENT">Red Teaming</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none group-focus-within:text-primary transition-colors"
                  size={16}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                Risk Priority
              </label>
              <div className="relative group">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-black border border-white/10 p-3 pr-10 rounded-lg focus:border-primary outline-none text-sm font-medium appearance-none cursor-pointer group-hover:border-white/20 transition-colors"
                >
                  <option value="LOW">Low Risk</option>
                  <option value="MEDIUM">Medium Risk</option>
                  <option value="HIGH">High Risk</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none group-focus-within:text-primary transition-colors"
                  size={16}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              Assign to Project
            </label>
            <div className="relative group">
              <select
                value={projectId}
                onChange={(e) =>
                  setProjectId(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="w-full bg-black border border-white/10 p-3 pr-10 rounded-lg focus:border-primary outline-none text-sm font-medium appearance-none cursor-pointer group-hover:border-white/20 transition-colors"
              >
                <option value="">Global / No Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none group-focus-within:text-primary transition-colors"
                size={16}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              Technical Findings
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the vulnerability, impact, and remediation steps..."
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

          {issue && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                Remediation Status
              </label>
              <div className="relative group">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-black border border-white/10 p-3 pr-10 rounded-lg focus:border-primary outline-none text-sm font-medium appearance-none cursor-pointer group-hover:border-white/20 transition-colors"
                >
                  <option value="OPEN">Open (New)</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="CLOSED">Closed (Fixed)</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none group-focus-within:text-primary transition-colors"
                  size={16}
                />
              </div>
            </div>
          )}
        </form>

        <footer className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-neutral-400 hover:text-white hover:bg-white/5 transition-all outline-none"
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
              : issue
              ? "Update Security Issue"
              : "Report Finding"}
          </button>
        </footer>
      </div>
    </div>
  );
};

