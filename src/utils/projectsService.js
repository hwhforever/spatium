import { supabase } from '../supabaseClient';

// Database operations for projects
export const projectsService = {
  // Fetch all projects for the current user
  async fetchUserProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching projects:', error);
        return [];
      }

      // Transform database format to app format
      return data.map(project => ({
        id: project.id,
        name: project.name,
        isSetupComplete: project.is_setup_complete,
        x: project.position_x,
        y: project.position_y,
        // Spread core data if it exists
        ...(project.core || {})
      }));
    } catch (error) {
      console.error('Error in fetchUserProjects:', error);
      return [];
    }
  },

  // Create a new project
  async createProject(projectData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('projects')
        .insert([{
          user_id: user.id,
          name: projectData.name,
          is_setup_complete: projectData.isSetupComplete || false,
          position_x: projectData.x || 30,
          position_y: projectData.y || 30,
          core: projectData.core || {}
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating project:', error);
        throw error;
      }

      // Transform database format to app format
      return {
        id: data.id,
        name: data.name,
        isSetupComplete: data.is_setup_complete,
        x: data.position_x,
        y: data.position_y,
        ...(data.core || {})
      };
    } catch (error) {
      console.error('Error in createProject:', error);
      throw error;
    }
  },

  // Update an existing project
  async updateProject(projectId, updateData) {
    try {
      // Prepare the update object
      const dbUpdateData = {};
      
      if (updateData.name !== undefined) dbUpdateData.name = updateData.name;
      if (updateData.isSetupComplete !== undefined) dbUpdateData.is_setup_complete = updateData.isSetupComplete;
      if (updateData.x !== undefined) dbUpdateData.position_x = updateData.x;
      if (updateData.y !== undefined) dbUpdateData.position_y = updateData.y;
      
      // Handle core data update
      if (updateData.oneSentencePitch || updateData.problemStatement || updateData.targetAudience || updateData.uniqueSolution) {
        const coreData = {};
        if (updateData.oneSentencePitch) coreData.oneSentencePitch = updateData.oneSentencePitch;
        if (updateData.problemStatement) coreData.problemStatement = updateData.problemStatement;
        if (updateData.targetAudience) coreData.targetAudience = updateData.targetAudience;
        if (updateData.uniqueSolution) coreData.uniqueSolution = updateData.uniqueSolution;
        
        dbUpdateData.core = coreData;
      }

      dbUpdateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('projects')
        .update(dbUpdateData)
        .eq('id', projectId)
        .select()
        .single();

      if (error) {
        console.error('Error updating project:', error);
        throw error;
      }

      // Transform database format to app format
      return {
        id: data.id,
        name: data.name,
        isSetupComplete: data.is_setup_complete,
        x: data.position_x,
        y: data.position_y,
        ...(data.core || {})
      };
    } catch (error) {
      console.error('Error in updateProject:', error);
      throw error;
    }
  },

  // Delete a project
  async deleteProject(projectId) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        console.error('Error deleting project:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteProject:', error);
      throw error;
    }
  },

  // Update project positions (for drag and drop)
  async updateProjectPositions(projectUpdates) {
    try {
      const updates = projectUpdates.map(update => 
        supabase
          .from('projects')
          .update({ 
            position_x: update.x, 
            position_y: update.y,
            updated_at: new Date().toISOString()
          })
          .eq('id', update.id)
      );

      await Promise.all(updates);
      return true;
    } catch (error) {
      console.error('Error updating project positions:', error);
      throw error;
    }
  }
};
