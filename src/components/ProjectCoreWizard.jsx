import { useState } from 'react';

function ProjectCoreWizard({ project, onGoBack, onCompleteSetup }) {
  const [formData, setFormData] = useState({
    oneSentencePitch: '',
    problemStatement: '',
    targetAudience: '',
    uniqueSolution: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveAndBegin = () => {
    // Check if all fields are filled
    if (Object.values(formData).every(value => value.trim() !== '')) {
      onCompleteSetup(project.id, formData);
    }
  };

  const isFormComplete = Object.values(formData).every(value => value.trim() !== '');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white border-opacity-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onGoBack}
              className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Dashboard</span>
            </button>
            
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-white">Define Your Project Core</h1>
          </div>
        </div>
        <p className="text-gray-300 mt-2 ml-16">
          Let's establish the foundation for <span className="font-semibold text-white">"{project.name}"</span> by defining its core elements.
        </p>
      </div>

      {/* Wizard Content */}
      <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
        <div className="space-y-8">
          {/* One-Sentence Pitch */}
          <div>
            <label className="block text-lg font-semibold text-white mb-3">
              One-Sentence Pitch
            </label>
            <p className="text-gray-400 text-sm mb-4">
              Describe your project in one compelling sentence that captures its essence.
            </p>
            <textarea
              value={formData.oneSentencePitch}
              onChange={(e) => handleInputChange('oneSentencePitch', e.target.value)}
              placeholder="Example: A revolutionary mobile app that connects local farmers directly with consumers for fresh, sustainable produce delivery."
              className="w-full h-24 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Problem Statement */}
          <div>
            <label className="block text-lg font-semibold text-white mb-3">
              Problem Statement
            </label>
            <p className="text-gray-400 text-sm mb-4">
              What specific problem does your project solve? Why is this problem important?
            </p>
            <textarea
              value={formData.problemStatement}
              onChange={(e) => handleInputChange('problemStatement', e.target.value)}
              placeholder="Describe the pain point, challenge, or opportunity your project addresses..."
              className="w-full h-32 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-lg font-semibold text-white mb-3">
              Target Audience
            </label>
            <p className="text-gray-400 text-sm mb-4">
              Who are you building this for? Be specific about demographics, behaviors, and needs.
            </p>
            <textarea
              value={formData.targetAudience}
              onChange={(e) => handleInputChange('targetAudience', e.target.value)}
              placeholder="Define your primary users, their characteristics, and what they care about..."
              className="w-full h-32 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Unique Solution */}
          <div>
            <label className="block text-lg font-semibold text-white mb-3">
              Unique Solution
            </label>
            <p className="text-gray-400 text-sm mb-4">
              What makes your approach different? How does your solution stand out from alternatives?
            </p>
            <textarea
              value={formData.uniqueSolution}
              onChange={(e) => handleInputChange('uniqueSolution', e.target.value)}
              placeholder="Explain your unique value proposition and competitive advantages..."
              className="w-full h-32 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Save Button */}
          <div className="pt-6 border-t border-gray-600">
            <button
              onClick={handleSaveAndBegin}
              disabled={!isFormComplete}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Save and Begin Project</span>
            </button>
            {!isFormComplete && (
              <p className="text-gray-400 text-sm text-center mt-2">
                Please fill in all fields to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCoreWizard;
