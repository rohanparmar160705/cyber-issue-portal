import { Sidebar } from "@/components/dashboard/Sidebar";
import { Plus, Search, Filter, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Security Issues
            </h1>
            <p className="text-neutral-500 text-sm mt-1">
              Manage and track your vulnerability assessments
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 bg-primary text-black px-6 py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-all active:scale-95">
              <Plus size={18} />
              <span>Create Issue</span>
            </button>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by title or description..."
              className="w-full bg-black border border-white/5 pl-12 pr-4 py-3 rounded-lg text-sm outline-none focus:border-primary transition-all"
            />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <select className="flex-1 md:flex-none bg-black border border-white/5 px-4 py-3 rounded-lg text-sm font-medium outline-none focus:border-primary transition-all appearance-none cursor-pointer">
              <option value="">All Types</option>
              <option value="CLOUD_SECURITY">Cloud Security</option>
              <option value="RETEAM_ASSESSMENT">RedTeaming</option>
              <option value="VAPT">VAPT</option>
            </select>
            <button className="p-3 bg-black border border-white/5 rounded-lg text-neutral-400 hover:text-white transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Issues List - Professional Table Layout */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                <th className="px-6 py-5">Issue Details</th>
                <th className="px-6 py-5">Type</th>
                <th className="px-6 py-5">Priority</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Empty State */}
              <tr>
                <td colSpan={5} className="py-24 text-center">
                  <div className="flex flex-col items-center">
                    <AlertCircle className="w-12 h-12 text-neutral-800 mb-4" />
                    <h4 className="text-xl font-bold mb-1">
                      No issues logged yet
                    </h4>
                    <p className="text-neutral-500 text-sm max-w-xs mx-auto">
                      All your security findings and assessments will appear
                      here. Start by creating your first issue.
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
