import * as settingService from '../services/setting.service.js';

export const getSetting = async (req, res, next) => {
  try {
    const setting = await settingService.getSetting();
    res.status(200).json({
      message: 'Settings fetched successfully',
      data: setting,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSetting = async (req, res, next) => {
  try {
    // req.body sudah divalidasi middleware
    const updatedSetting = await settingService.updateSetting(req.body);
    res.status(200).json({
      message: 'Settings updated successfully',
      data: updatedSetting,
    });
  } catch (error) {
    next(error);
  }
};