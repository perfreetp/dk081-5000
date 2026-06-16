import { Shield } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-warm-bg flex flex-col">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 bg-white border-b border-warm-border h-14 flex items-center justify-between px-4">
        <h1 className="text-xl font-bold text-brand">安心号</h1>
        <Shield className="w-5 h-5 text-safe" />
      </header>

      <main className="flex-1 pt-14 pb-20 overflow-y-auto">
        <div className="p-4">
          <Outlet />
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Layout;
