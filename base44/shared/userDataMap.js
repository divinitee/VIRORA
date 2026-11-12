// The map of every user-data entity and the profile-reset patch.
// Moved here from src/lib/userWipe.js (11 Nov 2026) so the admin console's
// server-side bulk delete (base44/shared/adminBulk.ts) and the browser-side
// wipe in AdminDashboard read ONE list and can never drift apart.
// tools/check_wipe_coverage.py checks this file.

// Everything in the schema that belongs to a single person, and the fields
// that can point at them.
//
// SCOPE (GPT audit, 2 Nov 2026): this is DATABASE-TABLE deletion coverage,
// not complete erasure of a person's data. The wipe deletes their rows in
// every user-data entity below (33/33, tools/check_wipe_coverage.py) except
// the ones marked `retain`. It does NOT yet delete:
//   - uploaded files: avatars, payment receipt photos, teacher material
//     files, bug-report screenshots (Base44 file storage)
//   - copies outside VIRORA: receipt photos sent to the admin Telegram bot,
//     rows exported to Google Sheets
// Those are tracked as a separate deletion backlog (taskboard VT-47).
// Retained on purpose, pending the lawyer: ManualPayment (financial records)
// and AdminSecurity (security records). Never delete those silently.
//
// The key field is wildly inconsistent across entities for historical
// reasons — and two of them are actively misleading: StudentSubscription's
// `phone` and QuizResult's `student_phone` both store EMAIL addresses, not
// phone numbers. That is exactly why this map exists in one place instead of
// each call site guessing.
//
// GrammarProfile and GrammarAssessmentRun were MISSING from
// AdminWipeUsers.jsx's original list, so even a full factory reset used to
// leave a user's grammar profile and assessment history orphaned under their
// email — and a "fresh" re-registration would inherit it. That page now
// imports this list so the two can never drift apart again.
export const USER_DATA_ENTITIES = [
  { name: "AiUsageLog", emailFields: ["user_email"], idFields: ["user_id"] },
  { name: "AssessmentResult", emailFields: ["user_email"], idFields: [] },
  // teacher_id is deliberately NOT matched: it points at the other party in
  // the conversation, not the row's owner.
  { name: "ChatMessage", emailFields: ["student_email"], idFields: [], excluded: ["teacher_id"] },
  { name: "GrammarAssessmentRun", emailFields: ["user_email"], idFields: [] },
  { name: "GrammarProfile", emailFields: ["user_email"], idFields: [] },
  { name: "QuizResult", emailFields: ["student_phone"], idFields: [] },
  { name: "RewardEvent", emailFields: ["user_email"], idFields: [] },
  { name: "SavedWord", emailFields: ["user_email"], idFields: [] },
  { name: "SkillHubProgress", emailFields: ["user_email"], idFields: [] },
  { name: "SkillState", emailFields: ["user_email"], idFields: [] },
  { name: "GrammarAttempt", emailFields: ["user_email"], idFields: [] },
  { name: "RoundReceipt", emailFields: ["user_email"], idFields: [] },
  { name: "AiGradedItem", emailFields: ["user_email"], idFields: [] },
  { name: "StudentProgress", emailFields: ["user_email"], idFields: [] },
  // teacher_id is deliberately NOT matched. On a subscription row it names
  // the REFERRING TEACHER, not the subscriber — matching it would mean that
  // wiping one teacher deletes every one of their students' paid
  // subscriptions. Students of a deleted teacher keep their access and are
  // simply left pointing at a teacher_id that no longer resolves.
  { name: "StudentSubscription", emailFields: ["phone"], idFields: [], excluded: ["teacher_id"] },
  { name: "TeacherReferral", emailFields: ["teacher_email"], idFields: ["teacher_id"] },
  { name: "UserCoins", emailFields: ["email"], idFields: ["user_id"] },
  { name: "WordAttempt", emailFields: ["user_email"], idFields: [] },
  // Added 2026-11-01 (tools/check_wipe_coverage.py was failing on all of
  // these). Without them a "deleted" account kept its route history, Coach
  // plan, learning map, homework and uploads — which breaks the Privacy
  // Policy's deletion promise.
  { name: "ActivitySession", emailFields: ["student_email"], idFields: [], excluded: ["teacher_id"] },
  { name: "CoachProfile", emailFields: ["user_email"], idFields: [] },
  { name: "PlanLog", emailFields: ["user_email"], idFields: [] },
  { name: "ItemEvidence", emailFields: ["user_email"], idFields: [] },
  { name: "LearnerItem", emailFields: ["user_email"], idFields: [] },
  { name: "LearnerWordState", emailFields: ["user_email"], idFields: [] },
  { name: "LeafState", emailFields: ["user_email"], idFields: [] },
  { name: "ThemeProgress", emailFields: ["user_email"], idFields: [] },
  { name: "UsageReservation", emailFields: ["user_email"], idFields: ["user_id"] },
  // A student's own submissions. teacher_id names the OTHER party.
  { name: "HomeworkSubmission", emailFields: ["student_email"], idFields: ["student_id"], excluded: ["teacher_id"] },
  // A teacher's own assignments and uploaded materials. Students' submissions
  // to a deleted teacher's assignments are the students' data and stay.
  { name: "HomeworkAssignment", emailFields: ["teacher_email"], idFields: ["teacher_id"] },
  { name: "MaterialSegment", emailFields: [], idFields: ["teacher_id"] },
  { name: "MaterialSource", emailFields: ["teacher_email"], idFields: ["teacher_id"] },
  // RETAINED, not deleted: payment records (amount, date, receipt) may have to
  // be kept for accounting/tax. Pending the lawyer's retention decision
  // (legal facts pack §D). Listed so the coverage check stays honest.
  { name: "ManualPayment", emailFields: ["user_email"], idFields: ["user_id"], retain: "payment record: retention pending lawyer" },
  // Admin TOTP secrets: RLS never, and guardDelete refuses admins anyway.
  { name: "AdminSecurity", emailFields: ["email"], idFields: ["user_id"], retain: "admin security record (admins can't be wiped here)" },
  // A ban outlives the account on purpose (11 Nov 2026): deleting a banned
  // account must not let the same email sign up again clean.
  { name: "AccountBan", emailFields: ["email"], idFields: ["user_id"], retain: "ban record: kept so a banned email stays banned" },
];

// Profile fields cleared by a reset, so the account walks back through
// registration/onboarding as if brand new.
//
// `role` is deliberately absent: that is Base44's own platform permission
// field, and clearing it on an admin would strip their access for real.
export const PROFILE_RESET_PATCH = {
  display_name: "",
  goals: [],
  classroom_code: "",
  cefr_level: null,
  level_source: null,
  level_set_at: null,
  cal_up: 0,
  cal_down: 0,
  teacher_status: "none",
  teacher_status_note: "",
  teacher_commission_rate_pct: null,
  teacher_commission_accrued_usd: 0,
  teacher_payout_status: "none",
  teacher_last_payout_at: null,
  teaching_center: "",
  teacher_phone: "",
  heard_about_us: "",
  heard_about_us_detail: "",
};
