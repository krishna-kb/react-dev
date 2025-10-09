export interface Task {
  id: number;
  name: string;
  status: 'Running' | 'Succeeded' | 'Failed';
  output: string[];
  startTime?: number;
  endTime?: number;
}
