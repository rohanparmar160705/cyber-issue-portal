import { Sidebar } from "@/components/dashboard/Sidebar";
import { Save, UserCircle, ShieldAlert } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      <Sidebar />

      {/* Main Profile Section */}
      <main className="flex-1 p-8 md:p-12 overflow-auto bg-[radial-gradient(circle_at_top_right,rgba(0,255,178,0.02),transparent)]">
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2 uppercase italic">
            Account <span className="text-primary not-italic">Settings</span>
          </h1>
          <p className="text-neutral-500 text-sm">
            Manage your profile and security preferences
          </p>
        </header>

        <div className="max-w-4xl space-y-8">
          <section className="bg-[#0A0A0A] border border-white/5 p-8 rounded-xl">
            <div className="flex items-center space-x-4 mb-10">
              <div className="bg-primary/10 p-4 rounded-full">
                <UserCircle className="text-primary w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Profile Information</h2>
                <p className="text-neutral-500 text-xs mt-1 font-bold uppercase tracking-widest">
                  General Identity Details
                </p>
              </div>
            </div>

            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-400">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Security Analyst"
                    className="w-full bg-black border border-white/5 p-4 rounded-lg focus:border-primary outline-none transition-all placeholder:text-neutral-700 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-400">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="analyst@apnisec.com"
                    className="w-full bg-black border border-white/5 p-4 rounded-lg focus:border-primary outline-none transition-all placeholder:text-neutral-700 font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-start">
                <button className="bg-primary text-black px-8 py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-all flex items-center shadow-[0_0_20px_rgba(0,255,178,0.1)]">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          </section>

          <section className="bg-red-500/5 border border-red-500/10 p-8 rounded-xl">
            <div className="flex items-center space-x-3 text-red-500 mb-4">
              <ShieldAlert size={20} />
              <h3 className="font-bold">Dangerous Zone</h3>
            </div>
            <p className="text-neutral-500 text-sm mb-6 max-w-lg">
              Deleting your account or revoking access are permanent actions.
              All your issues and projects will be permanently removed.
            </p>
            <button className="px-6 py-2.5 border border-red-500/20 text-red-500 font-bold text-xs rounded-lg hover:bg-red-500 hover:text-black transition-all">
              Deactivate Account
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
