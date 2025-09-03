import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ProjectView from './components/ProjectView';
import ProjectCoreWizard from './components/ProjectCoreWizard';
import ProjectModal from './components/ProjectModal';
import Auth from './components/Auth';
import { supabase, authHelpers } from './supabaseClient';
import { projectsService } from './utils/projectsService';

function App() {
  // Authentication state
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Existing app state
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  // Grid configuration
  const GRID_SIZE = 180; // 150px tile + 30px spacing
  const MARGIN = 30; // Margin from screen edges

  // Load projects from Supabase when user is authenticated
  const loadUserProjects = async () => {
    if (!user) return;
    
    setProjectsLoading(true);
    try {
      const userProjects = await projectsService.fetchUserProjects();
      setProjects(userProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setProjectsLoading(false);
    }
  };

  // Initialize authentication
  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setAuthLoading(false);

          // Load projects if user is already logged in
          if (session?.user) {
            const userProjects = await projectsService.fetchUserProjects();
            setProjects(userProjects);
          }
        }
      } catch (error) {
        console.error('Error getting session:', error);
        if (mounted) {
          setAuthLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setAuthLoading(false);

          // Load projects when user logs in
          if (session?.user) {
            const userProjects = await projectsService.fetchUserProjects();
            setProjects(userProjects);
          } else {
            // Clear projects when user logs out
            setProjects([]);
          }

          // Log auth events for debugging
          console.log('Auth event:', event, 'User:', session?.user?.email);
        }
      }
    );

    // Cleanup function
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
  };

  const handleGoBack = () => {
    setSelectedProject(null);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateProject = async (projectName) => {
    try {
      // Calculate position for new project
      const cols = Math.floor((window.innerWidth - 2 * MARGIN) / GRID_SIZE);
      const currentProjectCount = projects.length;
      const col = currentProjectCount % cols;
      const row = Math.floor(currentProjectCount / cols);
      const position = {
        x: MARGIN + col * GRID_SIZE,
        y: MARGIN + row * GRID_SIZE
      };

      // Create new project in database
      const newProject = await projectsService.createProject({
        name: projectName,
        isSetupComplete: false,
        ...position
      });

      // Add to local state
      setProjects(prevProjects => [...prevProjects, newProject]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating project:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleCompleteSetup = async (projectId, setupData) => {
    try {
      // Update project in database
      const updatedProject = await projectsService.updateProject(projectId, {
        isSetupComplete: true,
        oneSentencePitch: setupData.oneSentencePitch,
        problemStatement: setupData.problemStatement,
        targetAudience: setupData.targetAudience,
        uniqueSolution: setupData.uniqueSolution
      });

      // Update local state
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project.id === projectId ? updatedProject : project
        )
      );
    } catch (error) {
      console.error('Error completing project setup:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleSignOut = async () => {
    try {
      await authHelpers.signOut();
      // User state will be cleared by the auth state change listener
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {authLoading ? (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      ) : !user ? (
        <Auth />
      ) : (
        <>
          {selectedProject ? (
            selectedProject.isSetupComplete ? (
              <ProjectView 
                project={selectedProject} 
                onGoBack={handleGoBack} 
                onSignOut={handleSignOut}
              />
            ) : (
              <ProjectCoreWizard 
                project={selectedProject}
                onGoBack={handleGoBack}
                onCompleteSetup={handleCompleteSetup}
              />
            )
          ) : (
            <Dashboard 
              onProjectSelect={handleProjectSelect} 
              onOpenModal={handleOpenModal}
              projects={projects}
              setProjects={setProjects}
              onSignOut={handleSignOut}
            />
          )}
          <ProjectModal 
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onCreateProject={handleCreateProject}
          />
        </>
      )}
    </>
  );
}

export default App;
