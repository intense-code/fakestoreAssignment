module.exports = (requiredRole) => {
  return (req, res, next) => {
    console.log("🔒 Role restriction middleware hit");
    console.log("🔒 Required role:", requiredRole);
    console.log("🔒 User role from token:", req.user?.role);
    console.log("🔒 Full user object:", req.user);
    
    if (!req.user) {
      console.log("❌ No user in request");
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const userRole = req.user.role;
    
    if (!userRole) {
      console.log("❌ No role found in user token");
      return res.status(403).json({ message: "No role assigned" });
    }
    
    // Check if user has the required role
    if (userRole !== requiredRole) {
      console.log(`❌ Access denied. Required: ${requiredRole}, User has: ${userRole}`);
      return res.status(403).json({ 
        message: `Access denied. Required role: ${requiredRole}`,
        userRole: userRole 
      });
    }
    
    console.log(`✅ Role check passed. User has required role: ${requiredRole}`);
    next();
  };
};