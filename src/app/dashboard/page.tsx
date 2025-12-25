"use client";

import {
  Plus,
  Search,
  Filter,
  AlertCircle,
  Trash2,
  Edit,
  ShieldAlert,
  ChevronDown,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useEffect, useState } from "react";
import { IssueAPI, IssueResponse } from "@/api/api";
import { toast } from "sonner";
import { IssueModal } from "@/components/dashboard/IssueModal";

export default function DashboardPage() {
  const [issues, setIssues] = useState<IssueResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<IssueResponse | null>(
    null
  );

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const data = await IssueAPI.getAllIssues(typeFilter || undefined);
      setIssues(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch issues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [typeFilter]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this finding?"))
      return;
    try {
      await IssueAPI.deleteIssue(id);
      toast.success("Security finding purged");
      fetchIssues();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete issue");
    }
  };

  const handleEdit = (issue: IssueResponse) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  const filteredIssues = issues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white pt-24 pb-12">
        <main className="container mx-auto px-6 max-w-7xl">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <ShieldAlert className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  Vulnerability Registry
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight mb-2 uppercase italic leading-none">
                Security{" "}
                <span className="text-primary not-italic">Findings</span>
              </h1>
              <p className="text-neutral-500 text-sm font-medium">
                Monitor and manage active security threats and vulnerabilities.
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedIssue(null);
                setIsModalOpen(true);
              }}
              className="flex items-center space-x-2 bg-primary text-black px-8 py-4 rounded-xl font-bold text-sm hover:bg-white transition-all active:scale-95 shadow-[0_0_30px_rgba(0,255,178,0.15)] group text-nowrap"
            >
              <Plus
                size={18}
                className="transition-transform group-hover:rotate-90"
              />
              <span>Log Finding</span>
            </button>
          </header>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Total Findings",
                value: issues.length,
                color: "text-white",
              },
              {
                label: "Critical Risk",
                value: issues.filter((i) => i.priority === "HIGH").length,
                color: "text-red-500",
              },
              {
                label: "In Remediation",
                value: issues.filter((i) => i.status === "IN_PROGRESS").length,
                color: "text-blue-500",
              },
              {
                label: "Resolved",
                value: issues.filter((i) => i.status === "CLOSED").length,
                color: "text-primary",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-[#0A0A0A]/50 border border-white/5 p-4 rounded-2xl backdrop-blur-sm"
              >
                <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-1">
                  {stat.label}
                </p>
                <p className={`text-2xl font-black ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-[#0A0A0A]/50 border border-white/5 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-sm">
            <div className="relative w-full md:w-96 group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-primary transition-colors"
                size={18}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vulnerabilities..."
                className="w-full bg-black/50 border border-white/10 pl-12 pr-4 py-3 rounded-xl text-sm outline-none focus:border-primary transition-all placeholder:text-neutral-800 font-medium"
              />
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none group">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full bg-black border border-white/10 pl-4 pr-10 py-3 rounded-xl text-sm font-bold outline-none focus:border-primary transition-all appearance-none cursor-pointer uppercase tracking-widest text-neutral-400 focus:text-white group-hover:border-white/20"
                >
                  <option value="">All Vectors</option>
                  <option value="CLOUD_SECURITY">Cloud Security</option>
                  <option value="RETEAM_ASSESSMENT">Red Teaming</option>
                  <option value="VAPT">VAPT</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 pointer-events-none group-focus-within:text-primary transition-colors"
                  size={16}
                />
              </div>
              <button
                onClick={fetchIssues}
                className="p-3 bg-black border border-white/10 rounded-xl text-neutral-400 hover:text-white hover:border-white/20 transition-all active:scale-95"
              >
                <Filter size={18} />
              </button>
            </div>
          </div>

          {/* Issues List */}
          <div className="bg-[#0A0A0A]/80 border border-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                    <th className="px-6 py-6">Identity & Scope</th>
                    <th className="px-6 py-6">Vector</th>
                    <th className="px-6 py-6">Risk Factor</th>
                    <th className="px-6 py-6">Status</th>
                    <th className="px-6 py-6 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-24 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredIssues.length > 0 ? (
                    filteredIssues.map((issue) => (
                      <tr
                        key={issue.id}
                        className="hover:bg-white/[0.03] transition-colors group"
                      >
                        <td className="px-6 py-6">
                          <div className="font-bold text-sm text-white group-hover:text-primary transition-colors">
                            {issue.title}
                          </div>
                          <div className="text-[10px] text-neutral-600 mt-1 flex items-center font-bold uppercase tracking-widest">
                            <span className="mr-2">ID: {issue.id}</span>
                            {issue.projectName && (
                              <span className="bg-primary/5 text-primary/70 px-1.5 py-0.5 rounded border border-primary/10 ml-2">
                                {issue.projectName}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-6 font-medium">
                          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-white/5 rounded-lg border border-white/10 text-neutral-400">
                            {issue.type.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <div
                            className={`inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                              issue.priority === "HIGH"
                                ? "bg-red-500/10 text-red-500 border-red-500/20"
                                : issue.priority === "MEDIUM"
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                issue.priority === "HIGH"
                                  ? "bg-red-500"
                                  : issue.priority === "MEDIUM"
                                  ? "bg-amber-500"
                                  : "bg-blue-500"
                              }`}
                            ></span>
                            <span>{issue.priority} RISK</span>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <span
                            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                              issue.status === "OPEN"
                                ? "bg-primary/20 text-primary border-primary/30"
                                : issue.status === "IN_PROGRESS"
                                ? "bg-blue-500/20 text-blue-500 border-blue-500/30"
                                : "bg-neutral-500/20 text-neutral-500 border-neutral-500/30"
                            }`}
                          >
                            {issue.status.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <div className="flex items-center justify-end space-x-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(issue)}
                              className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-neutral-500 hover:text-white"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(issue.id)}
                              className="p-2.5 hover:bg-red-500/10 rounded-xl transition-all text-neutral-500 hover:text-red-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-24 text-center">
                        <div className="flex flex-col items-center">
                          <AlertCircle className="w-16 h-16 text-neutral-900 mb-6" />
                          <h4 className="text-2xl font-bold mb-2">
                            No Security Risks
                          </h4>
                          <p className="text-neutral-500 text-sm max-w-sm mx-auto font-medium leading-relaxed">
                            {searchQuery || typeFilter
                              ? "The tactical objective specified does not match any current findings. Adjust your filters."
                              : "The registry is currently clear. Authorized analysts may begin reporting vulnerabilities."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        <IssueModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchIssues}
          issue={selectedIssue}
        />
      </div>
    </ProtectedRoute>
  );
}
