import { useAuthStore } from '../../../stores/authStore';
import { User, Mail, Briefcase, Key, Loader2, Check } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../../../services/accountService';
import { profileService } from '../../../services/profileService';
import type { UpdateProfileRequest } from '../../../services/profileService';
import { useState, useEffect } from 'react';
import { ChangePasswordModal } from '../components/ChangePasswordModal';

export const ProfilePage = () => {
  const { email, userId, companyId, updateUser } = useAuthStore((state) => state);
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileRequest>({ firstName: '', lastName: '' });
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['accountProfile'],
    queryFn: accountService.getCurrentProfile,
  });

  const updateMutation = useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsEditing(false);
      updateUser({ firstName: variables.firstName, lastName: variables.lastName });
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  });

  useEffect(() => {
    if (profile && !isEditing) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
      });
    }
  }, [profile, isEditing]);

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-[32px] font-bold text-white tracking-tight">Profile</h1>
        <p className="text-[16px] text-slate-400 mt-1">Manage your personal account information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="premium-card p-8 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center text-4xl font-bold shadow-[0_0_20px_rgba(99,102,241,0.3)] ring-4 ring-white/[0.05]">
                {profile?.firstName ? profile.firstName.charAt(0).toUpperCase() : (email ? email.charAt(0).toUpperCase() : 'U')}
              </div>
              <div>
                <h2 className="text-[24px] font-bold text-white">
                  {profile?.firstName || profile?.lastName ? `${profile.firstName} ${profile.lastName}` : email || 'Unknown User'}
                </h2>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-[15px] text-slate-400">BizFlow User</span>
                </div>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-[14px] font-medium text-white bg-white/[0.05] border border-white/[0.1] rounded-xl hover:bg-white/[0.1] transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="premium-card p-8">
            <h3 className="text-[20px] font-medium text-white mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-3 text-indigo-400" />
                Personal Information
              </div>
              {showSuccessMessage && (
                <span className="inline-flex items-center text-[14px] text-emerald-400">
                  <Check className="h-4 w-4 mr-1" />
                  Saved successfully
                </span>
              )}
            </h3>
            
            {isLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-indigo-500" /></div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">First Name</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Not available"
                      className="block w-full h-12 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 text-[15px] text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Last Name</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Not available"
                      className="block w-full h-12 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 text-[15px] text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="email"
                      disabled
                      value={profile?.email || email || ''}
                      className="block w-full h-12 rounded-xl border border-white/[0.08] bg-white/[0.02] pl-12 pr-4 text-[15px] text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
                
                {isEditing ? (
                  <div className="pt-4 flex items-center justify-end space-x-4">
                    <button
                      onClick={handleCancel}
                      disabled={updateMutation.isPending}
                      className="px-5 py-2.5 text-[14px] font-medium text-slate-300 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={updateMutation.isPending || !formData.firstName || !formData.lastName}
                      className="inline-flex items-center px-6 py-2.5 text-[14px] font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] focus:ring-indigo-500 disabled:opacity-50 transition-colors shadow-sm"
                    >
                      {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <div className="pt-2">
                    <p className="text-sm text-slate-500 italic">Email address cannot be changed.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-8 relative z-10 backdrop-blur-md">
            <h3 className="text-[18px] font-medium text-white mb-6 uppercase tracking-wider flex items-center">
              <Briefcase className="h-5 w-5 mr-3 text-slate-400" />
              Account Context
            </h3>
            <div className="space-y-4">
              <div className="pb-4 border-b border-white/[0.08] border-dashed">
                <span className="block text-xs font-medium text-slate-500 mb-1">User ID</span>
                <span className="block text-sm font-mono text-slate-300 break-all bg-black/40 p-2 rounded-lg border border-white/[0.05]">{userId || 'N/A'}</span>
              </div>
              <div className="pb-4 border-b border-white/[0.08] border-dashed">
                <span className="block text-xs font-medium text-slate-500 mb-1">Company ID</span>
                <span className="block text-sm font-mono text-slate-300 break-all bg-black/40 p-2 rounded-lg border border-white/[0.05]">{companyId || 'N/A'}</span>
              </div>
              <div className="pt-2">
                <span className="block text-xs font-medium text-slate-500 mb-2">Account Role</span>
                <span className="inline-flex items-center rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-medium text-slate-400 ring-1 ring-inset ring-slate-500/20">
                  {profile?.role && profile.role.length > 0 ? profile.role.join(', ') : 'Not available'}
                </span>
              </div>
            </div>
          </div>

          <div className="premium-card p-8 border-l-4 border-l-rose-500">
            <h3 className="text-[18px] font-medium text-white mb-2 flex items-center">
              <Key className="h-5 w-5 mr-3 text-rose-400" />
              Security
            </h3>
            <p className="text-[14px] text-slate-400 mb-6">Change your password to keep your account secure.</p>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-full inline-flex justify-center items-center h-12 px-6 py-2 text-[15px] font-medium text-white bg-white/[0.05] border border-white/[0.1] rounded-xl hover:bg-white/[0.1] transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </div>
  );
};
