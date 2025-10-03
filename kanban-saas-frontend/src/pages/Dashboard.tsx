import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import KanbanBoard from '../components/board/KanbanBoard';
import TeamManagement from '../components/layout/TeamManagement';

const Dashboard = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<KanbanBoard />} />
        <Route path="/teams" element={<TeamManagement />} />
      </Routes>
    </MainLayout>
  );
};

export default Dashboard;