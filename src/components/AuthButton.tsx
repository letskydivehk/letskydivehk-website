import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AuthButtonProps {
  onOpenProfile?: () => void;
}

export function AuthButton({ onOpenProfile }: AuthButtonProps) {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsOpen(false);
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSignIn}
        disabled={isLoading}
        className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-medium px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 gentle-animation cursor-pointer disabled:opacity-50"
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">{isLoading ? '登入中...' : '登入'}</span>
      </motion.button>
    );
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-2 py-1.5 rounded-full border border-white/20 hover:bg-white/20 gentle-animation cursor-pointer"
      >
        <Avatar className="w-8 h-8">
          <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email} />
          <AvatarFallback className="bg-accent-orange text-white text-sm">
            {(user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="hidden sm:inline text-sm font-medium max-w-24 truncate">
          {user.user_metadata?.full_name || user.email?.split('@')[0]}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-48 bg-black/90 backdrop-blur-xl rounded-lg border border-white/20 shadow-xl z-50 overflow-hidden"
            >
              <div className="p-3 border-b border-white/10">
                <p className="text-white font-medium text-sm truncate">
                  {user.user_metadata?.full_name || '會員'}
                </p>
                <p className="text-white/60 text-xs truncate">{user.email}</p>
              </div>
              
              <div className="p-1">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenProfile?.();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded-md transition-colors text-sm"
                >
                  <User className="w-4 h-4" />
                  個人資料
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-white/10 rounded-md transition-colors text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  登出
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
