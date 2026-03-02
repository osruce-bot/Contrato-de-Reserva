import React from 'react';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children, icon }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mb-6 transition-all hover:shadow-lg">
      <div className="bg-blue-700 px-6 py-4 border-b border-blue-800 flex items-center gap-3">
        {icon && <span className="text-white bg-blue-600 p-1.5 rounded-lg">{icon}</span>}
        <h3 className="text-lg font-bold text-white tracking-wide">{title}</h3>
      </div>
      <div className="p-6 space-y-5 bg-slate-50">
        {children}
      </div>
    </div>
  );
};