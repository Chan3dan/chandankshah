// .mongoshrc.js
// Place this in your home directory (~/.mongoshrc.js)
// It loads helpful shortcuts when you run mongosh

// Auto-select the CKS database
db = db.getSiblingDB("cks_website");

// Pretty print helper
globalThis.pp = (obj) => printjson(obj);

// Quick stats
globalThis.stats = () => {
  const cols = ["services", "projects", "testimonials", "blogposts", "messages", "sitesettings"];
  print("\n📊 CKS Database Stats");
  print("─".repeat(35));
  cols.forEach((c) => {
    try {
      print(`  ${c.padEnd(20)} ${db.getCollection(c).countDocuments()}`);
    } catch {
      print(`  ${c.padEnd(20)} (empty)`);
    }
  });
  print("");
};

// Quick service list
globalThis.services = () => {
  db.services.find({}, { title: 1, slug: 1, price: 1, isActive: 1 }).forEach(printjson);
};

// Quick messages check
globalThis.inbox = () => {
  print("\n📬 Recent Messages:");
  db.messages
    .find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .forEach((m) => {
      print(`  [${m.status}] ${m.name} — ${m.service || m.message?.slice(0, 40)}`);
    });
  print("");
};

print(`\n🗄️  mongosh connected to: cks_website`);
print(`Type stats() for collection counts, inbox() for recent messages\n`);
