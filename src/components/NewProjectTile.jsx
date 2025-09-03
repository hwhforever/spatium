function NewProjectTile({ onCreateNew, position }) {
  return (
    <div 
      className="project-tile new-project-tile w-[150px] h-[150px] rounded-3xl flex flex-col items-center justify-center p-4 cursor-pointer"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onClick={onCreateNew}
    >
      {/* Plus Icon */}
      <div className="w-12 h-12 rounded-xl mb-3 flex items-center justify-center">
        <svg 
          className="w-8 h-8 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 4v16m8-8H4" 
          />
        </svg>
      </div>
      
      {/* Label */}
      <span className="text-gray-400 text-sm font-medium text-center leading-tight">
        New Project
      </span>
    </div>
  );
}

export default NewProjectTile;
