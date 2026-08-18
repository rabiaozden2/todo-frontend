'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'next-themes';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Box, Flex, Heading, Text, Button } from '@chakra-ui/react';
import { fetchTasksRequest, addTaskRequest, updateTaskRequest, deleteTaskRequest, Task } from '../../store/slices/todoSlice';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store/store';

/* ── Helpers ── */
function formatRemaining(ms: number): string {
  if (ms <= 0) return 'Süre doldu!';
  const totalMin = Math.floor(ms / 60000);
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}g ${hours % 24}s`;
  }
  if (hours > 0) return `${hours}s ${mins}dk`;
  if (mins > 0) return `${mins} dk`;
  return `${Math.floor(ms / 1000)} sn`;
}

function getUrgencyColor(ms: number): string {
  if (ms <= 0) return 'var(--accent-danger)';
  if (ms <= 3 * 60 * 1000) return 'var(--accent-danger)';
  if (ms <= 30 * 60 * 1000) return 'var(--accent-primary)';
  return 'var(--accent-secondary)';
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
}

/* ── Mini Calendar ── */
function MiniCalendar({ selectedDate, onSelectDate, tasks }: {
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
  tasks: Task[];
}) {
  const locale = useLocale();
  const t = useTranslations('Home');
  const [viewDate, setViewDate] = useState(new Date());
  const today = new Date();
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' });

  const firstDay = new Date(year, month, 1);
  let startDay = firstDay.getDay();
  if (startDay === 0) startDay = 7;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const daysWithTasks = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach(t => {
      const d = t.due_date ? new Date(t.due_date) : (t.created_at ? new Date(t.created_at) : null);
      if (d) set.add(dateKey(d));
    });
    return set;
  }, [tasks]);

  const cells: { day: number; current: boolean; isToday: boolean; isSelected: boolean; hasTasks: boolean; date: Date }[] = [];
  for (let i = startDay - 1; i > 0; i--) {
    const d = new Date(year, month - 1, daysInPrevMonth - i + 1);
    cells.push({ day: daysInPrevMonth - i + 1, current: false, isToday: false, isSelected: false, hasTasks: daysWithTasks.has(dateKey(d)), date: d });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const isToday = isSameDay(date, today);
    const isSelected = isSameDay(date, selectedDate);
    cells.push({ day: d, current: true, isToday, isSelected, hasTasks: daysWithTasks.has(dateKey(date)), date });
  }
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      cells.push({ day: i, current: false, isToday: false, isSelected: false, hasTasks: daysWithTasks.has(dateKey(d)), date: d });
    }
  }

  const dayLabels = Array.from({ length: 7 }, (_, i) => new Date(2021, 0, 4 + i).toLocaleDateString(locale === 'en' ? 'en-US' : locale, { weekday: 'short' }));

  return (
    <div>
      <div className="mini-cal-header">
        <button className="mini-cal-nav" onClick={() => setViewDate(new Date(year, month - 1, 1))}>◀</button>
        <span>{monthName}</span>
        <button className="mini-cal-nav" onClick={() => setViewDate(new Date(year, month + 1, 1))}>▶</button>
      </div>
      <div className="mini-cal-grid">
        {dayLabels.map(d => <div key={d} className="mini-cal-day-label">{d}</div>)}
        {cells.map((c, i) => (
          <div
            key={i}
            className={`mini-cal-day ${c.isToday ? 'today' : ''} ${c.isSelected ? 'selected' : ''} ${!c.current ? 'other-month' : ''} ${c.current ? 'clickable' : ''}`}
            onClick={() => c.current && onSelectDate(c.date)}
          >
            {c.day}
            {c.hasTasks && c.current && <span className="cal-dot" />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Weekly Planner ── */
function WeeklyPlanner({ tasks }: { tasks: Task[] }) {
  const locale = useLocale();
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + mondayOffset + i);
    return d;
  });
  const dayNames = Array.from({ length: 7 }, (_, i) => new Date(2021, 0, 4 + i).toLocaleDateString(locale === 'en' ? 'en-US' : locale, { weekday: 'short' }));

  const getTasksForDay = (date: Date) => {
    return tasks.filter(t => {
      const taskDate = t.due_date ? new Date(t.due_date) : (t.created_at ? new Date(t.created_at) : null);
      if (!taskDate) return false;
      return isSameDay(taskDate, date);
    });
  };

  return (
    <div className="weekly-grid">
      {weekDays.map((date, i) => {
        const dayTasks = getTasksForDay(date);
        return (
          <div key={i} className="weekly-col">
            <div className={`weekly-day-header ${isSameDay(date, today) ? 'today-col' : ''}`}>
              {dayNames[i]}
              <span className="weekly-date">{date.getDate()}</span>
            </div>
            <div style={{ padding: '4px 2px' }}>
              {dayTasks.length === 0 && (
                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center', padding: '8px 0' }}>—</p>
              )}
              {dayTasks.map(t => (
                <div key={t.id} className={`weekly-task-chip ${t.status === 'completed' ? 'done' : ''}`}>
                  {t.title}
                  {t.due_date && (
                    <span style={{ display: 'block', fontSize: '0.6rem', opacity: 0.7, marginTop: '2px' }}>
                      🕐 {new Date(t.due_date).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Notification Toast ── */
function NotificationToast({ task, onDone, onRemind, onDismiss }: {
  task: Task; onDone: () => void; onRemind: () => void; onDismiss: () => void;
}) {
  const locale = useLocale();
  const t = useTranslations('Home');
  const tCommon = useTranslations('Common');
  return (
    <div className="notification-toast">
      <div className="notification-toast-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '1.4rem' }}>🔔</span>
          <strong style={{ fontSize: '0.95rem' }}>{t('upcoming')}</strong>
        </div>
        <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px' }}>{task.title}</p>
        {task.due_date && (
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            🕐 {new Date(task.due_date).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })} — Süre yaklaşıyor!
          </p>
        )}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-notif-done" onClick={onDone}>✅ {tCommon('done') || 'Done'}</button>
          <button className="btn-notif-remind" onClick={onRemind}>⏰ 1 min Remind</button>
          <button className="btn-notif-dismiss" onClick={onDismiss}>✕</button>
        </div>
      </div>
    </div>
  );
}

/* ── Selected Day Detail Panel ── */
function SelectedDayDetail({ date, tasks, onEdit }: { date: Date; tasks: Task[]; onEdit: (t: Task) => void }) {
  const locale = useLocale();
  const t = useTranslations('Home');
  const dayTasks = tasks.filter(t => {
    const taskDate = t.due_date ? new Date(t.due_date) : (t.created_at ? new Date(t.created_at) : null);
    if (!taskDate) return false;
    return isSameDay(taskDate, date);
  });
  const label = date.toLocaleDateString(locale, { day: 'numeric', month: 'long', weekday: 'long' });

  return (
    <div>
      <p className="heading-sub" style={{ marginBottom: '8px' }}>📌 {label}</p>
      {dayTasks.length === 0 && (
        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.82rem' }}>{t('noUpcoming')}</p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {dayTasks.map(t => (
          <div key={t.id} style={{
            padding: '8px 12px', borderRadius: '8px', background: 'var(--bg-input)',
            border: '1px solid var(--border-color)', fontSize: '0.85rem', cursor: 'pointer'
          }} onClick={() => onEdit(t)}>
            <span style={{ fontWeight: 600, textDecoration: t.status === 'completed' ? 'line-through' : 'none' }}>{t.title}</span>
            {t.due_date && (
              <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                🕐 {new Date(t.due_date).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const t = useTranslations('Home');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const i18nRouter = useRouter();
  const pathname = usePathname();

  const changeLocale = () => {
    const nextLocale = locale === 'tr' ? 'en' : 'tr';
    i18nRouter.replace(pathname, { locale: nextLocale });
  };


  const { user, token } = useSelector((state: RootState) => state.auth);
  const { tasks, loading, error } = useSelector((state: RootState) => state.todos);

  const [newTask, setNewTask] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [now, setNow] = useState(new Date());
  const [selectedCalDate, setSelectedCalDate] = useState(new Date());

  // Inline Editing
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDueDate, setEditDueDate] = useState('');

  // Notification state
  const [notifications, setNotifications] = useState<Task[]>([]);
  const notifiedIds = useRef<Set<string>>(new Set());
  const remindTimers = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    setIsMounted(true);
    if (!token) {
      router.push('/login');
    } else {
      dispatch(fetchTasksRequest());
    }
  }, [token, dispatch, router]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    tasks.filter(t => t.due_date && t.status !== 'completed').forEach(task => {
      if (!task.due_date) return;
      const remaining = new Date(task.due_date).getTime() - now.getTime();
      if (remaining > 0 && remaining <= 3 * 60 * 1000 && !notifiedIds.current.has(task.id)) {
        notifiedIds.current.add(task.id);
        setNotifications(prev => [...prev, task]);
      }
    });
  }, [tasks, now]);

  const [filterByDate, setFilterByDate] = useState(false);
  const [newCategory, setNewCategory] = useState('Kişisel');
  const [editCategory, setEditCategory] = useState('');

  const CATEGORIES = ['Eğitim', 'İş', 'Kişisel', 'Spor'];

  const handleCalDateSelect = (d: Date) => {
    setSelectedCalDate(d);
    setFilterByDate(true);
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      const payload: { title: string; category?: string; due_date?: string | null } = { title: newTask, category: newCategory };
      if (newDueDate) {
        payload.due_date = new Date(newDueDate).toISOString();
      } else if (filterByDate) {
        // If they are viewing a specific date and add a task without a date, optionally assign it to that date
        const d = selectedCalDate;
        payload.due_date = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 9, 0).toISOString();
      }
      dispatch(addTaskRequest(payload));
      setNewTask('');
      setNewDueDate('');
      setNewCategory('Kişisel');
    }
  };

  const startEdit = (t: Task) => {
    setEditingTaskId(t.id);
    setEditTitle(t.title);
    setEditCategory(t.category || 'Kişisel');
    if (t.due_date) {
      const d = new Date(t.due_date);
      setEditDueDate(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
      );
    } else {
      setEditDueDate('');
    }
  };

  const saveEdit = () => {
    if (editingTaskId && editTitle.trim()) {
      dispatch(updateTaskRequest({ 
        id: editingTaskId, 
        title: editTitle, 
        category: editCategory,
        due_date: editDueDate ? new Date(editDueDate).toISOString() : null 
      }));
      setEditingTaskId(null);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    dispatch(updateTaskRequest({ id, status: currentStatus === 'completed' ? 'todo' : 'completed' }));
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('Bu görevi silmek istediğine emin misin?')) {
      dispatch(deleteTaskRequest(id));
    }
  };

  const handleLogout = () => dispatch(logout());

  const handleNotifDone = useCallback((taskId: string) => {
    dispatch(updateTaskRequest({ id: taskId, status: 'completed' }));
    setNotifications(prev => prev.filter(t => t.id !== taskId));
  }, [dispatch]);

  const handleNotifRemind = useCallback((taskId: string) => {
    setNotifications(prev => prev.filter(t => t.id !== taskId));
    const timer = window.setTimeout(() => {
      const task = tasks.find(t => t.id === taskId);
      if (task && task.status !== 'completed') {
        setNotifications(prev => [...prev, task]);
      }
      remindTimers.current.delete(taskId);
    }, 60000);
    remindTimers.current.set(taskId, timer);
  }, [tasks]);

  const handleNotifDismiss = useCallback((taskId: string) => {
    setNotifications(prev => prev.filter(t => t.id !== taskId));
  }, []);

  const [showTrash, setShowTrash] = useState(false);

  const displayedTasks = useMemo(() => {
    if (showTrash) {
      return tasks.filter(t => t.status === 'deleted');
    }
    const nonDeleted = tasks.filter(t => t.status !== 'deleted');
    if (!filterByDate) return nonDeleted;
    return nonDeleted.filter(t => {
      const taskDate = t.due_date ? new Date(t.due_date) : (t.created_at ? new Date(t.created_at) : null);
      if (!taskDate) return false;
      return isSameDay(taskDate, selectedCalDate);
    });
  }, [tasks, filterByDate, selectedCalDate, showTrash]);

  const activeTasks = useMemo(() => displayedTasks.filter(t => t.status !== 'completed' && t.status !== 'deleted'), [displayedTasks]);
  const completedTasks = useMemo(() => displayedTasks.filter(t => t.status === 'completed'), [displayedTasks]);

  const upcomingTasks = useMemo(() => {
    return tasks
      .filter(t => t.status !== 'completed' && t.status !== 'deleted' && t.due_date && new Date(t.due_date).getTime() > now.getTime() - 60000)
      .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime());
  }, [tasks, now]);

  const totalTasks = activeTasks.length + completedTasks.length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks.length / totalTasks) * 100);

  if (!isMounted || !token) return null;

  const isDark = theme === 'dark';
  const today = new Date();
  const dayName = today.toLocaleDateString(locale, { weekday: 'long' });
  const dateStr = today.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });

  // Task render helper to handle edit mode
  const renderTask = (task: Task, isCompleted: boolean) => {
    if (task.status === 'deleted') {
      return (
        <div key={task.id} className="task-item-done" style={{ opacity: 0.8 }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: 500, fontSize: '0.92rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{task.title}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-add" style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '6px' }} onClick={() => dispatch(updateTaskRequest({ id: task.id, status: 'todo' }))}>Geri Al</button>
            <button className="btn-delete" style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '6px' }} onClick={() => confirm('Kalıcı olarak silmek istediğine emin misin?') && dispatch(deleteTaskRequest(task.id))}>Kalıcı Sil</button>
          </div>
        </div>
      );
    }

    if (editingTaskId === task.id) {
      return (
        <div key={task.id} className={isCompleted ? "task-item-done" : "task-item"} style={{ flexDirection: 'column', alignItems: 'stretch', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              value={editTitle} 
              onChange={e => setEditTitle(e.target.value)} 
              className="datetime-input" 
              style={{ flex: 1 }} 
              placeholder="Görev adı..."
            />
            <select 
              value={editCategory} 
              onChange={e => setEditCategory(e.target.value)} 
              className="datetime-input"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input 
              type="datetime-local" 
              value={editDueDate} 
              onChange={e => setEditDueDate(e.target.value)} 
              className="datetime-input"
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button className="btn-delete" onClick={() => setEditingTaskId(null)}>İptal</button>
            <button className="btn-notif-done" onClick={saveEdit} style={{ padding: '4px 12px', fontSize: '0.75rem' }}>Kaydet</button>
          </div>
        </div>
      );
    }

    return (
      <div key={task.id} className={isCompleted ? "task-item-done" : "task-item"}>
        <div className={`custom-checkbox ${isCompleted ? 'checked' : ''}`} onClick={() => handleToggleStatus(task.id, task.status)} />
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => startEdit(task)}>
          <span style={{ 
            fontWeight: 500, 
            fontSize: '0.92rem', 
            textDecoration: isCompleted ? 'line-through' : 'none', 
            textDecorationColor: isCompleted ? 'red' : 'initial',
            color: isCompleted ? 'var(--text-muted)' : 'inherit' 
          }}>
            {task.title}
          </span>
          <div style={{ display: 'flex', gap: '8px', marginTop: '2px', alignItems: 'center' }}>
            {task.category && (
              <span style={{ fontSize: '0.65rem', background: 'var(--accent-cream)', color: 'var(--accent-primary)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                {task.category}
              </span>
            )}
            {task.due_date && (
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                🕐 {new Date(task.due_date).toLocaleDateString(locale, { day: 'numeric', month: 'short', weekday: 'short' })} — {new Date(task.due_date).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        </div>
        <button className="btn-delete" onClick={() => dispatch(updateTaskRequest({ id: task.id, status: 'deleted' }))}>Sil</button>
      </div>
    );
  };

  return (
    <Box minH="100vh" p={{ base: 4, md: 8 }} bg="bg.muted">
      <div className="notification-container">
        {notifications.map(task => (
          <NotificationToast key={task.id} task={task} onDone={() => handleNotifDone(task.id)} onRemind={() => handleNotifRemind(task.id)} onDismiss={() => handleNotifDismiss(task.id)} />
        ))}
      </div>

      <Flex maxW="1200px" mx="auto" mb={6} justify="space-between" align="center" wrap="wrap" gap={3}>
        <Box>
          <Text fontWeight="bold" color="fg.muted" fontSize="sm" letterSpacing="wider">{t('title').split(' ')[0]}</Text>
          <Heading size="2xl" mt={1}>{t('title')}</Heading>
          <Text color="fg.muted" fontSize="sm" mt={1}>
            {t.rich('welcome', { dayName, dateStr, name: user?.full_name || 'Kullanıcı', bold: (chunks) => <strong>{chunks}</strong> })}
          </Text>
        </Box>
        <Flex gap={2} align="center">
                    <LanguageSwitcher />
          <Button variant="outline" size="sm" onClick={() => setTheme(isDark ? 'light' : 'dark')}>
            {isDark ? t('themeLight') : t('themeDark')}
          </Button>
          <Button colorPalette="red" size="sm" onClick={handleLogout}>{tCommon('logout')}</Button>
        </Flex>
      </Flex>

      <div className="main-layout">
        {/* Sol Kolon */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <p className="heading-sub" style={{ marginBottom: '12px' }}>{t('calendar')}</p>
            <MiniCalendar selectedDate={selectedCalDate} onSelectDate={handleCalDateSelect} tasks={tasks.filter(t => t.status !== 'deleted')} />
            {filterByDate && (
              <button 
                onClick={() => setFilterByDate(false)} 
                style={{ width: '100%', padding: '8px', marginTop: '12px', background: 'var(--accent-cream)', color: 'var(--accent-primary)', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
              >
                Tüm Günleri Göster
              </button>
            )}
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{t('progress')} {filterByDate && `(${selectedCalDate.getDate()}/${selectedCalDate.getMonth() + 1})`}</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: progress === 100 ? 'var(--accent-secondary)' : 'var(--accent-primary)' }}>{progress}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>
            {progress === 100 && totalTasks > 0 && <p style={{ textAlign: 'center', marginTop: '8px', fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>🎉 {t('allTasksDone')}</p>}
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              <span className="tag tag-active">{t('active')}: {activeTasks.length}</span>
              <span className="tag tag-done">{t('done')}: {completedTasks.length}</span>
            </div>
          </div>

          <div className="card">
            <p className="heading-sub" style={{ marginBottom: '12px' }}>{t('upcoming')}</p>
            {upcomingTasks.length === 0 && <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.82rem' }}>{t('noUpcoming')}</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {upcomingTasks.map(task => {
                const remaining = new Date(task.due_date!).getTime() - now.getTime();
                return (
                  <div key={task.id} className="upcoming-item">
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{task.title}</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        🕐 {new Date(task.due_date!).toLocaleDateString(locale, { day: 'numeric', month: 'short' })} — {new Date(task.due_date!).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className="upcoming-badge" style={{ background: getUrgencyColor(remaining), color: 'white' }}>{formatRemaining(remaining)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Orta Kolon */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!showTrash && (
            <>
              <div className="card">
                <p className="heading-sub" style={{ marginBottom: '14px' }}>{t('weeklyView')}</p>
                <WeeklyPlanner tasks={tasks.filter(t => t.status !== 'deleted')} />
              </div>

              <div className="card">
                <p className="heading-sub" style={{ marginBottom: '10px' }}>{t('newTask')}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div className="input-area">
                    <input placeholder={t('taskTitle')} value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddTask()} />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>{t('category')}</label>
                      <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="datetime-input" style={{ width: '100%' }}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>{t('dateOptional')}</label>
                      <input type="datetime-local" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} className="datetime-input" style={{ width: '100%' }} />
                    </div>
                    <button className="btn-add" onClick={handleAddTask} disabled={loading} style={{ alignSelf: 'flex-end', padding: '12px 24px' }}>{loading ? '...' : tCommon('add')}</button>
                  </div>
                </div>
              </div>

              {error && <p style={{ color: 'var(--accent-danger)', fontSize: '0.85rem' }}>{error}</p>}

              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span className="heading-sub">{filterByDate ? `${selectedCalDate.toLocaleDateString(locale === 'en' ? 'en-US' : locale, { day: 'numeric', month: 'long' })}` : t('allTodos')}</span>
                  <span className="tag tag-active">{activeTasks.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activeTasks.map(t => renderTask(t, false))}
                  {activeTasks.length === 0 && <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.88rem', padding: '8px 0' }}>{t('noTodos')}</p>}
                </div>
              </div>

              {completedTasks.length > 0 && (
                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <span className="heading-sub">{filterByDate ? `${selectedCalDate.toLocaleDateString(locale === 'en' ? 'en-US' : locale, { day: 'numeric', month: 'long' })}` : t('allCompleted')}</span>
                    <span className="tag tag-done">{completedTasks.length}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {completedTasks.map(t => renderTask(t, true))}
                  </div>
                </div>
              )}
            </>
          )}

          {showTrash && (
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span className="heading-sub">{t('trash')}</span>
                <span className="tag tag-active">{displayedTasks.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {displayedTasks.map(t => renderTask(t, false))}
                {displayedTasks.length === 0 && <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.88rem', padding: '8px 0' }}>{t('trashEmpty')}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Sağ Kolon: Kategoriler & Araçlar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ position: 'sticky', top: '32px' }}>
            <p className="heading-sub" style={{ marginBottom: '16px' }}>🏷️ KATEGORİLER {filterByDate && !showTrash && `(${selectedCalDate.getDate()}/${selectedCalDate.getMonth() + 1})`}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {CATEGORIES.map(cat => {
                const count = activeTasks.filter(t => (t.category || 'Kişisel') === cat).length;
                return (
                  <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderRadius: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{cat}</span>
                    <span style={{ background: count > 0 ? 'var(--accent-primary)' : 'var(--border-color)', color: count > 0 ? 'white' : 'var(--text-muted)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
            
            <hr style={{ margin: '20px 0', borderColor: 'var(--border-color)' }} />
            
            <button 
              onClick={() => setShowTrash(!showTrash)} 
              style={{ width: '100%', padding: '10px', background: showTrash ? 'var(--accent-danger)' : 'transparent', color: showTrash ? 'white' : 'var(--text-secondary)', border: `1px solid ${showTrash ? 'transparent' : 'var(--border-color)'}`, borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px' }}
            >
              {showTrash ? 'Ana Sayfaya Dön' : '🗑️ Çöp Kutusunu Aç'}
            </button>
          </div>
        </div>
      </div>
    </Box>
  );
}
