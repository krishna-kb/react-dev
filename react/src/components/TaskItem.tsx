import React, { useState, useEffect, useRef } from 'react';
import type { Task } from '../types';

interface TaskItemProps {
  task: Task;
  searchTerm: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, searchTerm }) => {
  const outputRef = useRef<HTMLPreElement>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isExpanded && outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [task.output, isExpanded]);

  useEffect(() => {
    if (task.status === 'Running' && task.startTime) {
      const interval = setInterval(() => {
        setElapsedTime(Date.now() - (task.startTime ?? 0));
      }, 50); // Update every 50ms for a smoother timer

      return () => clearInterval(interval);
    }
  }, [task.status, task.startTime]);

  const getStatusIcon = () => {
    switch (task.status) {
      case 'Running':
        return '🟡';
      case 'Succeeded':
        return '✅';
      case 'Failed':
        return '❌';
    }
  };

  const renderTimer = () => {
    if (task.endTime && task.startTime) {
      const duration = (task.endTime - task.startTime) / 1000;
      return `Completed in ${duration.toFixed(2)}s`;
    }
    if (task.startTime) {
      return `Running for ${(elapsedTime / 1000).toFixed(2)}s`;
    }
    return task.status;
  };

  const filteredOutput = task.output.filter(line => 
    line.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="task-item">
      <div className="task-header" onClick={() => setIsExpanded(!isExpanded)}>
        <span className="task-toggle">{isExpanded ? '▼' : '►'}</span>
        <span>{getStatusIcon()} {task.name}</span>
        <span className="task-timer">{renderTimer()}</span>
      </div>
      {isExpanded && (
        <pre className="task-output" ref={outputRef}>
          {filteredOutput.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </pre>
      )}
    </div>
  );
};

export default TaskItem;
