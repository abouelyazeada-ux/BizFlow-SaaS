import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { authService, type RegisterRequest } from '../../services/authService';
import { Loader2 } from 'lucide-react';

const registerSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const Register = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterRequest) => {
    setError(null);
    try {
      const response = await authService.register(data);
      setAuth(response);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create workspace');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
          <h3 className="text-2xl font-bold text-slate-100 text-center">Create a Workspace</h3>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-5 py-4 rounded-xl text-[16px]" role="alert">
            {error}
          </div>
        )}

        <div className="space-y-2.5">
          <label className="block text-[15px] font-medium text-slate-200">Company Name</label>
          <input
            type="text"
            {...register('companyName')}
            className="appearance-none block w-full h-[52px] xl:h-[56px] px-4 border border-slate-300 rounded-[12px] shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-[16px] transition-colors"
            aria-invalid={!!errors.companyName}
          />
          {errors.companyName && (
            <p className="text-[14px] text-red-400 mt-1.5">{errors.companyName.message}</p>
          )}
        </div>

        <div className="space-y-2.5">
          <label className="block text-[15px] font-medium text-slate-200">Email address</label>
          <input
            type="email"
            {...register('email')}
            className="appearance-none block w-full h-[52px] xl:h-[56px] px-4 border border-slate-300 rounded-[12px] shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-[16px] transition-colors"
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-[14px] text-red-400 mt-1.5">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2.5">
          <label className="block text-[15px] font-medium text-slate-200">Password</label>
          <input
            type="password"
            {...register('password')}
            className="appearance-none block w-full h-[52px] xl:h-[56px] px-4 border border-slate-300 rounded-[12px] shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-[16px] transition-colors"
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="text-[14px] text-red-400 mt-1.5">{errors.password.message}</p>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center h-[52px] xl:h-[56px] px-6 border border-transparent rounded-[12px] shadow-sm text-[16px] font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Create Workspace'}
          </button>
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="text-[15px] text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] px-2 py-1">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
