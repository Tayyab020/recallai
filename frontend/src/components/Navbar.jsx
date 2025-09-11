import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="w-full sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/60 bg-zinc-900/80 border-b border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-pink-500"></div>
          <span className="font-extrabold tracking-tight text-zinc-100">Recall</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-300">
          <Link to="/explore" className="hover:text-zinc-100 transition-colors">Explore</Link>
          <Link to="/pricing" className="hover:text-zinc-100 transition-colors">Pricing</Link>
          <Link to="/about" className="hover:text-zinc-100 transition-colors">About</Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-zinc-300 hover:text-zinc-100 text-sm">Sign in</Link>
          <Button as={Link} to="/login" variant="default" size="sm">Sign up</Button>
        </div>

        <button className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-zinc-800 text-zinc-300">
          <Menu size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;


