import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/user.context';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
    const { user } = useContext(UserContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch projects on mount
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get('/projects/all');
                // Ensure projects is an array and filter out invalid entries
                const fetchedProjects = Array.isArray(res.data.projects) ? res.data.projects.filter(p => p && p._id) : [];
                setProjects(fetchedProjects);
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError('Failed to load projects. Please try again.');
                setProjects([]); // Reset to empty array on error
            }
        };
        fetchProjects();
    }, []);

    // Create a new project
    const createProject = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await axios.post('/projects/create', { name: projectName });
            // Handle different possible response structures
            const newProject = res.data.project || res.data;
            if (!newProject || !newProject._id) {
                throw new Error('Invalid project data received');
            }
            setProjects([...projects, newProject]);
            setProjectName('');
            setIsModalOpen(false);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error creating project. Please try again.';
            setError(errorMessage);
            console.error('Error creating project:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle project card click
    const handleProjectClick = (project) => {
        navigate('/project', { state: { project } });
    };

    return (
        <main className="p-6 min-h-screen bg-gradient-to-br from-purple-700 to-blue-500 text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Projects</h1>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow-md hover:bg-blue-200 transition-all"
                >
                    + New Project
                </motion.button>
            </div>

            {error && !isModalOpen && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {projects.length > 0 ? (
                    projects.map((project) => (
                        project ? ( // Check if project is defined
                            <motion.div
                                key={project._id}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white text-gray-800 p-4 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg"
                                onClick={() => handleProjectClick(project)}
                            >
                                <h2 className="text-xl font-semibold">{project.name || 'Unnamed Project'}</h2>
                                <p className="text-gray-600 mt-2">Collaborators: {project.users?.length || 0}</p>
                            </motion.div>
                        ) : null
                    ))
                ) : (
                    <p className="text-gray-300">No projects found. Create one to get started!</p>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-white p-6 rounded-lg shadow-lg w-96 text-gray-800"
                    >
                        <h2 className="text-2xl font-semibold mb-4">Create New Project</h2>
                        <form onSubmit={createProject}>
                            {error && (
                                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
                                    {error}
                                </div>
                            )}
                            <input
                                type="text"
                                placeholder="Project Name"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                                required
                                disabled={isLoading}
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-all"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all flex items-center justify-center"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                                    ) : (
                                        'Create'
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </main>
    );
};

export default Home;