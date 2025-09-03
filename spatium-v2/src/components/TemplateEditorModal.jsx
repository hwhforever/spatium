import React, { useState } from 'react';

function TemplateEditorModal({ isOpen, onClose, onSave, existingTemplate = null }) {
  const [templateName, setTemplateName] = useState(existingTemplate?.name || '');
  const [category, setCategory] = useState(existingTemplate?.category || 'Custom');
  const [promptTemplate, setPromptTemplate] = useState(existingTemplate?.promptTemplate || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Example template to help users get started
  const exampleTemplate = `Generate a comprehensive business plan for ${`{project.name}`}, a project focused on ${`{project.oneSentencePitch}`}.

The business plan should include:

1. **Executive Summary**
   - Brief overview of ${`{project.name}`}
   - Key value proposition targeting ${`{project.targetAudience}`}

2. **Problem Statement**
   - Detailed analysis of: ${`{project.problemStatement}`}
   - Market need validation

3. **Solution Overview**
   - How ${`{project.uniqueSolution}`} addresses the problem
   - Competitive advantages

4. **Target Market**
   - Primary audience: ${`{project.targetAudience}`}
   - Market size and opportunity

5. **Revenue Model**
   - Monetization strategy
   - Pricing structure

6. **Implementation Timeline**
   - Key milestones
   - Resource requirements

Please provide specific, actionable insights based on the project details.`;

  // Reset form when modal opens/closes or template changes
  React.useEffect(() => {
    if (isOpen && !existingTemplate && !templateName && !promptTemplate) {
      // Pre-fill with example for new templates
      setTemplateName('Business Plan Generator');
      setPromptTemplate(exampleTemplate);
    }
  }, [isOpen, existingTemplate]);

  // Available categories for the dropdown
  const categories = [
    'Custom',
    'Business Strategy',
    'Product Development', 
    'Marketing',
    'Technical Documentation',
    'User Research',
    'Project Planning',
    'Content Creation',
    'Analysis & Insights'
  ];

  const handleSave = async () => {
    // Validate required fields
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }
    
    if (!promptTemplate.trim()) {
      alert('Please enter a prompt template');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newTemplate = {
        id: existingTemplate?.id || `custom_${Date.now()}`,
        name: templateName.trim(),
        category: category,
        description: `Custom template for ${templateName.trim()}`,
        promptTemplate: promptTemplate.trim(),
        isCustom: true,
        createdAt: existingTemplate?.createdAt || new Date().toISOString()
      };

      // Call the parent's save function
      await onSave(newTemplate);
      
      // Reset form and close modal
      handleClose();
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form state
    setTemplateName(existingTemplate?.name || '');
    setCategory(existingTemplate?.category || 'Custom');
    setPromptTemplate(existingTemplate?.promptTemplate || '');
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content max-w-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {existingTemplate ? 'Edit Template' : 'Create New AI Template'}
          </h2>
          <button 
            onClick={handleClose}
            className="modal-close"
            disabled={isSubmitting}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <div className="space-y-6">
          {/* Template Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Template Name *
            </label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g., Product Launch Strategy"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Prompt Template */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Prompt Template *
            </label>
            <textarea
              value={promptTemplate}
              onChange={(e) => setPromptTemplate(e.target.value)}
              placeholder="Enter your prompt template here..."
              rows={8}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              disabled={isSubmitting}
            />
            <div className="mt-2 text-xs text-gray-400 bg-gray-800 rounded-lg p-3">
              <p className="font-medium mb-1">💡 Template Placeholders:</p>
              <div className="space-y-1">
                <p><code className="text-blue-400">${`{project.name}`}</code> - Project name</p>
                <p><code className="text-blue-400">${`{project.oneSentencePitch}`}</code> - Project pitch</p>
                <p><code className="text-blue-400">${`{project.problemStatement}`}</code> - Problem statement</p>
                <p><code className="text-blue-400">${`{project.targetAudience}`}</code> - Target audience</p>
                <p><code className="text-blue-400">${`{project.uniqueSolution}`}</code> - Unique solution</p>
              </div>
              <p className="mt-2 text-gray-500">Example: "Create a marketing strategy for $`{project.name}` targeting $`{project.targetAudience}`"</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-600">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting || !templateName.trim() || !promptTemplate.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <span>{existingTemplate ? 'Update Template' : 'Save Template'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TemplateEditorModal;
