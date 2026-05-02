import { DeployForm } from '@/components/deploy-form/DeployForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_32%),#f8fafc] px-4 py-8 sm:px-6 lg:px-10">
      <DeployForm />
    </main>
  );
}
