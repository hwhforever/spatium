import { useState, useEffect } from 'react';
import ProjectTile from './ProjectTile';
import NewProjectTile from './NewProjectTile';
import ThemeSelector from './ThemeSelector';
import ContextMenu from './ContextMenu';
import RenameModal from './RenameModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { projectsService } from '../utils/projectsService';

function Dashboard({ onProjectSelect, onOpenModal, projects, setProjects, onSignOut }) {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [draggedItemId, setDraggedItemId] = useState(null);
  const [contextMenu, setContextMenu] = useState({ isOpen: false, position: { x: 0, y: 0 }, project: null });
  const [renameModal, setRenameModal] = useState({ isOpen: false, project: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, project: null });

  // Grid configuration
  const GRID_SIZE = 180; // 150px tile + 30px spacing
  const MARGIN = 30; // Margin from screen edges

  // Helper function to snap coordinates to grid
  const snapToGrid = (x, y) => {
    const gridX = Math.round((x - MARGIN) / GRID_SIZE) * GRID_SIZE + MARGIN;
    const gridY = Math.round((y - MARGIN) / GRID_SIZE) * GRID_SIZE + MARGIN;
    
    // Ensure coordinates stay within viewport bounds
    const maxX = window.innerWidth - 150 - MARGIN;
    const maxY = window.innerHeight - 150 - MARGIN;
    
    return {
      x: Math.max(MARGIN, Math.min(gridX, maxX)),
      y: Math.max(MARGIN, Math.min(gridY, maxY))
    };
  };

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    document.body.className = `theme-${theme}`;
  };

  const handleDragStart = (itemId, offset) => {
    setDraggedItemId(itemId);
  };

  const handleDrag = (itemId, position) => {
    // During drag, allow free movement (don't snap yet)
    const maxX = window.innerWidth - 150;
    const maxY = window.innerHeight - 150;
    
    const constrainedPosition = {
      x: Math.max(0, Math.min(position.x, maxX)),
      y: Math.max(0, Math.min(position.y, maxY))
    };

    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === itemId 
          ? { ...project, ...constrainedPosition }
          : project
      )
    );
  };

  const handleDragEnd = async () => {
    if (draggedItemId) {
      // Snap to grid when drag ends
      let updatedProject = null;
      setProjects(prevProjects => 
        prevProjects.map(project => {
          if (project.id === draggedItemId) {
            const snappedPosition = snapToGrid(project.x, project.y);
            updatedProject = { ...project, ...snappedPosition };
            return updatedProject;
          }
          return project;
        })
      );

      // Save position to database
      if (updatedProject) {
        try {
          await projectsService.updateProject(draggedItemId, {
            x: updatedProject.x,
            y: updatedProject.y
          });
        } catch (error) {
          console.error('Error updating project position:', error);
        }
      }
    }
    setDraggedItemId(null);
  };

  const handleContextMenu = (project, position) => {
    setContextMenu({ isOpen: true, position, project });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ isOpen: false, position: { x: 0, y: 0 }, project: null });
  };

  const handleRename = () => {
    setRenameModal({ isOpen: true, project: contextMenu.project });
    handleCloseContextMenu();
  };

  const handleDelete = () => {
    setDeleteModal({ isOpen: true, project: contextMenu.project });
    handleCloseContextMenu();
  };

  const handleRenameProject = async (newName) => {
    if (renameModal.project) {
      try {
        await projectsService.updateProject(renameModal.project.id, { name: newName });
        setProjects(prevProjects =>
          prevProjects.map(project =>
            project.id === renameModal.project.id
              ? { ...project, name: newName }
              : project
          )
        );
      } catch (error) {
        console.error('Error renaming project:', error);
        // You might want to show an error message to the user here
      }
    }
    setRenameModal({ isOpen: false, project: null });
  };

  const handleDeleteProject = async () => {
    if (deleteModal.project) {
      try {
        await projectsService.deleteProject(deleteModal.project.id);
        setProjects(prevProjects =>
          prevProjects.filter(project => project.id !== deleteModal.project.id)
        );
      } catch (error) {
        console.error('Error deleting project:', error);
        // You might want to show an error message to the user here
      }
    }
    setDeleteModal({ isOpen: false, project: null });
  };

  // Set initial theme on component mount
  useEffect(() => {
    document.body.className = `theme-${currentTheme}`;
  }, []);

  // Handle window resize to reposition tiles to new grid
  useEffect(() => {
    const handleResize = () => {
      setProjects(prevProjects => 
        prevProjects.map(project => {
          const snappedPosition = snapToGrid(project.x, project.y);
          return { ...project, ...snappedPosition };
        })
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setProjects]);

  // Calculate position for new project tile (next available grid position)
  const getNewProjectTilePosition = () => {
    const cols = Math.floor((window.innerWidth - 2 * MARGIN) / GRID_SIZE);
    
    if (projects.length === 0) {
      // If no projects, place at first grid position
      return {
        x: MARGIN,
        y: MARGIN
      };
    }
    
    // Find the rightmost and bottommost occupied positions
    let maxRow = 0;
    let maxColInBottomRow = -1;
    
    projects.forEach(project => {
      const col = Math.round((project.x - MARGIN) / GRID_SIZE);
      const row = Math.round((project.y - MARGIN) / GRID_SIZE);
      
      if (row > maxRow) {
        maxRow = row;
        maxColInBottomRow = col;
      } else if (row === maxRow && col > maxColInBottomRow) {
        maxColInBottomRow = col;
      }
    });
    
    // Calculate next position
    let nextCol = maxColInBottomRow + 1;
    let nextRow = maxRow;
    
    // If we exceed the number of columns, wrap to next row
    if (nextCol >= cols) {
      nextCol = 0;
      nextRow = maxRow + 1;
    }
    
    return {
      x: MARGIN + nextCol * GRID_SIZE,
      y: MARGIN + nextRow * GRID_SIZE
    };
  };

  return (
    <>
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={onSignOut}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
      <ThemeSelector 
        currentTheme={currentTheme} 
        onThemeChange={handleThemeChange} 
      />
      <div className="dashboard-container">
        {projects.map(project => (
          <ProjectTile 
            key={project.id} 
            project={project}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            isDragging={draggedItemId === project.id}
            onSelect={onProjectSelect}
            onContextMenu={handleContextMenu}
          />
        ))}
        <NewProjectTile 
          onCreateNew={onOpenModal}
          position={getNewProjectTilePosition()}
        />
      </div>
      
      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        onClose={handleCloseContextMenu}
        onRename={handleRename}
        onDelete={handleDelete}
      />
      
      <RenameModal
        isOpen={renameModal.isOpen}
        onClose={() => setRenameModal({ isOpen: false, project: null })}
        onRename={handleRenameProject}
        currentName={renameModal.project?.name || ''}
      />
      
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, project: null })}
        onDelete={handleDeleteProject}
        projectName={deleteModal.project?.name || ''}
      />
    </>
  );
}

export default Dashboard;
