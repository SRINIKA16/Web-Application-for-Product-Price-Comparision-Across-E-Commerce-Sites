import React from 'react';
import { RecommendationWizard } from '../components/RecommendationWizard';

export const RecommendationPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <RecommendationWizard />
    </div>
  );
};
