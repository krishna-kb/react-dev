import React from 'react';
import type { Task } from '../types';
import TaskItem from './TaskItem';

interface TerminalProps {
  tasks: Task[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const Terminal: React.FC<TerminalProps> = ({ tasks, searchTerm, onSearchChange }) => {
  return (
    <div className="main-content">
      <input
        type="search"
        className="log-search"
        placeholder="Search all logs..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} searchTerm={searchTerm} />
      ))}
    </div>
  );
};

export default Terminal;
