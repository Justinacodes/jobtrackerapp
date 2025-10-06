import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-slate-500">
          &copy; {currentYear} Justina Ominisan. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
