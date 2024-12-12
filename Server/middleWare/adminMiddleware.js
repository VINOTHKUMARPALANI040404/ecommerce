import jwt from 'jsonwebtoken';

export const adminMiddleWare = async (req, res, next) => {
    try {
        console.log(req.cookies);
        
        // Retrieve the token from cookies
        const token = req.cookies.token; 
        // const authHeader= req.headers['authorization']   
        // const token = authHeader.split(' ')[1]
        console.log(token);
        
        if (!token) {
            return res.status(403).json({ message: "No token provided" });
        }

        // Verify the token and decode it
        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired token" });
            }

            // Attach user data (including role) to request object
            req.user = decoded; 
            

            // Check if the user has 'user' or 'admin' role
            if (decoded.role === 'admin') {
                next();  // Proceed to the next middleware or route handler
            } else {
                return res.status(403).json({ message: "Unauthorized access", status: false });
            }
        });
        
    } catch (err) {
        console.error("Error in authMiddleware:", err);
        res.status(500).json({
            message: "Something went wrong",
            status: false,
            error: err.message
        });
    }
};
