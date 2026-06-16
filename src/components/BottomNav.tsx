import { Home, Tag, ShoppingBag, ClipboardList, Headphones } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface TabItem {
  label: string;
  icon: React.FC<{ className?: string }>;
  path: string;
}

const tabs: TabItem[] = [
  { label: '首页', icon: Home, path: '/' },
  { label: '卖号', icon: Tag, path: '/sell' },
  { label: '买号', icon: ShoppingBag, path: '/buy' },
  { label: '订单', icon: ClipboardList, path: '/orders' },
  { label: '客服', icon: Headphones, path: '/support' },
];

const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 bg-white border-t border-warm-border">
      <div className="flex items-stretch justify-around">
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          const Icon = tab.icon;

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex-1 flex flex-col items-center justify-center min-h-[64px] relative"
            >
              {active && (
                <span className="absolute top-1.5 w-1.5 h-1.5 rounded-full bg-warn" />
              )}
              <Icon
                className={`w-7 h-7 ${active ? 'text-brand' : 'text-warm-muted'}`}
              />
              <span
                className={`text-sm mt-0.5 ${active ? 'text-brand' : 'text-warm-muted'}`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
