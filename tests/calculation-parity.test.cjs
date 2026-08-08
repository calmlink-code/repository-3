const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appSource = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
const calculationStart = appSource.indexOf("function monthOf");
const calculationEnd = appSource.indexOf("function findBillingRecord");
assert.ok(calculationStart >= 0 && calculationEnd > calculationStart, "計算関数を抽出できること");

const state = {
  settings: { fiscalClosingMonth: 3 },
  students: [
    { id: "s1", status: "在籍", tuition: 1000, startMonth: "2026-04", pauseMonth: "", resumeMonth: "", classroomId: "c1" },
    { id: "s2", status: "休会", tuition: 2000, startMonth: "2026-04", pauseMonth: "2026-07", resumeMonth: "", classroomId: "c1" },
    { id: "s3", status: "在籍", tuition: 3000, startMonth: "2026-06", pauseMonth: "2026-07", resumeMonth: "2026-08", classroomId: "c1" },
  ],
  billing: [
    { id: "b1", studentId: "s1", month: "2026-04", billed: 1000, paid: 994 },
    { id: "b2", studentId: "s2", month: "2026-04", billed: 2000, paid: 2000 },
  ],
  incidentalSales: [
    { id: "i1", month: "2026-04", amount: 500 },
  ],
  attendance: [],
};

const context = {
  state,
  MINOR_BILLING_DIFFERENCE_YEN: 10,
  matchClassroom: () => true,
  getStudent: (id) => state.students.find((student) => student.id === id),
  yen: (value) => `${value}円`,
  Date,
  Number,
  String,
  Math,
  Map,
  Object,
};
vm.createContext(context);
vm.runInContext(appSource.slice(calculationStart, calculationEnd), context);

assert.equal(context.normalizeMinorBillingDifference(6), 0, "10円未満の差額を未収にしないこと");
assert.equal(context.billingSummaryForStudent("s1", "2026-05").carryover, 0, "少額差を翌月へ繰り越さないこと");
assert.equal(context.isStudentBillableForMonth(state.students[1], "2026-05"), true, "休会前は請求対象であること");
assert.equal(context.isStudentBillableForMonth(state.students[1], "2026-06"), false, "休会月に対応する請求対象月から除外すること");
assert.equal(context.isStudentBillableForMonth(state.students[2], "2026-07"), true, "復会月に対応する請求対象月へ復帰すること");

const april = context.monthlySalesRows().find((row) => row.month === "2026-04");
assert.deepEqual(
  JSON.parse(JSON.stringify({ billed: april.billed, paid: april.paid, unpaid: april.unpaid })),
  { billed: 3500, paid: 3494, unpaid: 0 },
  "月謝と手動売上をローカル版と同じ方法で集計すること",
);

assert.match(appSource, /\["incidental_sales", importedState\.incidentalSales\.map\(incidentalSaleToDb\)\]/, "手動売上もインポートすること");
assert.match(appSource, /select\("pause_month,resume_month,attendance_days"\)\.limit\(0\)/, "破壊的インポート前にDB列を確認すること");

console.log("calculation parity tests passed");
