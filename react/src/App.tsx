import React, { useState } from 'react';
import ScriptList from './components/ScriptList';
import Terminal from './components/Terminal';
import type { Task } from './types';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const runScript = (scriptName: string) => {
    const newTask: Task = {
      id: Date.now() + Math.random(), // Add random to avoid key collision in runAll
      name: scriptName,
      status: 'Running',
      output: [],
      startTime: Date.now(),
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    executeScriptLogic(newTask);
  };

  const runAllScripts = () => {
    const scripts = ['test', 'lint', 'build', 'deploy', 'stress-test'];
    const newTasks: Task[] = [];

    scripts.forEach(scriptName => {
      const newTask: Task = {
        id: Date.now() + Math.random(),
        name: scriptName,
        status: 'Running',
        output: [],
        startTime: Date.now(),
      };
      newTasks.push(newTask);
    });

    setTasks((prevTasks) => [...prevTasks, ...newTasks]);
    
    // Execute the logic for each new task after the state has been updated
    newTasks.forEach(task => executeScriptLogic(task));
  };

  const executeScriptLogic = (task: Task) => {
    const { id: taskId, name: scriptName } = task;

    const updateTask = (id: number, updates: Partial<Task>) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.id === id) {
            const updatedTask = { ...task, ...updates };
            if (updates.status && (updates.status === 'Succeeded' || updates.status === 'Failed')) {
              updatedTask.endTime = Date.now();
            }
            return updatedTask;
          }
          return task;
        })
      );
    };

    const appendOutput = (id: number, line: string) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, output: [...task.output, line] } : task
        )
      );
    };

    switch (scriptName) {
      case 'test':
        setTimeout(() => {
          appendOutput(taskId, `Script 'test' finished.`);
          updateTask(taskId, { status: 'Succeeded' });
        }, 2000);
        break;
      case 'lint':
        setTimeout(() => {
          appendOutput(taskId, `Script 'lint' finished.`);
          updateTask(taskId, { status: 'Succeeded' });
        }, 3000);
        break;
      case 'build':
        appendOutput(taskId, 'Build process started...');
        setTimeout(() => {
          appendOutput(taskId, `Script 'build' finished.`);
          updateTask(taskId, { status: 'Succeeded' });
        }, 5000);
        break;
      case 'deploy':
        setTimeout(() => {
          const success = Math.random() < 0.5;
          if (success) {
            appendOutput(taskId, `Script 'deploy' finished.`);
            updateTask(taskId, { status: 'Succeeded' });
          } else {
            appendOutput(taskId, 'Deployment failed.');
            updateTask(taskId, { status: 'Failed' });
          }
        }, 6000);
        break;
      case 'stress-test':
        for (let i = 1; i <= 5000; i++) {
          appendOutput(taskId, `Generating log line ${i}...`);
        }
        setTimeout(() => {
          updateTask(taskId, { status: 'Succeeded' });
        }, 4000);
        break;
    }
  };

  return (
    <div className="app-container">
      <ScriptList onRunScript={runScript} onRunAll={runAllScripts} />
      <Terminal
        tasks={tasks}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
    </div>
  );
};

export default App;