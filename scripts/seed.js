/* eslint-disable no-console */
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const {
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} = process.env;

if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing env vars. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local"
  );
}

const WebSocket = require("ws");

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  // Node.js 20 needs a custom websocket transport (the `ws` package).
  realtime: { transport: WebSocket },
});

const WARDS = ["Ward 1", "Ward 2", "Ward 3", "Ward 4"];
const CATEGORIES = [
  "education",
  "roads",
  "health",
  "water",
  "sanitation",
  "other",
];

const seedPassword = "SeedPass123!";

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function withSeedPrefix(s) {
  return `SEED: ${s}`;
}

async function getOrCreateAuthUser({ email, fullName }) {
  // Supabase admin create-user API doesn't provide a direct get-by-email,
  // so we list users and match.
  const { data: existing, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) throw listError;

  const match = existing.users.find((u) => u.email === email);
  if (match) return match;

  const { data, error: createError } = await supabase.auth.admin.createUser({
    email,
    password: seedPassword,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });
  if (createError) throw createError;

  return data.user;
}

async function ensureProfile(userId) {
  // Our migration defines an after-insert trigger on auth.users that creates a profile row.
  // This loop waits briefly for that trigger to complete.
  for (let i = 0; i < 10; i++) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();
    if (profile) return profile;
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`Profile row not found for user ${userId}`);
}

async function main() {
  // 1) Users (so /my-submissions has something to show)
  const seedUsers = [
    { email: "citizen1@govtapp.local", fullName: "Seed Citizen One" },
    { email: "citizen2@govtapp.local", fullName: "Seed Citizen Two" },
    { email: "citizen3@govtapp.local", fullName: "Seed Citizen Three" },
  ];

  const users = [];
  for (const u of seedUsers) {
    const created = await getOrCreateAuthUser(u);
    users.push({ ...u, id: created.id });
    await ensureProfile(created.id);
  }

  // 2) Clear previously seeded submissions/datasets (safe re-run)
  await supabase
    .from("submissions")
    .delete()
    .like("title", "SEED: %");

  await supabase
    .from("datasets")
    .delete()
    .eq("source", "seed");

  // 3) Datasets for the "schools" compare demo
  const datasets = [
    {
      ward: "Ward 1",
      metric_name: "school_enrollment",
      metric_value: 12400,
      source: "seed",
    },
    {
      ward: "Ward 2",
      metric_name: "school_enrollment",
      metric_value: 9800,
      source: "seed",
    },
    {
      ward: "Ward 3",
      metric_name: "school_enrollment",
      metric_value: 11250,
      source: "seed",
    },
    {
      ward: "Ward 1",
      metric_name: "avg_travel_distance_km",
      metric_value: 2.6,
      source: "seed",
    },
    {
      ward: "Ward 2",
      metric_name: "avg_travel_distance_km",
      metric_value: 3.1,
      source: "seed",
    },
    {
      ward: "Ward 3",
      metric_name: "avg_travel_distance_km",
      metric_value: 2.2,
      source: "seed",
    },
  ];

  const { error: datasetError } = await supabase.from("datasets").insert(datasets);
  if (datasetError) throw datasetError;

  // 4) Fake submissions (Hindi + English mix included)
  const hindiEducation1 =
    "स्कूल की बिल्डिंग जर्जर है और बारिश में पानी टपकता है। बच्चों की पढ़ाई प्रभावित हो रही है।";
  const hindiEducation2 =
    "मिड-डे मील के लिए पर्याप्त स्टाफ नहीं है, लाइन में बच्चे परेशान होते हैं।";
  const hindiRoads1 =
    "मुख्य सड़क पर गड्ढे हैं, रात में अंधेरा रहता है और दुर्घटनाओं का खतरा बढ़ गया है।";

  const submissions = [
    // education
    {
      user_id: users[0].id,
      title: withSeedPrefix("School repair request (roof leak)"),
      description: `${hindiEducation1} (English request context: roof leak & classroom safety).`,
      language: "hi",
      category: "education",
      ai_summary: null,
      priority_score: 72,
      photo_url: null,
      latitude: 28.6139,
      longitude: 77.209,
      ward: "Ward 1",
      status: "new",
    },
    {
      user_id: users[1].id,
      title: withSeedPrefix("Additional staff for midday meals"),
      description: `${hindiEducation2} (English note: need support staff for smoother service).`,
      language: "hi",
      category: "education",
      ai_summary: null,
      priority_score: 60,
      photo_url: null,
      latitude: 28.612,
      longitude: 77.218,
      ward: "Ward 2",
      status: "new",
    },
    {
      user_id: users[2].id,
      title: withSeedPrefix("New classrooms for increasing enrollment"),
      description:
        "Enrollment has increased this year; current classrooms feel overcrowded. Request for additional classrooms and basic repairs.",
      language: "en",
      category: "education",
      ai_summary: null,
      priority_score: 78,
      photo_url: null,
      latitude: 28.624,
      longitude: 77.205,
      ward: "Ward 3",
      status: "new",
    },
    // roads
    {
      user_id: users[0].id,
      title: withSeedPrefix("Road potholes & poor street lighting"),
      description: `${hindiRoads1} (English: potholes and inadequate lighting).`,
      language: "hi",
      category: "roads",
      ai_summary: null,
      priority_score: 70,
      photo_url: null,
      latitude: 28.616,
      longitude: 77.214,
      ward: "Ward 2",
      status: "new",
    },
    {
      user_id: users[2].id,
      title: withSeedPrefix("Footpath restoration near bus stop"),
      description:
        "The footpath near the bus stop is broken and pedestrians get muddy during rains. Please restore it and add drainage where possible.",
      language: "en",
      category: "roads",
      ai_summary: null,
      priority_score: 55,
      photo_url: null,
      latitude: 28.620,
      longitude: 77.201,
      ward: "Ward 1",
      status: "new",
    },
    // health
    {
      user_id: users[1].id,
      title: withSeedPrefix("PHC equipment needs replacement"),
      description:
        "Basic equipment at the primary health centre is outdated. Request for replacement of key diagnostic tools and adequate supplies.",
      language: "en",
      category: "health",
      ai_summary: null,
      priority_score: 52,
      photo_url: null,
      latitude: 28.619,
      longitude: 77.212,
      ward: "Ward 3",
      status: "new",
    },
    // water
    {
      user_id: users[2].id,
      title: withSeedPrefix("Irregular water supply schedule"),
      description:
        "Water supply timings are inconsistent. Residents request a predictable schedule and maintenance of overhead tank and pipelines.",
      language: "en",
      category: "water",
      ai_summary: null,
      priority_score: 58,
      photo_url: null,
      latitude: 28.611,
      longitude: 77.206,
      ward: "Ward 2",
      status: "new",
    },
    // sanitation
    {
      user_id: users[0].id,
      title: withSeedPrefix("Solid waste collection gap"),
      description:
        "Garbage collection is delayed and waste piles up near the lane. Request regular collection and better coordination with local workers.",
      language: "en",
      category: "sanitation",
      ai_summary: null,
      priority_score: 49,
      photo_url: null,
      latitude: 28.6145,
      longitude: 77.2155,
      ward: "Ward 1",
      status: "new",
    },
    // other
    {
      user_id: users[1].id,
      title: withSeedPrefix("Community center maintenance"),
      description:
        "The community center needs maintenance: minor repairs, cleaning, and upkeep of seating and lights.",
      language: "en",
      category: "other",
      ai_summary: null,
      priority_score: 40,
      photo_url: null,
      latitude: 28.623,
      longitude: 77.219,
      ward: "Ward 4",
      status: "new",
    },
  ];

  // Add more submissions to reach ~30–40
  const more = 30;
  for (let i = 0; i < more; i++) {
    const u = pick(users);
    const c = pick(CATEGORIES);
    const w = pick(WARDS);
    submissions.push({
      user_id: u.id,
      title: withSeedPrefix(`General request #${i + 1} (${c}) in ${w}`),
      description: `Residents request improvement for ${c} in ${w}. Please review and plan necessary action.`,
      language: "en",
      category: c,
      ai_summary: null,
      priority_score: Math.floor(30 + Math.random() * 60),
      photo_url: null,
      latitude: 28.61 + Math.random() * 0.03,
      longitude: 77.19 + Math.random() * 0.05,
      ward: w,
      status: "new",
    });
  }

  const { error: subError } = await supabase.from("submissions").insert(submissions);
  if (subError) throw subError;

  console.log("Seed complete.");
  console.log("Seed user emails (password for all):", seedPassword);
  for (const u of seedUsers) console.log(`- ${u.email}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

