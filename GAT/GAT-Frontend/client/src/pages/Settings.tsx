import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { buildUrl } from '@/lib/api';
import { Layout } from '@/components/Layout';
import { useToast } from '@/hooks/use-toast'; // Shadcn toast hook
import {
  User as UserIcon, LogOut,
  Check, Mail, AtSign, KeyRound, Loader2
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utils ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface UserProfile {
  id: string;
  email: string;
  username: string;
  role: string;
  isVerified?: boolean;
}

// --- Validation Schemas ---
const passwordSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

// --- Constants ---
const NAV_ITEMS = [
  { name: 'Account', icon: UserIcon },
] as const;

type TabName = typeof NAV_ITEMS[number]['name'];

// ──────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────
export default function Settings() {
  const [activeTab, setActiveTab] = useState<TabName>('Account');

  const { data: user, isLoading } = useQuery<UserProfile>({
    queryKey: ['/auth/user-info'],
  });

  const handleLogout = async () => {
    try {
      // 1. Attempt server-side logout (optional, depending on backend)
      await fetch(buildUrl('/auth/logout'), { method: 'POST' }).catch(() => {}); 
      
      // 2. Clear Client State
      sessionStorage.clear();
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin');
      
      // 3. Hard Redirect to clear memory/React state
      window.location.href = '/';
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30">

      <div className="max-w-6xl mx-auto px-4 py-8 lg:px-8 lg:py-12">
        <h1 className="text-3xl font-bold mb-8 font-grotesk text-white">Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR NAVIGATION */}
          <aside className="lg:col-span-3">
            <nav className="bg-card border border-border rounded-xl p-2 lg:p-3 sticky top-24 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible no-scrollbar shadow-lg">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={cn(
                    "flex-shrink-0 lg:w-full flex items-center gap-3 px-4 lg:px-5 py-3 rounded-xl font-bold transition-all whitespace-nowrap text-sm lg:text-base font-grotesk",
                    activeTab === item.name
                      ? "bg-primary text-background shadow-md shadow-primary/10"
                      : "text-slate-400 hover:bg-secondary/40 hover:text-white"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </button>
              ))}

              <div className="w-px h-8 bg-border lg:w-full lg:h-px lg:my-2 mx-2 lg:mx-0 flex-shrink-0" />

              <button
                onClick={handleLogout}
                className="flex-shrink-0 lg:w-full flex items-center gap-3 px-4 lg:px-5 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition text-sm lg:text-base whitespace-nowrap font-bold font-grotesk"
              >
                <LogOut className="w-5 h-5" />
                Log Out
              </button>
            </nav>
          </aside>

          {/* CONTENT AREA */}
          <main className="lg:col-span-9">
            <div className="bg-card border border-border rounded-xl p-6 sm:p-10 min-h-[600px] shadow-xl">
              {isLoading ? (
                <div className="flex items-center justify-center h-full text-slate-500">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {activeTab === 'Account' && <AccountTab user={user} />}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
    </Layout>
  );
}

// ──────────────────────────────────────────────────────────────
// TAB: ACCOUNT SETTINGS
// ──────────────────────────────────────────────────────────────
function AccountTab({ user }: { user?: UserProfile }) {
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema)
  });

  const mutation = useMutation({
    mutationFn: async (data: PasswordFormValues) => {
      const res = await fetch(buildUrl('/auth/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || err.message || 'Failed to update password');
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Password updated successfully." });
      reset();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h2 className="text-2xl font-bold text-white font-grotesk leading-none">Account Settings</h2>
          <p className="text-slate-400 text-sm mt-1.5 font-medium">Manage your personal information and security.</p>
        </div>
        {user?.isVerified && (
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 uppercase tracking-wider font-grotesk glow-text">
            Verified
          </span>
        )}
      </div>

      {/* User Details (Read Only) */}
      <div className="grid gap-6 p-6 bg-background/40 rounded-xl border border-border shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 border border-border text-primary">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1 font-grotesk">Email Address</p>
            <p className="text-lg font-medium text-white">{user?.email || '—'}</p>
          </div>
        </div>

        <div className="h-px bg-border w-full" />

        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 border border-border text-primary">
            <AtSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1 font-grotesk">Username</p>
            <p className="text-lg font-medium text-white">@{user?.username || '—'}</p>
          </div>
        </div>
      </div>

      {/* Password Form */}
      <div className="pt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-primary/10 border border-primary/25 text-primary rounded-xl">
            <KeyRound className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white font-grotesk leading-none">Change Password</h3>
        </div>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5 max-w-lg">
          <div>
            <label className="text-sm font-semibold text-slate-400 mb-2 block font-grotesk">Current Password</label>
            <input
              type="password"
              {...register('oldPassword')}
              className={cn(
                "w-full px-4 py-3 bg-secondary/40 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/30 transition text-sm text-white",
                errors.oldPassword 
                  ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" 
                  : "border-border/80 focus:border-primary/50"
              )}
            />
            {errors.oldPassword && <p className="text-red-400 text-xs mt-1.5 font-semibold">{errors.oldPassword.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-semibold text-slate-400 mb-2 block font-grotesk">New Password</label>
              <input
                type="password"
                {...register('newPassword')}
                className={cn(
                  "w-full px-4 py-3 bg-secondary/40 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/30 transition text-sm text-white",
                  errors.newPassword 
                    ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" 
                    : "border-border/80 focus:border-primary/50"
                )}
              />
              {errors.newPassword && <p className="text-red-400 text-xs mt-1.5 font-semibold">{errors.newPassword.message}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-400 mb-2 block font-grotesk">Confirm Password</label>
              <input
                type="password"
                {...register('confirmPassword')}
                className={cn(
                  "w-full px-4 py-3 bg-secondary/40 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/30 transition text-sm text-white",
                  errors.confirmPassword 
                    ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" 
                    : "border-border/80 focus:border-primary/50"
                )}
              />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1.5 font-semibold">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 bg-primary hover:bg-primary/90 text-background font-bold py-3.5 rounded-xl transition mt-2 shadow-lg shadow-primary/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-grotesk text-sm"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}


