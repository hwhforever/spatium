// Helper functions for localStorage persistence
export const saveProjectsToLocalStorage = (projects) => {
  try {
    localStorage.setItem('spatium_projects', JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to save projects to localStorage:', error);
  }
};

export const loadProjectsFromLocalStorage = () => {
  try {
    const savedProjects = localStorage.getItem('spatium_projects');
    if (savedProjects) {
      return JSON.parse(savedProjects);
    }
  } catch (error) {
    console.error('Failed to load projects from localStorage:', error);
  }
  
  // Return default projects if no saved data or error occurred
  return getDefaultProjects();
};

export const getDefaultProjects = () => {
  // Helper function to get initial grid positions
  const getInitialGridPositions = () => {
    const positions = [];
    const GRID_SIZE = 180; // 150px tile + 30px spacing
    const MARGIN = 30; // Margin from screen edges
    const cols = Math.floor((window.innerWidth - 2 * MARGIN) / GRID_SIZE);
    
    for (let i = 0; i < 10; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = MARGIN + col * GRID_SIZE;
      const y = MARGIN + row * GRID_SIZE;
      positions.push({ x, y });
    }
    
    return positions;
  };

  const initialPositions = getInitialGridPositions();
  return [
    { id: 1, name: 'Spatium', isSetupComplete: true, ...initialPositions[0] },
    { id: 2, name: 'AI Voice App', isSetupComplete: true, ...initialPositions[1] },
    { id: 3, name: 'Fitness Tracker', isSetupComplete: true, ...initialPositions[2] },
    { id: 4, name: 'Personal Website', isSetupComplete: true, ...initialPositions[3] },
    { id: 5, name: 'Marketing Blog', isSetupComplete: true, ...initialPositions[4] },
    { id: 6, name: 'E-commerce Store', isSetupComplete: true, ...initialPositions[5] },
    { id: 7, name: 'Weather Dashboard', isSetupComplete: true, ...initialPositions[6] },
    { id: 8, name: 'Task Manager', isSetupComplete: true, ...initialPositions[7] },
    { id: 9, name: 'Photo Gallery', isSetupComplete: true, ...initialPositions[8] },
    { id: 10, name: 'Music Player', isSetupComplete: true, ...initialPositions[9] }
  ];
};

// Template management functions
export const saveCustomTemplatesToLocalStorage = (templates) => {
  try {
    localStorage.setItem('spatium_custom_templates', JSON.stringify(templates));
  } catch (error) {
    console.error('Failed to save custom templates to localStorage:', error);
  }
};

export const loadCustomTemplatesFromLocalStorage = () => {
  try {
    const savedTemplates = localStorage.getItem('spatium_custom_templates');
    if (savedTemplates) {
      return JSON.parse(savedTemplates);
    }
  } catch (error) {
    console.error('Failed to load custom templates from localStorage:', error);
  }
  
  return [];
};

export const addCustomTemplate = (template) => {
  const existingTemplates = loadCustomTemplatesFromLocalStorage();
  const newTemplate = {
    ...template,
    id: template.id || `custom_${Date.now()}`,
    isCustom: true,
    createdAt: template.createdAt || new Date().toISOString()
  };
  
  const updatedTemplates = [...existingTemplates, newTemplate];
  saveCustomTemplatesToLocalStorage(updatedTemplates);
  return newTemplate;
};

export const updateCustomTemplate = (templateId, updates) => {
  const existingTemplates = loadCustomTemplatesFromLocalStorage();
  const updatedTemplates = existingTemplates.map(template => 
    template.id === templateId ? { ...template, ...updates } : template
  );
  
  saveCustomTemplatesToLocalStorage(updatedTemplates);
  return updatedTemplates.find(t => t.id === templateId);
};

export const deleteCustomTemplate = (templateId) => {
  const existingTemplates = loadCustomTemplatesFromLocalStorage();
  const updatedTemplates = existingTemplates.filter(template => template.id !== templateId);
  saveCustomTemplatesToLocalStorage(updatedTemplates);
  return updatedTemplates;
};
