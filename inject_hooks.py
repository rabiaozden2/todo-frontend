with open('src/app/[locale]/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

hooks = {
    """function MiniCalendar({ selectedDate, onSelectDate, tasks }: {
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
  tasks: Task[];
}) {""": """function MiniCalendar({ selectedDate, onSelectDate, tasks }: {
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
  tasks: Task[];
}) {
  const locale = useLocale();
  const t = useTranslations('Home');""",

    """function WeeklyView({ selectedDate, onSelectDate, tasks }: {
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
  tasks: Task[];
}) {""": """function WeeklyView({ selectedDate, onSelectDate, tasks }: {
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
  tasks: Task[];
}) {
  const locale = useLocale();
  const t = useTranslations('Home');""",

    """function NotificationToast({ task, onDone, onRemind, onDismiss }: {
  task: Task; onDone: () => void; onRemind: () => void; onDismiss: () => void;
}) {""": """function NotificationToast({ task, onDone, onRemind, onDismiss }: {
  task: Task; onDone: () => void; onRemind: () => void; onDismiss: () => void;
}) {
  const locale = useLocale();
  const t = useTranslations('Home');
  const tCommon = useTranslations('Common');""",

    """function SelectedDayDetail({ date, tasks, onEdit }: { date: Date; tasks: Task[]; onEdit: (t: Task) => void }) {""": """function SelectedDayDetail({ date, tasks, onEdit }: { date: Date; tasks: Task[]; onEdit: (t: Task) => void }) {
  const locale = useLocale();
  const t = useTranslations('Home');"""
}

for k, v in hooks.items():
    content = content.replace(k, v)

with open('src/app/[locale]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Hooks injected.")
