// api/users/users-model.js
const db = require("../../db/connection.js");
const { randomUUID } = require("node:crypto");
const jwt = require("jsonwebtoken");

module.exports = {
  add,
  find,
  findBy,
  findById,
  createSessiontoken,
  restricted,
  signToken,
  logoutNow,
  ping,
  usersOnline,
  cleanupSessions
  // Removed touchSession from exports - it belongs in middleware
};

async function usersOnline(res){
  try {
    console.log("🔍 Querying online users...");
    
    // First, let's see all sessions to debug
    const allSessions = await db("sessions")
      .leftJoin("users", "sessions.user_id", "users.id")
      .select(
        "sessions.*",
        "users.username"
      )
      .orderBy("sessions.last_seen_at", "desc");
    
    console.log("📋 All sessions in database:", allSessions.length);
    console.log("📋 Recent sessions sample:", allSessions.slice(0, 3));
    
    const currentTime = new Date();
    const thirtyMinutesAgo = new Date(currentTime.getTime() - 30 * 60 * 1000);
    
    console.log("⏰ Current time:", currentTime.toISOString());
    console.log("⏰ 30 minutes ago:", thirtyMinutesAgo.toISOString());
    
    // Filter for online users - matching the debug logic exactly
    const onlineUsers = [];
    const processedUserIds = new Set();
    
    for (const session of allSessions) {
      // Skip if we already processed this user (get most recent session per user)
      if (processedUserIds.has(session.user_id)) {
        continue;
      }
      
      const isNotRevoked = !session.revoked_at;
      const isNotExpired = new Date(session.expires_at) > currentTime;
      const isRecentActivity = new Date(session.last_seen_at) > thirtyMinutesAgo;
      
      console.log(`User ${session.username}: revoked=${!!session.revoked_at}, expired=${!isNotExpired}, recent=${isRecentActivity}`);
      console.log(`  last_seen: ${session.last_seen_at}, expires: ${session.expires_at}`);
      
      if (isNotRevoked && isNotExpired && isRecentActivity && session.username) {
        onlineUsers.push({
          user_id: session.user_id,
          username: session.username,
          last_seen_at: session.last_seen_at,
          created_at: session.created_at,
          session_id: session.id,
          minutesSinceLastSeen: Math.round((currentTime - new Date(session.last_seen_at)) / (1000 * 60))
        });
        processedUserIds.add(session.user_id);
      }
    }
    
    console.log("✅ Found online users (30 min window):", onlineUsers.length);
    console.log("📋 Online users list:", onlineUsers.map(u => `${u.username} (${u.minutesSinceLastSeen}min ago)`));
    
    // If no one is online in 30 minutes, show recent activity (last 2 hours) for debugging
    if (onlineUsers.length === 0) {
      console.log("🔍 No users online, checking last 2 hours for debugging...");
      
      const twoHoursAgo = new Date(currentTime.getTime() - 2 * 60 * 60 * 1000);
      const recentUsers = [];
      const recentProcessedUserIds = new Set();
      
      for (const session of allSessions) {
        if (recentProcessedUserIds.has(session.user_id)) {
          continue;
        }
        
        const isNotRevoked = !session.revoked_at;
        const isNotExpired = new Date(session.expires_at) > currentTime;
        const isRecentish = new Date(session.last_seen_at) > twoHoursAgo;
        
        if (isNotRevoked && isNotExpired && isRecentish && session.username) {
          recentUsers.push({
            user_id: session.user_id,
            username: session.username,
            last_seen_at: session.last_seen_at,
            minutesSinceLastSeen: Math.round((currentTime - new Date(session.last_seen_at)) / (1000 * 60)),
            status: "recent"
          });
          recentProcessedUserIds.add(session.user_id);
        }
      }
      
      console.log("📋 Recent users (2h window):", recentUsers.length);
      
      res.json({
        online_now: onlineUsers,
        recent_activity: recentUsers,
        message: `No users online in last 30 minutes. Showing ${recentUsers.length} users with recent activity.`,
        debug: {
          totalSessions: allSessions.length,
          currentTime: currentTime.toISOString(),
          thirtyMinutesAgo: thirtyMinutesAgo.toISOString(),
          twoHoursAgo: twoHoursAgo.toISOString()
        }
      });
    } else {
      res.json(onlineUsers);
    }
    
  } catch (error) {
    console.error("❌ Error getting online users:", error);
    res.status(500).json({ message: "Failed to get online users", error: error.message });
  }
}

// Remove touchSession function from here - it belongs in middleware/restricted.js

function find() {
  return db("users as u")
    .join("roles as r", "u.role", "=", "r.id")
    .select("u.id", "u.username", "r.name as role", "u.department");
}

function findBy(filter) {
  return db("users as u")
    .join("roles as r", "u.role", "=", "r.id")
    .select("u.id", "u.username", "r.name as role_name", "u.password", "u.department")
    .where(filter);
}

async function add(user) {
  const trx = await db.transaction();
  
  try {
    console.log("➕ Adding user to database:", user.username);
    
    const userToInsert = {
      username: user.username,
      password: user.password,
      department: user.department || 'General',
      role: parseInt(user.role) || 2
    };
    
    console.log("📝 User data to insert:", userToInsert);
    
    const roleExists = await trx("roles").where({ id: userToInsert.role }).first();
    console.log("🔍 Role exists check:", roleExists);
    
    if (!roleExists) {
      throw new Error(`Role with id ${userToInsert.role} does not exist`);
    }
    
    await trx("users").insert(userToInsert);
    console.log("✅ User inserted successfully");
    
    const basicUser = await trx("users")
      .select("id", "username", "department", "role")
      .where("username", userToInsert.username)
      .first();
    
    console.log("🔍 Basic user query result:", basicUser);
    
    if (!basicUser) {
      throw new Error("Failed to create user - user not found after insertion");
    }
    
    const newUser = await trx("users as u")
      .join("roles as r", "u.role", "=", "r.id")
      .select("u.id", "u.username", "u.department", "r.name as role_name", "u.role")
      .where("u.username", userToInsert.username)
      .first();
    
    console.log("🔍 Joined query result:", newUser);
    
    if (!newUser) {
      const userWithRoleName = {
        ...basicUser,
        role_name: basicUser.role === 1 ? 'admin' : 'user'
      };
      console.log("⚠️ Using fallback user data:", userWithRoleName);
      await trx.commit();
      return userWithRoleName;
    }
    
    await trx.commit();
    console.log("✅ User added successfully:", newUser.username);
    return newUser;
  } catch (error) {
    await trx.rollback();
    console.error("❌ Error adding user:", error);
    throw error;
  }
}

function findById(id) {
  return db("users as u")
    .join("roles as r", "u.role", "=", "r.id")
    .select("u.id", "u.username", "u.department", "r.name as role_name")
    .where("u.id", id)
    .first();
}

async function createSessiontoken(res, req, user) {
  const trx = await db.transaction();
  
  try {
    const jti = require('crypto').randomUUID();
    const expiresIn = '1d';
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    console.log("🔐 Creating session for user:", user.username, "with jti:", jti);
    console.log("🔍 Full user object received:", user);
    console.log("🔍 User ID for session:", user.id);

    const sessionData = {
      id: jti,
      user_id: user.id,
      user_agent: req.get('User-Agent') || null,
      ip: req.ip || req.connection.remoteAddress || null,
      expires_at: expiresAt,
      created_at: new Date(),
      last_seen_at: new Date()
    };

    console.log("💾 Session data to insert:", sessionData);

    // Insert session
    await trx("sessions").insert(sessionData);
    console.log("✅ Session inserted successfully");

    // Verify the session was created by querying it back
    const createdSession = await trx("sessions").where({ id: jti }).first();
    console.log("🔍 Verified session creation:", createdSession);

    await trx.commit();

    // Ensure the payload has all necessary user info
    const payload = {
      sub: user.id,
      username: user.username, 
      role: user.role_name || 'user',
      department: user.department,
      jti: jti
    };

    console.log("🎫 JWT payload being created:", payload);

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    
    console.log("✅ Session and token created successfully");
    console.log("🎫 Generated token (first 50 chars):", token.substring(0, 50) + "...");
    console.log("🎫 JTI in token:", jti);
    
    return res.status(200).json({
      message: `Welcome ${user.username}!`,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role_name || 'user',
        department: user.department
      }
    });
  } catch (error) {
    await trx.rollback();
    console.error("❌ Session creation error:", error);
    console.error("❌ Error details:", error.message);
    console.error("❌ Error stack:", error.stack);
    return res.status(500).json({ message: "session creation failed", error: error.message });
  }
}
async function logoutNow(jti, res) {
  const trx = await db.transaction();
  
  try {
    console.log("🚪 Logging out session:", jti);
    
    await trx("sessions")
      .where({ id: jti })
      .update({ 
        revoked_at: new Date()
      });

    await trx.commit();
    console.log("✅ Session revoked successfully");
    return res.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    await trx.rollback();
    console.error("❌ Logout error:", error);
    return res.status(500).json({ message: "logout failed" });
  }
}

async function cleanupSessions() {
  try {
    const result = await db("sessions")
      .where('expires_at', '<', db.fn.now())
      .orWhere(function() {
        this.whereNotNull('revoked_at')
            .andWhere('revoked_at', '<', db.raw("DATETIME('now', '-7 days')"));
      })
      .del();
    
    console.log(`Cleaned up ${result} expired/old sessions`);
  } catch (error) {
    console.error("Session cleanup error:", error);
  }
}

function signToken(user, jti, expiresInSec = 24 * 60 * 60) {
  const payload = { sub: user.id, username: user.username, role: user.role, jti };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiresInSec });
}

function restricted(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;
  if (!token) return res.status(401).json({ message: "token required" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "token invalid" });
    req.user = decoded;
    next();
  });
}

async function ping(jti) {
  try {
    if (jti) {
      await db("sessions")
        .where({ id: jti })
        .update({ last_seen_at: new Date() });
      
      await db("sessions").where("expires_at", "<=", new Date()).del();
    }
    return { jti, timestamp: new Date().toISOString() };
  } catch (error) {
    throw error;
  }
}