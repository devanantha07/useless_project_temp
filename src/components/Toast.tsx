import { useEffect, useState } from 'react';
import type { ToastMessage } from '@/game/types';

interface ToastProps {
  toasts: ToastMessage[];
}

const iconMap: Record<ToastMessage['type'], string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  achievement: '🏆',
};

const colorMap: Record<ToastMessage['type'], string> = {
  success: 'border-green-500/40 text-green-400',
  error: 'border-red-500/40 text-red-400',
  info: 'border-blue-500/40 text-blue-400',
  achievement: 'border-yellow-500/40 text-yellow-400',
};

function ToastItem({ toast }: { toast: ToastMessage }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);
  }, []);
  return (
    <div
      className={`toast glass-card px-4 py-3 flex items-center gap-3 min-w-[280px] max-w-sm border ${
        colorMap[toast.type]
      } ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <span className="text-lg flex-shrink-0">{iconMap[toast.type]}</span>
      <span className="text-sm text-white">{toast.text}</span>
    </div>
  );
}

export default function ToastContainer({ toasts }: ToastProps) {
  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
