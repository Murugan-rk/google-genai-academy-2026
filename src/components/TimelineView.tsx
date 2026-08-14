import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  Clock,
  Trash2,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { TimelineTask } from '../types';

interface TimelineViewProps {
  tasks: TimelineTask[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: TimelineTask) => void;
  onDeleteTask: (id: string) => void;
}

const TIMEFRAME_ORDER = [
  '2 Weeks Before',
  '1 Week Before',
  '3 Days Before',
  'Day Before',
  'Party Day Morning',
  '1 Hour Before',
];

export const TimelineView: React.FC<TimelineViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTimeframe, setNewTimeframe] = useState('Day Before');
  const [newCategory, setNewCategory] = useState('Prep');

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    onAddTask({
      id: 'task_' + Date.now(),
      timeframe: newTimeframe,
      task: newTaskText.trim(),
      category: newCategory,
      isCompleted: false,
    });

    setNewTaskText('');
    setIsAdding(false);
  };

  // Group tasks by timeframe
  const groupedTasks: Record<string, TimelineTask[]> = {};
  TIMEFRAME_ORDER.forEach((tf) => {
    groupedTasks[tf] = [];
  });

  tasks.forEach((t) => {
    const key = t.timeframe || 'Day Before';
    if (!groupedTasks[key]) groupedTasks[key] = [];
    groupedTasks[key].push(t);
  });

  return (
    <div className="space-y-6">
      {/* Header Banner & Readiness Progress */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B08D57] text-white flex items-center justify-center shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-[#1A1A1A]">Party Countdown & Prep Timeline</h2>
              <p className="text-xs text-[#6B655D]">
                Step-by-step chronological roadmap from two weeks out until party time.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EDE2] border border-[#D6C5B0] text-xs font-semibold text-[#7A633F] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Checklist Item</span>
          </button>
        </div>

        {/* Readiness Meter */}
        <div className="mt-5 pt-4 border-t border-[#F0EBE3] grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-[#524B43]">
              <span>Host Readiness Score</span>
              <span className="text-[#1A1A1A] font-bold">{progressPercent}% Ready</span>
            </div>
            <div className="w-full bg-[#EAE2D5] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#F8F5F2] px-4 py-2 rounded-xl border border-[#E8E2D9]">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-[#1A1A1A]">{completedCount}</span> of{' '}
              <span className="font-bold text-[#1A1A1A]">{totalCount}</span> prep milestones checked
            </div>
          </div>

          <div className="text-right text-xs text-[#6B655D]">
            {progressPercent === 100 ? (
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                🎉 All setup completed! Ready to host!
              </span>
            ) : (
              <span className="text-[#7A633F]">
                {totalCount - completedCount} tasks remaining before guests arrive
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Add Task Form inline */}
      {isAdding && (
        <form
          onSubmit={handleCreateTask}
          className="bg-white rounded-2xl border border-[#B08D57] p-5 shadow-sm space-y-3 animate-in fade-in duration-150"
        >
          <div className="font-semibold text-sm text-[#1A1A1A] flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-[#B08D57]" />
            New Timeline Task
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <input
                type="text"
                required
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="e.g. Chill Pinot Noir bottles & slice lemons for water pitcher"
                className="w-full bg-[#FAF7F2] border border-[#D6C5B0] focus:border-[#B08D57] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newTimeframe}
                onChange={(e) => setNewTimeframe(e.target.value)}
                className="bg-[#FAF7F2] border border-[#D6C5B0] rounded-xl px-2 py-2 text-xs text-[#1A1A1A] outline-none"
              >
                {TIMEFRAME_ORDER.map((tf) => (
                  <option key={tf} value={tf}>
                    {tf}
                  </option>
                ))}
              </select>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="bg-[#FAF7F2] border border-[#D6C5B0] rounded-xl px-2 py-2 text-xs text-[#1A1A1A] outline-none"
              >
                <option value="Shopping">Shopping</option>
                <option value="Prep">Food Prep</option>
                <option value="Setup">Decor Setup</option>
                <option value="Invites">Invites</option>
                <option value="Host">Hosting</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-[#6B655D] hover:text-[#1A1A1A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-[#B08D57] hover:bg-[#9B7B4B] text-white"
            >
              Save Milestone
            </button>
          </div>
        </form>
      )}

      {/* Chronological Timeline Groups */}
      <div className="space-y-4">
        {Object.entries(groupedTasks).map(([timeframe, items]) => {
          if (!items || items.length === 0) return null;
          const isAllDone = items.every((i) => i.isCompleted);

          return (
            <div key={timeframe} className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden shadow-xs">
              {/* Header */}
              <div className="bg-[#FAF7F2] px-5 py-3 border-b border-[#E8E2D9] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#B08D57]" />
                  <span className="font-semibold text-sm text-[#1A1A1A]">{timeframe}</span>
                  <span className="text-[11px] text-[#6B655D]">
                    ({items.filter((i) => i.isCompleted).length}/{items.length} completed)
                  </span>
                </div>
                {isAllDone && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Completed ✓
                  </span>
                )}
              </div>

              {/* Task Items */}
              <div className="divide-y divide-[#F0EBE3]">
                {items.map((t) => (
                  <div
                    key={t.id}
                    className={`p-4 flex items-center justify-between gap-3 transition-colors ${
                      t.isCompleted ? 'bg-[#FAF7F2]/60' : 'hover:bg-[#FAF7F2]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => onToggleTask(t.id)}
                        className="text-[#B08D57] hover:scale-110 transition-transform shrink-0"
                      >
                        {t.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#D6C5B0]" />
                        )}
                      </button>

                      <div className="min-w-0">
                        <span
                          className={`text-xs sm:text-sm font-medium ${
                            t.isCompleted ? 'line-through text-[#8C847B]' : 'text-[#1A1A1A]'
                          }`}
                        >
                          {t.task}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#EAE2D5] text-[#7A633F]">
                            {t.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteTask(t.id)}
                      className="p-1 rounded-md text-[#8C847B] hover:text-rose-600 transition-colors shrink-0"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
