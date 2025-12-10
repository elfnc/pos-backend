import * as dashboardService from '../services/dashboard.service.js';

export const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    res.status(200).json({
      message: 'Dashboard stats fetched successfully',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};