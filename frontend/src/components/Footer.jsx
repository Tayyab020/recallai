import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-zinc-800 py-10 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-pink-500" />
          <span className="text-zinc-400 text-sm">© {new Date().getFullYear()} Recall.</span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-zinc-400">
          <Link to="/privacy" className="hover:text-zinc-200">Privacy</Link>
          <Link to="/terms" className="hover:text-zinc-200">Terms</Link>
          <a href="https://twitter.com" className="hover:text-zinc-200" rel="noreferrer" target="_blank">Twitter</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;


