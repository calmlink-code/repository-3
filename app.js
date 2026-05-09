// =====================================================================
// Supabase設定 - ここを自分のプロジェクトに合わせてください
// =====================================================================
const SUPABASE_URL = "https://dlsgxabfadfzduklievq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsc2d4YWJmYWRmemR1a2xpZXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMDk1NTIsImV4cCI6MjA5Mzg4NTU1Mn0.Jj8GElqAp7x7jN_kDr5uv6YY1lGRxT9V4YdMlcfsBAc";

// =====================================================================
// Supabase クライアント初期化
// =====================================================================
const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =====================================================================
// 定数
// =====================================================================
const STORAGE_KEY = "robot-school-shared-system-v1";
const BACKUP_STORAGE_KEY = `${STORAGE_KEY}-backups`;
const SAVE_META_KEY = `${STORAGE_KEY}-save-meta`;
const HANDLE_DB_NAME = "robot-school-shared-system-db";
const HANDLE_STORE_NAME = "app-settings";
const HANDLE_KEY = "backup-file-handle";
const BACKUP_LIMIT = 12;
const RECOMMENDED_BACKUP_PATH = "Supabase クラウドに自動保存";
const STUDENT_LIST_SECTION_CONFIG = [
  { title: "勝川教室", classroomNames: ["勝川教室"], days: ["月", "火", "木", "金", "土"] },
  { title: "大手教室", classroomNames: ["大手教室"], days: ["水", "日"] },
  { title: "あさひがおかこども園教室", classroomNames: ["あさひがおかこども園教室"] },
  { title: "味美幼稚園教室", classroomNames: ["味美幼稚園教室"] },
];
const ART_CLASS_NAMES = ["アート初級", "アート中級", "アート上級"];
const WEEKDAY_ORDER = ["月", "火", "水", "木", "金", "土", "日"];
const SATURDAY_SLOT_ORDER = ["10時", "13時", "15時", "17時"];
const CLASS_COLOR_PALETTE = [
  "#FFF36B", "#F8C9D8", "#9ED2FF", "#BCE88B", "#F6A3B8",
  "#FFD27F", "#C9B5FF", "#7AD4B5", "#F6F07A", "#F7B267",
  "#8EC5FF", "#D8E97B",
];

const seedState = {
  settings: { fiscalClosingMonth: 3 },
  classOptions: [
    { id: "co1", name: "ベーシック", sortOrder: 1 },
    { id: "co2", name: "アドバンス", sortOrder: 2 },
    { id: "co3", name: "マスター", sortOrder: 3 },
  ],
  classrooms: [
    { id: "c1", name: "自由が丘教室", manager: "田中先生", days: "火・木" },
    { id: "c2", name: "武蔵小杉教室", manager: "佐藤先生", days: "水・土" },
    { id: "c3", name: "たまプラーザ教室", manager: "鈴木先生", days: "月・金" },
  ],
  users: [
    { id: "u1", name: "田中先生", email: "tanaka@example.com", password: "tanaka123", role: "教室責任者", classroomId: "c1" },
    { id: "u2", name: "佐藤先生", email: "sato@example.com", password: "sato1234", role: "先生", classroomId: "c2" },
    { id: "u3", name: "鈴木先生", email: "suzuki@example.com", password: "suzuki123", role: "教室責任者", classroomId: "c3" },
    { id: "u4", name: "本部スタッフ", email: "hq@example.com", password: "hq123456", role: "本部", classroomId: "all" },
  ],
  students: [
    { id: "s1", name: "山田 太郎", classroomId: "c1", classOptionId: "co1", status: "在籍", tuition: 13200, guardian: "山田 花子", phone: "090-1111-1111", email: "yamada@example.com", weekdays: ["火"], saturdaySlots: [] },
    { id: "s2", name: "高橋 陽斗", classroomId: "c1", classOptionId: "co2", status: "在籍", tuition: 13200, guardian: "高橋 真理", phone: "090-2222-2222", email: "takahashi@example.com", weekdays: ["木"], saturdaySlots: [] },
    { id: "s3", name: "鈴木 花", classroomId: "c1", classOptionId: "co1", status: "在籍", tuition: 13200, guardian: "鈴木 一郎", phone: "090-3333-3333", email: "suzuki-family@example.com", weekdays: ["火", "木"], saturdaySlots: [] },
    { id: "s4", name: "伊藤 結菜", classroomId: "c2", classOptionId: "co1", status: "在籍", tuition: 12100, guardian: "伊藤 純子", phone: "090-4444-4444", email: "ito@example.com", weekdays: ["水"], saturdaySlots: [] },
    { id: "s5", name: "中村 蒼", classroomId: "c2", classOptionId: "co3", status: "在籍", tuition: 12100, guardian: "中村 健", phone: "090-5555-5555", email: "nakamura@example.com", weekdays: ["土"], saturdaySlots: ["13時"] },
    { id: "s6", name: "小林 凛", classroomId: "c3", classOptionId: "co1", status: "在籍", tuition: 12100, guardian: "小林 明美", phone: "090-6666-6666", email: "kobayashi@example.com", weekdays: ["月"], saturdaySlots: [] },
    { id: "s7", name: "加藤 新", classroomId: "c3", classOptionId: "co2", status: "在籍", tuition: 12100, guardian: "加藤 香織", phone: "090-7777-7777", email: "kato@example.com", weekdays: ["金"], saturdaySlots: [] },
  ],
  attendance: [
    { id: "a1", date: "2026-04-28", classroomId: "c1", studentId: "s1", status: "出席", transfer: "なし", teacher: "田中先生", note: "" },
    { id: "a2", date: "2026-04-28", classroomId: "c1", studentId: "s2", status: "欠席", transfer: "木曜クラス", teacher: "田中先生", note: "保護者連絡済み" },
    { id: "a3", date: "2026-04-28", classroomId: "c2", studentId: "s4", status: "出席", transfer: "なし", teacher: "佐藤先生", note: "" },
    { id: "a4", date: "2026-04-28", classroomId: "c3", studentId: "s7", status: "遅刻", transfer: "なし", teacher: "鈴木先生", note: "10分遅れ" },
    { id: "a5", date: "2026-04-22", classroomId: "c3", studentId: "s6", status: "出席", transfer: "なし", teacher: "鈴木先生", note: "" },
  ],
  billing: [
    { id: "b1", month: "2026-04", classroomId: "c1", studentId: "s2", billed: 13200, paid: 0, paidDate: "", method: "口座振替", note: "4/30再案内" },
    { id: "b2", month: "2026-04", classroomId: "c1", studentId: "s1", billed: 13200, paid: 13200, paidDate: "2026-04-05", method: "口座振替", note: "" },
    { id: "b3", month: "2026-04", classroomId: "c3", studentId: "s7", billed: 12100, paid: 6000, paidDate: "2026-04-20", method: "振込", note: "分割対応中" },
    { id: "b4", month: "2026-04", classroomId: "c2", studentId: "s4", billed: 12100, paid: 12100, paidDate: "2026-04-06", method: "現金", note: "" },
  ],
  handovers: [
    { id: "h1", classroomId: "c1", category: "欠席フォロー", studentId: "s2", author: "田中先生", title: "高橋陽斗くん欠席", body: "木曜クラスへの振替候補。保護者了承済み。", createdAt: "2026-04-28T10:00:00" },
    { id: "h2", classroomId: "c3", category: "集金フォロー", studentId: "s7", author: "鈴木先生", title: "4月分一部入金", body: "残額6,100円。5月前半に再確認予定。", createdAt: "2026-04-28T09:00:00" },
    { id: "h3", classroomId: "c2", category: "授業準備", studentId: "", author: "佐藤先生", title: "来週の体験対応", body: "教材セットを2名分事前準備したいです。", createdAt: "2026-04-27T18:30:00" },
  ],
  incidentalSales: [],
};

// =====================================================================
// グローバル状態
// =====================================================================
const state = {
  settings: { fiscalClosingMonth: 3 },
  classOptions: [],
  classrooms: [],
  users: [],
  students: [],
  attendance: [],
  billing: [],
  handovers: [],
  incidentalSales: [],
};
let backupSnapshots = loadBackupSnapshots();
let saveMeta = loadSaveMeta();
let currentUser = null;
let currentView = "dashboard";
let currentFilter = "all";
let toastTimer = null;
let backupFileHandle = null;
let externalBackupTimer = null;
const currentSubView = {
  attendance: "entry",
  billing: "entry",
  handover: "entry",
  master: "entry",
};
const formEditState = {
  classOption: null,
  incidentalSale: null,
  attendance: null,
  billing: null,
  handover: null,
  classroom: null,
  teacher: null,
  student: null,
};

// =====================================================================
// Supabase データ変換ヘルパー
// =====================================================================
function dbToStudent(row) {
  return {
    id: row.id,
    name: row.name,
    classroomId: row.classroom_id,
    classOptionId: row.class_option_id,
    status: row.status,
    tuition: row.tuition,
    guardian: row.guardian,
    phone: row.phone,
    email: row.email,
    weekdays: Array.isArray(row.weekdays) ? row.weekdays : [],
    saturdaySlots: Array.isArray(row.saturday_slots) ? row.saturday_slots : [],
    startMonth: row.start_month || "",
  };
}

function studentToDb(s) {
  return {
    id: s.id,
    name: s.name,
    classroom_id: s.classroomId,
    class_option_id: s.classOptionId,
    status: s.status,
    tuition: s.tuition,
    guardian: s.guardian,
    phone: s.phone,
    email: s.email,
    weekdays: s.weekdays,
    saturday_slots: s.saturdaySlots,
    start_month: s.startMonth,
  };
}

function dbToAttendance(row) {
  return {
    id: row.id,
    date: row.date,
    classroomId: row.classroom_id,
    studentId: row.student_id,
    status: row.status,
    transfer: row.transfer,
    teacher: row.teacher,
    note: row.note,
  };
}

function attendanceToDb(a) {
  return {
    id: a.id,
    date: a.date,
    classroom_id: a.classroomId,
    student_id: a.studentId,
    status: a.status,
    transfer: a.transfer,
    teacher: a.teacher,
    note: a.note,
  };
}

function dbToBilling(row) {
  return {
    id: row.id,
    month: row.month,
    classroomId: row.classroom_id,
    studentId: row.student_id,
    billed: row.billed,
    paid: row.paid,
    paidDate: row.paid_date,
    method: row.method,
    note: row.note,
  };
}

function billingToDb(b) {
  return {
    id: b.id,
    month: b.month,
    classroom_id: b.classroomId,
    student_id: b.studentId,
    billed: b.billed,
    paid: b.paid,
    paid_date: b.paidDate,
    method: b.method,
    note: b.note,
  };
}

function dbToHandover(row) {
  return {
    id: row.id,
    classroomId: row.classroom_id,
    category: row.category,
    studentId: row.student_id,
    author: row.author,
    title: row.title,
    body: row.body,
    createdAt: row.created_at,
  };
}

function handoverToDb(h) {
  return {
    id: h.id,
    classroom_id: h.classroomId,
    category: h.category,
    student_id: h.studentId,
    author: h.author,
    title: h.title,
    body: h.body,
    created_at: h.createdAt,
  };
}

function dbToClassroom(row) {
  return { id: row.id, name: row.name, manager: row.manager, days: row.days };
}

function classroomToDb(c) {
  return { id: c.id, name: c.name, manager: c.manager, days: c.days };
}

function dbToUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    role: row.role,
    classroomId: row.classroom_id,
  };
}

function userToDb(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    password: u.password,
    role: u.role,
    classroom_id: u.classroomId,
  };
}

function dbToClassOption(row) {
  return { id: row.id, name: row.name, sortOrder: row.sort_order };
}

function classOptionToDb(c) {
  return { id: c.id, name: c.name, sort_order: c.sortOrder };
}

function dbToIncidentalSale(row) {
  return {
    id: row.id,
    month: row.month,
    name: row.name,
    content: row.content,
    amount: row.amount,
    note: row.note,
  };
}

function incidentalSaleToDb(i) {
  return {
    id: i.id,
    month: i.month,
    name: i.name,
    content: i.content,
    amount: i.amount,
    note: i.note,
  };
}

// =====================================================================
// Supabase データ読み込み
// =====================================================================
async function loadStateFromSupabase() {
  showLoadingOverlay(true);
  try {
    const [
      { data: settings },
      { data: classOptions },
      { data: classrooms },
      { data: users },
      { data: students },
      { data: attendance },
      { data: billing },
      { data: handovers },
      { data: incidentalSales },
    ] = await Promise.all([
      sb.from("settings").select("*").eq("id", "main").single(),
      sb.from("class_options").select("*"),
      sb.from("classrooms").select("*"),
      sb.from("users").select("*"),
      sb.from("students").select("*"),
      sb.from("attendance").select("*"),
      sb.from("billing").select("*"),
      sb.from("handovers").select("*"),
      sb.from("incidental_sales").select("*"),
    ]);

    const isEmpty = !classrooms || classrooms.length === 0;

    if (isEmpty) {
      // 初回: シードデータを投入
      await seedSupabase();
      return;
    }

    state.settings = { fiscalClosingMonth: settings?.fiscal_closing_month || 3 };
    state.classOptions = (classOptions || []).map(dbToClassOption).sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "ja"));
    state.classrooms = (classrooms || []).map(dbToClassroom);
    state.users = (users || []).map(dbToUser);
    state.students = (students || []).map(dbToStudent);
    state.attendance = (attendance || []).map(dbToAttendance);
    state.billing = (billing || []).map(dbToBilling);
    state.handovers = (handovers || []).map(dbToHandover);
    state.incidentalSales = (incidentalSales || []).map(dbToIncidentalSale);

    saveMeta.lastSavedAt = new Date().toISOString();
    persistSaveMeta();
  } catch (err) {
    console.error("Supabase読み込みエラー:", err);
    showToast("データの読み込みに失敗しました");
  } finally {
    showLoadingOverlay(false);
  }
}

// =====================================================================
// 初回シードデータ投入
// =====================================================================
async function seedSupabase() {
  try {
    await Promise.all([
      sb.from("class_options").insert(seedState.classOptions.map(classOptionToDb)),
      sb.from("classrooms").insert(seedState.classrooms.map(classroomToDb)),
      sb.from("users").insert(seedState.users.map(userToDb)),
      sb.from("students").insert(seedState.students.map(studentToDb)),
      sb.from("attendance").insert(seedState.attendance.map(attendanceToDb)),
      sb.from("billing").insert(seedState.billing.map(billingToDb)),
      sb.from("handovers").insert(seedState.handovers.map(handoverToDb)),
      sb.from("settings").upsert({ id: "main", fiscal_closing_month: 3 }),
    ]);
    await loadStateFromSupabase();
  } catch (err) {
    console.error("シードデータ投入エラー:", err);
    showToast("初期データの投入に失敗しました");
    showLoadingOverlay(false);
  }
}

// =====================================================================
// Supabase 書き込み
// =====================================================================
async function saveState(options = {}) {
  const { label = "自動保存" } = options;
  saveMeta.lastSavedAt = new Date().toISOString();
  persistSaveMeta();
  // ローカルスナップショット（復元点用）は引き続き保持
  if (!options.skipSnapshot) createBackupSnapshot(label);
}

// 個別テーブルのupsert関数
async function upsertRecord(table, dbRow) {
  const { error } = await sb.from(table).upsert(dbRow);
  if (error) { console.error(`upsert ${table} error:`, error); showToast("保存に失敗しました"); }
}

async function deleteRecord(table, id) {
  const { error } = await sb.from(table).delete().eq("id", id);
  if (error) { console.error(`delete ${table} error:`, error); showToast("削除に失敗しました"); }
}

// =====================================================================
// バックアップ（localStorageに復元点のみ保持）
// =====================================================================
function loadBackupSnapshots() {
  const saved = localStorage.getItem(BACKUP_STORAGE_KEY);
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) { return []; }
}

function saveBackupSnapshots() {
  localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(backupSnapshots));
}

function loadSaveMeta() {
  const saved = localStorage.getItem(SAVE_META_KEY);
  if (!saved) return { externalFileName: "", lastSavedAt: "", lastExternalSavedAt: "" };
  try {
    return { externalFileName: "", lastSavedAt: "", lastExternalSavedAt: "", ...JSON.parse(saved) };
  } catch (_error) {
    return { externalFileName: "", lastSavedAt: "", lastExternalSavedAt: "" };
  }
}

function persistSaveMeta() {
  localStorage.setItem(SAVE_META_KEY, JSON.stringify(saveMeta));
}

function snapshotCounts(s) {
  return `${s.classrooms.length}教室 / ${s.students.length}名 / 出席${s.attendance.length}件 / 集金${s.billing.length}件`;
}

function createBackupSnapshot(label = "自動保存") {
  const snap = structuredClone(state);
  backupSnapshots = [
    {
      id: makeId("backup"),
      label,
      savedAt: new Date().toISOString(),
      summary: snapshotCounts(snap),
      payload: JSON.stringify(snap),
    },
    ...backupSnapshots,
  ].slice(0, BACKUP_LIMIT);
  saveBackupSnapshots();
}

async function restoreBackupSnapshot(snapshotId) {
  const snapshot = backupSnapshots.find((item) => item.id === snapshotId);
  if (!snapshot) { showToast("復元点が見つかりません"); return; }
  try {
    const parsed = JSON.parse(snapshot.payload);
    await overwriteStateToSupabase(parsed, `復元: ${snapshot.label}`);
    showToast("復元点からデータを戻しました");
  } catch (_error) {
    showToast("復元に失敗しました");
  }
}

async function overwriteStateToSupabase(nextState, saveLabel) {
  showLoadingOverlay(true);
  try {
    // 全テーブルをnextStateで上書き
    await Promise.all([
      sb.from("class_options").delete().neq("id", ""),
      sb.from("classrooms").delete().neq("id", ""),
      sb.from("users").delete().neq("id", ""),
      sb.from("students").delete().neq("id", ""),
      sb.from("attendance").delete().neq("id", ""),
      sb.from("billing").delete().neq("id", ""),
      sb.from("handovers").delete().neq("id", ""),
      sb.from("incidental_sales").delete().neq("id", ""),
    ]);
    await Promise.all([
      nextState.classOptions.length && sb.from("class_options").insert(nextState.classOptions.map(classOptionToDb)),
      nextState.classrooms.length && sb.from("classrooms").insert(nextState.classrooms.map(classroomToDb)),
      nextState.users.length && sb.from("users").insert(nextState.users.map(userToDb)),
      nextState.students.length && sb.from("students").insert(nextState.students.map(studentToDb)),
      nextState.attendance.length && sb.from("attendance").insert(nextState.attendance.map(attendanceToDb)),
      nextState.billing.length && sb.from("billing").insert(nextState.billing.map(billingToDb)),
      nextState.handovers.length && sb.from("handovers").insert(nextState.handovers.map(handoverToDb)),
      sb.from("settings").upsert({ id: "main", fiscal_closing_month: nextState.settings?.fiscalClosingMonth || 3 }),
    ].filter(Boolean));
    await loadStateFromSupabase();
    createBackupSnapshot(saveLabel);
    if (currentUser) {
      currentUser = state.users.find((u) => u.id === currentUser.id) || state.users[0] || null;
      if (currentUser) renderApp();
    }
    renderSaveStatus();
  } catch (err) {
    console.error("上書き保存エラー:", err);
    showToast("保存に失敗しました");
  } finally {
    showLoadingOverlay(false);
  }
}

async function resetState() {
  await overwriteStateToSupabase(seedState, "初期データに戻す");
}

// =====================================================================
// ローディングオーバーレイ
// =====================================================================
function showLoadingOverlay(visible) {
  const overlay = document.getElementById("loading-overlay");
  if (overlay) overlay.classList.toggle("hidden", !visible);
}

// =====================================================================
// ユーティリティ
// =====================================================================
function makeId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function yen(value) {
  return `${Number(value || 0).toLocaleString("ja-JP")}円`;
}

function formatDateTime(dateString) {
  if (!dateString) return "未記録";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "未記録";
  return date.toLocaleString("ja-JP", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

function weekdaysText(student) {
  if (!student.weekdays?.length) return "-";
  return student.weekdays.map((weekday) => {
    if (weekday !== "土") return weekday;
    if (!student.saturdaySlots?.length) return "土";
    return `土(${student.saturdaySlots.join("・")})`;
  }).join("・");
}

function escapeXml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

function japaneseWeekdayFromDate(dateStr) {
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const date = new Date(`${dateStr}T00:00:00`);
  return weekdays[date.getDay()];
}

function getClassroom(classroomId) {
  return state.classrooms.find((item) => item.id === classroomId);
}

function getStudent(studentId) {
  return state.students.find((item) => item.id === studentId);
}

function getClassOption(classOptionId) {
  return state.classOptions.find((item) => item.id === classOptionId);
}

function buildClassColorStyleMap() {
  const classNames = [
    ...state.classOptions.map((item) => item.name),
    ...ART_CLASS_NAMES.filter((name) => !state.classOptions.some((item) => item.name === name)),
  ];
  return classNames.reduce((map, className, index) => {
    map[className] = {
      styleId: `styleCourse${index + 1}`,
      color: CLASS_COLOR_PALETTE[index % CLASS_COLOR_PALETTE.length],
    };
    return map;
  }, {});
}

function classColorStyleId(className) {
  const colorMap = buildClassColorStyleMap();
  return colorMap[className]?.styleId || "styleNameDefault";
}

function exportTargetStudents() {
  return state.students.filter((student) => student.status !== "休会");
}

function studentMatchesDayLabel(student, label) {
  if (label === "土") {
    return (student.weekdays || []).includes("土") && !(student.saturdaySlots || []).length;
  }
  if (label.startsWith("土")) {
    const slot = label.replace("土", "");
    return (student.weekdays || []).includes("土") && (student.saturdaySlots || []).includes(slot);
  }
  return (student.weekdays || []).includes(label);
}

function expandConfiguredDays(days, students) {
  const labels = [];
  days.forEach((day) => {
    if (day !== "土") { labels.push(day); return; }
    SATURDAY_SLOT_ORDER.forEach((slot) => {
      if (students.some((s) => (s.weekdays || []).includes("土") && (s.saturdaySlots || []).includes(slot))) {
        labels.push(`土${slot}`);
      }
    });
    if (students.some((s) => (s.weekdays || []).includes("土") && !(s.saturdaySlots || []).length)) {
      labels.push("土");
    }
  });
  return labels;
}

function studentClassName(student) {
  return getClassOption(student.classOptionId)?.name || "未設定";
}

function isArtStudent(student) {
  return ART_CLASS_NAMES.includes(studentClassName(student));
}

function findSectionDays(students) {
  const days = [];
  WEEKDAY_ORDER.forEach((weekday) => {
    if (weekday !== "土") {
      if (students.some((s) => (s.weekdays || []).includes(weekday))) days.push(weekday);
      return;
    }
    SATURDAY_SLOT_ORDER.forEach((slot) => {
      if (students.some((s) => (s.weekdays || []).includes("土") && (s.saturdaySlots || []).includes(slot))) {
        days.push(`土${slot}`);
      }
    });
    if (students.some((s) => (s.weekdays || []).includes("土") && !(s.saturdaySlots || []).length)) {
      days.push("土");
    }
  });
  return days;
}

function sectionStudentsByDay(students, days) {
  return days.map((weekday) => ({
    weekday,
    students: students
      .filter((s) => studentMatchesDayLabel(s, weekday))
      .sort((a, b) => a.name.localeCompare(b.name, "ja")),
  }));
}

function buildStudentListSections() {
  const activeStudents = exportTargetStudents();
  const regularStudents = activeStudents.filter((s) => !isArtStudent(s));
  const artStudents = activeStudents.filter((s) => isArtStudent(s));
  const sections = [];
  const usedClassrooms = new Set();

  STUDENT_LIST_SECTION_CONFIG.forEach((config) => {
    const sectionStudents = regularStudents.filter((s) => config.classroomNames.includes(getClassroom(s.classroomId)?.name || ""));
    config.classroomNames.forEach((name) => usedClassrooms.add(name));
    if (!sectionStudents.length) return;
    const days = config.days?.length ? expandConfiguredDays(config.days, sectionStudents) : findSectionDays(sectionStudents);
    sections.push({ title: config.title, type: "regular", dayGroups: sectionStudentsByDay(sectionStudents, days) });
  });

  const unmatchedStudents = regularStudents.filter((s) => !usedClassrooms.has(getClassroom(s.classroomId)?.name || ""));
  const unmatchedByClassroom = unmatchedStudents.reduce((map, s) => {
    const classroomName = getClassroom(s.classroomId)?.name || "未設定教室";
    if (!map.has(classroomName)) map.set(classroomName, []);
    map.get(classroomName).push(s);
    return map;
  }, new Map());
  unmatchedByClassroom.forEach((students, classroomName) => {
    sections.push({ title: classroomName, type: "regular", dayGroups: sectionStudentsByDay(students, findSectionDays(students)) });
  });

  if (artStudents.length) {
    sections.push({
      title: "アートクラス",
      type: "art",
      dayGroups: ART_CLASS_NAMES.map((className) => ({
        weekday: className,
        students: artStudents.filter((s) => studentClassName(s) === className).sort((a, b) => a.name.localeCompare(b.name, "ja")),
      })).filter((g) => g.students.length),
    });
  }
  return sections;
}

function weekdayTotals(students) {
  const totals = [];
  WEEKDAY_ORDER.forEach((weekday) => {
    if (weekday !== "土") {
      totals.push({ weekday, count: students.filter((s) => (s.weekdays || []).includes(weekday)).length });
      return;
    }
    SATURDAY_SLOT_ORDER.forEach((slot) => {
      totals.push({
        weekday: `土${slot}`,
        count: students.filter((s) => (s.weekdays || []).includes("土") && (s.saturdaySlots || []).includes(slot)).length,
      });
    });
    const noSlotCount = students.filter((s) => (s.weekdays || []).includes("土") && !(s.saturdaySlots || []).length).length;
    if (noSlotCount) totals.push({ weekday: "土", count: noSlotCount });
  });
  return totals;
}

function xmlCell(content, styleId = "styleCell", dataType = "String", mergeAcross = 0) {
  const mergeAttr = mergeAcross ? ` ss:MergeAcross="${mergeAcross}"` : "";
  return `<Cell ss:StyleID="${styleId}"${mergeAttr}><Data ss:Type="${dataType}">${escapeXml(content)}</Data></Cell>`;
}

function emptyCells(count, styleId = "styleCell") {
  return Array.from({ length: count }, () => xmlCell("", styleId)).join("");
}

function buildStudentListExcelXml() {
  const sections = buildStudentListSections();
  const students = exportTargetStudents();
  const classStyleMap = buildClassColorStyleMap();
  const maxNames = Math.max(6, ...sections.flatMap((s) => s.dayGroups.map((g) => g.students.length)));
  const totalColumns = 3 + maxNames;
  const rows = [];
  const legendItems = [...Object.entries(classStyleMap).map(([label, style]) => ({ label, styleId: style.styleId }))];

  rows.push(`<Row ss:Height="30">${xmlCell("曜日別 生徒一覧", "styleTitle", "String", totalColumns - 1)}</Row>`);
  rows.push(`<Row>${xmlCell(`出力日時: ${formatDateTime(new Date().toISOString())}`, "styleMeta", "String", totalColumns - 1)}</Row>`);
  rows.push(`<Row>${xmlCell("参考レイアウトに合わせた印刷用名簿", "styleMeta", "String", totalColumns - 1)}</Row>`);
  rows.push("<Row/>");

  sections.forEach((section) => {
    const visibleGroups = section.dayGroups.length ? section.dayGroups : [{ weekday: "-", students: [] }];
    rows.push(`<Row ss:Height="23">${xmlCell(section.title, "styleSection", "String", totalColumns - 1)}</Row>`);
    visibleGroups.forEach((group, index) => {
      const rowCells = [
        xmlCell(index === 0 ? (section.type === "art" ? "アート" : section.title) : "", "styleCategory"),
        xmlCell(group.weekday, "styleDayLabel"),
      ];
      group.students.forEach((s) => { rowCells.push(xmlCell(s.name, classColorStyleId(studentClassName(s)))); });
      rowCells.push(...Array.from({ length: Math.max(0, maxNames - group.students.length) }, () => xmlCell("", "styleCell")));
      rowCells.push(xmlCell(group.students.length, "styleCountStrong", "Number"));
      rows.push(`<Row ss:Height="22">${rowCells.join("")}</Row>`);
    });
    rows.push("<Row/>");
  });

  rows.push(`<Row ss:Height="22">${xmlCell("色分け凡例", "styleLegendTitle", "String", totalColumns - 1)}</Row>`);
  for (let index = 0; index < legendItems.length; index += 4) {
    const items = legendItems.slice(index, index + 4);
    const rowCells = [];
    items.forEach((item) => {
      rowCells.push(xmlCell(item.label, item.styleId));
      rowCells.push(xmlCell("", "styleLegendSpacer"));
    });
    rows.push(`<Row>${rowCells.join("")}${emptyCells(Math.max(0, totalColumns - rowCells.length))}</Row>`);
  }

  const totals = weekdayTotals(students);
  rows.push("<Row/>");
  rows.push(`<Row ss:Height="22">${xmlCell("曜日ごとの合計", "styleLegendTitle", "String", totalColumns - 1)}</Row>`);
  rows.push(`<Row>${totals.map((item) => xmlCell(item.weekday, "styleHeaderCompact")).join("")}${emptyCells(totalColumns - totals.length, "styleHeaderCompact")}</Row>`);
  rows.push(`<Row>${totals.map((item) => xmlCell(item.count, "styleCountStrong", "Number")).join("")}${emptyCells(totalColumns - totals.length)}</Row>`);
  rows.push("<Row/>");
  rows.push(`<Row ss:Height="28">${xmlCell("生徒数", "styleTotalLabel", "String", totalColumns - 2)}${xmlCell(students.length, "styleTotalValue", "Number")}</Row>`);

  const columns = [
    `<Column ss:Width="110"/>`,
    `<Column ss:Width="72"/>`,
    ...Array.from({ length: maxNames }, () => `<Column ss:Width="74"/>`),
    `<Column ss:Width="48"/>`,
  ].join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal"><Alignment ss:Vertical="Center"/><Font ss:FontName="Meiryo" ss:Size="10"/></Style>
  <Style ss:ID="styleTitle"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="Meiryo" ss:Size="16" ss:Bold="1"/><Interior ss:Color="#D6E8FF" ss:Pattern="Solid"/></Style>
  <Style ss:ID="styleMeta"><Font ss:FontName="Meiryo" ss:Size="9"/></Style>
  <Style ss:ID="styleSection"><Alignment ss:Vertical="Center"/><Font ss:FontName="Meiryo" ss:Size="11" ss:Bold="1"/><Interior ss:Color="#BBD7F5" ss:Pattern="Solid"/></Style>
  <Style ss:ID="styleCategory"><Alignment ss:Vertical="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders><Interior ss:Color="#F3F7FB" ss:Pattern="Solid"/></Style>
  <Style ss:ID="styleDayLabel"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="Meiryo" ss:Size="10" ss:Bold="1"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders><Interior ss:Color="#E9F3FF" ss:Pattern="Solid"/></Style>
  <Style ss:ID="styleHeader"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="Meiryo" ss:Size="10" ss:Bold="1"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders><Interior ss:Color="#EFF6FF" ss:Pattern="Solid"/></Style>
  <Style ss:ID="styleHeaderCompact"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="Meiryo" ss:Size="9" ss:Bold="1"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders><Interior ss:Color="#EFF6FF" ss:Pattern="Solid"/></Style>
  <Style ss:ID="styleCell"><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>
  <Style ss:ID="styleCount"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders><Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/></Style>
  <Style ss:ID="styleCountStrong"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="Meiryo" ss:Size="10" ss:Bold="1"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders><Interior ss:Color="#FFF8D6" ss:Pattern="Solid"/></Style>
  <Style ss:ID="styleNameDefault"><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders><Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/></Style>
  ${Object.values(classStyleMap).map((style) => `<Style ss:ID="${style.styleId}"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders><Interior ss:Color="${style.color}" ss:Pattern="Solid"/></Style>`).join("")}
  <Style ss:ID="styleLegendTitle"><Font ss:FontName="Meiryo" ss:Size="10" ss:Bold="1"/><Interior ss:Color="#DCEAFE" ss:Pattern="Solid"/></Style>
  <Style ss:ID="styleLegendSpacer"><Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/></Style>
  <Style ss:ID="styleTotalLabel"><Alignment ss:Horizontal="Right" ss:Vertical="Center"/><Font ss:FontName="Meiryo" ss:Bold="1"/><Interior ss:Color="#DCEAFE" ss:Pattern="Solid"/></Style>
  <Style ss:ID="styleTotalValue"><Alignment ss:Horizontal="Center"/><Font ss:FontName="Meiryo" ss:Size="16" ss:Bold="1"/><Interior ss:Color="#DCEAFE" ss:Pattern="Solid"/></Style>
 </Styles>
 <Worksheet ss:Name="生徒一覧">
  <Table ss:ExpandedColumnCount="${totalColumns}" ss:ExpandedRowCount="${rows.length}">
   ${columns}
   ${rows.join("")}
  </Table>
  <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
   <PageSetup><Layout x:Orientation="Portrait"/><Header x:Margin="0.3"/><Footer x:Margin="0.3"/><PageMargins x:Bottom="0.5" x:Left="0.3" x:Right="0.3" x:Top="0.5"/></PageSetup>
   <Print><ValidPrinterInfo/><PaperSizeIndex>9</PaperSizeIndex><Scale>80</Scale><FitWidth>1</FitWidth><FitHeight>0</FitHeight></Print>
   <Selected/><ProtectObjects>False</ProtectObjects><ProtectScenarios>False</ProtectScenarios>
  </WorksheetOptions>
 </Worksheet>
</Workbook>`;
}

function exportStudentListExcel() {
  const xml = buildStudentListExcelXml();
  const blob = new Blob([`\uFEFF${xml}`], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `student-list-${todayDate()}.xls`;
  anchor.click();
  URL.revokeObjectURL(url);
  showToast("生徒一覧Excelを出力しました");
}

function buildSalesReportExcelXml() {
  const monthlyRows = monthlySalesRows();
  const detailRowsByMonth = monthlySalesDetailRowsByMonth();
  const totalPaid = monthlyRows.reduce((sum, item) => sum + item.paid, 0);
  const totalUnpaid = monthlyRows.reduce((sum, item) => sum + item.unpaid, 0);

  const summaryRows = monthlyRows.map((item) => `
    <Row>
      ${xmlCell(monthLabel(item.month), "styleCell")}
      ${xmlCell(item.billed, "styleMoney", "Number")}
      ${xmlCell(item.paid, "styleMoney", "Number")}
      ${xmlCell(item.unpaid, "styleMoney", "Number")}
      ${xmlCell(item.paidCount, "styleCount", "Number")}
      ${xmlCell(item.unpaidCount, "styleCount", "Number")}
      ${xmlCell("", "styleCell")}
    </Row>`).join("");

  const detailSheets = Object.entries(detailRowsByMonth)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([month, rows]) => {
      const totalAmount = rows.reduce((sum, item) => sum + Number(item.amount || 0), 0);
      const detailRows = [
        `<Row ss:Height="24">${xmlCell(`${monthLabel(month)} 詳細`, "styleSectionTitle", "String", 3)}</Row>`,
        `<Row>${xmlCell("区分", "styleHeader")}${xmlCell("生徒名 / 名前", "styleHeader")}${xmlCell("内容", "styleHeader")}${xmlCell("金額", "styleHeader")}</Row>`,
        ...(rows.length
          ? rows.map((item) => `<Row>${xmlCell(item.category, "styleCell")}${xmlCell(item.name, "styleCell")}${xmlCell(item.content, "styleCell")}${xmlCell(item.amount, "styleMoney", "Number")}</Row>`)
          : [`<Row>${xmlCell("データなし", "styleCell", "String", 3)}${xmlCell(0, "styleMoney", "Number")}</Row>`]),
        `<Row>${xmlCell("合計", "styleHeader", "String", 2)}${xmlCell(totalAmount, "styleMoney", "Number")}</Row>`,
      ].join("");
      return `<Worksheet ss:Name="${escapeXml(sheetNameForMonth(month))}"><Table ss:ExpandedColumnCount="4" ss:ExpandedRowCount="${rows.length + 3}"><Column ss:Width="90"/><Column ss:Width="150"/><Column ss:Width="240"/><Column ss:Width="90"/>${detailRows}</Table></Worksheet>`;
    }).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal"><Alignment ss:Vertical="Center"/><Font ss:FontName="Meiryo" ss:Size="10"/></Style>
  <Style ss:ID="styleTitle"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="Meiryo" ss:Size="15" ss:Bold="1"/><Interior ss:Color="#DCEAFE" ss:Pattern="Solid"/></Style>
  <Style ss:ID="styleSectionTitle"><Alignment ss:Horizontal="Left" ss:Vertical="Center"/><Font ss:FontName="Meiryo" ss:Size="11" ss:Bold="1"/><Interior ss:Color="#E0F2FE" ss:Pattern="Solid"/></Style>
  <Style ss:ID="styleMeta"><Font ss:FontName="Meiryo" ss:Size="9"/></Style>
  <Style ss:ID="styleHeader"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="Meiryo" ss:Bold="1"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders><Interior ss:Color="#EFF6FF" ss:Pattern="Solid"/></Style>
  <Style ss:ID="styleCell"><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>
  <Style ss:ID="styleMoney"><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders><NumberFormat ss:Format="#,##0円"/></Style>
  <Style ss:ID="styleCount"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>
  <Style ss:ID="styleManual"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders><Interior ss:Color="#DBEAFE" ss:Pattern="Solid"/></Style>
 </Styles>
 <Worksheet ss:Name="売上表">
  <Table ss:ExpandedColumnCount="7" ss:ExpandedRowCount="${monthlyRows.length + 5}">
   <Column ss:Width="90"/><Column ss:Width="90"/><Column ss:Width="150"/><Column ss:Width="180"/><Column ss:Width="90"/><Column ss:Width="80"/><Column ss:Width="80"/>
   <Row ss:Height="26">${xmlCell("売上表", "styleTitle", "String", 6)}</Row>
   <Row>${xmlCell(`決算月: ${state.settings.fiscalClosingMonth}月 / 出力日: ${todayDate()}`, "styleMeta", "String", 6)}</Row>
   <Row>${xmlCell("入金合計", "styleHeader")}${xmlCell(totalPaid, "styleMoney", "Number")}${xmlCell("未入金合計", "styleHeader")}${xmlCell(totalUnpaid, "styleMoney", "Number")}${emptyCells(3)}</Row>
   <Row/>
   ${summaryRows}
  </Table>
 </Worksheet>
 ${detailSheets}
</Workbook>`;
}

function exportSalesReportExcel() {
  const xml = buildSalesReportExcelXml();
  const blob = new Blob([`\uFEFF${xml}`], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `sales-report-${todayDate()}.xls`;
  anchor.click();
  URL.revokeObjectURL(url);
  showToast("売上表Excelを出力しました");
}

function getStudentsByClassroom(classroomId) {
  return state.students.filter((s) => classroomId === "all" || s.classroomId === classroomId);
}

function getUsersByClassroom(classroomId) {
  return state.users.filter((u) => classroomId === "all" || u.classroomId === classroomId || u.classroomId === "all");
}

function getAccessibleClassrooms() {
  if (!currentUser || currentUser.classroomId === "all") return state.classrooms;
  return state.classrooms.filter((item) => item.id === currentUser.classroomId);
}

function getActiveFilter() {
  if (!currentUser) return "all";
  if (currentUser.classroomId !== "all" && currentFilter === "all") return currentUser.classroomId;
  return currentFilter;
}

function matchClassroom(itemClassroomId) {
  const filter = getActiveFilter();
  return filter === "all" || itemClassroomId === filter;
}

function monthOf(dateStr) { return dateStr.slice(0, 7); }
function currentMonth() { return todayDate().slice(0, 7); }

function todayDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function monthLabel(month) { return `${month.slice(0, 4)}年${month.slice(5, 7)}月`; }

function isStudentActiveFromMonth(student, month) {
  if (!student?.startMonth) return true;
  return student.startMonth <= month;
}

function fiscalYearForMonth(month) {
  const [yearText, monthText] = month.split("-");
  const year = Number(yearText);
  const monthNumber = Number(monthText);
  const closingMonth = Number(state.settings?.fiscalClosingMonth || 3);
  if (closingMonth === 12) return year;
  return monthNumber <= closingMonth ? year - 1 : year;
}

function fiscalYearLabel(month) { return `${fiscalYearForMonth(month)}年度`; }

function addMonths(month, offset) {
  const [yearText, monthText] = month.split("-");
  const date = new Date(Number(yearText), Number(monthText) - 1 + offset, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function previousMonth(month = currentMonth()) { return addMonths(month, -1); }

function trackedMonths() {
  const months = [
    ...state.billing.map((item) => item.month),
    ...state.incidentalSales.map((item) => item.month).filter(Boolean),
    ...state.students.map((s) => s.startMonth).filter(Boolean),
  ].sort();
  const firstMonth = months[0] || currentMonth();
  const lastMonth = currentMonth() > (months[months.length - 1] || "") ? currentMonth() : (months[months.length - 1] || currentMonth());
  const result = [];
  let cursor = firstMonth;
  while (cursor <= lastMonth) {
    result.push(cursor);
    cursor = addMonths(cursor, 1);
  }
  return result.sort((a, b) => b.localeCompare(a));
}

function monthlySalesRows() {
  return trackedMonths().map((month) => {
    const students = state.students.filter((s) => s.status === "在籍" && matchClassroom(s.classroomId) && isStudentActiveFromMonth(s, month));
    const summaries = students.map((s) => billingSummaryForStudent(s.id, month));
    const incidentalSales = state.incidentalSales.filter((item) => item.month === month);
    const incidentalAmount = incidentalSales.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    return {
      month,
      billed: summaries.reduce((sum, item) => sum + item.expected, 0) + incidentalAmount,
      paid: summaries.reduce((sum, item) => sum + item.paid, 0) + incidentalAmount,
      unpaid: summaries.reduce((sum, item) => sum + item.outstanding, 0),
      paidCount: summaries.filter((item) => item.paid > 0).length + incidentalSales.length,
      unpaidCount: summaries.filter((item) => item.outstanding > 0).length,
    };
  });
}

function monthlySalesDetailRowsByMonth() {
  return Object.fromEntries(trackedMonths().map((month) => {
    const studentRows = state.students
      .filter((s) => s.status === "在籍" && matchClassroom(s.classroomId) && isStudentActiveFromMonth(s, month))
      .map((s) => {
        const summary = billingSummaryForStudent(s.id, month);
        return { month, category: "生徒月謝", name: s.name, content: summary.carryover > 0 ? `月謝（前月繰越 ${yen(summary.carryover)} を含む）` : "月謝", amount: summary.expected, isManual: false, manualLabel: "いいえ" };
      }).filter((item) => item.amount > 0);
    const incidentalRows = state.incidentalSales
      .filter((item) => item.month === month && matchClassroom(item.classroomId || "all"))
      .map((item) => ({ month, category: "手動売上", name: item.name, content: item.content, amount: Number(item.amount || 0), isManual: true, manualLabel: "はい" }));
    return [month, [...studentRows, ...incidentalRows]];
  }));
}

function sheetNameForMonth(month) { return `${month.slice(0, 4)}-${month.slice(5, 7)}詳細`; }

function unpaidMonthsForStudent(studentId) {
  return trackedMonths().slice().reverse().filter((month) => billingSummaryForStudent(studentId, month).outstanding > 0);
}

function fiscalSalesRows() {
  const fiscalMap = new Map();
  monthlySalesRows().forEach((item) => {
    const key = fiscalYearForMonth(item.month);
    const summary = fiscalMap.get(key) || { fiscalYear: key, billed: 0, paid: 0, unpaid: 0, paidCount: 0, unpaidCount: 0 };
    summary.billed += item.billed;
    summary.paid += item.paid;
    summary.unpaid += item.unpaid;
    summary.paidCount += item.paidCount;
    summary.unpaidCount += item.unpaidCount;
    fiscalMap.set(key, summary);
  });
  return [...fiscalMap.values()].sort((a, b) => b.fiscalYear - a.fiscalYear);
}

function attendanceForCurrentMonth() {
  return state.attendance.filter((item) => monthOf(item.date) === currentMonth() && matchClassroom(item.classroomId));
}

function billingForCurrentMonth() {
  return state.billing.filter((item) => item.month === currentMonth() && matchClassroom(item.classroomId));
}

function activeStudents() {
  return state.students.filter((s) => s.status === "在籍" && matchClassroom(s.classroomId));
}

function getBillingEntriesByStudent(studentId) {
  return state.billing.filter((item) => item.studentId === studentId);
}

function previousCarryoverForStudent(studentId, month) {
  const monthlyMap = new Map();
  getBillingEntriesByStudent(studentId)
    .filter((item) => item.month < month)
    .forEach((item) => {
      const summary = monthlyMap.get(item.month) || { billed: 0, paid: 0 };
      summary.billed += Number(item.billed || 0);
      summary.paid += Number(item.paid || 0);
      monthlyMap.set(item.month, summary);
    });
  return [...monthlyMap.values()].reduce((sum, item) => sum + Math.max(item.billed - item.paid, 0), 0);
}

function previousUnpaidMonthsForStudent(studentId, month) {
  return trackedMonths().filter((itemMonth) => itemMonth < month && billingSummaryForStudent(studentId, itemMonth).outstanding > 0);
}

function billingSummaryForStudent(studentId, month = currentMonth(), excludeBillingId = null) {
  const student = getStudent(studentId);
  if (!isStudentActiveFromMonth(student, month)) {
    return { tuition: Number(student?.tuition || 0), carryover: 0, expected: 0, billed: 0, paid: 0, outstanding: 0, status: "未開始" };
  }
  const tuition = Number(student?.tuition || 0);
  const carryover = previousCarryoverForStudent(studentId, month);
  const expected = tuition + carryover;
  const currentMonthEntries = getBillingEntriesByStudent(studentId).filter((item) => item.month === month && item.id !== excludeBillingId);
  const paid = currentMonthEntries.reduce((sum, item) => sum + Number(item.paid || 0), 0);
  const billed = currentMonthEntries.reduce((sum, item) => sum + Number(item.billed || 0), 0);
  const outstanding = Math.max(expected - paid, 0);
  const status = outstanding === 0 ? "完了" : paid === 0 ? "未収" : "一部入金";
  return { tuition, carryover, expected, billed, paid, outstanding, status };
}

function overallBillingSummaryForStudent(studentId) {
  const months = trackedMonths();
  const monthlySummaries = months.map((month) => billingSummaryForStudent(studentId, month));
  const billed = monthlySummaries.reduce((sum, item) => sum + Number(item.expected || 0), 0);
  const paid = monthlySummaries.reduce((sum, item) => sum + Number(item.paid || 0), 0);
  const outstanding = monthlySummaries.reduce((sum, item) => sum + Number(item.outstanding || 0), 0);
  const paidCount = monthlySummaries.filter((item) => Number(item.paid || 0) > 0).length;
  const unpaidCount = monthlySummaries.filter((item) => Number(item.outstanding || 0) > 0).length;
  const status = outstanding === 0 ? "完了" : paid === 0 ? "未収" : "一部入金";
  return { billed, paid, outstanding, paidCount, unpaidCount, status, unpaidMonths: unpaidMonthsForStudent(studentId) };
}

function expectedTuitionForMonth(classroomId = null) {
  return state.students
    .filter((s) => s.status === "在籍" && (!classroomId || s.classroomId === classroomId))
    .reduce((sum, s) => sum + billingSummaryForStudent(s.id, currentMonth()).expected, 0);
}

function paidAmountForMonth(classroomId = null) {
  return state.billing
    .filter((item) => item.month === currentMonth() && (!classroomId || item.classroomId === classroomId))
    .reduce((sum, item) => sum + Number(item.paid || 0), 0);
}

function outstandingAmountForMonth(classroomId = null) {
  return Math.max(expectedTuitionForMonth(classroomId) - paidAmountForMonth(classroomId), 0);
}

function previousOutstandingAmount(classroomId = null, month = currentMonth()) {
  const targetMonth = previousMonth(month);
  return state.students
    .filter((s) => s.status === "在籍" && (!classroomId || s.classroomId === classroomId) && matchClassroom(s.classroomId) && isStudentActiveFromMonth(s, targetMonth))
    .reduce((sum, s) => sum + billingSummaryForStudent(s.id, targetMonth).outstanding, 0);
}

function cumulativeOutstandingAmount(classroomId = null, month = currentMonth()) {
  return state.students
    .filter((s) => s.status === "在籍" && (!classroomId || s.classroomId === classroomId) && matchClassroom(s.classroomId) && isStudentActiveFromMonth(s, month))
    .reduce((sum, s) => sum + overallBillingSummaryForStudent(s.id).outstanding, 0);
}

function findBillingRecord(studentId, month) {
  return state.billing.find((item) => item.studentId === studentId && item.month === month) || null;
}

function summarizeClassroom(classroom) {
  const students = state.students.filter((item) => item.classroomId === classroom.id && item.status === "在籍");
  const monthAttendance = state.attendance.filter((item) => item.classroomId === classroom.id && monthOf(item.date) === currentMonth());
  const absences = monthAttendance.filter((item) => item.status === "欠席").length;
  const present = monthAttendance.filter((item) => item.status === "出席").length;
  const outstanding = outstandingAmountForMonth(classroom.id);
  let status = { label: "安定", className: "ok" };
  if (outstanding > 0) status = { label: "集金確認", className: "warn" };
  if (absences >= 2) status = { label: "欠席確認", className: "alert" };
  if (outstanding > 10000 && absences >= 1) status = { label: "対応必要", className: "alert" };
  return { classroom, studentCount: students.length, present, absences, outstanding, status };
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => { els.toast.classList.remove("is-visible"); }, 2200);
}

// IndexedDB（バックアップファイルハンドル用）
function openHandleDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(HANDLE_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(HANDLE_STORE_NAME)) db.createObjectStore(HANDLE_STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function loadBackupFileHandle() {
  try {
    const db = await openHandleDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(HANDLE_STORE_NAME, "readonly");
      const request = tx.objectStore(HANDLE_STORE_NAME).get(HANDLE_KEY);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (_error) { return null; }
}

async function saveBackupFileHandle(handle) {
  const db = await openHandleDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HANDLE_STORE_NAME, "readwrite");
    tx.objectStore(HANDLE_STORE_NAME).put(handle, HANDLE_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function ensureBackupFilePermission(handle) {
  if (!handle) return false;
  if (typeof handle.queryPermission !== "function") return true;
  if (await handle.queryPermission({ mode: "readwrite" }) === "granted") return true;
  return await handle.requestPermission({ mode: "readwrite" }) === "granted";
}

async function chooseBackupFile() {
  if (typeof window.showSaveFilePicker !== "function") {
    showToast("このブラウザでは保存先ファイルの固定に対応していません");
    return;
  }
  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: "robot-school-shared-backup.json",
      types: [{ description: "JSONファイル", accept: { "application/json": [".json"] } }],
    });
    backupFileHandle = handle;
    saveMeta.externalFileName = handle.name || "robot-school-shared-backup.json";
    persistSaveMeta();
    await saveBackupFileHandle(handle);
    await writeExternalBackupFile(true);
    renderSaveStatus();
  } catch (_error) {
    showToast("保存先ファイルの設定をキャンセルしました");
  }
}

function scheduleExternalBackup() {
  if (!backupFileHandle) return;
  window.clearTimeout(externalBackupTimer);
  externalBackupTimer = window.setTimeout(() => { writeExternalBackupFile(false); }, 700);
}

async function writeExternalBackupFile(showNotice) {
  if (!backupFileHandle) {
    if (showNotice) showToast("先に保存先ファイルを選んでください");
    return false;
  }
  try {
    const permitted = await ensureBackupFilePermission(backupFileHandle);
    if (!permitted) {
      if (showNotice) showToast("保存先ファイルへのアクセス許可が必要です");
      return false;
    }
    const writable = await backupFileHandle.createWritable();
    await writable.write(JSON.stringify({ exportedAt: new Date().toISOString(), source: "robot-school-shared-system", data: state }, null, 2));
    await writable.close();
    saveMeta.externalFileName = backupFileHandle.name || saveMeta.externalFileName;
    saveMeta.lastExternalSavedAt = new Date().toISOString();
    persistSaveMeta();
    renderSaveStatus();
    if (showNotice) showToast("外部バックアップファイルを保存しました");
    return true;
  } catch (_error) {
    if (showNotice) showToast("外部バックアップファイルの保存に失敗しました");
    return false;
  }
}

function renderSaveStatus() {
  const browserSavedAt = formatDateTime(saveMeta.lastSavedAt);
  if (els.saveLocationLabel) els.saveLocationLabel.textContent = "Supabase クラウドに保存中";
  if (els.saveLocationDetail) els.saveLocationDetail.textContent = `クラウド保存: 自動 / 最終読込: ${browserSavedAt}`;
  if (els.backupSummary) els.backupSummary.textContent = `Supabaseクラウドに自動保存されています。最終読込: ${browserSavedAt}`;
}

function pillForStatus(status) {
  if (status === "完了" || status === "出席" || status === "安定") return "ok";
  if (status === "一部入金" || status === "遅刻" || status === "集金確認") return "warn";
  if (status === "未入金" || status === "欠席" || status === "対応必要" || status === "欠席確認") return "alert";
  return "neutral";
}

function filteredAttendance() {
  return state.attendance.filter((item) => matchClassroom(item.classroomId)).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 50);
}

function filteredBilling() {
  return state.students
    .filter((s) => s.status === "在籍" && matchClassroom(s.classroomId) && isStudentActiveFromMonth(s, currentMonth()))
    .map((s) => {
      const billingRecord = findBillingRecord(s.id, currentMonth());
      const summary = billingSummaryForStudent(s.id, currentMonth());
      const previousUnpaidMonths = previousUnpaidMonthsForStudent(s.id, currentMonth());
      return {
        id: billingRecord?.id || null,
        month: currentMonth(),
        classroomId: s.classroomId,
        studentId: s.id,
        billed: summary.expected,
        paid: summary.paid,
        outstanding: summary.outstanding,
        status: summary.status,
        previousUnpaidMonths,
        previousCarryover: summary.carryover,
        note: billingRecord?.note || "",
      };
    })
    .sort((a, b) => {
      const monthDiff = b.month.localeCompare(a.month);
      if (monthDiff !== 0) return monthDiff;
      const classroomDiff = (getClassroom(a.classroomId)?.name || "").localeCompare(getClassroom(b.classroomId)?.name || "", "ja");
      if (classroomDiff !== 0) return classroomDiff;
      return (getStudent(a.studentId)?.name || "").localeCompare(getStudent(b.studentId)?.name || "", "ja");
    });
}

function filteredHandovers() {
  return state.handovers.filter((item) => matchClassroom(item.classroomId)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function setLoginOptions() {
  if (!state.users.length) { els.loginEmail.value = ""; els.loginPassword.value = ""; return; }
  const defaultUser = state.users[0];
  if (!els.loginEmail.value) els.loginEmail.value = defaultUser.email || "";
  if (!els.loginPassword.value) els.loginPassword.value = defaultUser.password || "";
}

function setCurrentUserInfo() {
  const classroomLabel = currentUser.classroomId === "all" ? "全教室を閲覧可能" : `${getClassroom(currentUser.classroomId)?.name || "-"} 担当`;
  els.currentUserName.textContent = currentUser.name;
  els.currentUserRole.textContent = `権限: ${currentUser.role} / ${currentUser.email || "-"}`;
  els.currentUserClassroom.textContent = classroomLabel;
  els.topbarMeta.textContent = `${currentUser.name}として利用中 / Supabaseクラウド保存`;
}

function setGlobalFilters() {
  const classrooms = getAccessibleClassrooms();
  const options = [`<option value="all">全教室</option>`]
    .concat(classrooms.map((c) => `<option value="${c.id}">${c.name}</option>`))
    .join("");
  els.globalFilter.innerHTML = options;
  if (currentUser.classroomId !== "all") {
    currentFilter = currentUser.classroomId;
    els.globalFilter.value = currentUser.classroomId;
    els.globalFilter.disabled = true;
  } else {
    els.globalFilter.disabled = false;
    if (!classrooms.some((item) => item.id === currentFilter)) currentFilter = "all";
    els.globalFilter.value = currentFilter;
  }
}

function activateSubView(section, subview) {
  currentSubView[section] = subview;
  els.subviewButtons.forEach((button) => {
    const isCurrent = button.dataset.section === section && button.dataset.subview === subview;
    if (button.dataset.section === section) button.classList.toggle("is-active", isCurrent);
  });
  els.subviewPanels.forEach((panel) => {
    if (panel.dataset.sectionPanel !== section) return;
    panel.classList.toggle("is-visible", panel.dataset.subviewPanel === subview);
  });
}

function updateSaturdaySlotVisibility() {
  const saturdayChecked = Array.from(els.studentForm.querySelectorAll('input[name="weekday"]')).some((cb) => cb.value === "土" && cb.checked);
  els.saturdaySlotsFieldset.classList.toggle("hidden", !saturdayChecked);
  if (!saturdayChecked) els.studentForm.querySelectorAll('input[name="saturdaySlot"]').forEach((cb) => { cb.checked = false; });
}

function setSelectOptions() {
  const classroomOptions = state.classrooms.map((c) => `<option value="${c.id}">${c.name}</option>`).join("");
  const teacherClassroomOptions = `<option value="all">全教室担当</option>` + state.classrooms.map((c) => `<option value="${c.id}">${c.name}</option>`).join("");
  const classOptionOptions = [`<option value="">選択してください</option>`, ...state.classOptions.map((item) => `<option value="${item.id}">${item.name}</option>`)].join("");
  const studentOptions = (classroomId) => {
    const items = getStudentsByClassroom(classroomId || getActiveFilter()).map((s) => `<option value="${s.id}">${s.name}</option>`);
    return [`<option value="">選択してください</option>`, ...items].join("");
  };

  [els.attendanceForm, els.billingForm, els.handoverForm, els.studentForm].forEach((form) => {
    const classroomSelect = form.querySelector('select[name="classroomId"]');
    if (classroomSelect) classroomSelect.innerHTML = classroomOptions;
  });
  els.teacherForm.querySelector('select[name="classroomId"]').innerHTML = teacherClassroomOptions;
  els.studentForm.querySelector('select[name="classOptionId"]').innerHTML = classOptionOptions;

  const attendanceClassroom = els.attendanceForm.querySelector('select[name="classroomId"]');
  const billingClassroom = els.billingForm.querySelector('select[name="classroomId"]');
  const handoverClassroom = els.handoverForm.querySelector('select[name="classroomId"]');

  const syncStudents = (form, classroomId) => {
    const studentSelect = form.querySelector('select[name="studentId"]');
    if (!studentSelect) return;
    const selectedStudentId = studentSelect.value;
    studentSelect.innerHTML = studentOptions(classroomId);
    const hasSelectedStudent = [...studentSelect.options].some((option) => option.value === selectedStudentId);
    studentSelect.value = hasSelectedStudent ? selectedStudentId : "";
  };

  if (attendanceClassroom.value === "") attendanceClassroom.value = getAccessibleClassrooms()[0]?.id || "";
  if (billingClassroom.value === "") billingClassroom.value = getAccessibleClassrooms()[0]?.id || "";
  if (handoverClassroom.value === "") handoverClassroom.value = getAccessibleClassrooms()[0]?.id || "";

  syncStudents(els.attendanceForm, attendanceClassroom.value);
  syncStudents(els.billingForm, billingClassroom.value);
  syncStudents(els.handoverForm, handoverClassroom.value);

  attendanceClassroom.addEventListener("change", () => syncStudents(els.attendanceForm, attendanceClassroom.value), { once: true });
  billingClassroom.addEventListener("change", () => syncStudents(els.billingForm, billingClassroom.value), { once: true });
  handoverClassroom.addEventListener("change", () => syncStudents(els.handoverForm, handoverClassroom.value), { once: true });
}

function autofillBillingAmount() {
  const studentId = els.billingForm.querySelector('select[name="studentId"]').value;
  const month = els.billingForm.querySelector('input[name="month"]').value;
  if (!studentId || !month) return;
  const summary = billingSummaryForStudent(studentId, month, formEditState.billing);
  els.billingForm.querySelector('input[name="billed"]').value = summary.expected;
  els.billingForm.querySelector('input[name="paid"]').max = summary.outstanding;
}

function setBillingQuickActionsVisible(visible) {
  if (els.billingQuickActions) els.billingQuickActions.classList.toggle("hidden", !visible);
}

function refreshBillingEditNote() {
  const editingId = formEditState.billing;
  if (!editingId) {
    els.billingEditNote.classList.add("hidden");
    els.billingEditNote.textContent = "";
    setBillingQuickActionsVisible(false);
    return;
  }
  const item = state.billing.find((entry) => entry.id === editingId);
  if (!item) {
    els.billingEditNote.classList.add("hidden");
    els.billingEditNote.textContent = "";
    setBillingQuickActionsVisible(false);
    return;
  }
  const month = els.billingForm.querySelector('input[name="month"]').value || item.month;
  const studentId = els.billingForm.querySelector('select[name="studentId"]').value || item.studentId;
  const summary = billingSummaryForStudent(studentId, month, editingId);
  const duplicate = state.billing.find((entry) => entry.studentId === studentId && entry.month === month && entry.id !== editingId);
  els.billingEditNote.classList.remove("hidden");
  els.billingEditNote.innerHTML = `登録中の内容: 請求額 ${yen(item.billed)} / 入金額 ${yen(item.paid)} / 対象月 ${monthLabel(item.month)}<br>編集中の対象: ${monthLabel(month)} / この月の請求見込み ${yen(summary.expected)} / 未収上限 ${yen(summary.outstanding)}${duplicate ? `<br>注意: ${monthLabel(month)} には別の集金登録がすでにあります。` : ""}`;
  setBillingQuickActionsVisible(true);
}

function setBillingEditNote(item = null) {
  if (!item) { formEditState.billing = null; refreshBillingEditNote(); return; }
  refreshBillingEditNote();
}

function setBillingFormForEdit(item) {
  const summary = billingSummaryForStudent(item.studentId, item.month, item.id);
  els.billingForm.querySelector('input[name="month"]').value = item.month;
  els.billingForm.querySelector('select[name="classroomId"]').value = item.classroomId;
  setSelectOptions();
  els.billingForm.querySelector('input[name="month"]').value = item.month;
  els.billingForm.querySelector('select[name="classroomId"]').value = item.classroomId;
  els.billingForm.querySelector('select[name="studentId"]').value = item.studentId;
  els.billingForm.querySelector('input[name="billed"]').value = summary.expected;
  els.billingForm.querySelector('input[name="paid"]').value = item.paid;
  els.billingForm.querySelector('input[name="paid"]').max = summary.outstanding;
  els.billingForm.querySelector('input[name="paidDate"]').value = item.paidDate || "";
  els.billingForm.querySelector('select[name="method"]').value = item.method;
  els.billingForm.querySelector('textarea[name="note"]').value = item.note || "";
  refreshBillingEditNote();
}

function renderDashboard() {
  const attendanceMonth = attendanceForCurrentMonth();
  const billingMonth = billingForCurrentMonth();
  const openHandovers = filteredHandovers();
  const todayLessons = state.attendance.filter((item) => item.date === todayDate() && matchClassroom(item.classroomId)).length;
  const presentCount = attendanceMonth.filter((item) => item.status === "出席").length;
  const absentCount = attendanceMonth.filter((item) => item.status === "欠席").length;
  const activeClassroomId = getActiveFilter() === "all" ? null : getActiveFilter();
  const expectedAmount = expectedTuitionForMonth(activeClassroomId);
  const paidAmount = billingMonth.reduce((sum, item) => sum + Number(item.paid || 0), 0);
  const previousOutstanding = previousOutstandingAmount(activeClassroomId, currentMonth());
  const currentOutstanding = Math.max(expectedAmount - paidAmount, 0);
  const outstandingAmount = cumulativeOutstandingAmount(activeClassroomId, currentMonth());

  els.heroNote.innerHTML = `
    <span>本日の授業入力</span>
    <strong>${todayLessons}件</strong>
    <small>未集金累計 ${yen(outstandingAmount)} / 前月未収 ${yen(previousOutstanding)} / 引き継ぎ ${openHandovers.length}件</small>
  `;

  const cards = [
    { label: "在籍生徒", value: `${activeStudents().length}名`, note: "現在の在籍人数", className: "" },
    { label: "今月出席", value: `${presentCount}回`, note: `欠席 ${absentCount}回`, className: "success" },
    { label: "未集金", value: yen(outstandingAmount), note: `前月未収 ${yen(previousOutstanding)} + 今月未収 ${yen(currentOutstanding)}`, className: "warning" },
    { label: "前月未収", value: yen(previousOutstanding), note: `今月請求 ${yen(expectedAmount)} / 今月入金 ${yen(paidAmount)}`, className: "warning" },
    { label: "引き継ぎ", value: `${openHandovers.length}件`, note: "先生どうしの共有メモ", className: "accent" },
  ];

  els.statsGrid.innerHTML = cards.map((card) => `
    <article class="stat-card ${card.className}">
      <span>${card.label}</span>
      <strong>${card.value}</strong>
      <small>${card.note}</small>
    </article>
  `).join("");

  const summaries = getAccessibleClassrooms().filter((c) => currentFilter === "all" || c.id === currentFilter).map(summarizeClassroom);
  els.classroomSummaryBody.innerHTML = summaries.map((item) => `
    <tr>
      <td>${item.classroom.name}</td>
      <td>${item.studentCount}</td>
      <td>${item.present}</td>
      <td>${item.absences}</td>
      <td>${yen(item.outstanding)}</td>
      <td><span class="pill ${item.status.className}">${item.status.label}</span></td>
    </tr>
  `).join("");

  els.latestHandoverList.innerHTML = openHandovers.slice(0, 6).map((item) => {
    const student = item.studentId ? getStudent(item.studentId)?.name : "教室メモ";
    const classroom = getClassroom(item.classroomId)?.name || "";
    return `<li><strong>${item.title}</strong><p>${classroom} / ${student} / ${item.body}</p></li>`;
  }).join("");
}

function renderAttendance() {
  const selectedDate = els.attendanceForm?.querySelector('input[name="date"]')?.value || todayDate();
  const selectedClassroomId = els.attendanceForm?.querySelector('select[name="classroomId"]')?.value || getAccessibleClassrooms()[0]?.id || "";
  const weekday = japaneseWeekdayFromDate(selectedDate);
  const scheduledStudents = state.students
    .filter((s) => s.status === "在籍" && s.classroomId === selectedClassroomId && (s.weekdays || []).includes(weekday))
    .sort((a, b) => a.name.localeCompare(b.name, "ja"));

  const classroomName = getClassroom(selectedClassroomId)?.name || "未選択";
  els.scheduledStudentsMeta.textContent = `${selectedDate}（${weekday}） / ${classroomName} / ${scheduledStudents.length}名`;
  const scheduledAttendanceMap = new Map(
    state.attendance.filter((item) => item.date === selectedDate && item.classroomId === selectedClassroomId).map((item) => [item.studentId, item])
  );

  const billingSummaryText = (studentId) => {
    const billing = billingSummaryForStudent(studentId, currentMonth());
    const previousUnpaidMonths = previousUnpaidMonthsForStudent(studentId, currentMonth());
    if (billing.status === "完了") return `完了 / 今月入金 ${yen(billing.paid)}`;
    if (previousUnpaidMonths.length) return `未収 ${yen(billing.outstanding)} / 繰越 ${previousUnpaidMonths.map(monthLabel).join(" / ")}`;
    return `${billing.status} / 今月未収 ${yen(billing.outstanding)}`;
  };

  const renderScheduledCard = (s) => {
    const classOption = getClassOption(s.classOptionId)?.name || "-";
    const attendanceDaysThisMonth = state.attendance.filter((ai) => ai.studentId === s.id && monthOf(ai.date) === currentMonth() && ai.status === "出席").length;
    const attendanceRecord = scheduledAttendanceMap.get(s.id);
    const billing = billingSummaryForStudent(s.id, currentMonth());
    return `
      <article class="scheduled-card">
        <strong>${s.name}</strong>
        <p>${s.guardian || "保護者情報未登録"}</p>
        <p>クラス: ${classOption} / 当月出席: ${attendanceDaysThisMonth}日</p>
        <p>集金: <span class="scheduled-status ${pillForStatus(billing.status)}">${billingSummaryText(s.id)}</span></p>
        <span>${weekdaysText(s)}</span>
        <div class="scheduled-actions">
          <button class="primary-btn scheduled-action-btn" data-mark-attendance="${s.id}" ${attendanceRecord?.status === "出席" ? "disabled" : ""}>${attendanceRecord?.status === "出席" ? "出席済み" : "出席登録"}</button>
          <button class="ghost-inline-btn scheduled-action-btn" data-open-billing="${s.id}">${findBillingRecord(s.id, currentMonth()) ? "集金編集" : "集金登録"}</button>
        </div>
      </article>
    `;
  };

  if (!scheduledStudents.length) {
    els.scheduledStudentsList.innerHTML = `<p class="scheduled-empty">この曜日に登録された出席予定者はいません。</p>`;
  } else if (weekday === "土") {
    const saturdayGroups = SATURDAY_SLOT_ORDER.map((slot) => ({ label: slot, students: scheduledStudents.filter((s) => (s.saturdaySlots || []).includes(slot)) })).filter((g) => g.students.length);
    const noSlotStudents = scheduledStudents.filter((s) => !(s.saturdaySlots || []).length);
    if (noSlotStudents.length) saturdayGroups.push({ label: "時間未設定", students: noSlotStudents });
    els.scheduledStudentsList.innerHTML = saturdayGroups.map((group) => `
      <section class="scheduled-slot-group">
        <h4>${group.label}</h4>
        <div class="scheduled-slot-cards">${group.students.map(renderScheduledCard).join("")}</div>
      </section>
    `).join("");
  } else {
    els.scheduledStudentsList.innerHTML = scheduledStudents.map(renderScheduledCard).join("");
  }

  els.attendanceBody.innerHTML = filteredAttendance().map((item) => {
    const classroom = getClassroom(item.classroomId)?.name || "-";
    const student = getStudent(item.studentId)?.name || "-";
    const billing = billingSummaryForStudent(item.studentId, currentMonth());
    return `
      <tr>
        <td>${item.date}</td>
        <td>${classroom}</td>
        <td>${student}</td>
        <td><span class="pill ${pillForStatus(item.status)}">${item.status}</span></td>
        <td><span class="pill ${pillForStatus(billing.status)}">${billing.status}</span> ${billing.outstanding > 0 ? `${yen(billing.outstanding)}未収` : yen(billing.paid)}</td>
        <td>${item.transfer || "-"}</td>
        <td>${item.teacher}</td>
        <td>${item.note || "-"}</td>
        <td class="row-actions">
          <button class="link-btn" data-open-billing="${item.studentId}">${findBillingRecord(item.studentId, currentMonth()) ? "集金編集" : "集金登録"}</button>
          <button class="link-btn" data-edit-attendance="${item.id}">編集</button>
          <button class="link-btn" data-delete-attendance="${item.id}">削除</button>
        </td>
      </tr>
    `;
  }).join("");
}

async function markAttendanceFromSchedule(studentId) {
  const date = els.attendanceForm?.querySelector('input[name="date"]')?.value || todayDate();
  const classroomId = els.attendanceForm?.querySelector('select[name="classroomId"]')?.value || getAccessibleClassrooms()[0]?.id || "";
  const teacher = els.attendanceForm?.querySelector('input[name="teacher"]')?.value || currentUser?.name || "";
  const existingRecord = state.attendance.find((item) => item.date === date && item.classroomId === classroomId && item.studentId === studentId);
  const payload = {
    id: existingRecord?.id || makeId("attendance"),
    date, classroomId, studentId, status: "出席",
    transfer: existingRecord?.transfer || "",
    teacher: existingRecord?.teacher || teacher,
    note: existingRecord?.note || "",
  };
  if (existingRecord) {
    state.attendance = state.attendance.map((item) => item.id === existingRecord.id ? payload : item);
  } else {
    state.attendance.unshift(payload);
  }
  await upsertRecord("attendance", attendanceToDb(payload));
  await saveState();
  renderApp();
  els.attendanceForm.querySelector('input[name="date"]').value = date;
  els.attendanceForm.querySelector('select[name="classroomId"]').value = classroomId;
  setSelectOptions();
  els.attendanceForm.querySelector('input[name="date"]').value = date;
  els.attendanceForm.querySelector('select[name="classroomId"]').value = classroomId;
  els.attendanceForm.querySelector('input[name="teacher"]').value = teacher;
  renderAttendance();
  activateView("attendance");
  activateSubView("attendance", "list");
  showToast(existingRecord ? "出席状況を出席に更新しました" : "出席を登録しました");
}

function renderBilling() {
  els.billingBody.innerHTML = filteredBilling().map((item) => {
    const student = getStudent(item.studentId)?.name || "-";
    const previousUnpaidLabel = item.previousUnpaidMonths.length ? `${item.previousUnpaidMonths.map(monthLabel).join(" / ")} (${yen(item.previousCarryover)})` : "-";
    return `
      <tr>
        <td>${item.month}</td>
        <td>${student}</td>
        <td>${yen(item.billed)}</td>
        <td>${yen(item.paid)}</td>
        <td>${yen(item.outstanding)}</td>
        <td>${previousUnpaidLabel}</td>
        <td><span class="pill ${pillForStatus(item.status)}">${item.status}</span></td>
        <td>${item.note || "-"}</td>
        <td class="row-actions">
          <button class="link-btn" ${item.id ? `data-edit-billing="${item.id}"` : `data-edit-student-billing="${item.studentId}"`}>${item.id ? "編集" : "集金登録"}</button>
          ${item.id ? `<button class="link-btn" data-delete-billing="${item.id}">削除</button>` : ""}
        </td>
      </tr>
    `;
  }).join("");
}

function renderSales() {
  const monthlyRows = monthlySalesRows();
  const fiscalRows = fiscalSalesRows();
  const currentMonthRow = monthlyRows.find((item) => item.month === currentMonth()) || { billed: 0, paid: 0, unpaid: 0, paidCount: 0, unpaidCount: 0 };
  const currentFiscalRow = fiscalRows.find((item) => item.fiscalYear === fiscalYearForMonth(currentMonth())) || { billed: 0, paid: 0, unpaid: 0, paidCount: 0, unpaidCount: 0 };

  els.salesStatsGrid.innerHTML = [
    { label: "今月請求", value: yen(currentMonthRow.billed), note: monthLabel(currentMonth()), className: "" },
    { label: "今月入金", value: yen(currentMonthRow.paid), note: `${currentMonthRow.paidCount}件`, className: "success" },
    { label: "今月未入金", value: yen(currentMonthRow.unpaid), note: `${currentMonthRow.unpaidCount}件`, className: "warning" },
    { label: "当年度売上", value: yen(currentFiscalRow.billed), note: fiscalYearLabel(currentMonth()), className: "accent" },
  ].map((card) => `<article class="stat-card ${card.className}"><span>${card.label}</span><strong>${card.value}</strong><small>${card.note}</small></article>`).join("");

  els.salesMonthlyMeta.textContent = `${monthLabel(currentMonth())} を含む月別集計`;
  els.salesFiscalMeta.textContent = `決算月 ${state.settings.fiscalClosingMonth}月 / ${fiscalYearLabel(currentMonth())}`;

  els.salesMonthlyBody.innerHTML = monthlyRows.length
    ? monthlyRows.map((item) => `<tr><td>${monthLabel(item.month)}</td><td>${yen(item.billed)}</td><td>${yen(item.paid)}</td><td>${yen(item.unpaid)}</td><td>${item.paidCount}件</td><td>${item.unpaidCount}件</td></tr>`).join("")
    : `<tr><td colspan="6">集金データがまだありません</td></tr>`;

  els.salesFiscalBody.innerHTML = fiscalRows.length
    ? fiscalRows.map((item) => `<tr><td>${item.fiscalYear}年度</td><td>${yen(item.billed)}</td><td>${yen(item.paid)}</td><td>${yen(item.unpaid)}</td><td>${item.paidCount}件</td><td>${item.unpaidCount}件</td></tr>`).join("")
    : `<tr><td colspan="6">年度集計できるデータがまだありません</td></tr>`;
}

function renderHandovers() {
  els.handoverGrid.innerHTML = filteredHandovers().map((item) => {
    const classroom = getClassroom(item.classroomId)?.name || "-";
    const student = item.studentId ? getStudent(item.studentId)?.name || "-" : "対象なし";
    return `
      <article class="memo-card">
        <div class="meta">${classroom} / ${item.author} / ${item.category}</div>
        <h4>${item.title}</h4>
        <p>${item.body}</p>
        <p class="meta">対象: ${student}</p>
        <div class="row-actions">
          <button class="link-btn" data-edit-handover="${item.id}">編集</button>
          <button class="link-btn" data-delete-handover="${item.id}">削除</button>
        </div>
      </article>
    `;
  }).join("");
}

function renderMaster() {
  setIncidentalSaleTemplateOptions();
  els.classOptionTableBody.innerHTML = state.classOptions.map((item) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.sortOrder}</td>
      <td class="row-actions">
        <button class="link-btn" data-edit-class-option="${item.id}">編集</button>
        <button class="link-btn" data-delete-class-option="${item.id}">削除</button>
      </td>
    </tr>
  `).join("");

  els.classroomTableBody.innerHTML = state.classrooms.map((item) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.manager}</td>
      <td>${item.days || "-"}</td>
      <td class="row-actions">
        <button class="link-btn" data-edit-classroom="${item.id}">編集</button>
        <button class="link-btn" data-delete-classroom="${item.id}">削除</button>
      </td>
    </tr>
  `).join("");

  els.teacherTableBody.innerHTML = getUsersByClassroom(currentFilter === "all" ? "all" : currentFilter).map((user) => `
    <tr>
      <td>${user.name}</td>
      <td>${user.email || "-"}</td>
      <td><span class="pill ${user.role === "本部" ? "warn" : "ok"}">${user.role}</span></td>
      <td>${user.classroomId === "all" ? "全教室" : getClassroom(user.classroomId)?.name || "-"}</td>
      <td class="row-actions">
        <button class="link-btn" data-edit-user="${user.id}">編集</button>
        <button class="link-btn" data-delete-user="${user.id}">削除</button>
      </td>
    </tr>
  `).join("");

  const renderIncidentalSaleRow = (item) => `
    <tr>
      <td>${monthLabel(item.month)}</td>
      <td>${item.name}</td>
      <td>${item.content}</td>
      <td>${yen(item.amount)}</td>
      <td>${item.note || "-"}</td>
      <td class="row-actions">
        <button class="link-btn" data-edit-incidental-sale="${item.id}">編集</button>
        <button class="link-btn" data-delete-incidental-sale="${item.id}">削除</button>
      </td>
    </tr>
  `;
  const currentMonthIncidentalSales = state.incidentalSales.filter((item) => item.month === currentMonth()).slice().sort((a, b) => b.month.localeCompare(a.month));
  els.incidentalSaleTableBody.innerHTML = currentMonthIncidentalSales.map(renderIncidentalSaleRow).join("");
  els.billingIncidentalSaleTableBody.innerHTML = currentMonthIncidentalSales.map(renderIncidentalSaleRow).join("");

  els.studentTableBody.innerHTML = state.students.filter((s) => matchClassroom(s.classroomId)).map((s) => {
    const billing = billingSummaryForStudent(s.id, currentMonth());
    const overallBilling = overallBillingSummaryForStudent(s.id);
    return `
      <tr>
        <td>${s.name}</td>
        <td>${getClassOption(s.classOptionId)?.name || "-"}</td>
        <td><span class="pill ${s.status === "在籍" ? "ok" : "neutral"}">${s.status}</span></td>
        <td>${yen(billing.expected)}</td>
        <td>${yen(billing.paid)}</td>
        <td>${yen(billing.outstanding)}</td>
        <td><span class="pill ${pillForStatus(billing.status)}">${billing.status}</span></td>
        <td>${yen(overallBilling.paid)}</td>
        <td>${yen(overallBilling.outstanding)}</td>
        <td>${overallBilling.unpaidMonths.length ? overallBilling.unpaidMonths.map(monthLabel).join(" / ") : "-"}</td>
        <td><span class="pill ${pillForStatus(overallBilling.status)}">${overallBilling.status}</span></td>
        <td>${weekdaysText(s)}</td>
        <td>${s.guardian || "-"}</td>
        <td>${s.phone || "-"}</td>
        <td>${s.email || "-"}</td>
        <td class="row-actions">
          <button class="link-btn" data-edit-student-billing="${s.id}">集金編集</button>
          <button class="link-btn" data-edit-student="${s.id}">編集</button>
          <button class="link-btn" data-delete-student="${s.id}">削除</button>
        </td>
      </tr>
    `;
  }).join("");
}

function setFormMode(type, editing, submitText) {
  formEditState[type] = editing;
  const submitMap = { classOption: els.classOptionSubmitBtn, incidentalSale: els.incidentalSaleSubmitBtn, attendance: els.attendanceSubmitBtn, billing: els.billingSubmitBtn, handover: els.handoverSubmitBtn, classroom: els.classroomSubmitBtn, teacher: els.teacherSubmitBtn, student: els.studentSubmitBtn };
  const cancelMap = { classOption: els.classOptionCancelBtn, incidentalSale: els.incidentalSaleCancelBtn, attendance: els.attendanceCancelBtn, billing: els.billingCancelBtn, handover: els.handoverCancelBtn, classroom: els.classroomCancelBtn, teacher: els.teacherCancelBtn, student: els.studentCancelBtn };
  submitMap[type].textContent = submitText;
  cancelMap[type].classList.toggle("hidden", !editing);
}

function clearClassOptionForm() {
  els.classOptionForm.reset();
  els.classOptionForm.querySelector('input[name="sortOrder"]').value = state.classOptions.length + 1;
  setFormMode("classOption", null, "クラスを追加");
  activateSubView("master", "entry");
}

function clearIncidentalSaleForm() {
  els.incidentalSaleForm.reset();
  els.incidentalSaleForm.querySelector('input[name="month"]').value = currentMonth();
  if (els.incidentalSaleTemplateSelect) els.incidentalSaleTemplateSelect.value = "";
  if (els.billingIncidentalSaleForm) {
    els.billingIncidentalSaleForm.reset();
    els.billingIncidentalSaleForm.querySelector('input[name="month"]').value = currentMonth();
  }
  if (els.billingIncidentalSaleTemplateSelect) els.billingIncidentalSaleTemplateSelect.value = "";
  setFormMode("incidentalSale", null, "手動売上を追加");
  activateSubView("master", "entry");
}

function fillIncidentalSaleForms(item = {}, options = {}) {
  const { month = item.month || currentMonth() } = options;
  [els.incidentalSaleForm, els.billingIncidentalSaleForm].forEach((form) => {
    if (!form) return;
    form.querySelector('input[name="month"]').value = month;
    form.querySelector('input[name="name"]').value = item.name || "";
    form.querySelector('input[name="content"]').value = item.content || "";
    form.querySelector('input[name="amount"]').value = item.amount || "";
    form.querySelector('textarea[name="note"]').value = item.note || "";
  });
}

function setIncidentalSaleTemplateOptions() {
  const templateOptions = [
    `<option value="">選択してください</option>`,
    ...state.incidentalSales.slice().sort((a, b) => b.month.localeCompare(a.month))
      .map((item) => `<option value="${item.id}">${monthLabel(item.month)} / ${item.name} / ${item.content} / ${yen(item.amount)}</option>`),
  ].join("");
  if (els.incidentalSaleTemplateSelect) els.incidentalSaleTemplateSelect.innerHTML = templateOptions;
  if (els.billingIncidentalSaleTemplateSelect) els.billingIncidentalSaleTemplateSelect.innerHTML = templateOptions;
}

function applyIncidentalSaleTemplate(id) {
  const item = state.incidentalSales.find((row) => row.id === id);
  if (!item) return;
  fillIncidentalSaleForms(item, { month: currentMonth() });
}

function clearAttendanceForm() {
  els.attendanceForm.reset();
  els.attendanceForm.querySelector('input[name="date"]').value = todayDate();
  els.attendanceForm.querySelector('input[name="teacher"]').value = currentUser?.name || "";
  setSelectOptions();
  setFormMode("attendance", null, "出席を追加");
  activateSubView("attendance", "entry");
}

function clearBillingForm() {
  els.billingForm.reset();
  els.billingForm.querySelector('input[name="month"]').value = currentMonth();
  setSelectOptions();
  autofillBillingAmount();
  setBillingEditNote();
  setFormMode("billing", null, "集金情報を追加");
  activateSubView("billing", "entry");
}

function markBillingFormAsUnpaid() {
  els.billingForm.querySelector('input[name="paid"]').value = 0;
  els.billingForm.querySelector('input[name="paidDate"]').value = "";
  refreshBillingEditNote();
}

function moveBillingFormToCurrentMonth() {
  els.billingForm.querySelector('input[name="month"]').value = currentMonth();
  autofillBillingAmount();
  refreshBillingEditNote();
}

function fillBillingFormAsPaid() {
  const billed = Number(els.billingForm.querySelector('input[name="billed"]').value || 0);
  els.billingForm.querySelector('input[name="paid"]').value = billed;
  els.billingForm.querySelector('input[name="paidDate"]').value = todayDate();
  refreshBillingEditNote();
}

function clearHandoverForm() {
  els.handoverForm.reset();
  els.handoverForm.querySelector('input[name="author"]').value = currentUser?.name || "";
  setSelectOptions();
  setFormMode("handover", null, "引き継ぎを追加");
  activateSubView("handover", "entry");
}

function clearClassroomForm() {
  els.classroomForm.reset();
  setFormMode("classroom", null, "教室を追加");
  activateSubView("master", "entry");
}

function clearTeacherForm() {
  els.teacherForm.reset();
  setSelectOptions();
  setFormMode("teacher", null, "先生アカウントを追加");
  activateSubView("master", "entry");
}

function clearStudentForm() {
  els.studentForm.reset();
  els.studentForm.querySelectorAll('input[name="weekday"]').forEach((cb) => { cb.checked = false; });
  els.studentForm.querySelectorAll('input[name="saturdaySlot"]').forEach((cb) => { cb.checked = false; });
  setSelectOptions();
  els.studentForm.querySelector('select[name="classOptionId"]').value = "";
  updateSaturdaySlotVisibility();
  setFormMode("student", null, "生徒を追加");
  activateSubView("master", "entry");
}

function presetSettingsForm() {
  if (!els.settingsForm) return;
  els.settingsForm.querySelector('select[name="fiscalClosingMonth"]').value = String(state.settings.fiscalClosingMonth || 3);
}

async function submitIncidentalSaleForm(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const payload = {
    id: formEditState.incidentalSale || makeId("incidental-sale"),
    month: String(formData.get("month") || currentMonth()),
    name: String(formData.get("name") || "").trim(),
    content: String(formData.get("content") || "").trim(),
    amount: Number(formData.get("amount") || 0),
    note: String(formData.get("note") || "").trim(),
  };
  if (formEditState.incidentalSale) {
    state.incidentalSales = state.incidentalSales.map((item) => item.id === formEditState.incidentalSale ? payload : item);
  } else {
    state.incidentalSales.unshift(payload);
  }
  await upsertRecord("incidental_sales", incidentalSaleToDb(payload));
  await saveState();
  renderApp();
  clearIncidentalSaleForm();
  showToast(formEditState.incidentalSale ? "手動売上を更新しました" : "手動売上を追加しました");
}

function startEditClassOption(id) {
  const item = state.classOptions.find((row) => row.id === id);
  if (!item) return;
  activateView("master");
  activateSubView("master", "entry");
  els.classOptionForm.querySelector('input[name="name"]').value = item.name || "";
  els.classOptionForm.querySelector('input[name="sortOrder"]').value = item.sortOrder || "";
  setFormMode("classOption", id, "クラスを更新");
}

function startEditIncidentalSale(id) {
  const item = state.incidentalSales.find((row) => row.id === id);
  if (!item) return;
  activateView("billing");
  activateSubView("billing", "entry");
  fillIncidentalSaleForms(item, { month: item.month || currentMonth() });
  setFormMode("incidentalSale", id, "手動売上を更新");
}

function startReuseIncidentalSale(id) {
  const item = state.incidentalSales.find((row) => row.id === id);
  if (!item) return;
  activateView("billing");
  activateSubView("billing", "entry");
  clearIncidentalSaleForm();
  fillIncidentalSaleForms(item, { month: currentMonth() });
  setFormMode("incidentalSale", null, "手動売上を追加");
}

function startEditAttendance(id) {
  const item = state.attendance.find((row) => row.id === id);
  if (!item) return;
  activateView("attendance");
  activateSubView("attendance", "entry");
  els.attendanceForm.querySelector('input[name="date"]').value = item.date;
  els.attendanceForm.querySelector('select[name="classroomId"]').value = item.classroomId;
  setSelectOptions();
  els.attendanceForm.querySelector('select[name="classroomId"]').value = item.classroomId;
  els.attendanceForm.querySelector('select[name="studentId"]').value = item.studentId;
  els.attendanceForm.querySelector('select[name="status"]').value = item.status;
  els.attendanceForm.querySelector('input[name="transfer"]').value = item.transfer || "";
  els.attendanceForm.querySelector('input[name="teacher"]').value = item.teacher || "";
  els.attendanceForm.querySelector('textarea[name="note"]').value = item.note || "";
  setFormMode("attendance", id, "出席を更新");
}

function startEditBilling(id) {
  const item = state.billing.find((row) => row.id === id);
  if (!item) return;
  activateView("billing");
  activateSubView("billing", "entry");
  setFormMode("billing", id, "集金情報を更新");
  setBillingFormForEdit(item);
  setBillingEditNote(item);
}

function startStudentBillingEdit(studentId, month = currentMonth()) {
  const student = getStudent(studentId);
  if (!student) return;
  const existing = findBillingRecord(studentId, month);
  if (existing) { startEditBilling(existing.id); return; }
  activateView("billing");
  activateSubView("billing", "entry");
  clearBillingForm();
  els.billingForm.querySelector('input[name="month"]').value = month;
  els.billingForm.querySelector('select[name="classroomId"]').value = student.classroomId;
  setSelectOptions();
  els.billingForm.querySelector('input[name="month"]').value = month;
  els.billingForm.querySelector('select[name="classroomId"]').value = student.classroomId;
  els.billingForm.querySelector('select[name="studentId"]').value = studentId;
  autofillBillingAmount();
}

function startEditHandover(id) {
  const item = state.handovers.find((row) => row.id === id);
  if (!item) return;
  activateView("handover");
  activateSubView("handover", "entry");
  els.handoverForm.querySelector('select[name="classroomId"]').value = item.classroomId;
  setSelectOptions();
  els.handoverForm.querySelector('select[name="classroomId"]').value = item.classroomId;
  els.handoverForm.querySelector('select[name="category"]').value = item.category;
  els.handoverForm.querySelector('select[name="studentId"]').value = item.studentId || "";
  els.handoverForm.querySelector('input[name="author"]').value = item.author || "";
  els.handoverForm.querySelector('input[name="title"]').value = item.title || "";
  els.handoverForm.querySelector('textarea[name="body"]').value = item.body || "";
  setFormMode("handover", id, "引き継ぎを更新");
}

function startEditClassroom(id) {
  const item = state.classrooms.find((row) => row.id === id);
  if (!item) return;
  activateView("master");
  activateSubView("master", "entry");
  els.classroomForm.querySelector('input[name="name"]').value = item.name || "";
  els.classroomForm.querySelector('input[name="manager"]').value = item.manager || "";
  els.classroomForm.querySelector('input[name="days"]').value = item.days || "";
  setFormMode("classroom", id, "教室を更新");
}

function startEditTeacher(id) {
  const item = state.users.find((row) => row.id === id);
  if (!item) return;
  activateView("master");
  activateSubView("master", "entry");
  els.teacherForm.querySelector('input[name="name"]').value = item.name || "";
  els.teacherForm.querySelector('input[name="email"]').value = item.email || "";
  els.teacherForm.querySelector('input[name="password"]').value = item.password || "";
  els.teacherForm.querySelector('select[name="role"]').value = item.role || "先生";
  els.teacherForm.querySelector('select[name="classroomId"]').value = item.classroomId || "all";
  setFormMode("teacher", id, "先生アカウントを更新");
}

function startEditStudent(id) {
  const item = state.students.find((row) => row.id === id);
  if (!item) return;
  activateView("master");
  activateSubView("master", "entry");
  els.studentForm.querySelector('input[name="name"]').value = item.name || "";
  els.studentForm.querySelector('select[name="classroomId"]').value = item.classroomId || "";
  els.studentForm.querySelector('select[name="classOptionId"]').value = item.classOptionId || "";
  els.studentForm.querySelector('select[name="status"]').value = item.status || "在籍";
  els.studentForm.querySelector('input[name="startMonth"]').value = item.startMonth || "";
  els.studentForm.querySelector('input[name="tuition"]').value = item.tuition || 0;
  els.studentForm.querySelector('input[name="guardian"]').value = item.guardian || "";
  els.studentForm.querySelector('input[name="phone"]').value = item.phone || "";
  els.studentForm.querySelector('input[name="email"]').value = item.email || "";
  els.studentForm.querySelectorAll('input[name="weekday"]').forEach((cb) => { cb.checked = (item.weekdays || []).includes(cb.value); });
  els.studentForm.querySelectorAll('input[name="saturdaySlot"]').forEach((cb) => { cb.checked = (item.saturdaySlots || []).includes(cb.value); });
  updateSaturdaySlotVisibility();
  setFormMode("student", id, "生徒を更新");
}

async function deleteStudentCascade(studentId) {
  state.students = state.students.filter((s) => s.id !== studentId);
  state.attendance = state.attendance.filter((item) => item.studentId !== studentId);
  state.billing = state.billing.filter((item) => item.studentId !== studentId);
  state.handovers = state.handovers.filter((item) => item.studentId !== studentId);
  await Promise.all([
    deleteRecord("students", studentId),
    sb.from("attendance").delete().eq("student_id", studentId),
    sb.from("billing").delete().eq("student_id", studentId),
    sb.from("handovers").delete().eq("student_id", studentId),
  ]);
}

async function deleteClassroomCascade(classroomId) {
  const studentIds = state.students.filter((s) => s.classroomId === classroomId).map((s) => s.id);
  state.classrooms = state.classrooms.filter((c) => c.id !== classroomId);
  state.users = state.users.filter((u) => u.classroomId !== classroomId);
  state.students = state.students.filter((s) => s.classroomId !== classroomId);
  state.attendance = state.attendance.filter((item) => item.classroomId !== classroomId && !studentIds.includes(item.studentId));
  state.billing = state.billing.filter((item) => item.classroomId !== classroomId && !studentIds.includes(item.studentId));
  state.handovers = state.handovers.filter((item) => item.classroomId !== classroomId && !studentIds.includes(item.studentId));
  await Promise.all([
    deleteRecord("classrooms", classroomId),
    sb.from("users").delete().eq("classroom_id", classroomId),
    sb.from("students").delete().eq("classroom_id", classroomId),
    sb.from("attendance").delete().eq("classroom_id", classroomId),
    sb.from("billing").delete().eq("classroom_id", classroomId),
    sb.from("handovers").delete().eq("classroom_id", classroomId),
  ]);
}

function renderApp() {
  setCurrentUserInfo();
  renderSaveStatus();
  setGlobalFilters();
  setSelectOptions();
  presetForms();
  renderDashboard();
  renderAttendance();
  renderBilling();
  renderSales();
  renderHandovers();
  renderMaster();
  Object.entries(currentSubView).forEach(([section, subview]) => activateSubView(section, subview));
}

function activateView(viewName) {
  currentView = viewName;
  Object.entries(els.views).forEach(([key, node]) => { node.classList.toggle("is-visible", key === viewName); });
  document.querySelectorAll(".nav-item").forEach((button) => { button.classList.toggle("is-active", button.dataset.view === viewName); });
  els.viewTitle.textContent = viewTitles[viewName];
  if (currentSubView[viewName]) activateSubView(viewName, currentSubView[viewName]);
}

function login(email, password) {
  const normalizedEmail = String(email).trim().toLowerCase();
  currentUser = state.users.find((item) => String(item.email).trim().toLowerCase() === normalizedEmail && item.password === password);
  if (!currentUser) { showToast("メールアドレスまたはパスワードが違います"); return; }
  currentFilter = currentUser.classroomId;
  if (currentUser.classroomId !== "all") currentFilter = currentUser.classroomId;
  els.loginScreen.classList.add("hidden");
  els.appShell.classList.remove("hidden");
  activateView("dashboard");
  renderApp();
}

function logout() {
  currentUser = null;
  els.appShell.classList.add("hidden");
  els.loginScreen.classList.remove("hidden");
}

// =====================================================================
// DOM要素参照
// =====================================================================
const els = {
  loginScreen: document.getElementById("login-screen"),
  appShell: document.getElementById("app-shell"),
  loginForm: document.getElementById("login-form"),
  loginEmail: document.getElementById("login-email"),
  loginPassword: document.getElementById("login-password"),
  currentUserName: document.getElementById("current-user-name"),
  currentUserRole: document.getElementById("current-user-role"),
  currentUserClassroom: document.getElementById("current-user-classroom"),
  topbarMeta: document.getElementById("topbar-meta"),
  saveLocationLabel: document.getElementById("save-location-label"),
  saveLocationDetail: document.getElementById("save-location-detail"),
  backupSummary: document.getElementById("backup-summary"),
  viewTitle: document.getElementById("view-title"),
  globalFilter: document.getElementById("global-classroom-filter"),
  heroNote: document.getElementById("hero-note"),
  statsGrid: document.getElementById("stats-grid"),
  classroomSummaryBody: document.getElementById("classroom-summary-body"),
  latestHandoverList: document.getElementById("latest-handover-list"),
  salesStatsGrid: document.getElementById("sales-stats-grid"),
  salesMonthlyMeta: document.getElementById("sales-monthly-meta"),
  salesMonthlyBody: document.getElementById("sales-monthly-body"),
  salesFiscalMeta: document.getElementById("sales-fiscal-meta"),
  salesFiscalBody: document.getElementById("sales-fiscal-body"),
  attendanceBody: document.getElementById("attendance-table-body"),
  scheduledStudentsMeta: document.getElementById("scheduled-students-meta"),
  scheduledStudentsList: document.getElementById("scheduled-students-list"),
  billingBody: document.getElementById("billing-table-body"),
  billingIncidentalSaleTableBody: document.getElementById("billing-incidental-sale-table-body"),
  handoverGrid: document.getElementById("handover-grid"),
  classOptionTableBody: document.getElementById("class-option-table-body"),
  incidentalSaleTableBody: document.getElementById("incidental-sale-table-body"),
  classroomTableBody: document.getElementById("classroom-table-body"),
  teacherTableBody: document.getElementById("teacher-table-body"),
  studentTableBody: document.getElementById("student-table-body"),
  attendanceForm: document.getElementById("attendance-form"),
  billingForm: document.getElementById("billing-form"),
  billingIncidentalSaleForm: document.getElementById("billing-incidental-sale-form"),
  billingIncidentalSaleTemplateSelect: document.getElementById("billing-incidental-sale-template-select"),
  billingEditNote: document.getElementById("billing-edit-note"),
  billingQuickActions: document.getElementById("billing-quick-actions"),
  billingMarkUnpaidBtn: document.getElementById("billing-mark-unpaid-btn"),
  billingMoveCurrentMonthBtn: document.getElementById("billing-move-current-month-btn"),
  billingFillPaidBtn: document.getElementById("billing-fill-paid-btn"),
  handoverForm: document.getElementById("handover-form"),
  classOptionForm: document.getElementById("class-option-form"),
  incidentalSaleForm: document.getElementById("incidental-sale-form"),
  incidentalSaleTemplateSelect: document.getElementById("incidental-sale-template-select"),
  settingsForm: document.getElementById("settings-form"),
  classroomForm: document.getElementById("classroom-form"),
  teacherForm: document.getElementById("teacher-form"),
  studentForm: document.getElementById("student-form"),
  saturdaySlotsFieldset: document.getElementById("saturday-slots-fieldset"),
  attendanceSubmitBtn: document.getElementById("attendance-submit-btn"),
  attendanceCancelBtn: document.getElementById("attendance-cancel-btn"),
  billingSubmitBtn: document.getElementById("billing-submit-btn"),
  billingIncidentalSaleSubmitBtn: document.getElementById("billing-incidental-sale-submit-btn"),
  billingCancelBtn: document.getElementById("billing-cancel-btn"),
  billingIncidentalSaleCancelBtn: document.getElementById("billing-incidental-sale-cancel-btn"),
  handoverSubmitBtn: document.getElementById("handover-submit-btn"),
  handoverCancelBtn: document.getElementById("handover-cancel-btn"),
  classOptionSubmitBtn: document.getElementById("class-option-submit-btn"),
  incidentalSaleSubmitBtn: document.getElementById("incidental-sale-submit-btn"),
  classOptionCancelBtn: document.getElementById("class-option-cancel-btn"),
  incidentalSaleCancelBtn: document.getElementById("incidental-sale-cancel-btn"),
  classroomSubmitBtn: document.getElementById("classroom-submit-btn"),
  classroomCancelBtn: document.getElementById("classroom-cancel-btn"),
  teacherSubmitBtn: document.getElementById("teacher-submit-btn"),
  teacherCancelBtn: document.getElementById("teacher-cancel-btn"),
  studentSubmitBtn: document.getElementById("student-submit-btn"),
  studentCancelBtn: document.getElementById("student-cancel-btn"),
  exportStudentListBtn: document.getElementById("export-student-list-btn"),
  exportSalesReportBtn: document.getElementById("export-sales-report-btn"),
  exportBtn: document.getElementById("export-data-btn"),
  importInput: document.getElementById("import-data-input"),
  resetBtn: document.getElementById("reset-data-btn"),
  chooseBackupFileBtn: document.getElementById("choose-backup-file-btn"),
  saveBackupFileBtn: document.getElementById("save-backup-file-btn"),
  createRestorePointBtn: document.getElementById("create-restore-point-btn"),
  logoutBtn: document.getElementById("logout-btn"),
  quickAddBtn: document.getElementById("quick-add-btn"),
  toast: document.getElementById("toast"),
  subviewButtons: document.querySelectorAll(".subview-btn"),
  subviewPanels: document.querySelectorAll("[data-section-panel]"),
  views: {
    dashboard: document.getElementById("dashboard-view"),
    attendance: document.getElementById("attendance-view"),
    billing: document.getElementById("billing-view"),
    sales: document.getElementById("sales-view"),
    handover: document.getElementById("handover-view"),
    master: document.getElementById("master-view"),
  },
};

const viewTitles = {
  dashboard: "ダッシュボード",
  attendance: "出席管理",
  billing: "集金管理",
  sales: "売上管理",
  handover: "引き継ぎ",
  master: "マスタ管理",
};

function bindEvents() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => activateView(button.dataset.view));
  });
  els.subviewButtons.forEach((button) => {
    button.addEventListener("click", () => activateSubView(button.dataset.section, button.dataset.subview));
  });

  els.loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    login(els.loginEmail.value.trim(), els.loginPassword.value);
  });

  els.studentForm.querySelectorAll('input[name="weekday"]').forEach((cb) => {
    cb.addEventListener("change", updateSaturdaySlotVisibility);
  });
  els.incidentalSaleTemplateSelect.addEventListener("change", (event) => { if (event.target.value) applyIncidentalSaleTemplate(event.target.value); });
  els.billingIncidentalSaleTemplateSelect.addEventListener("change", (event) => { if (event.target.value) applyIncidentalSaleTemplate(event.target.value); });
  els.billingForm.querySelector('input[name="month"]').addEventListener("change", () => { autofillBillingAmount(); });
  els.billingForm.querySelector('select[name="studentId"]').addEventListener("change", () => { autofillBillingAmount(); });
  els.billingForm.querySelector('input[name="paid"]').addEventListener("input", () => { refreshBillingEditNote(); });
  els.billingMarkUnpaidBtn.addEventListener("click", () => { markBillingFormAsUnpaid(); });
  els.billingMoveCurrentMonthBtn.addEventListener("click", () => { moveBillingFormToCurrentMonth(); });
  els.billingFillPaidBtn.addEventListener("click", () => { fillBillingFormAsPaid(); });
  els.exportStudentListBtn.addEventListener("click", exportStudentListExcel);
  els.exportSalesReportBtn.addEventListener("click", exportSalesReportExcel);

  els.globalFilter.addEventListener("change", () => { currentFilter = els.globalFilter.value; renderApp(); });
  els.quickAddBtn.addEventListener("click", () => {
    const targetView = currentView === "dashboard" ? "attendance" : currentView;
    activateView(targetView);
    if (currentSubView[targetView]) activateSubView(targetView, "entry");
  });

  els.logoutBtn.addEventListener("click", logout);
  els.chooseBackupFileBtn.addEventListener("click", () => { chooseBackupFile(); });
  els.saveBackupFileBtn.addEventListener("click", () => { writeExternalBackupFile(true); });
  els.createRestorePointBtn.addEventListener("click", () => {
    createBackupSnapshot("手動復元点");
    renderSaveStatus();
    showToast("復元点を作成しました");
  });

  els.attendanceForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      id: formEditState.attendance || makeId("attendance"),
      date: formData.get("date"),
      classroomId: formData.get("classroomId"),
      studentId: formData.get("studentId"),
      status: formData.get("status"),
      transfer: formData.get("transfer"),
      teacher: formData.get("teacher"),
      note: formData.get("note"),
    };
    if (formEditState.attendance) {
      state.attendance = state.attendance.map((item) => item.id === formEditState.attendance ? payload : item);
    } else {
      state.attendance.unshift(payload);
    }
    await upsertRecord("attendance", attendanceToDb(payload));
    await saveState();
    renderApp();
    clearAttendanceForm();
    showToast(formEditState.attendance ? "出席情報を更新しました" : "出席情報を追加しました");
  });

  els.billingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const month = String(formData.get("month"));
    const studentId = String(formData.get("studentId"));
    const paid = Number(formData.get("paid"));
    if (!studentId) { showToast("生徒を選択してください"); return; }
    const expectedSummary = billingSummaryForStudent(studentId, month, formEditState.billing);
    const duplicate = state.billing.find((item) => item.studentId === studentId && item.month === month && item.id !== formEditState.billing);
    if (duplicate) { showToast("この生徒の対象月の集金はすでにあります。既存の編集画面を開きます"); startEditBilling(duplicate.id); return; }
    if (paid > expectedSummary.outstanding) { showToast(`入金額は不足額 ${yen(expectedSummary.outstanding)} までにしてください`); return; }
    const payload = {
      id: formEditState.billing || makeId("billing"),
      month, classroomId: formData.get("classroomId"), studentId,
      billed: expectedSummary.expected, paid,
      paidDate: formData.get("paidDate"),
      method: formData.get("method"),
      note: formData.get("note"),
    };
    if (formEditState.billing) {
      state.billing = state.billing.map((item) => item.id === formEditState.billing ? payload : item);
    } else {
      state.billing.unshift(payload);
    }
    await upsertRecord("billing", billingToDb(payload));
    await saveState();
    renderApp();
    clearBillingForm();
    showToast(formEditState.billing ? "集金情報を更新しました" : "集金情報を追加しました");
  });

  els.handoverForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      id: formEditState.handover || makeId("handover"),
      classroomId: formData.get("classroomId"),
      category: formData.get("category"),
      studentId: formData.get("studentId"),
      author: formData.get("author"),
      title: formData.get("title"),
      body: formData.get("body"),
      createdAt: formEditState.handover
        ? (state.handovers.find((item) => item.id === formEditState.handover)?.createdAt || new Date().toISOString())
        : new Date().toISOString(),
    };
    if (formEditState.handover) {
      state.handovers = state.handovers.map((item) => item.id === formEditState.handover ? payload : item);
    } else {
      state.handovers.unshift(payload);
    }
    await upsertRecord("handovers", handoverToDb(payload));
    await saveState();
    renderApp();
    clearHandoverForm();
    showToast(formEditState.handover ? "引き継ぎを更新しました" : "引き継ぎを追加しました");
  });

  els.classOptionForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name")).trim();
    if (state.classOptions.some((item) => item.name === name && item.id !== formEditState.classOption)) { showToast("同じクラス名がすでに登録されています"); return; }
    const payload = {
      id: formEditState.classOption || makeId("class-option"),
      name,
      sortOrder: Number(formData.get("sortOrder")) || state.classOptions.length + 1,
    };
    if (formEditState.classOption) {
      state.classOptions = state.classOptions.map((item) => item.id === formEditState.classOption ? payload : item);
    } else {
      state.classOptions.push(payload);
    }
    state.classOptions.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "ja"));
    await upsertRecord("class_options", classOptionToDb(payload));
    await saveState();
    renderApp();
    clearClassOptionForm();
    showToast(formEditState.classOption ? "クラスを更新しました" : "クラスを追加しました");
  });

  els.incidentalSaleForm.addEventListener("submit", submitIncidentalSaleForm);
  els.billingIncidentalSaleForm.addEventListener("submit", submitIncidentalSaleForm);

  els.classroomForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      id: formEditState.classroom || makeId("classroom"),
      name: formData.get("name"),
      manager: formData.get("manager"),
      days: formData.get("days"),
    };
    if (formEditState.classroom) {
      state.classrooms = state.classrooms.map((item) => item.id === formEditState.classroom ? payload : item);
    } else {
      state.classrooms.push(payload);
    }
    await upsertRecord("classrooms", classroomToDb(payload));
    await saveState();
    renderApp();
    clearClassroomForm();
    showToast(formEditState.classroom ? "教室を更新しました" : "教室を追加しました");
  });

  els.teacherForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email")).trim().toLowerCase();
    if (state.users.some((u) => u.email?.toLowerCase() === email && u.id !== formEditState.teacher)) { showToast("同じメールアドレスの先生がすでに登録されています"); return; }
    const payload = {
      id: formEditState.teacher || makeId("user"),
      name: formData.get("name"),
      email,
      password: formData.get("password"),
      role: formData.get("role"),
      classroomId: formData.get("classroomId"),
    };
    if (formEditState.teacher) {
      state.users = state.users.map((u) => u.id === formEditState.teacher ? payload : u);
      if (currentUser?.id === formEditState.teacher) currentUser = payload;
    } else {
      state.users.push(payload);
    }
    await upsertRecord("users", userToDb(payload));
    await saveState();
    renderApp();
    setLoginOptions();
    clearTeacherForm();
    showToast(formEditState.teacher ? "先生アカウントを更新しました" : "先生アカウントを追加しました");
  });

  els.studentForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      id: formEditState.student || makeId("student"),
      name: formData.get("name"),
      classroomId: formData.get("classroomId"),
      classOptionId: formData.get("classOptionId"),
      status: formData.get("status"),
      startMonth: formData.get("startMonth"),
      tuition: Number(formData.get("tuition")),
      guardian: formData.get("guardian"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      weekdays: formData.getAll("weekday"),
      saturdaySlots: formData.getAll("weekday").includes("土") ? formData.getAll("saturdaySlot") : [],
    };
    if (formEditState.student) {
      state.students = state.students.map((s) => s.id === formEditState.student ? payload : s);
    } else {
      state.students.push(payload);
    }
    await upsertRecord("students", studentToDb(payload));
    await saveState();
    renderApp();
    clearStudentForm();
    showToast(formEditState.student ? "生徒情報を更新しました" : "生徒を追加しました");
  });

  els.settingsForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    state.settings.fiscalClosingMonth = Number(formData.get("fiscalClosingMonth")) || 3;
    await sb.from("settings").upsert({ id: "main", fiscal_closing_month: state.settings.fiscalClosingMonth });
    await saveState();
    renderApp();
    showToast("決算月を保存しました");
  });

  els.attendanceCancelBtn.addEventListener("click", clearAttendanceForm);
  els.billingCancelBtn.addEventListener("click", clearBillingForm);
  els.handoverCancelBtn.addEventListener("click", clearHandoverForm);
  els.classOptionCancelBtn.addEventListener("click", clearClassOptionForm);
  els.incidentalSaleCancelBtn.addEventListener("click", clearIncidentalSaleForm);
  els.billingIncidentalSaleCancelBtn.addEventListener("click", clearIncidentalSaleForm);
  els.classroomCancelBtn.addEventListener("click", clearClassroomForm);
  els.teacherCancelBtn.addEventListener("click", clearTeacherForm);
  els.studentCancelBtn.addEventListener("click", clearStudentForm);

  els.exportBtn.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `robot-school-shared-data-${todayDate()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    showToast("データを書き出しました");
  });

  els.importInput.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      await overwriteStateToSupabase(JSON.parse(text), `JSON読込: ${file.name}`);
      renderSaveStatus();
      showToast("データを読み込みました");
    } catch (_error) {
      showToast("JSONの読み込みに失敗しました");
    }
    event.target.value = "";
  });

  els.resetBtn.addEventListener("click", async () => {
    await resetState();
    setLoginOptions();
    if (currentUser) {
      currentUser = state.users.find((u) => u.id === currentUser.id) || state.users[0];
      renderApp();
    }
    showToast("初期データに戻しました");
  });

  document.body.addEventListener("click", async (event) => {
    const markAttendanceStudentId = event.target.dataset.markAttendance;
    const openBillingStudentId = event.target.dataset.openBilling;
    const attendanceId = event.target.dataset.deleteAttendance;
    const billingId = event.target.dataset.deleteBilling;
    const handoverId = event.target.dataset.deleteHandover;
    const classOptionId = event.target.dataset.deleteClassOption;
    const incidentalSaleId = event.target.dataset.deleteIncidentalSale;
    const reuseIncidentalSaleId = event.target.dataset.reuseIncidentalSale;
    const classroomId = event.target.dataset.deleteClassroom;
    const userId = event.target.dataset.deleteUser;
    const studentId = event.target.dataset.deleteStudent;
    const editAttendanceId = event.target.dataset.editAttendance;
    const editBillingId = event.target.dataset.editBilling;
    const editHandoverId = event.target.dataset.editHandover;
    const editClassOptionId = event.target.dataset.editClassOption;
    const editIncidentalSaleId = event.target.dataset.editIncidentalSale;
    const editClassroomId = event.target.dataset.editClassroom;
    const editUserId = event.target.dataset.editUser;
    const editStudentId = event.target.dataset.editStudent;
    const editStudentBillingId = event.target.dataset.editStudentBilling;
    const restoreBackupId = event.target.dataset.restoreBackup;

    if (markAttendanceStudentId) { markAttendanceFromSchedule(markAttendanceStudentId); return; }
    if (openBillingStudentId) { startStudentBillingEdit(openBillingStudentId, currentMonth()); return; }
    if (editAttendanceId) { startEditAttendance(editAttendanceId); return; }
    if (editBillingId) { startEditBilling(editBillingId); return; }
    if (editHandoverId) { startEditHandover(editHandoverId); return; }
    if (editClassOptionId) { startEditClassOption(editClassOptionId); return; }
    if (editIncidentalSaleId) { startEditIncidentalSale(editIncidentalSaleId); return; }
    if (reuseIncidentalSaleId) { startReuseIncidentalSale(reuseIncidentalSaleId); return; }
    if (editClassroomId) { startEditClassroom(editClassroomId); return; }
    if (editUserId) { startEditTeacher(editUserId); return; }
    if (editStudentId) { startEditStudent(editStudentId); return; }
    if (editStudentBillingId) { startStudentBillingEdit(editStudentBillingId); return; }
    if (restoreBackupId) { restoreBackupSnapshot(restoreBackupId); return; }

    if (attendanceId) {
      state.attendance = state.attendance.filter((item) => item.id !== attendanceId);
      await deleteRecord("attendance", attendanceId);
      await saveState();
      renderApp();
      showToast("出席情報を削除しました");
    }
    if (billingId) {
      state.billing = state.billing.filter((item) => item.id !== billingId);
      await deleteRecord("billing", billingId);
      await saveState();
      renderApp();
      showToast("集金情報を削除しました");
    }
    if (handoverId) {
      state.handovers = state.handovers.filter((item) => item.id !== handoverId);
      await deleteRecord("handovers", handoverId);
      await saveState();
      renderApp();
      showToast("引き継ぎを削除しました");
    }
    if (classOptionId) {
      if (state.students.some((s) => s.classOptionId === classOptionId)) { showToast("生徒に使われているクラスは削除できません"); return; }
      state.classOptions = state.classOptions.filter((item) => item.id !== classOptionId);
      await deleteRecord("class_options", classOptionId);
      await saveState();
      renderApp();
      clearClassOptionForm();
      showToast("クラスを削除しました");
    }
    if (incidentalSaleId) {
      state.incidentalSales = state.incidentalSales.filter((item) => item.id !== incidentalSaleId);
      await deleteRecord("incidental_sales", incidentalSaleId);
      await saveState();
      renderApp();
      clearIncidentalSaleForm();
      showToast("手動売上を削除しました");
    }
    if (classroomId) {
      if (currentUser?.classroomId === classroomId) { showToast("ログイン中の担当教室は削除できません"); return; }
      await deleteClassroomCascade(classroomId);
      await saveState();
      setLoginOptions();
      renderApp();
      showToast("教室と関連データを削除しました");
    }
    if (userId) {
      if (currentUser?.id === userId) { showToast("ログイン中の先生アカウントは削除できません"); return; }
      state.users = state.users.filter((u) => u.id !== userId);
      await deleteRecord("users", userId);
      await saveState();
      setLoginOptions();
      renderApp();
      showToast("先生アカウントを削除しました");
    }
    if (studentId) {
      await deleteStudentCascade(studentId);
      await saveState();
      renderApp();
      showToast("生徒と関連データを削除しました");
    }
  });
}

function presetForms() {
  clearAttendanceForm();
  clearBillingForm();
  clearHandoverForm();
  clearClassOptionForm();
  clearIncidentalSaleForm();
  clearClassroomForm();
  clearTeacherForm();
  clearStudentForm();
  presetSettingsForm();
}

async function init() {
  backupFileHandle = await loadBackupFileHandle();
  if (backupFileHandle && !saveMeta.externalFileName) {
    saveMeta.externalFileName = backupFileHandle.name || "robot-school-shared-backup.json";
    persistSaveMeta();
  }
  await loadStateFromSupabase();
  if (!backupSnapshots.length) createBackupSnapshot("起動時の復元点");
  setLoginOptions();
  bindEvents();
  presetForms();
  renderSaveStatus();
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});
