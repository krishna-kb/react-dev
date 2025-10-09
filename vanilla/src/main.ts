// Type definition for a task's status
type TaskStatus = 'Running' | 'Succeeded' | 'Failed';

// Interface for a task object
interface Task {
    id: string;
    name: string;
    status: TaskStatus;
    log: string;
    startTime?: number;
    endTime?: number;
}

const sidebar = document.getElementById('sidebar')!;
const terminal = document.getElementById('terminal')!;
let taskIdCounter = 0;
const runningTimers = new Map<string, number>(); // Map to store interval IDs

/**
 * Appends a new log line to a task's output element.
 * @param logElement The <pre> element for the task's output.
 * @param line The text content of the log line.
 */
function appendLog(logElement: HTMLElement, line: string) {
    const lineElement = document.createElement('div');
    lineElement.textContent = line;
    logElement.appendChild(lineElement);
}

/**
 * Handles clicks on the script buttons in the sidebar.
 */
sidebar.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.tagName === 'BUTTON') {
        const scriptName = target.dataset.script;
        if (scriptName === 'run-all') {
            const scriptButtons = sidebar.querySelectorAll<HTMLButtonElement>('button:not([data-script="run-all"])');
            scriptButtons.forEach(button => {
                const name = button.dataset.script;
                if (name) {
                    runScript(name);
                }
            });
        } else if (scriptName) {
            runScript(scriptName);
        }
    }
});

/**
 * Creates and executes a script simulation.
 * @param scriptName The name of the script to run.
 */
function runScript(scriptName: string): void {
    const taskId = `task-${taskIdCounter++}`;
    const task: Task = {
        id: taskId,
        name: scriptName,
        status: 'Running',
        log: '',
        startTime: Date.now(),
    };

    createTaskElement(task);

    const timerElement = document.querySelector(`#${taskId} .task-timer`) as HTMLElement;
    const intervalId = window.setInterval(() => {
        const elapsedTime = (Date.now() - task.startTime!) / 1000;
        timerElement.textContent = `Running for ${elapsedTime.toFixed(2)}s`;
    }, 50);
    runningTimers.set(taskId, intervalId);

    simulateScript(task);
}

/**
 * Creates the DOM elements for a new task.
 * @param task The task object.
 */
function createTaskElement(task: Task): void {
    const taskElement = document.createElement('div');
    taskElement.id = task.id;
    taskElement.className = 'task task-running';

    taskElement.innerHTML = `
        <div class="task-header">
            <span class="task-toggle">►</span>
            <span class="task-name"></span>
            <span class="task-timer"></span>
        </div>
        <div class="task-output" style="display: none;">
            <pre></pre>
        </div>
    `;
    
    const header = taskElement.querySelector('.task-header')!;
    header.setAttribute('data-name', task.name);

    const statusIcon = task.status === 'Running' ? '🟡' : '';
    taskElement.querySelector('.task-name')!.textContent = `${statusIcon} ${task.name}`;

    header.addEventListener('click', () => {
        const output = taskElement.querySelector('.task-output') as HTMLElement;
        const toggle = header.querySelector('.task-toggle') as HTMLElement;
        const isCollapsed = output.style.display === 'none';
        output.style.display = isCollapsed ? 'block' : 'none';
        toggle.textContent = isCollapsed ? '▼' : '►';
    });

    terminal.appendChild(taskElement);
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Simulates the execution of a script.
 * @param task The task to simulate.
 */
function simulateScript(task: Task): void {
    const { id, name, startTime } = task;
    let duration = 2000;
    let willFail = false;
    let initialLog = '';

    switch (name) {
        case 'test': duration = 2000; break;
        case 'lint': duration = 3000; break;
        case 'build':
            duration = 5000;
            initialLog = 'Build process started...';
            break;
        case 'deploy':
            duration = 6000;
            willFail = Math.random() < 0.5;
            break;
        case 'stress-test':
            duration = 4000;
            runStressTest(id);
            break;
    }

    const taskElement = document.getElementById(id)!;
    const logElement = taskElement.querySelector('.task-output pre')! as HTMLElement;

    if (initialLog) {
        appendLog(logElement, initialLog);
    }

    if (name === 'stress-test') {
        setTimeout(() => {
            updateTaskStatus(id, 'Succeeded', '', startTime!);
        }, duration);
        return;
    }

    setTimeout(() => {
        const finalStatus: TaskStatus = willFail ? 'Failed' : 'Succeeded';
        const finalLog = willFail ? 'Deployment failed.' : `Script '${name}' finished.`;
        updateTaskStatus(id, finalStatus, finalLog, startTime!);
    }, duration);
}

/**
 * Handles the stress test logging.
 * @param taskId The ID of the stress test task.
 */
function runStressTest(taskId: string): void {
    const taskElement = document.getElementById(taskId)!;
    const logElement = taskElement.querySelector('.task-output pre')! as HTMLElement;
    for (let i = 1; i <= 5000; i++) {
        appendLog(logElement, `Generating log line ${i}...`);
    }
}

/**
 * Updates a task's status in the DOM.
 * @param taskId The ID of the task to update.
 * @param status The new status.
 * @param log The final log message.
 * @param startTime The start time of the task.
 */
function updateTaskStatus(taskId: string, status: TaskStatus, log: string, startTime: number): void {
    const taskElement = document.getElementById(taskId);
    if (!taskElement) return;

    const intervalId = runningTimers.get(taskId);
    if (intervalId) {
        clearInterval(intervalId);
        runningTimers.delete(taskId);
    }

    const headerElement = taskElement.querySelector('.task-header')!;
    const taskNameElement = taskElement.querySelector('.task-name')!;
    const logElement = taskElement.querySelector('.task-output pre')! as HTMLElement;
    const timerElement = taskElement.querySelector('.task-timer')!;
    const taskName = headerElement.getAttribute('data-name')!;

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    timerElement.textContent = `Completed in ${duration.toFixed(2)}s`;

    let statusIcon = '';
    let statusClass = '';

    switch (status) {
        case 'Succeeded': statusIcon = '✅'; statusClass = 'task-succeeded'; break;
        case 'Failed': statusIcon = '❌'; statusClass = 'task-failed'; break;
        case 'Running': statusIcon = '🟡'; statusClass = 'task-running'; break;
    }

    taskElement.className = `task ${statusClass}`;
    taskNameElement.textContent = `${statusIcon} ${taskName}`;

    if (log) {
        appendLog(logElement, log);
    }
    
    const outputContainer = taskElement.querySelector('.task-output')! as HTMLElement;
    outputContainer.scrollTop = outputContainer.scrollHeight;
}

// --- Real-time Log Search Filter ---
const searchInput = document.getElementById('log-search') as HTMLInputElement;

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const logLines = document.querySelectorAll<HTMLElement>('.task-output pre > div');

    logLines.forEach(line => {
        const lineText = line.textContent?.toLowerCase() || '';
        if (lineText.includes(searchTerm)) {
            line.style.display = 'block';
        } else {
            line.style.display = 'none';
        }
    });
});
