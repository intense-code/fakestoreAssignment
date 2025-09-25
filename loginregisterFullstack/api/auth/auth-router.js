const bcryptjs = require("bcryptjs");
const router = require("express").Router();
const {isValid} = require("../users/users-service.js");
const Users = require("../users/users-model.js");
const { restricted, touchSession } = require("../middleware/restricted.js");

// Add database connection for debug route
const knex = require("knex");
const knexConfig = require("../../knexfile");
const db = knex(knexConfig.development);

// Simple test route - no auth needed
router.get("/test", (req, res) => {
  res.json({ message: "Auth router is working!", timestamp: new Date().toISOString() });
});
// Add this route after your other debug routes
router.get("/debug/sessions", async (req, res) => {
  try {
    console.log("🔍 Checking all sessions in database...");
    
    const allSessions = await db("sessions")
      .leftJoin("users", "sessions.user_id", "users.id")
      .select(
        "sessions.*",
        "users.username"
      )
      .orderBy("sessions.created_at", "desc");
    
    console.log("📋 Total sessions found:", allSessions.length);
    
    const activeSessions = allSessions.filter(s => !s.revoked_at && new Date(s.expires_at) > new Date());
    console.log("📋 Active sessions:", activeSessions.length);
    
    const onlineSessions = activeSessions.filter(s => {
      const lastSeen = new Date(s.last_seen_at);
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      return lastSeen > thirtyMinutesAgo;
    });
    
    console.log("📋 Online sessions (30 min):", onlineSessions.length);
    
    res.json({
      totalSessions: allSessions.length,
      activeSessions: activeSessions.length,
      onlineSessions: onlineSessions.length,
      sessions: allSessions.map(session => ({
        id: session.id,
        username: session.username,
        user_id: session.user_id,
        created_at: session.created_at,
        last_seen_at: session.last_seen_at,
        expires_at: session.expires_at,
        revoked_at: session.revoked_at,
        isActive: !session.revoked_at && new Date(session.expires_at) > new Date(),
        isOnline: !session.revoked_at && 
                  new Date(session.expires_at) > new Date() && 
                  new Date(session.last_seen_at) > new Date(Date.now() - 30 * 60 * 1000),
        minutesSinceLastSeen: Math.round((new Date() - new Date(session.last_seen_at)) / (1000 * 60))
      }))
    });
  } catch (error) {
    console.error("❌ Debug sessions error:", error);
    res.status(500).json({ error: error.message });
  }
});
// Debug session route - needs auth
router.get("/debug/session", restricted, async (req, res) => {
  try {
    const jti = req.user?.jti;
    console.log("🔍 Debug session for jti:", jti);
    
    const session = await db("sessions")
      .where({ id: jti })
      .first();
    
    console.log("📋 Full session data:", session);
    
    res.json({
      jti: jti,
      session: session,
      current_time: new Date().toISOString(),
      time_diff_minutes: session ? Math.round((new Date() - new Date(session.last_seen_at)) / (1000 * 60)) : null
    });
  } catch (error) {
    console.error("❌ Debug session error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Debug tables route - no auth needed
router.get("/debug/tables", async (req, res) => {
  try {
    console.log("🔍 Checking database tables...");
    
    // Check if roles table exists and has data
    const roles = await db("roles").select("*");
    console.log("🔍 Roles in database:", roles);
    
    // Check if users table is accessible
    const userCount = await db("users").count("* as count").first();
    console.log("🔍 User count:", userCount);
    
    res.json({
      roles: roles,
      userCount: userCount,
      message: "Database connection working"
    });
  } catch (error) {
    console.error("❌ Database debug error:", error);
    res.status(500).json({
      error: error.message,
      message: "Database connection failed"
    });
  }
});

// Registration route
router.post("/register", async (req, res) => {
  try {
    const credentials = req.body;
    console.log("📝 Registration attempt for:", credentials.username);
    
    if (!credentials.username || !credentials.password) {
      return res.status(400).json({ message: "username and password required" });
    }

    if (!credentials.department) {
      return res.status(400).json({ message: "department required" });
    }

    const existingUsers = await Users.findBy({ username: credentials.username });
    const existingUser = Array.isArray(existingUsers) ? existingUsers[0] : existingUsers;
    
    if (existingUser) {
      console.log("❌ Username already exists:", credentials.username);
      return res.status(409).json({ message: "Username already taken" });
    }

    const rounds = Number(process.env.BCRYPT_ROUNDS) || 8;
    credentials.password = bcryptjs.hashSync(credentials.password, rounds);

    console.log("✅ Creating new user:", credentials.username);
    const user = await Users.add(credentials);
    
    if (!user) {
      return res.status(500).json({ message: "User creation failed - no user returned" });
    }
    
    const { password, ...userWithoutPassword } = user;
    return res.status(201).json({ 
      message: "User created successfully",
      data: userWithoutPassword 
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    const msg = String(error?.message || "");
    
    if (msg.includes("UNIQUE constraint failed")) {
      return res.status(409).json({ message: "Username already taken" });
    }
    
    return res.status(500).json({ 
      message: "Registration failed", 
      error: process.env.NODE_ENV === 'development' ? msg : undefined
    });
  }
});

// Login route
// Login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    console.log("🔐 Login attempt for:", username);
    console.log("🔍 Request body:", req.body);
    
    if (!isValid(req.body)) {
      return res.status(400).json({ message: "username and password required" });
    }

    console.log("🔍 Looking for user with username:", username);
    const found = await Users.findBy({ username });
    console.log("🔍 Database query result:", found);
    
    const user = Array.isArray(found) ? found[0] : found;
    console.log("🔍 User object after array check:", user ? "Found" : "Not found");
    
    if (user) {
      console.log("✅ User found in database:", user.username);
      console.log("🔍 User has password:", user.password ? "Yes" : "No");
      console.log("🔍 Password from request:", password ? "Present" : "Missing");
      
      // Test password comparison
      const passwordMatch = bcryptjs.compareSync(password, user.password);
      console.log("🔑 Password comparison result:", passwordMatch);
      
      if (passwordMatch) {
        console.log("✅ Login successful for:", username);
        return Users.createSessiontoken(res, req, user);
      } else {
        console.log("❌ Password mismatch for:", username);
        return res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      console.log("❌ User not found in database:", username);
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("❌ Login error:", error);
    console.error("❌ Error stack:", error.stack);
    return res.status(500).json({ message: "login failed" });
  }
});
// Add this debug route to check user data
// Add this debug route to check user data and online status
// Update the debug user route to fix session querying
router.get("/debug/user/:username", async (req, res) => {
  try {
    const { username } = req.params;
    console.log("🔍 Debug lookup for username:", username);
    
    const found = await Users.findBy({ username });
    console.log("🔍 Raw database result:", found);
    
    const user = Array.isArray(found) ? found[0] : found;
    
    if (user) {
      console.log("🔍 User found with ID:", user.id);
      
      // Query sessions directly using the database connection
      console.log("🔍 Querying sessions for user_id:", user.id);
      
      const allUserSessions = await db("sessions")
        .where({ user_id: user.id })
        .orderBy("created_at", "desc");
      
      console.log("📋 All sessions for user:", allUserSessions.length);
      console.log("📋 Session details:", allUserSessions);
      
      // Check for active sessions (not revoked and not expired)
      const currentTime = new Date();
      const activeSessions = allUserSessions.filter(session => {
        const isNotRevoked = !session.revoked_at;
        const isNotExpired = new Date(session.expires_at) > currentTime;
        console.log(`Session ${session.id}: revoked=${!!session.revoked_at}, expired=${new Date(session.expires_at) <= currentTime}`);
        return isNotRevoked && isNotExpired;
      });
      
      console.log("📋 Active sessions found:", activeSessions.length);
      
      // Check if user is considered "online" (active in last 30 minutes)
      const thirtyMinutesAgo = new Date(currentTime.getTime() - 30 * 60 * 1000);
      const onlineSessions = activeSessions.filter(session => {
        const lastSeen = new Date(session.last_seen_at);
        const isRecent = lastSeen > thirtyMinutesAgo;
        console.log(`Session ${session.id}: last_seen=${session.last_seen_at}, isRecent=${isRecent}`);
        return isRecent;
      });
      
      console.log("📋 Online sessions (last 30 min):", onlineSessions.length);
      
      // Get the most recent session info
      const mostRecentSession = activeSessions[0];
      let onlineStatus = "offline";
      let lastActivity = null;
      
      if (onlineSessions.length > 0) {
        onlineStatus = "online";
        lastActivity = mostRecentSession.last_seen_at;
      } else if (activeSessions.length > 0) {
        onlineStatus = "away";
        lastActivity = mostRecentSession.last_seen_at;
      }
      
      // Don't send the actual password, just indicate if it exists
      const { password, ...safeUser } = user;
      
      res.json({
        user: safeUser,
        hasPassword: password ? true : false,
        passwordLength: password ? password.length : 0,
        onlineStatus: onlineStatus,
        isOnline: onlineStatus === "online",
        totalSessions: allUserSessions.length,
        activeSessions: activeSessions.length,
        onlineSessionsCount: onlineSessions.length,
        lastActivity: lastActivity,
        currentTime: currentTime.toISOString(),
        thirtyMinutesAgo: thirtyMinutesAgo.toISOString(),
        sessions: activeSessions.map(session => ({
          id: session.id,
          created_at: session.created_at,
          last_seen_at: session.last_seen_at,
          expires_at: session.expires_at,
          revoked_at: session.revoked_at,
          user_agent: session.user_agent,
          minutesSinceLastSeen: Math.round((currentTime - new Date(session.last_seen_at)) / (1000 * 60)),
          isExpired: new Date(session.expires_at) <= currentTime,
          isRevoked: !!session.revoked_at,
          isOnline: new Date(session.last_seen_at) > thirtyMinutesAgo
        }))
      });
    } else {
      res.json({ 
        message: "User not found", 
        username,
        isOnline: false,
        onlineStatus: "not_found"
      });
    }
  } catch (error) {
    console.error("❌ Debug user error:", error);
    console.error("❌ Error stack:", error.stack);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});
// Add this route to test immediate session lookup after login
router.get("/debug/my-session", restricted, async (req, res) => {
  try {
    const jti = req.user?.jti;
    const userId = req.user?.sub;
    
    console.log("🔍 Debug my session - JTI:", jti);
    console.log("🔍 Debug my session - User ID:", userId);
    
    if (!jti) {
      return res.status(400).json({ message: "No JTI in token" });
    }
    
    // Find the specific session by JTI
    const mySession = await db("sessions")
      .where({ id: jti })
      .first();
    
    console.log("📋 My session data:", mySession);
    
    // Also find all sessions for this user
    const allMySessions = await db("sessions")
      .where({ user_id: userId })
      .orderBy("created_at", "desc");
    
    console.log("📋 All my sessions:", allMySessions.length);
    
    const currentTime = new Date();
    const thirtyMinutesAgo = new Date(currentTime.getTime() - 30 * 60 * 1000);
    
    res.json({
      tokenJTI: jti,
      tokenUserId: userId,
      currentSession: mySession,
      allSessions: allMySessions.map(session => ({
        id: session.id,
        created_at: session.created_at,
        last_seen_at: session.last_seen_at,
        expires_at: session.expires_at,
        revoked_at: session.revoked_at,
        isActive: !session.revoked_at && new Date(session.expires_at) > currentTime,
        isOnline: !session.revoked_at && 
                  new Date(session.expires_at) > currentTime && 
                  new Date(session.last_seen_at) > thirtyMinutesAgo,
        minutesSinceLastSeen: Math.round((currentTime - new Date(session.last_seen_at)) / (1000 * 60))
      })),
      currentTime: currentTime.toISOString()
    });
  } catch (error) {
    console.error("❌ Debug my session error:", error);
    res.status(500).json({ error: error.message });
  }
});
// Logout route
router.post("/logout", restricted, async (req, res) => {
  try {
    const jti = req.user?.jti;
    if (!jti) {
      return res.status(400).json({ message: "no session id" });
    }
    
    console.log("🚪 Logout request for session:", jti);
    return Users.logoutNow(jti, res);
  } catch (err) {
    console.error("❌ Logout error:", err);
    return res.status(500).json({ message: "logout failed" });
  }
});

// Protected route - needs auth
router.get("/me", restricted, touchSession, async (req, res) => {
  try {
    console.log("👤 /me route hit");
    
    const username = req.user?.username;
    const userId = req.user?.sub;
    
    if (!username && !userId) {
      return res.status(400).json({ 
        message: "No user identifier found in token",
        token_payload: req.user 
      });
    }
    
    let user;
    
    if (username) {
      const users = await Users.findBy({ username });
      user = Array.isArray(users) ? users[0] : users;
    } else if (userId) {
      user = await Users.findById(userId);
    }
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("❌ Error in /me route:", error);
    res.status(500).json({ message: "Failed to fetch user data", error: error.message });
  }
});

module.exports = router;