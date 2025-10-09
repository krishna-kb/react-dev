import React from 'react';

interface ScriptListProps {
  onRunScript: (scriptName: string) => void;
  onRunAll: () => void;
}

const scripts = ['test', 'lint', 'build', 'deploy', 'stress-test'];

const ScriptList: React.FC<ScriptListProps> = ({ onRunScript, onRunAll }) => {
  return (
    <div className="sidebar">
      <h2>Scripts</h2>
      <button onClick={onRunAll} className="run-all-button">
        Run All Scripts
      </button>
      <hr />
      {scripts.map((script) => (
        <button key={script} onClick={() => onRunScript(script)}>
          {script}
        </button>
      ))}
    </div>
  );
};

export default ScriptList;
