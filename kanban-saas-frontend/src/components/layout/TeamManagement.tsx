import { useState, useEffect } from 'react';
import { teamService } from '../../services/api';

interface Team {
  id: string;
  name: string;
  description: string;
}

const TeamManagement = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        // For demo purposes, create mock data
        setTeams([
          { id: '1', name: 'Engineering', description: 'Software development team' },
          { id: '2', name: 'Marketing', description: 'Marketing and sales team' },
          { id: '3', name: 'Design', description: 'UI/UX design team' }
        ]);
        
        // In a real app, we would fetch from API:
        // const { data } = await teamService.getTeams();
        // setTeams(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load teams');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTeamName.trim()) return;
    
    try {
      // For demo purposes, create mock data
      const newTeam = {
        id: Date.now().toString(),
        name: newTeamName,
        description: newTeamDescription
      };
      
      setTeams([...teams, newTeam]);
      setNewTeamName('');
      setNewTeamDescription('');
      
      // In a real app, we would call the API:
      // await teamService.createTeam(newTeamName, newTeamDescription);
      // const { data } = await teamService.getTeams();
      // setTeams(data);
    } catch (err: any) {
      setError(err.message || 'Failed to create team');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {teams.map(team => (
            <li key={team.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-primary-600 truncate">{team.name}</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <button className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Manage
                    </button>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {team.description}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-white shadow sm:rounded-md sm:overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Team</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Create a new team to collaborate with your colleagues.</p>
          </div>
          <form onSubmit={handleCreateTeam} className="mt-5 sm:flex sm:items-center">
            <div className="w-full sm:max-w-xs">
              <label htmlFor="team-name" className="sr-only">Team Name</label>
              <input
                type="text"
                name="team-name"
                id="team-name"
                className="input"
                placeholder="Team Name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
            </div>
            <div className="w-full sm:max-w-xs mt-3 sm:mt-0 sm:ml-3">
              <label htmlFor="team-description" className="sr-only">Team Description</label>
              <input
                type="text"
                name="team-description"
                id="team-description"
                className="input"
                placeholder="Team Description"
                value={newTeamDescription}
                onChange={(e) => setNewTeamDescription(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;