

export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        const error = new Error('Forbidden: Authentication data missing');
        error.status = 403;
        throw error;
      }

      const { role } = req.user;
      if (!allowedRoles.includes(role)) {
        const error = new Error('Forbidden: You do not have permission to access this resource');
        error.status = 403;
        throw error;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};