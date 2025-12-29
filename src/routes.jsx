import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/shared/protectedRoute';
import TryRefresh from './components/shared/TryRefresh';
import MainLayout from './pages/mainLayout.page';
import LoginPage from './pages/login.page.jsx';
import Dashboard from './pages/dashboard.page';
import GaragePage from './pages/garage.page';
import OffresPage from './pages/offres.page';
import DemandesPage from './pages/demandes.page';
import ContratsPage from './pages/contrats.page';
import DepensesPage from './pages/depenses.page';
import ClientsPage from './pages/clients.page.jsx';
import HistoriquePage from './pages/historique.page.jsx';
import NotFound from './pages/util.pages/notfound.page.jsx';
import PerformancePage from './pages/performance.page.jsx'; 
import PerformanceAcess from './components/shared/PerformanceAccess.jsx';
import ArchivePage from './pages/archive.page.jsx';
import DownPage from './pages/util.pages/down.page.jsx';
// Example placeholder components

const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/login" element={<TryRefresh><LoginPage /></TryRefresh>} />
            <Route path="/" element={<Navigate to="/dashboard" replace/>} />
            <Route path='/dashboard' element={<ProtectedRoute> <MainLayout/> </ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="garage" element={<GaragePage />} />
                <Route path="offres" element={<OffresPage />} />
                <Route path="demandes" element={<DemandesPage/>} />
                <Route path="contrats" element={<ContratsPage/>} />
                <Route path='depenses' element={<DepensesPage/>} />
                <Route path='partenaires' element={<ClientsPage/>} />
                <Route path='journal' element={<HistoriquePage/>} />
                <Route path='performance' element={<PerformanceAcess> <PerformancePage/> </PerformanceAcess>} />
                <Route path='archive' element={<ArchivePage/>} />
            </Route>
            <Route path="/down" element={<TryRefresh><DownPage /></TryRefresh>} />
            <Route path="*" element={<NotFound/>} />
        </Routes>
    </Router>
);

export default AppRoutes;