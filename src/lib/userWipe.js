import { base44 } from "@/api/base44Client";

// USER_DATA_ENTITIES and PROFILE_RESET_PATCH live in base44/shared/userDataMap.js
// (shared with the console's server-side bulk delete). Re-exported here so
// existing imports keep working.
import { USER_DATA_ENTITIES, PROFILE_RESET_PATCH } from "../../base44/shared/userDataMap.js";
export { USER_DATA_ENTITIES, PROFILE_RESET_PATCH };

// Resetting data is always safe: the login survives, so there is no way to
// lock yourself out. Wiping your own account is a legitimate thing to want —
// it's how you test registration as a fresh user.
export function guardReset(target) {
  if (!target?.id) return "No user selected.";
  return null;
}

// Deleting the account is the one move that can lock you out of your own app,
// so it refuses on yourself and on any other admin.
export function guardDelete(target, me) {
  if (!target?.id) return "No user selected.";
  if (me && target.id === me.id) {
    return "This is your own account. Reset its data freely — but deleting it would lock you out of your own app.";
  }
  if (target.role === "admin") {
    return "That account is an admin. Remove its admin role in Base44 first if you really mean to delete it.";
  }
  return null;
}

// Deletes every row belonging to this person across every entity above
// (except the ones marked `retain`). Database rows only; see SCOPE above.
// Matches on the declared email/id fields plus created_by_id as a catch-all,
// de-duplicating by row id so a row matched twice is only deleted once.
// Never throws — a failure on one entity is recorded and the sweep continues,
// so one locked row can't strand the rest of the wipe half-done.
export async function wipeUserData(user, onProgress) {
  const email = user?.email;
  const id = user?.id;
  const results = [];

  for (const ent of USER_DATA_ENTITIES) {
    if (ent.retain) {
      results.push({ name: ent.name, deleted: 0, failed: 0, error: null, retained: ent.retain });
      onProgress?.([...results]);
      continue;
    }
    let deleted = 0;
    let failed = 0;
    let firstError = null;
    const seen = new Set();

    const queries = [
      ...(email ? ent.emailFields.map((f) => ({ [f]: email })) : []),
      ...(id ? (ent.idFields || []).map((f) => ({ [f]: id })) : []),
      ...(id ? [{ created_by_id: id }] : []),
    ];

    for (const q of queries) {
      let rows = [];
      try {
        rows = await base44.entities[ent.name].filter(q);
      } catch (e) {
        // A filter on a field this entity doesn't have (created_by_id on an
        // odd entity, say) just yields nothing useful — not worth failing on.
        continue;
      }
      for (const row of rows) {
        if (seen.has(row.id)) continue;
        seen.add(row.id);
        try {
          await base44.entities[ent.name].delete(row.id);
          deleted += 1;
        } catch (e) {
          failed += 1;
          if (!firstError) firstError = e?.message || String(e);
        }
      }
    }

    results.push({ name: ent.name, deleted, failed, error: firstError });
    onProgress?.([...results]);
  }

  return results;
}

// Clears the profile fields so the account re-enters onboarding. Uses
// auth.updateMe() when the target is the caller — that's the supported path
// for your own record — and the admin entity update for anyone else.
export async function resetUserProfile(user, me) {
  const isSelf = me && user.id === me.id;
  if (isSelf) return base44.auth.updateMe(PROFILE_RESET_PATCH);
  return base44.entities.User.update(user.id, PROFILE_RESET_PATCH);
}

// Full reset: data sweep + profile clear. The login survives.
export async function resetUser(user, me, onProgress) {
  const results = await wipeUserData(user, onProgress);
  let profileError = null;
  try {
    await resetUserProfile(user, me);
  } catch (e) {
    profileError = e?.message || String(e);
  }
  return { results, profileError };
}

// Data sweep, then remove the auth record itself. Whether the platform
// permits deleting a User row is not guaranteed — if it refuses, the data is
// still gone and the caller is told the account itself survived.
export async function deleteUserAccount(user, me, onProgress) {
  const results = await wipeUserData(user, onProgress);
  let accountDeleted = false;
  let accountError = null;
  try {
    await base44.entities.User.delete(user.id);
    accountDeleted = true;
  } catch (e) {
    accountError = e?.message || String(e);
  }
  return { results, accountDeleted, accountError };
}