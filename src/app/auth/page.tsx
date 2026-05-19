import AuthForm from '../../components/AuthForm';

export const metadata = {
  title: 'Sign In — Resume Lie Detector',
  description: 'Sign in to save your resume analysis history.',
};

export default function AuthPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
        <p className="mt-2 text-sm text-zinc-500">Sign in to access your analysis history</p>
      </div>
      <AuthForm />
    </main>
  );
}
