import { useEffect, useMemo, useRef, useState } from 'react'

const ATTENDANCE_STORAGE_KEY = 'paper-present.attendance.v2'
const GROUP_STORAGE_KEY = 'paper-present.groups.v1'
const LANGUAGE_STORAGE_KEY = 'paper-present.language.v1'
const CALENDAR_STORAGE_KEY = 'paper-present.calendar.v1'

const DEFAULT_GROUPS = [
  {
    id: 'g-a',
    name: 'Group A',
    students: [
      { id: 's-01', name: 'Adam Benali' },
      { id: 's-02', name: 'Aya Benhaddou' },
      { id: 's-03', name: 'Ines Cherif' },
      { id: 's-04', name: 'Karim Daoud' },
      { id: 's-05', name: 'Lina El Amrani' },
      { id: 's-06', name: 'Mehdi Fares' },
      { id: 's-07', name: 'Nora Ghezali' },
      { id: 's-08', name: 'Omar Haddad' },
      { id: 's-09', name: 'Ranya Ikram' },
      { id: 's-10', name: 'Samir Jaziri' },
    ],
  },
  {
    id: 'g-b',
    name: 'Group B',
    students: [
      { id: 's-11', name: 'Taha Khelifa' },
      { id: 's-12', name: 'Yasmine Lamrani' },
      { id: 's-13', name: 'Bilal Mansour' },
      { id: 's-14', name: 'Hiba Nadir' },
      { id: 's-15', name: 'Sara Oukili' },
      { id: 's-16', name: 'Younes Qassem' },
      { id: 's-17', name: 'Zineb Rami' },
      { id: 's-18', name: 'Ilyas Saidi' },
    ],
  },
]

const LANGUAGES = [
  { code: 'ar', label: 'AR العربية' },
  { code: 'fr', label: 'FR Français' },
  { code: 'en', label: 'EN English' },
  { code: 'fa', label: 'FA فارسی' },
  { code: 'pt', label: 'PT Português' },
  { code: 'es', label: 'ES Español' },
  { code: 'ru', label: 'RU Русский' },
  { code: 'zh', label: 'ZH 中文' },
  { code: 'ko', label: 'KO 한국어' },
  { code: 'tr', label: 'TR Türkçe' },
  { code: 'sw', label: 'SW Kiswahili' },
  { code: 'vi', label: 'VI Tiếng Việt' },
  { code: 'ur', label: 'UR اردو' },
]

const I18N = {
  en: {
    eyebrow: 'Teacher Attendance Board',
    subtitle: 'One-click presence tracking with smart insights and zero backend.',
    teacher: 'Teacher',
    date: 'Date',
    calendar: 'Calendar',
    solarCalendar: 'Solar (Gregorian)',
    lunarCalendar: 'Lunar (Hijri)',
    language: 'Language',
    group: 'Group',
    addGroup: 'Add Group',
    addStudent: 'Add Student',
    deleteStudent: 'Delete student',
    confirmDeleteTitle: 'Confirm student deletion',
    confirmDeleteBody: 'Do you want to delete this student from the group?',
    deleteAction: 'Delete',
    print: 'Print',
    classGroup: 'Class group',
    marked: 'Marked',
    present: 'Present',
    late: 'Late',
    absent: 'Absent',
    quickActions: 'Quick actions',
    markAllPresent: 'Mark all present',
    markAllLate: 'Mark all late',
    markAllAbsent: 'Mark all absent',
    clearDay: 'Clear day',
    legend: 'Legend',
    notMarked: 'Not marked',
    guideTitle: 'Teacher guide (How to use)',
    guide1: 'Set your name and choose the date at the top.',
    guide2: 'Click a student row to cycle: Present, Late, Absent, Clear.',
    guide3: 'Use quick actions to mark everyone at once if needed.',
    guide4: 'Search by student name, or filter by status.',
    guide5: 'Use the small signature bar next to each student.',
    guideTip: 'Tip: This app works offline and saves automatically in this browser.',
    attendanceList: 'Attendance list',
    students: 'students',
    search: 'Search',
    searchPlaceholder: 'Search student',
    all: 'All',
    groupText: 'Group',
    signLabel: 'Sign',
    promptGroup: 'Group name',
    promptStudent: 'Student full name',
    addGroupTitle: 'Create new group',
    addStudentTitle: 'Add student',
    dialogHintGroup: 'Create a new class group by entering its name.',
    dialogHintStudent: 'Enter the full name of the student to add.',
    save: 'Save',
    cancel: 'Cancel',
    requiredField: 'This field is required.',
    numberLabel: 'No.',
    studentLabel: 'Student',
    statusLabel: 'Status',
    signatureLabel: 'Signature',
    printableSheet: 'Printable attendance sheet',
    totalLabel: 'Total',
    professorSignature: 'Professor signature',
  },
  fr: {
    eyebrow: 'Tableau de présence enseignant',
    subtitle: 'Suivi de présence en un clic, avec aperçu intelligent et sans backend.',
    teacher: 'Enseignant',
    date: 'Date',
    calendar: 'Calendrier',
    solarCalendar: 'Solaire (Gregorian)',
    lunarCalendar: 'Lunaire (Hijri)',
    language: 'Langue',
    group: 'Groupe',
    addGroup: 'Ajouter Groupe',
    addStudent: 'Ajouter Etudiant',
    deleteStudent: 'Supprimer etudiant',
    confirmDeleteTitle: 'Confirmer la suppression',
    confirmDeleteBody: 'Voulez-vous supprimer cet etudiant du groupe ?',
    deleteAction: 'Supprimer',
    print: 'Imprimer',
    classGroup: 'Groupe de classe',
    marked: 'Marques',
    present: 'Present',
    late: 'Retard',
    absent: 'Absent',
    quickActions: 'Actions rapides',
    markAllPresent: 'Tous presents',
    markAllLate: 'Tous en retard',
    markAllAbsent: 'Tous absents',
    clearDay: 'Effacer le jour',
    legend: 'Legende',
    notMarked: 'Non marque',
    attendanceList: 'Liste de presence',
    search: 'Recherche',
    all: 'Tous',
    groupText: 'Groupe',
    signLabel: 'Signature',
    promptGroup: 'Nom du groupe',
    promptStudent: 'Nom complet de l etudiant',
    addGroupTitle: 'Creer un nouveau groupe',
    addStudentTitle: 'Ajouter un etudiant',
    dialogHintGroup: 'Creez un nouveau groupe de classe en entrant son nom.',
    dialogHintStudent: 'Entrez le nom complet de l etudiant a ajouter.',
    save: 'Enregistrer',
    cancel: 'Annuler',
    requiredField: 'Ce champ est obligatoire.',
    numberLabel: 'N',
    studentLabel: 'Etudiant',
    statusLabel: 'Statut',
    signatureLabel: 'Signature',
    printableSheet: 'Feuille de presence',
    totalLabel: 'Total',
    professorSignature: 'Signature du professeur',
  },
  ar: {
    eyebrow: 'لوحة حضور الأستاذ',
    subtitle: 'تتبع الحضور بنقرة واحدة مع رؤى ذكية وبدون خادم.',
    teacher: 'الأستاذ',
    date: 'التاريخ',
    calendar: 'نوع التاريخ',
    solarCalendar: 'شمسي (ميلادي)',
    lunarCalendar: 'قمري (هجري)',
    language: 'اللغة',
    group: 'المجموعة',
    addGroup: 'إضافة مجموعة',
    addStudent: 'إضافة طالب',
    deleteStudent: 'حذف الطالب',
    confirmDeleteTitle: 'تأكيد حذف الطالب',
    confirmDeleteBody: 'هل تريد حذف هذا الطالب من المجموعة؟',
    deleteAction: 'حذف',
    print: 'طباعة',
    classGroup: 'مجموعة القسم',
    marked: 'تم تسجيله',
    present: 'حاضر',
    late: 'متأخر',
    absent: 'غائب',
    quickActions: 'إجراءات سريعة',
    markAllPresent: 'تسجيل الكل حاضر',
    markAllLate: 'تسجيل الكل متأخر',
    markAllAbsent: 'تسجيل الكل غائب',
    clearDay: 'مسح اليوم',
    legend: 'الدليل',
    notMarked: 'غير مسجل',
    guideTitle: 'دليل الأستاذ (طريقة الاستخدام)',
    guide1: 'حدد اسمك واختر التاريخ من الأعلى.',
    guide2: 'انقر على صف الطالب للتبديل: حاضر، متأخر، غائب، مسح.',
    guide3: 'استخدم الإجراءات السريعة لتحديد الكل دفعة واحدة.',
    guide4: 'ابحث باسم الطالب أو صفّ حسب الحالة.',
    guide5: 'استخدم خانة التوقيع الصغيرة بجانب كل طالب.',
    guideTip: 'معلومة: التطبيق يعمل دون إنترنت ويحفظ تلقائيا في هذا المتصفح.',
    attendanceList: 'قائمة الحضور',
    students: 'طلاب',
    search: 'بحث',
    searchPlaceholder: 'ابحث عن طالب',
    all: 'الكل',
    groupText: 'المجموعة',
    signLabel: 'توقيع',
    promptGroup: 'اسم المجموعة',
    promptStudent: 'الاسم الكامل للطالب',
    addGroupTitle: 'إنشاء مجموعة جديدة',
    addStudentTitle: 'إضافة طالب',
    dialogHintGroup: 'أنشئ مجموعة قسم جديدة بإدخال اسمها.',
    dialogHintStudent: 'أدخل الاسم الكامل للطالب المراد إضافته.',
    save: 'حفظ',
    cancel: 'إلغاء',
    requiredField: 'هذا الحقل مطلوب.',
    numberLabel: 'رقم',
    studentLabel: 'الطالب',
    statusLabel: 'الحالة',
    signatureLabel: 'التوقيع',
    printableSheet: 'ورقة الحضور للطباعة',
    totalLabel: 'المجموع',
    professorSignature: 'توقيع الأستاذ',
  },
  fa: {
    eyebrow: 'تابلوی حضور استاد',
    subtitle: 'ثبت حضور با یک کلیک، با دید هوشمند و بدون بک اند.',
    teacher: 'استاد',
    date: 'تاریخ',
    calendar: 'تقویم',
    solarCalendar: 'شمسی (میلادی)',
    lunarCalendar: 'قمری (هجری)',
    language: 'زبان',
    group: 'گروه',
    addGroup: 'افزودن گروه',
    addStudent: 'افزودن دانش آموز',
    deleteStudent: 'حذف دانش آموز',
    confirmDeleteTitle: 'تایید حذف دانش آموز',
    confirmDeleteBody: 'آیا می خواهید این دانش آموز را از گروه حذف کنید؟',
    deleteAction: 'حذف',
    print: 'چاپ',
    classGroup: 'گروه کلاس',
    marked: 'ثبت شده',
    present: 'حاضر',
    late: 'دیرکرد',
    absent: 'غایب',
    quickActions: 'اقدام های سریع',
    markAllPresent: 'همه حاضر',
    markAllLate: 'همه دیرکرد',
    markAllAbsent: 'همه غایب',
    clearDay: 'پاک کردن روز',
    legend: 'راهنما',
    notMarked: 'ثبت نشده',
    guideTitle: 'راهنمای استاد (نحوه استفاده)',
    guide1: 'نام خود را تنظیم کنید و تاریخ را از بالا انتخاب کنید.',
    guide2: 'روی ردیف دانش آموز کلیک کنید: حاضر، دیرکرد، غایب، پاک.',
    guide3: 'در صورت نیاز از اقدام های سریع برای ثبت همه استفاده کنید.',
    guide4: 'بر اساس نام دانش آموز جستجو کنید یا بر اساس وضعیت فیلتر کنید.',
    guide5: 'از نوار امضا کنار هر دانش آموز استفاده کنید.',
    guideTip: 'نکته: این برنامه آفلاین کار می کند و خودکار ذخیره می شود.',
    attendanceList: 'فهرست حضور',
    students: 'دانش آموز',
    search: 'جستجو',
    searchPlaceholder: 'جستجوی دانش آموز',
    all: 'همه',
    groupText: 'گروه',
    signLabel: 'امضا',
    promptGroup: 'نام گروه',
    promptStudent: 'نام کامل دانش آموز',
    addGroupTitle: 'ایجاد گروه جدید',
    addStudentTitle: 'افزودن دانش آموز',
    dialogHintGroup: 'با وارد کردن نام، یک گروه کلاس جدید ایجاد کنید.',
    dialogHintStudent: 'نام کامل دانش آموزی که باید اضافه شود را وارد کنید.',
    save: 'ذخیره',
    cancel: 'لغو',
    requiredField: 'این فیلد الزامی است.',
    numberLabel: 'شماره',
    studentLabel: 'دانش آموز',
    statusLabel: 'وضعیت',
    signatureLabel: 'امضا',
    printableSheet: 'برگه حضور قابل چاپ',
    totalLabel: 'مجموع',
    professorSignature: 'امضای استاد',
  },
  pt: {
    eyebrow: 'Quadro de Presenca do Professor',
    subtitle: 'Controle de presenca com um clique, com visao inteligente e sem backend.',
    teacher: 'Professor',
    date: 'Data',
    calendar: 'Calendario',
    solarCalendar: 'Solar (Gregoriano)',
    lunarCalendar: 'Lunar (Hijri)',
    language: 'Idioma',
    group: 'Grupo',
    addGroup: 'Adicionar Grupo',
    addStudent: 'Adicionar Aluno',
    deleteStudent: 'Excluir aluno',
    confirmDeleteTitle: 'Confirmar exclusao do aluno',
    confirmDeleteBody: 'Deseja excluir este aluno do grupo?',
    deleteAction: 'Excluir',
    print: 'Imprimir',
    classGroup: 'Grupo da turma',
    marked: 'Marcados',
    present: 'Presente',
    late: 'Atrasado',
    absent: 'Ausente',
    quickActions: 'Acoes rapidas',
    markAllPresent: 'Marcar todos presentes',
    markAllLate: 'Marcar todos atrasados',
    markAllAbsent: 'Marcar todos ausentes',
    clearDay: 'Limpar dia',
    legend: 'Legenda',
    notMarked: 'Nao marcado',
    guideTitle: 'Guia do professor (Como usar)',
    guide1: 'Defina seu nome e escolha a data no topo.',
    guide2: 'Clique na linha do aluno: Presente, Atrasado, Ausente, Limpar.',
    guide3: 'Use acoes rapidas para marcar todos de uma vez.',
    guide4: 'Pesquise por nome do aluno ou filtre por status.',
    guide5: 'Use a barra pequena de assinatura ao lado de cada aluno.',
    guideTip: 'Dica: Este app funciona offline e salva automaticamente.',
    attendanceList: 'Lista de presenca',
    students: 'alunos',
    search: 'Pesquisar',
    searchPlaceholder: 'Pesquisar aluno',
    all: 'Todos',
    groupText: 'Grupo',
    signLabel: 'Assinatura',
    promptGroup: 'Nome do grupo',
    promptStudent: 'Nome completo do aluno',
    addGroupTitle: 'Criar novo grupo',
    addStudentTitle: 'Adicionar aluno',
    dialogHintGroup: 'Crie um novo grupo da turma informando seu nome.',
    dialogHintStudent: 'Digite o nome completo do aluno para adicionar.',
    save: 'Salvar',
    cancel: 'Cancelar',
    requiredField: 'Este campo e obrigatorio.',
    numberLabel: 'No.',
    studentLabel: 'Aluno',
    statusLabel: 'Status',
    signatureLabel: 'Assinatura',
    printableSheet: 'Folha de presenca para impressao',
    totalLabel: 'Total',
    professorSignature: 'Assinatura do professor',
  },
  es: {
    eyebrow: 'Panel de Asistencia del Profesor',
    subtitle: 'Control de asistencia en un clic, con informacion inteligente y sin backend.',
    teacher: 'Profesor',
    date: 'Fecha',
    calendar: 'Calendario',
    solarCalendar: 'Solar (Gregoriano)',
    lunarCalendar: 'Lunar (Hijri)',
    language: 'Idioma',
    group: 'Grupo',
    addGroup: 'Agregar Grupo',
    addStudent: 'Agregar Estudiante',
    deleteStudent: 'Eliminar estudiante',
    confirmDeleteTitle: 'Confirmar eliminacion del estudiante',
    confirmDeleteBody: 'Desea eliminar este estudiante del grupo?',
    deleteAction: 'Eliminar',
    print: 'Imprimir',
    classGroup: 'Grupo de clase',
    marked: 'Marcados',
    present: 'Presente',
    late: 'Tarde',
    absent: 'Ausente',
    quickActions: 'Acciones rapidas',
    markAllPresent: 'Marcar todos presentes',
    markAllLate: 'Marcar todos tarde',
    markAllAbsent: 'Marcar todos ausentes',
    clearDay: 'Limpiar dia',
    legend: 'Leyenda',
    notMarked: 'Sin marcar',
    guideTitle: 'Guia del profesor (Como usar)',
    guide1: 'Escribe tu nombre y elige la fecha arriba.',
    guide2: 'Haz clic en una fila para cambiar: Presente, Tarde, Ausente, Limpiar.',
    guide3: 'Usa acciones rapidas para marcar todos de una vez.',
    guide4: 'Busca por nombre del estudiante o filtra por estado.',
    guide5: 'Usa la barra pequena de firma junto a cada estudiante.',
    guideTip: 'Consejo: Esta app funciona sin internet y guarda automaticamente.',
    attendanceList: 'Lista de asistencia',
    students: 'estudiantes',
    search: 'Buscar',
    searchPlaceholder: 'Buscar estudiante',
    all: 'Todos',
    groupText: 'Grupo',
    signLabel: 'Firma',
    promptGroup: 'Nombre del grupo',
    promptStudent: 'Nombre completo del estudiante',
    addGroupTitle: 'Crear nuevo grupo',
    addStudentTitle: 'Agregar estudiante',
    dialogHintGroup: 'Crea un nuevo grupo de clase ingresando su nombre.',
    dialogHintStudent: 'Ingresa el nombre completo del estudiante para agregar.',
    save: 'Guardar',
    cancel: 'Cancelar',
    requiredField: 'Este campo es obligatorio.',
    numberLabel: 'No.',
    studentLabel: 'Estudiante',
    statusLabel: 'Estado',
    signatureLabel: 'Firma',
    printableSheet: 'Hoja de asistencia imprimible',
    totalLabel: 'Total',
    professorSignature: 'Firma del profesor',
  },
  ru: {
    eyebrow: 'Таблица посещаемости преподавателя',
    subtitle: 'Учет посещаемости в один клик, с умной аналитикой и без сервера.',
    teacher: 'Преподаватель',
    date: 'Дата',
    calendar: 'Календарь',
    solarCalendar: 'Солнечный (Григорианский)',
    lunarCalendar: 'Лунный (Хиджри)',
    language: 'Язык',
    group: 'Группа',
    addGroup: 'Добавить группу',
    addStudent: 'Добавить студента',
    deleteStudent: 'Удалить студента',
    confirmDeleteTitle: 'Подтвердить удаление студента',
    confirmDeleteBody: 'Удалить этого студента из группы?',
    deleteAction: 'Удалить',
    print: 'Печать',
    classGroup: 'Учебная группа',
    marked: 'Отмечено',
    present: 'Присутствует',
    late: 'Опоздал',
    absent: 'Отсутствует',
    quickActions: 'Быстрые действия',
    markAllPresent: 'Отметить всех присутствующими',
    markAllLate: 'Отметить всех опоздавшими',
    markAllAbsent: 'Отметить всех отсутствующими',
    clearDay: 'Очистить день',
    legend: 'Легенда',
    notMarked: 'Не отмечено',
    guideTitle: 'Руководство преподавателя (Как использовать)',
    guide1: 'Введите имя и выберите дату вверху.',
    guide2: 'Нажмите на строку студента: Присутствует, Опоздал, Отсутствует, Очистить.',
    guide3: 'Используйте быстрые действия, чтобы отметить всех сразу.',
    guide4: 'Ищите по имени студента или фильтруйте по статусу.',
    guide5: 'Используйте небольшую строку подписи рядом с каждым студентом.',
    guideTip: 'Совет: приложение работает офлайн и автоматически сохраняет данные.',
    attendanceList: 'Список посещаемости',
    students: 'студентов',
    search: 'Поиск',
    searchPlaceholder: 'Поиск студента',
    all: 'Все',
    groupText: 'Группа',
    signLabel: 'Подпись',
    promptGroup: 'Название группы',
    promptStudent: 'Полное имя студента',
    addGroupTitle: 'Создать новую группу',
    addStudentTitle: 'Добавить студента',
    dialogHintGroup: 'Создайте новую учебную группу, введя ее название.',
    dialogHintStudent: 'Введите полное имя студента для добавления.',
    save: 'Сохранить',
    cancel: 'Отмена',
    requiredField: 'Это поле обязательно.',
    numberLabel: '№',
    studentLabel: 'Студент',
    statusLabel: 'Статус',
    signatureLabel: 'Подпись',
    printableSheet: 'Печатный лист посещаемости',
    totalLabel: 'Итого',
    professorSignature: 'Подпись преподавателя',
  },
  zh: {
    eyebrow: '教师考勤面板',
    subtitle: '一键记录出勤，提供智能统计，无需后端。',
    teacher: '教师',
    date: '日期',
    calendar: '日历',
    solarCalendar: '阳历（公历）',
    lunarCalendar: '阴历（回历）',
    language: '语言',
    group: '分组',
    addGroup: '添加分组',
    addStudent: '添加学生',
    deleteStudent: '删除学生',
    confirmDeleteTitle: '确认删除学生',
    confirmDeleteBody: '是否要从分组中删除这名学生？',
    deleteAction: '删除',
    print: '打印',
    classGroup: '班级分组',
    marked: '已标记',
    present: '出勤',
    late: '迟到',
    absent: '缺勤',
    quickActions: '快捷操作',
    markAllPresent: '全部标为出勤',
    markAllLate: '全部标为迟到',
    markAllAbsent: '全部标为缺勤',
    clearDay: '清空当天',
    legend: '图例',
    notMarked: '未标记',
    guideTitle: '教师指南（使用方法）',
    guide1: '先设置姓名，并在顶部选择日期。',
    guide2: '点击学生行可切换：出勤、迟到、缺勤、清除。',
    guide3: '需要时可用快捷操作一次性标记全部。',
    guide4: '可按学生姓名搜索，或按状态筛选。',
    guide5: '可使用每位学生旁边的小签名栏。',
    guideTip: '提示：本应用支持离线，并会在浏览器中自动保存。',
    attendanceList: '考勤列表',
    students: '名学生',
    search: '搜索',
    searchPlaceholder: '搜索学生',
    all: '全部',
    groupText: '分组',
    signLabel: '签名',
    promptGroup: '分组名称',
    promptStudent: '学生全名',
    addGroupTitle: '创建新分组',
    addStudentTitle: '添加学生',
    dialogHintGroup: '输入名称以创建新的班级分组。',
    dialogHintStudent: '输入要添加学生的完整姓名。',
    save: '保存',
    cancel: '取消',
    requiredField: '此字段为必填项。',
    numberLabel: '序号',
    studentLabel: '学生',
    statusLabel: '状态',
    signatureLabel: '签名',
    printableSheet: '可打印考勤表',
    totalLabel: '总计',
    professorSignature: '教师签名',
  },
  ko: {
    eyebrow: '교사 출석 보드',
    subtitle: '한 번의 클릭으로 출석을 기록하고, 스마트 통계를 제공하며, 백엔드가 필요 없습니다.',
    teacher: '교사',
    date: '날짜',
    calendar: '달력',
    solarCalendar: '양력(그레고리력)',
    lunarCalendar: '음력(히즈리)',
    language: '언어',
    group: '그룹',
    addGroup: '그룹 추가',
    addStudent: '학생 추가',
    deleteStudent: '학생 삭제',
    confirmDeleteTitle: '학생 삭제 확인',
    confirmDeleteBody: '이 학생을 그룹에서 삭제하시겠습니까?',
    deleteAction: '삭제',
    print: '인쇄',
    classGroup: '반 그룹',
    marked: '기록됨',
    present: '출석',
    late: '지각',
    absent: '결석',
    quickActions: '빠른 작업',
    markAllPresent: '모두 출석 처리',
    markAllLate: '모두 지각 처리',
    markAllAbsent: '모두 결석 처리',
    clearDay: '오늘 기록 지우기',
    legend: '범례',
    notMarked: '미기록',
    guideTitle: '교사 안내 (사용 방법)',
    guide1: '상단에서 이름을 입력하고 날짜를 선택하세요.',
    guide2: '학생 행을 클릭해 출석, 지각, 결석, 초기화로 순환하세요.',
    guide3: '필요하면 빠른 작업으로 전체를 한 번에 처리하세요.',
    guide4: '학생 이름으로 검색하거나 상태로 필터링하세요.',
    guide5: '학생 옆의 작은 서명 칸을 사용하세요.',
    guideTip: '팁: 이 앱은 오프라인으로 작동하며 자동 저장됩니다.',
    attendanceList: '출석 목록',
    students: '명',
    search: '검색',
    searchPlaceholder: '학생 검색',
    all: '전체',
    groupText: '그룹',
    signLabel: '서명',
    promptGroup: '그룹 이름',
    promptStudent: '학생 전체 이름',
    addGroupTitle: '새 그룹 만들기',
    addStudentTitle: '학생 추가',
    dialogHintGroup: '이름을 입력해 새 반 그룹을 만드세요.',
    dialogHintStudent: '추가할 학생의 전체 이름을 입력하세요.',
    save: '저장',
    cancel: '취소',
    requiredField: '이 필드는 필수입니다.',
    numberLabel: '번호',
    studentLabel: '학생',
    statusLabel: '상태',
    signatureLabel: '서명',
    printableSheet: '인쇄용 출석표',
    totalLabel: '합계',
    professorSignature: '교사 서명',
  },
  tr: {
    eyebrow: 'Ogretmen Yoklama Panosu',
    subtitle: 'Tek tikla yoklama takibi, akilli icgoruler ve sifir backend.',
    teacher: 'Ogretmen',
    date: 'Tarih',
    calendar: 'Takvim',
    solarCalendar: 'Gunes (Gregoryen)',
    lunarCalendar: 'Ay (Hicri)',
    language: 'Dil',
    group: 'Grup',
    addGroup: 'Grup Ekle',
    addStudent: 'Ogrenci Ekle',
    deleteStudent: 'Ogrenciyi Sil',
    confirmDeleteTitle: 'Ogrenci silmeyi onayla',
    confirmDeleteBody: 'Bu ogrenciyi gruptan silmek istiyor musunuz?',
    deleteAction: 'Sil',
    print: 'Yazdir',
    classGroup: 'Sinif grubu',
    marked: 'Isaretli',
    present: 'Var',
    late: 'Gec',
    absent: 'Yok',
    quickActions: 'Hizli islemler',
    markAllPresent: 'Hepsini var yap',
    markAllLate: 'Hepsini gec yap',
    markAllAbsent: 'Hepsini yok yap',
    clearDay: 'Gunu temizle',
    legend: 'Aciklama',
    notMarked: 'Isaretlenmedi',
    guideTitle: 'Ogretmen rehberi (Nasil kullanilir)',
    guide1: 'Adinizi girin ve ustten tarihi secin.',
    guide2: 'Ogrenci satirina tiklayin: Var, Gec, Yok, Temizle.',
    guide3: 'Gerekirse hizli islemlerle herkesi bir anda isaretleyin.',
    guide4: 'Ogrenci adina gore arayin veya duruma gore filtreleyin.',
    guide5: 'Her ogrencinin yanindaki kucuk imza alanini kullanin.',
    guideTip: 'Ipucu: Bu uygulama cevrimdisi calisir ve otomatik kaydeder.',
    attendanceList: 'Yoklama listesi',
    students: 'ogrenci',
    search: 'Ara',
    searchPlaceholder: 'Ogrenci ara',
    all: 'Tum',
    groupText: 'Grup',
    signLabel: 'Imza',
    promptGroup: 'Grup adi',
    promptStudent: 'Ogrencinin tam adi',
    addGroupTitle: 'Yeni grup olustur',
    addStudentTitle: 'Ogrenci ekle',
    dialogHintGroup: 'Adini girerek yeni bir sinif grubu olusturun.',
    dialogHintStudent: 'Eklenecek ogrencinin tam adini girin.',
    save: 'Kaydet',
    cancel: 'Iptal',
    requiredField: 'Bu alan zorunludur.',
    numberLabel: 'No.',
    studentLabel: 'Ogrenci',
    statusLabel: 'Durum',
    signatureLabel: 'Imza',
    printableSheet: 'Yazdirilabilir yoklama cizelgesi',
    totalLabel: 'Toplam',
    professorSignature: 'Ogretmen imzasi',
  },
  sw: {
    eyebrow: 'Bodi ya Mahudhurio ya Mwalimu',
    subtitle: 'Fuatilia mahudhurio kwa mbofyo mmoja, kwa takwimu za akili na bila backend.',
    teacher: 'Mwalimu',
    date: 'Tarehe',
    calendar: 'Kalenda',
    solarCalendar: 'Jua (Gregoria)',
    lunarCalendar: 'Mwezi (Hijri)',
    language: 'Lugha',
    group: 'Kikundi',
    addGroup: 'Ongeza Kikundi',
    addStudent: 'Ongeza Mwanafunzi',
    deleteStudent: 'Futa mwanafunzi',
    confirmDeleteTitle: 'Thibitisha kufuta mwanafunzi',
    confirmDeleteBody: 'Unataka kumfuta mwanafunzi huyu kutoka kwenye kundi?',
    deleteAction: 'Futa',
    print: 'Chapisha',
    classGroup: 'Kikundi cha darasa',
    marked: 'Waliowekwa alama',
    present: 'Yupo',
    late: 'Amechelewa',
    absent: 'Hayupo',
    quickActions: 'Vitendo vya haraka',
    markAllPresent: 'Weka wote yupo',
    markAllLate: 'Weka wote amechelewa',
    markAllAbsent: 'Weka wote hayupo',
    clearDay: 'Futa siku',
    legend: 'Mwongozo',
    notMarked: 'Hajawekwa alama',
    guideTitle: 'Mwongozo wa mwalimu (Jinsi ya kutumia)',
    guide1: 'Weka jina lako na chagua tarehe juu.',
    guide2: 'Bonyeza mstari wa mwanafunzi: Yupo, Amechelewa, Hayupo, Futa.',
    guide3: 'Tumia vitendo vya haraka kuweka wote kwa mara moja uki hitaji.',
    guide4: 'Tafuta kwa jina la mwanafunzi au chuja kwa hali.',
    guide5: 'Tumia sehemu ndogo ya saini karibu na kila mwanafunzi.',
    guideTip: 'Kidokezo: Programu hii hufanya kazi bila intaneti na huhifadhi kiotomatiki.',
    attendanceList: 'Orodha ya mahudhurio',
    students: 'wanafunzi',
    search: 'Tafuta',
    searchPlaceholder: 'Tafuta mwanafunzi',
    all: 'Wote',
    groupText: 'Kikundi',
    signLabel: 'Saini',
    promptGroup: 'Jina la kikundi',
    promptStudent: 'Jina kamili la mwanafunzi',
    addGroupTitle: 'Unda kikundi kipya',
    addStudentTitle: 'Ongeza mwanafunzi',
    dialogHintGroup: 'Unda kikundi kipya cha darasa kwa kuingiza jina lake.',
    dialogHintStudent: 'Ingiza jina kamili la mwanafunzi wa kuongeza.',
    save: 'Hifadhi',
    cancel: 'Ghairi',
    requiredField: 'Sehemu hii inahitajika.',
    numberLabel: 'Na.',
    studentLabel: 'Mwanafunzi',
    statusLabel: 'Hali',
    signatureLabel: 'Saini',
    printableSheet: 'Karatasi ya mahudhurio ya kuchapisha',
    totalLabel: 'Jumla',
    professorSignature: 'Saini ya mwalimu',
  },
  vi: {
    eyebrow: 'Bang Diem Danh Giao Vien',
    subtitle: 'Diem danh mot nhap, thong ke thong minh va khong can backend.',
    teacher: 'Giao vien',
    date: 'Ngay',
    calendar: 'Lich',
    solarCalendar: 'Duong lich (Gregorian)',
    lunarCalendar: 'Am lich (Hijri)',
    language: 'Ngon ngu',
    group: 'Nhom',
    addGroup: 'Them nhom',
    addStudent: 'Them hoc sinh',
    deleteStudent: 'Xoa hoc sinh',
    confirmDeleteTitle: 'Xac nhan xoa hoc sinh',
    confirmDeleteBody: 'Ban co muon xoa hoc sinh nay khoi nhom khong?',
    deleteAction: 'Xoa',
    print: 'In',
    classGroup: 'Nhom lop',
    marked: 'Da danh dau',
    present: 'Co mat',
    late: 'Di tre',
    absent: 'Vang',
    quickActions: 'Tac vu nhanh',
    markAllPresent: 'Danh dau tat ca co mat',
    markAllLate: 'Danh dau tat ca di tre',
    markAllAbsent: 'Danh dau tat ca vang',
    clearDay: 'Xoa ngay',
    legend: 'Chu thich',
    notMarked: 'Chua danh dau',
    guideTitle: 'Huong dan giao vien (Cach dung)',
    guide1: 'Nhap ten va chon ngay o phia tren.',
    guide2: 'Bam vao dong hoc sinh de chuyen: Co mat, Di tre, Vang, Xoa.',
    guide3: 'Dung tac vu nhanh de danh dau tat ca khi can.',
    guide4: 'Tim theo ten hoc sinh hoac loc theo trang thai.',
    guide5: 'Dung o chu ky nho ben canh moi hoc sinh.',
    guideTip: 'Meo: Ung dung hoat dong offline va tu dong luu.',
    attendanceList: 'Danh sach diem danh',
    students: 'hoc sinh',
    search: 'Tim kiem',
    searchPlaceholder: 'Tim hoc sinh',
    all: 'Tat ca',
    groupText: 'Nhom',
    signLabel: 'Chu ky',
    promptGroup: 'Ten nhom',
    promptStudent: 'Ho ten day du hoc sinh',
    addGroupTitle: 'Tao nhom moi',
    addStudentTitle: 'Them hoc sinh',
    dialogHintGroup: 'Tao nhom lop moi bang cach nhap ten.',
    dialogHintStudent: 'Nhap ho ten day du cua hoc sinh can them.',
    save: 'Luu',
    cancel: 'Huy',
    requiredField: 'Truong nay bat buoc.',
    numberLabel: 'So',
    studentLabel: 'Hoc sinh',
    statusLabel: 'Trang thai',
    signatureLabel: 'Chu ky',
    printableSheet: 'Bang diem danh de in',
    totalLabel: 'Tong',
    professorSignature: 'Chu ky giao vien',
  },
  ur: {
    eyebrow: 'استاد حاضری بورڈ',
    subtitle: 'ایک کلک میں حاضری ٹریک کریں، ذہین خلاصے کے ساتھ اور بغیر بیک اینڈ۔',
    teacher: 'استاد',
    date: 'تاریخ',
    calendar: 'کیلنڈر',
    solarCalendar: 'شمسی (گریگورین)',
    lunarCalendar: 'قمری (ہجری)',
    language: 'زبان',
    group: 'گروپ',
    addGroup: 'گروپ شامل کریں',
    addStudent: 'طالب علم شامل کریں',
    deleteStudent: 'طالب علم حذف کریں',
    confirmDeleteTitle: 'طالب علم حذف کرنے کی تصدیق',
    confirmDeleteBody: 'کیا آپ اس طالب علم کو گروپ سے حذف کرنا چاہتے ہیں؟',
    deleteAction: 'حذف کریں',
    print: 'پرنٹ',
    classGroup: 'کلاس گروپ',
    marked: 'نشان زدہ',
    present: 'حاضر',
    late: 'تاخیر',
    absent: 'غیر حاضر',
    quickActions: 'فوری اعمال',
    markAllPresent: 'سب کو حاضر کریں',
    markAllLate: 'سب کو تاخیر میں کریں',
    markAllAbsent: 'سب کو غیر حاضر کریں',
    clearDay: 'دن صاف کریں',
    legend: 'راهنمائی',
    notMarked: 'نشان زدہ نہیں',
    guideTitle: 'استاد رہنما (استعمال کا طریقہ)',
    guide1: 'اپنا نام لکھیں اور اوپر تاریخ منتخب کریں۔',
    guide2: 'طالب علم کی قطار پر کلک کریں: حاضر، تاخیر، غیر حاضر، صاف۔',
    guide3: 'ضرورت ہو تو فوری اعمال سے سب کو ایک ساتھ نشان زد کریں۔',
    guide4: 'طالب علم کے نام سے تلاش کریں یا حالت کے مطابق فلٹر کریں۔',
    guide5: 'ہر طالب علم کے ساتھ چھوٹی دستخط بار استعمال کریں۔',
    guideTip: 'مشورہ: یہ ایپ آف لائن چلتی ہے اور خودکار محفوظ کرتی ہے۔',
    attendanceList: 'حاضری فہرست',
    students: 'طلبہ',
    search: 'تلاش',
    searchPlaceholder: 'طالب علم تلاش کریں',
    all: 'سب',
    groupText: 'گروپ',
    signLabel: 'دستخط',
    promptGroup: 'گروپ کا نام',
    promptStudent: 'طالب علم کا مکمل نام',
    addGroupTitle: 'نیا گروپ بنائیں',
    addStudentTitle: 'طالب علم شامل کریں',
    dialogHintGroup: 'نام درج کر کے نیا کلاس گروپ بنائیں۔',
    dialogHintStudent: 'شامل کرنے کے لئے طالب علم کا مکمل نام درج کریں۔',
    save: 'محفوظ کریں',
    cancel: 'منسوخ',
    requiredField: 'یہ خانہ لازمی ہے۔',
    numberLabel: 'نمبر',
    studentLabel: 'طالب علم',
    statusLabel: 'حالت',
    signatureLabel: 'دستخط',
    printableSheet: 'پرنٹ کے لئے حاضری شیٹ',
    totalLabel: 'کل',
    professorSignature: 'استاد کے دستخط',
  },
}

const STATUS_OPTIONS = [
  { value: 'present', label: 'present' },
  { value: 'late', label: 'late' },
  { value: 'absent', label: 'absent' },
]

const STATUS_STYLES = {
  present: 'status--present',
  late: 'status--late',
  absent: 'status--absent',
}
const PRINT_TARGET_ROWS = 20
const EMPTY_STUDENTS = []
const EMPTY_ATTENDANCE = {}

const todayIso = () => new Date().toISOString().slice(0, 10)

const makeId = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 7)}`

const safeLoadAttendance = () => {
  try {
    const raw = localStorage.getItem(ATTENDANCE_STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

const safeSaveAttendance = (data) => {
  try {
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(data))
  } catch {
    // ignore write errors
  }
}

const safeLoadGroups = () => {
  try {
    const raw = localStorage.getItem(GROUP_STORAGE_KEY)
    if (!raw) return DEFAULT_GROUPS
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_GROUPS
    return parsed
  } catch {
    return DEFAULT_GROUPS
  }
}

const safeSaveGroups = (groups) => {
  try {
    localStorage.setItem(GROUP_STORAGE_KEY, JSON.stringify(groups))
  } catch {
    // ignore write errors
  }
}

const detectLanguage = () => {
  const browserLanguage = (navigator.language || 'en').toLowerCase().split('-')[0]
  return LANGUAGES.some((item) => item.code === browserLanguage) ? browserLanguage : 'en'
}

const loadLanguage = () => {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (stored && LANGUAGES.some((item) => item.code === stored)) return stored
  } catch {
    // ignore storage errors
  }
  return detectLanguage()
}

const loadCalendarMode = () => {
  try {
    const stored = localStorage.getItem(CALENDAR_STORAGE_KEY)
    if (stored === 'solar' || stored === 'lunar') return stored
  } catch {
    // ignore storage errors
  }
  return 'solar'
}

const formatDisplayDate = (value, language, calendarMode = 'solar') => {
  const date = new Date(`${value}T00:00:00`)
  const locale =
    calendarMode === 'lunar' && language === 'ar' ? 'ar-SA-u-ca-islamic' : language || 'en'
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

const cycleStatus = (current) => {
  if (current === 'present') return 'late'
  if (current === 'late') return 'absent'
  if (current === 'absent') return undefined
  return 'present'
}

function App() {
  const [date, setDate] = useState(todayIso)
  const [attendanceByDate, setAttendanceByDate] = useState(safeLoadAttendance)
  const [groups, setGroups] = useState(safeLoadGroups)
  const [activeGroupId, setActiveGroupId] = useState(() => safeLoadGroups()[0]?.id || '')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [teacherName, setTeacherName] = useState('Mme. Amina')
  const [language, setLanguage] = useState(loadLanguage)
  const [calendarMode, setCalendarMode] = useState(loadCalendarMode)
  const [dialog, setDialog] = useState({ type: null, value: '', error: '' })
  const [deletePrompt, setDeletePrompt] = useState({ open: false, studentId: '', studentName: '' })
  const dialogInputRef = useRef(null)

  useEffect(() => {
    safeSaveAttendance(attendanceByDate)
  }, [attendanceByDate])

  useEffect(() => {
    safeSaveGroups(groups)
  }, [groups])

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    } catch {
      // ignore write errors
    }
  }, [language])

  useEffect(() => {
    try {
      localStorage.setItem(CALENDAR_STORAGE_KEY, calendarMode)
    } catch {
      // ignore write errors
    }
  }, [calendarMode])

  useEffect(() => {
    if (dialog.type && dialogInputRef.current) {
      dialogInputRef.current.focus()
    }
  }, [dialog.type])

  const t = useMemo(() => ({ ...I18N.en, ...(I18N[language] || {}) }), [language])
  const isRtl = useMemo(() => ['ar', 'fa', 'ur'].includes(language), [language])
  const effectiveCalendarMode = language === 'ar' ? calendarMode : 'solar'
  const effectiveGroupId = useMemo(() => {
    if (groups.some((group) => group.id === activeGroupId)) return activeGroupId
    return groups[0]?.id || ''
  }, [groups, activeGroupId])
  const activeGroup = useMemo(
    () => groups.find((group) => group.id === effectiveGroupId),
    [groups, effectiveGroupId],
  )
  const currentStudents = activeGroup?.students || EMPTY_STUDENTS
  const dayAttendance = attendanceByDate[date] || EMPTY_ATTENDANCE

  const stats = useMemo(() => {
    const total = currentStudents.length
    const present = currentStudents.filter((student) => dayAttendance[student.id] === 'present').length
    const late = currentStudents.filter((student) => dayAttendance[student.id] === 'late').length
    const absent = currentStudents.filter((student) => dayAttendance[student.id] === 'absent').length
    const marked = present + late + absent
    return { total, present, late, absent, marked }
  }, [currentStudents, dayAttendance])

  const filteredRoster = useMemo(() => {
    const q = query.trim().toLowerCase()
    return currentStudents.filter((student) => {
      const status = dayAttendance[student.id]
      const matchStatus = filter === 'all' ? true : status === filter
      const matchQuery = q ? student.name.toLowerCase().includes(q) : true
      return matchStatus && matchQuery
    })
  }, [query, filter, dayAttendance, currentStudents])

  const printRows = useMemo(() => {
    const filledRows = currentStudents.map((student, index) => ({
      key: `print-${student.id}`,
      index: String(index + 1).padStart(2, '0'),
      name: student.name,
      status: dayAttendance[student.id] ? t[dayAttendance[student.id]] : t.notMarked,
      empty: false,
    }))
    const emptyRowsCount = Math.max(0, PRINT_TARGET_ROWS - filledRows.length)
    const emptyRows = Array.from({ length: emptyRowsCount }, (_, index) => ({
      key: `print-empty-${index}`,
      index: String(filledRows.length + index + 1).padStart(2, '0'),
      name: '',
      status: '',
      empty: true,
    }))
    return [...filledRows, ...emptyRows]
  }, [currentStudents, dayAttendance, t])

  const setStatus = (id, status) => {
    setAttendanceByDate((prev) => {
      const currentDay = { ...(prev[date] || {}) }
      if (!status) {
        delete currentDay[id]
      } else {
        currentDay[id] = status
      }
      return { ...prev, [date]: currentDay }
    })
  }

  const markAll = (status) => {
    setAttendanceByDate((prev) => {
      const currentDay = { ...(prev[date] || {}) }
      currentStudents.forEach((student) => {
        currentDay[student.id] = status
      })
      return { ...prev, [date]: currentDay }
    })
  }

  const clearDay = () => {
    setAttendanceByDate((prev) => {
      const currentDay = { ...(prev[date] || {}) }
      currentStudents.forEach((student) => delete currentDay[student.id])
      return { ...prev, [date]: currentDay }
    })
  }

  const openDialog = (type) => {
    setDialog({ type, value: '', error: '' })
  }

  const closeDialog = () => {
    setDialog({ type: null, value: '', error: '' })
  }

  const submitDialog = (event) => {
    event.preventDefault()
    const name = dialog.value.trim()
    if (!name) {
      setDialog((prev) => ({ ...prev, error: t.requiredField }))
      return
    }

    if (dialog.type === 'group') {
      const nextGroup = { id: makeId('g'), name, students: [] }
      setGroups((prev) => [...prev, nextGroup])
      setActiveGroupId(nextGroup.id)
      closeDialog()
      return
    }

    if (dialog.type === 'student' && activeGroup) {
      const nextStudent = { id: makeId('s'), name }
      setGroups((prev) =>
        prev.map((group) =>
          group.id === activeGroup.id
            ? { ...group, students: [...group.students, nextStudent] }
            : group,
        ),
      )
      closeDialog()
    }
  }

  const removeStudent = (studentId) => {
    if (!activeGroup) return

    setGroups((prev) =>
      prev.map((group) =>
        group.id === activeGroup.id
          ? { ...group, students: group.students.filter((student) => student.id !== studentId) }
          : group,
      ),
    )

    setAttendanceByDate((prev) => {
      const next = {}
      Object.entries(prev).forEach(([day, records]) => {
        const current = { ...records }
        delete current[studentId]
        next[day] = current
      })
      return next
    })
  }

  const openDeletePrompt = (student) => {
    setDeletePrompt({ open: true, studentId: student.id, studentName: student.name })
  }

  const closeDeletePrompt = () => {
    setDeletePrompt({ open: false, studentId: '', studentName: '' })
  }

  const confirmDeleteStudent = () => {
    if (!deletePrompt.studentId) return
    removeStudent(deletePrompt.studentId)
    closeDeletePrompt()
  }

  return (
    <div className="app" dir={isRtl ? 'rtl' : 'ltr'} lang={language}>
      <header className="app__header">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>Paper Present</h1>
          <p className="subtitle">{t.subtitle}</p>
        </div>
        <div className="header__actions">
          <label className="input input--inline input--language">
            <span className="label-with-icon">
              <span className="lang-icon" aria-hidden="true">
                Aa
              </span>
              {t.language}
            </span>
            <select
              value={language}
              onChange={(event) => {
                const nextLanguage = event.target.value
                setLanguage(nextLanguage)
                if (nextLanguage !== 'ar') setCalendarMode('solar')
              }}
            >
              {LANGUAGES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="input input--inline">
            <span>{t.teacher}</span>
            <input
              value={teacherName}
              onChange={(event) => setTeacherName(event.target.value)}
              placeholder={t.teacher}
            />
          </label>
          <label className="input input--inline">
            <span>{t.date}</span>
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
          {language === 'ar' && (
            <label className="input input--inline">
              <span>{t.calendar}</span>
              <select value={calendarMode} onChange={(event) => setCalendarMode(event.target.value)}>
                <option value="solar">{t.solarCalendar}</option>
                <option value="lunar">{t.lunarCalendar}</option>
              </select>
            </label>
          )}
          <label className="input input--inline">
            <span>{t.group}</span>
            <select value={effectiveGroupId} onChange={(event) => setActiveGroupId(event.target.value)}>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </label>
          <button className="btn btn--ghost" onClick={() => openDialog('group')}>
            {t.addGroup}
          </button>
          <button
            className="btn btn--ghost"
            onClick={() => openDialog('student')}
            disabled={!activeGroup}
          >
            {t.addStudent}
          </button>
          <button className="btn btn--dark" onClick={() => window.print()}>
            {t.print}
          </button>
        </div>
      </header>

      <main className="layout">
        <section className="panel panel--overview">
          <div className="card card--hero">
            <div>
              <p className="card__label">{t.classGroup}</p>
              <h2>{activeGroup?.name || '-'}</h2>
              <p className="card__meta">{formatDisplayDate(date, language, effectiveCalendarMode)}</p>
            </div>
            <div className="badge">
              <p>{t.marked}</p>
              <span>
                {stats.marked}/{stats.total}
              </span>
            </div>
          </div>

          <div className="stats">
            <div className="stat stat--present">
              <p>{t.present}</p>
              <h3>{stats.present}</h3>
            </div>
            <div className="stat stat--late">
              <p>{t.late}</p>
              <h3>{stats.late}</h3>
            </div>
            <div className="stat stat--absent">
              <p>{t.absent}</p>
              <h3>{stats.absent}</h3>
            </div>
          </div>

          <div className="card">
            <h4>{t.quickActions}</h4>
            <div className="actions">
              <button className="btn btn--ghost" onClick={() => markAll('present')}>
                {t.markAllPresent}
              </button>
              <button className="btn btn--ghost" onClick={() => markAll('late')}>
                {t.markAllLate}
              </button>
              <button className="btn btn--ghost" onClick={() => markAll('absent')}>
                {t.markAllAbsent}
              </button>
              <button className="btn btn--danger" onClick={clearDay}>
                {t.clearDay}
              </button>
            </div>
          </div>

          <div className="card">
            <h4>{t.legend}</h4>
            <div className="legend">
              <span className="pill pill--present">{t.present}</span>
              <span className="pill pill--late">{t.late}</span>
              <span className="pill pill--absent">{t.absent}</span>
              <span className="pill pill--unset">{t.notMarked}</span>
            </div>
          </div>

          <div className="card card--guide">
            <h4>{t.guideTitle}</h4>
            <ol className="guide">
              <li>{t.guide1}</li>
              <li>{t.guide2}</li>
              <li>{t.guide3}</li>
              <li>{t.guide4}</li>
              <li>{t.guide5}</li>
            </ol>
            <p className="guide__note">{t.guideTip}</p>
          </div>
        </section>

        <section className="panel panel--list">
          <div className="list__header">
            <div>
              <h3>{t.attendanceList}</h3>
              <p>
                {teacherName} - {currentStudents.length} {t.students}
              </p>
            </div>
            <div className="filters">
              <label className="input">
                <span>{t.search}</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t.searchPlaceholder}
                />
              </label>
              <div className="tabs">
                <button
                  className={filter === 'all' ? 'tab tab--active' : 'tab'}
                  onClick={() => setFilter('all')}
                >
                  {t.all}
                </button>
                {STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    className={filter === option.value ? 'tab tab--active' : 'tab'}
                    onClick={() => setFilter(option.value)}
                  >
                    {t[option.label]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="list">
            {filteredRoster.map((student, index) => {
              const status = dayAttendance[student.id]
              const statusClass = status ? STATUS_STYLES[status] : 'status--unset'
              return (
                <article
                  key={student.id}
                  className={`row ${statusClass}`}
                  onClick={() => setStatus(student.id, cycleStatus(status))}
                >
                  <div className="row__danger">
                    <button
                      className="mini mini--delete"
                      onClick={(event) => {
                        event.stopPropagation()
                        openDeletePrompt(student)
                      }}
                    >
                      {t.deleteStudent}
                    </button>
                  </div>
                  <div className="row__main">
                    <span className="row__index">{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <h4>{student.name}</h4>
                      <p>
                        {t.groupText} {activeGroup?.name || ''}
                      </p>
                    </div>
                  </div>
                  <div className="row__status">
                    <span className={`pill pill--${status || 'unset'}`}>
                      {status ? t[status] : t.notMarked}
                    </span>
                    <div className="signbar">
                      <span>{t.signLabel}</span>
                    </div>
                  </div>
                  <div className="row__actions">
                    {STATUS_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        className={`mini ${status === option.value ? 'mini--active' : ''}`}
                        onClick={(event) => {
                          event.stopPropagation()
                          setStatus(student.id, option.value)
                        }}
                      >
                        {t[option.label]}
                      </button>
                    ))}
                    <button
                      className="mini mini--clear"
                      onClick={(event) => {
                        event.stopPropagation()
                        setStatus(student.id, undefined)
                      }}
                    >
                      {t.clearDay}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </main>

      <section className="print-sheet">
        <header className="print-sheet__head">
          <h2>{t.printableSheet}</h2>
          <div className="print-sheet__meta">
            <p>
              <strong>{t.teacher}:</strong> {teacherName || '-'}
            </p>
            <p>
              <strong>{t.date}:</strong> {formatDisplayDate(date, language, effectiveCalendarMode)}
            </p>
            <p>
              <strong>{t.classGroup}:</strong> {activeGroup?.name || '-'}
            </p>
            <p>
              <strong>{t.totalLabel}:</strong> {currentStudents.length}
            </p>
          </div>
        </header>
        <div className="print-sheet__table-wrap">
          <table className="print-table">
            <thead>
              <tr>
                <th>{t.numberLabel}</th>
                <th>{t.studentLabel}</th>
                <th>{t.statusLabel}</th>
                <th>{t.signatureLabel}</th>
              </tr>
            </thead>
            <tbody>
              {printRows.map((row) => (
                <tr key={row.key}>
                  <td>{row.index}</td>
                  <td>{row.name}</td>
                  <td>{row.status}</td>
                  <td>
                    <span className={row.empty ? 'print-signline print-signline--empty' : 'print-signline'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="print-prof-sign">
          <p>{t.professorSignature}</p>
          <span className="print-prof-sign__line" />
        </div>
      </section>

      {dialog.type && (
        <div className="modal-backdrop" onClick={closeDialog}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="dialog-title">{dialog.type === 'group' ? t.addGroupTitle : t.addStudentTitle}</h3>
            <p className="modal__hint">
              {dialog.type === 'group' ? t.dialogHintGroup : t.dialogHintStudent}
            </p>
            <form className="modal__form" onSubmit={submitDialog}>
              <label className="input">
                <span>{dialog.type === 'group' ? t.promptGroup : t.promptStudent}</span>
                <input
                  ref={dialogInputRef}
                  value={dialog.value}
                  onChange={(event) =>
                    setDialog((prev) => ({ ...prev, value: event.target.value, error: '' }))
                  }
                />
              </label>
              {dialog.error && <p className="modal__error">{dialog.error}</p>}
              <div className="modal__actions">
                <button type="button" className="btn btn--ghost" onClick={closeDialog}>
                  {t.cancel}
                </button>
                <button type="submit" className="btn btn--dark">
                  {t.save}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {deletePrompt.open && (
        <div className="modal-backdrop" onClick={closeDeletePrompt}>
          <section className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <h3>{t.confirmDeleteTitle}</h3>
            <p className="modal__hint">{t.confirmDeleteBody}</p>
            <p>
              <strong>{deletePrompt.studentName}</strong>
            </p>
            <div className="modal__actions">
              <button type="button" className="btn btn--ghost" onClick={closeDeletePrompt}>
                {t.cancel}
              </button>
              <button type="button" className="btn btn--danger" onClick={confirmDeleteStudent}>
                {t.deleteAction}
              </button>
            </div>
          </section>
        </div>
      )}

      <footer className="footer">
        <p>{'\u00A9 2026 Marwan.M \u2014 All rights reserved.'}</p>
      </footer>
    </div>
  )
}

export default App
