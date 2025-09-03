import { useState, useEffect } from 'react';
import TemplateLibrary from './TemplateLibrary';
import TemplateEditorModal from './TemplateEditorModal';
import { loadCustomTemplatesFromLocalStorage, addCustomTemplate } from '../utils/localStorage';

function ProjectView({ project, onGoBack, onSignOut }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customTemplates, setCustomTemplates] = useState([]);
  const [isTemplateEditorOpen, setIsTemplateEditorOpen] = useState(false);

  // Load custom templates from localStorage on component mount
  useEffect(() => {
    const savedTemplates = loadCustomTemplatesFromLocalStorage();
    setCustomTemplates(savedTemplates);
  }, []);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    
    // Generate pre-filled prompt using project core data
    if (template.promptTemplate) {
      // Create a function to safely replace template literals
      const generatePrompt = (templateStr, projectData) => {
        try {
          // Use a function to replace template literal syntax
          return templateStr.replace(/\$\{([^}]+)\}/g, (match, expression) => {
            // Safely evaluate simple property access
            if (expression.includes('project.name')) {
              return projectData.name || 'Untitled Project';
            } else if (expression.includes('project.oneSentencePitch')) {
              return projectData.oneSentencePitch || 'a new project';
            } else if (expression.includes('project.problemStatement')) {
              return projectData.problemStatement || 'Various user needs and market opportunities';
            } else if (expression.includes('project.targetAudience')) {
              return projectData.targetAudience || 'General users';
            } else if (expression.includes('project.uniqueSolution')) {
              return projectData.uniqueSolution || 'Innovative features and user experience';
            }
            return match; // Return original if no match found
          });
        } catch (error) {
          console.error('Error generating prompt:', error);
          return `Generate content for the ${template.name} template based on the project "${projectData.name}".`;
        }
      };
      
      const preFilledPrompt = generatePrompt(template.promptTemplate, project);
      setUserInput(preFilledPrompt);
    } else {
      // Fallback for templates without promptTemplate
      setUserInput(`Generate content for the ${template.name} template based on the project "${project.name}".`);
    }
    
    // Clear any previous generated content
    setGeneratedContent('');
  };

  const handleCreateTemplate = () => {
    setIsTemplateEditorOpen(true);
  };

  const handleSaveTemplate = async (newTemplate) => {
    const savedTemplate = addCustomTemplate(newTemplate);
    const updatedTemplates = loadCustomTemplatesFromLocalStorage();
    setCustomTemplates(updatedTemplates);
    setIsTemplateEditorOpen(false);
    
    // Optionally select the newly created template
    setSelectedTemplate(savedTemplate);
  };

  const handleGenerate = async () => {
    if (selectedTemplate && userInput.trim()) {
      // Set loading state and clear previous content
      setIsGenerating(true);
      setGeneratedContent('');
      
      try {
        // Make direct fetch call to our backend endpoint
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            prompt: userInput.trim()
          }),
        });

        // Parse the response
        const data = await response.json();

        // Handle error responses
        if (!response.ok) {
          throw new Error(data.message || `API error: ${response.status}`);
        }

        // Get the AI-generated text from the response
        const aiResponse = data.text;
        
        // Format the response with template context
        const formattedResponse = `🤖 **AI-Generated ${selectedTemplate.name}**

${aiResponse}

---

This response was generated using advanced AI analysis of your project requirements and the specific template context. You can use this as a starting point and customize it further based on your specific needs and goals.`;
        
        setGeneratedContent(formattedResponse);
        
      } catch (error) {
        console.error('AI generation error:', error);
        
        // Fallback to template response on error
        const fallbackResponse = `⚠️ **AI Service Temporarily Unavailable**

${generateTemplateResponse(selectedTemplate, project, userInput)}

---

We encountered an issue connecting to the AI service: ${error.message}. Here's a template-based response instead. Please try again later for AI-powered content generation.`;
        
        setGeneratedContent(fallbackResponse);
      } finally {
        // Always set loading to false when done
        setIsGenerating(false);
      }
    }
  };

  // Helper function to generate template-specific responses
  const generateTemplateResponse = (template, project) => {
    const responses = {
      'Product Roadmap Generator': `🚀 **6-Month Product Roadmap for ${project.name}**

**Phase 1 (Months 1-2): Foundation & Core Features**
• MVP development with essential functionality addressing: ${project.problemStatement || 'core user needs'}
• User authentication and onboarding flow
• Basic analytics implementation
• Initial user testing with ${project.targetAudience || 'target audience'}

**Phase 2 (Months 3-4): Enhancement & Scaling** 
• Advanced feature rollout leveraging: ${project.uniqueSolution || 'key differentiators'}
• Performance optimization and scaling infrastructure
• Customer feedback integration and iterative improvements
• Partnership and integration opportunities

**Phase 3 (Months 5-6): Market Expansion**
• Advanced analytics and reporting capabilities
• Multi-platform expansion strategy
• Revenue optimization and monetization features
• Market penetration analysis and growth metrics

**Success Metrics:**
• User acquisition: 10,000+ active users
• Retention rate: 70%+ monthly active users
• Customer satisfaction: 4.5+ star rating
• Revenue targets: $50K+ monthly recurring revenue`,

      'Market Research Assistant': `📊 **Comprehensive Market Analysis for ${project.name}**

**Market Size & Opportunity:**
The market addressing "${project.problemStatement || 'similar challenges'}" is estimated at $2.5B+ globally, with 15% annual growth driven by increasing demand for solutions targeting ${project.targetAudience || 'similar user segments'}.

**Competitive Landscape:**
• 3 major incumbents with 60% market share
• 12+ emerging startups with innovative approaches
• Gap identified: ${project.uniqueSolution || 'differentiated value proposition'} represents underserved market segment

**Target Customer Analysis:**
Primary segment: ${project.targetAudience || 'Defined user base'}
• Pain points: High demand for solutions addressing core problems
• Spending power: $500-2000 annual budget for related solutions
• Decision factors: Quality, ease of use, and proven ROI

**Go-to-Market Recommendations:**
1. Direct-to-consumer digital marketing focusing on problem-solution fit
2. Strategic partnerships with complementary service providers
3. Content marketing emphasizing unique value proposition
4. Freemium model to drive adoption and convert to paid tiers`,

      // Add more template responses here as needed
    };

    return responses[template.name] || `Here's a comprehensive analysis for your ${template.name} request:

This AI-generated response addresses your specific needs for "${project.name}" by leveraging the context you provided about ${project.problemStatement || 'your project challenges'}.

Key recommendations include:
• Strategic approach tailored to ${project.targetAudience || 'your target audience'}
• Implementation of ${project.uniqueSolution || 'your unique solutions'}
• Measurable outcomes and success metrics
• Next steps for immediate implementation

The analysis incorporates industry best practices while considering your specific project requirements and constraints.`;
  };

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
            
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-white">{project.name}</h1>
          </div>
          
          <button
            onClick={onSignOut}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex-1 flex">
        {/* Left Column - Template Library */}
        <TemplateLibrary 
          selectedTemplate={selectedTemplate}
          onTemplateSelect={handleTemplateSelect}
          onCreateTemplate={handleCreateTemplate}
          customTemplates={customTemplates}
        />

        {/* Right Column - Template Details & AI Generation */}
        <div className="flex-1 p-8">
          {selectedTemplate ? (
            <div className="h-full flex flex-col">
              {/* Template Header */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-4">
                  {selectedTemplate.name}
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {selectedTemplate.description}
                </p>
              </div>
              
              {/* AI Generation Interface */}
              <div className="flex-1 flex flex-col space-y-6">
                {/* Generated Content Output Area */}
                <div className="flex-1 min-h-0">
                  <h3 className="text-lg font-semibold text-white mb-3">Generated Output</h3>
                  <div className="h-full bg-gray-800 bg-opacity-50 border border-gray-600 rounded-xl p-4 overflow-y-auto">
                    {isGenerating ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                          <div className="text-blue-400 font-medium">Generating...</div>
                          <div className="text-gray-500 text-sm mt-2">AI is analyzing your prompt and creating a response</div>
                        </div>
                      </div>
                    ) : generatedContent ? (
                      <div className="text-gray-300 whitespace-pre-wrap">
                        {generatedContent}
                      </div>
                    ) : (
                      <div className="text-gray-500 italic">
                        {selectedTemplate 
                          ? "Generated content will appear here after you review the pre-filled prompt and click Generate..."
                          : "Select a template from the left to auto-generate a customized prompt based on your project core data..."
                        }
                      </div>
                    )}
                  </div>
                </div>
                
                {/* User Input Area */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Your Input</h3>
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={selectedTemplate ? `Template loaded! Review and edit the pre-filled ${selectedTemplate.name} prompt...` : `Select a template to auto-generate a customized prompt...`}
                    className="w-full h-32 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  
                  {/* Generate Button */}
                  <button 
                    onClick={handleGenerate}
                    disabled={!userInput.trim() || isGenerating}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center space-x-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Generate</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-400 mb-2">
                  Select a template to get started
                </h3>
                <p className="text-gray-500">
                  Choose a template from the list to auto-generate a customized prompt using your project core data.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Template Editor Modal */}
      <TemplateEditorModal
        isOpen={isTemplateEditorOpen}
        onClose={() => setIsTemplateEditorOpen(false)}
        onSave={handleSaveTemplate}
      />
    </div>
  );
}

export default ProjectView;
