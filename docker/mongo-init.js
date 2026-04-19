// docker/mongo-init.js
// Runs once when the container is first created
// Creates the application database user and initial indexes

db = db.getSiblingDB("cks_website");

// Create app-level user (less privileged than root)
db.createUser({
  user: "cks_user",
  pwd: "cks_userpass",
  roles: [
    { role: "readWrite", db: "cks_website" },
    { role: "dbAdmin", db: "cks_website" },
  ],
});

// Create collections with validation
db.createCollection("services");
db.createCollection("projects");
db.createCollection("testimonials");
db.createCollection("blogposts");
db.createCollection("messages");
db.createCollection("sitesettings");

// Indexes for performance
db.services.createIndex({ slug: 1 }, { unique: true });
db.services.createIndex({ isActive: 1, sortOrder: 1 });

db.projects.createIndex({ slug: 1 }, { unique: true });
db.projects.createIndex({ isActive: 1, featured: -1, sortOrder: 1 });

db.testimonials.createIndex({ isActive: 1, isFeatured: -1 });

db.blogposts.createIndex({ slug: 1 }, { unique: true });
db.blogposts.createIndex({ isPublished: 1, publishedAt: -1 });

db.messages.createIndex({ status: 1, createdAt: -1 });

db.sitesettings.createIndex({ key: 1 }, { unique: true });

print("✅ cks_website database initialized with collections and indexes");
