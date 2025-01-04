import React from 'react';
import { Code } from 'lucide-react';
import { CollapsibleJsonView } from './CollapsibleJsonView';

interface ExtrasDataSectionProps {
  title: string;
  data: any;
  icon?: React.ReactNode;
}

export function ExtrasDataSection({ title, data, icon = <Code className="h-5 w-5 text-gray-500" /> }: ExtrasDataSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {icon}
        <span>{title}</span>
      </div>
      <CollapsibleJsonView data={data} />
    </div>
  );
}