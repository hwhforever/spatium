import { useState, useEffect } from 'react';

function RenameModal({ isOpen, onClose, onRename, currentName }) {
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    if (isOpen && currentName) {
      setProjectName(currentName);
    }
  }, [isOpen, currentName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectName.trim() && projectName.trim() !== currentName) {
      onRename(projectName.trim());
      setProjectName('');
    }
  };

  const handleClose = () => {
    setProjectName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-6">Rename Project</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="renameProjectName" className="block text-sm font-medium text-gray-300 mb-2">
              Project Name
            </label>
            <input
              type="text"
              id="renameProjectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter new project name..."
              className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              autoFocus
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={!projectName.trim() || projectName.trim() === currentName}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              Rename
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RenameModal;
