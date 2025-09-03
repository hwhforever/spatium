import { templateLibrary } from '../utils/templateLibrary';

function TemplateLibrary({ selectedTemplate, onTemplateSelect, onCreateTemplate, customTemplates = [] }) {
  return (
    <div className="w-1/3 border-r border-white border-opacity-10 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">AI Template Library</h2>
        <button
          onClick={onCreateTemplate}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-200 flex items-center space-x-1"
          title="Create New Template"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New</span>
        </button>
      </div>
      
      {/* Custom Templates Section */}
      {customTemplates.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
            Custom Templates
          </h3>
          <div className="space-y-2">
            {customTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => onTemplateSelect(template)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 relative group ${
                  selectedTemplate?.id === template.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-white hover:bg-opacity-5 hover:text-white'
                }`}
              >
                <div className="font-medium text-sm pr-8">{template.name}</div>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs bg-green-600 px-1.5 py-0.5 rounded text-white">
                    Custom
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Built-in Templates */}
      {Object.entries(templateLibrary).map(([category, templates]) => (
        <div key={category} className="mb-8">
          {/* Category Header */}
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
            {category}
          </h3>
          
          {/* Template List */}
          <div className="space-y-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => onTemplateSelect(template)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                  selectedTemplate?.id === template.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-white hover:bg-opacity-5 hover:text-white'
                }`}
              >
                <div className="font-medium text-sm">{template.name}</div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TemplateLibrary;
