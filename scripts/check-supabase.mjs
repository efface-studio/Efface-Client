import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = readFileSync(".env.local", "utf-8")
  .split("\n")
  .filter((l) => l && !l.startsWith("#"))
  .reduce((acc, line) => {
    const eq = line.indexOf("=");
    if (eq > 0) acc[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    return acc;
  }, {});

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { count, error } = await supabase.from("demo_jobs").select("*", { count: "exact", head: true });
if (error) {
  console.error("FAIL:", error.message);
  process.exit(1);
}
console.log(`OK — demo_jobs reachable, rows=${count}`);

const { data: bucket, error: bErr } = await supabase.storage.getBucket("demos");
if (bErr) {
  console.error("FAIL bucket:", bErr.message);
  process.exit(1);
}
console.log(`OK — demos bucket: public=${bucket.public}`);
