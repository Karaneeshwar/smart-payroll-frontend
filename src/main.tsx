import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import EmployeeForm from '../../admin-front/src/pages/addEmployee';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);