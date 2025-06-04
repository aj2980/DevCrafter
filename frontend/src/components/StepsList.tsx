import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { Step } from '../types';

interface StepsListProps {
  steps: Step[];
  onStepClick: (id: number) => void;
}

export const StepsList: React.FC<StepsListProps> = ({ steps, onStepClick }) => {
  return (
    <div className="h-full bg-gray-800 text-gray-200 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Steps</h2>
      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className="flex items-start gap-3 cursor-pointer hover:bg-gray-700 p-2 rounded"
            onClick={() => onStepClick(step.id)}
          >
            {step.status=='completed' ? (
              <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 mt-1" />
            )}
            <div>
              <h3 className="font-medium">{step.title}</h3>
              <p className="text-sm text-gray-400">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};