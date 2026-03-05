export const adminRole = async(req, res, next) => {
    try {
        const userRole = req.user.role;
        
        if (userRole !== 'admin') {
            return res.status(403).json({ message: 'Admin Access Required' })
        }

        next();

    } catch (err) {
        res.status(401).json({ message: 'Not Authorized, Token Failed'})
    }
}