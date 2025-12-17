import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Button } from "./Button";
import { ShoppingBag, Sun, Moon, LogOut, User as UserIcon, Heart, GitCompare } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";
import { useComparison } from "../../context/ComparisonContext";

export const Navbar: React.FC = () => {
  const { totalItems, setIsDrawerOpen } = useCart();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { wishlist } = useWishlist();
  const { comparison } = useComparison();

  return (
    <div className="navbar bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 dark:border-dark-border h-20 px-4 md:px-8 transition-colors duration-300">
      <div className="flex-1">
        <Link
          to="/"
          className="text-2xl font-black font-display tracking-tight text-gray-900 dark:text-white flex items-center gap-2"
        >
          <span className="text-4xl">🛍️</span>
          <span>Store</span>
        </Link>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {user ? (
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/profile"
              className="flex items-center gap-2 text-sm font-medium dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300">
                <UserIcon size={16} />
              </div>
              <span>{user.name}</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut size={18} />
            </Button>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary">Sign Up</Button>
            </Link>
          </div>
        )}

        <Link
          to="/wishlist"
          className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
        >
          <Heart size={20} className={wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''} />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-dark-bg">
              {wishlist.length}
            </span>
          )}
        </Link>

        <Link
          to="/compare"
          className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
        >
          <GitCompare size={20} className={comparison.length > 0 ? 'fill-blue-500 text-blue-500' : ''} />
          {comparison.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-dark-bg">
              {comparison.length}
            </span>
          )}
        </Link>

        <button
          className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
          onClick={() => setIsDrawerOpen(true)}
        >
          <ShoppingBag size={24} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-dark-bg">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
