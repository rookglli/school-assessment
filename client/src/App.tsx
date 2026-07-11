import { Navigate, Route, Routes } from 'react-router';

import HomePage from './pages/HomePage';
import SubjectsPage from './pages/SubjectsPage';
import SubjectTopicsPage from './pages/SubjectTopicsPage';
import TestDetailsPage from './pages/TestDetailsPage';
import TestPage from './pages/TestPage';
import ResultsPage from './pages/ResultsPage';

import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/subjects" element={<SubjectsPage />} />

      <Route
        path="/subjects/:subjectId"
        element={<SubjectTopicsPage />}
      />

      <Route
        path="/tests/:testId"
        element={<TestDetailsPage />}
      />

      <Route
        path="/tests/:testId/start"
        element={<TestPage />}
      />

      <Route
        path="/results/:attemptId"
        element={<ResultsPage />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;