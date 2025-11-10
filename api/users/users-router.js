const router = require("express").Router();
const Users = require("./users-model.js");

// Use the correct middleware path
const { restricted, touchSession } = require("../middleware/restricted.js");
const restrictRole = require('../auth/rolerestricted-middleware.js')

// Protected route - needs auth
router.get("/me", restricted, touchSession, async (req, res) => {
  try {
    console.log("👤 /me route hit");
    console.log("👤 Full decoded token:", req.user);
    console.log("👤 Request headers:", req.headers.authorization);
    
    // Try username first, then fall back to sub (user ID)
    const username = req.user?.username;
    const userId = req.user?.sub;
    
    console.log("👤 Username from token:", username);
    console.log("👤 User ID from token:", userId);
    
    if (!username && !userId) {
      console.log("❌ No user identifier found in token");
      return res.status(400).json({ 
        message: "No user identifier found in token",
        token_payload: req.user 
      });
    }
    
    let user;
    
    if (username) {
      console.log("🔍 Finding user by username:", username);
      const users = await Users.findBy({ username });
      user = Array.isArray(users) ? users[0] : users;
      console.log("👤 User found by username:", user ? "Yes" : "No");
    } else if (userId) {
      console.log("🔍 Finding user by ID:", userId);
      user = await Users.findById(userId);
      console.log("👤 User found by ID:", user ? "Yes" : "No");
    }
    
    if (!user) {
      console.log("❌ User not found in database");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User found:", user.username);
    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("❌ Error in /me route:", error);
    res.status(500).json({ message: "Failed to fetch user data", error: error.message });
  }
});

// Public route - no auth needed
router.get("/online", async (req, res) => {
  try {
    console.log("📡 Getting online users...");
    Users.usersOnline(res);
  } catch (e) {
    console.error("❌ Online users error:", e);
    res.status(500).json({ message: "failed to load online users" });
  }
});
// Add this route - NO AUTH REQUIRED for debugging
router.get("/debug/sessions-simple", async (req, res) => {
  try {
    console.log("🔍 Simple session check - no auth required");
    
    // Get all sessions with user info
    const sessions = await db("sessions")
      .leftJoin("users", "sessions.user_id", "users.id")
      .select(
        "sessions.id as session_id",
        "sessions.user_id",
        "sessions.created_at",
        "sessions.last_seen_at",
        "sessions.expires_at",
        "sessions.revoked_at",
        "users.username"
      )
      .orderBy("sessions.created_at", "desc")
      .limit(10);
    
    console.log("📋 Found sessions:", sessions.length);
    
    const currentTime = new Date();
    const thirtyMinutesAgo = new Date(currentTime.getTime() - 30 * 60 * 1000);
    
    const processedSessions = sessions.map(session => {
      const isActive = !session.revoked_at && new Date(session.expires_at) > currentTime;
      const isOnline = isActive && new Date(session.last_seen_at) > thirtyMinutesAgo;
      
      return {
        ...session,
        isActive,
        isOnline,
        minutesSinceLastSeen: Math.round((currentTime - new Date(session.last_seen_at)) / (1000 * 60))
      };
    });
    
    const activeSessions = processedSessions.filter(s => s.isActive);
    const onlineSessions = processedSessions.filter(s => s.isOnline);
    
    res.json({
      currentTime: currentTime.toISOString(),
      totalSessions: sessions.length,
      activeSessions: activeSessions.length,
      onlineSessions: onlineSessions.length,
      sessions: processedSessions
    });
  } catch (error) {
    console.error("❌ Simple sessions debug error:", error);
    res.status(500).json({ error: error.message });
  }
});
// Admin only route - with better debugging
router.get("/", restricted, touchSession, (req, res, next) => {
  console.log("🔐 Admin route hit - checking role");
  console.log("👤 User role from token:", req.user?.role);
  console.log("👤 Full user from token:", req.user);
  next();
}, restrictRole('admin'), (req, res) => {
  console.log("✅ Admin access granted");
  Users.find()
    .then(users => {
      console.log(`📋 Returning ${users.length} users`);
      res.json(users);
    })
    .catch(err => {
      console.error("❌ Error fetching users:", err);
      res.status(500).json({ message: "Failed to fetch users" });
    });
});

// User route
router.get('/limited', restricted, touchSession, restrictRole('user'), (req, res) => {
    const username = req?.user?.username;
    const userId = req?.user?.sub;
    
    if (username) {
      Users.findBy({username})
        .then((users) => {
          res.json(users)
        })
        .catch(er => res.send(er));
    } else if (userId) {
      Users.findById(userId)
        .then((user) => {
          res.json(user)
        })
        .catch(er => res.send(er));
    } else {
      res.status(400).json({ message: "No user identifier in token" });
    }
});

module.exports = router;