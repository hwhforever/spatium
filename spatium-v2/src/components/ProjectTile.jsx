import { useState, useEffect } from 'react';

function ProjectTile({ project, onDragStart, onDrag, onDragEnd, isDragging, onSelect, onContextMenu }) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStartTime, setDragStartTime] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left mouse button
    
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setDragStartTime(Date.now());
    setHasDragged(false);
    onDragStart(project.id, { x: offsetX, y: offsetY });
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    onContextMenu(project, { x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    // Mark that we've dragged if mouse moved significantly
    if (!hasDragged) {
      setHasDragged(true);
    }
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Constrain within viewport bounds
    const maxX = window.innerWidth - 150; // tile width
    const maxY = window.innerHeight - 150; // tile height
    
    const constrainedX = Math.max(0, Math.min(newX, maxX));
    const constrainedY = Math.max(0, Math.min(newY, maxY));
    
    onDrag(project.id, { x: constrainedX, y: constrainedY });
  };

  const handleMouseUp = () => {
    const dragDuration = Date.now() - dragStartTime;
    
    // If it was a quick click without dragging, treat it as a selection
    if (dragDuration < 200 && !hasDragged) {
      onSelect(project);
    }
    
    onDragEnd();
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, dragStartTime, hasDragged]);

  return (
    <div 
      className={`project-tile w-[150px] h-[150px] rounded-3xl flex flex-col items-center justify-center p-4 ${isDragging ? 'dragging' : ''}`}
      style={{
        left: `${project.x}px`,
        top: `${project.y}px`,
      }}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
    >
      {/* Icon Placeholder */}
      <div className="icon-placeholder w-12 h-12 rounded-xl mb-3 flex items-center justify-center">
        <svg 
          className="w-6 h-6 text-gray-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
          />
        </svg>
      </div>
      
      {/* Project Name */}
      <span className="text-white text-sm font-medium text-center leading-tight">
        {project.name}
      </span>
    </div>
  );
}

export default ProjectTile;
