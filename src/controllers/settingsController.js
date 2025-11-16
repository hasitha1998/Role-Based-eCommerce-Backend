import models from '../models/index.js';

export const getAllSettings = async (req, res) => {
  try {
    const settings = await models.Setting.findAll({
      order: [['key', 'ASC']]
    });

    res.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPublicSettings = async (req, res) => {
  try {
    const settings = await models.Setting.findAll({
      where: { isPublic: true },
      attributes: ['key', 'value']
    });

    // Convert to key-value object
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });

    res.json({ settings: settingsObj });
  } catch (error) {
    console.error('Error fetching public settings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await models.Setting.findOne({ where: { key } });

    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }

    res.json({ setting });
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createSetting = async (req, res) => {
  try {
    const { key, value, description, type, isPublic } = req.body;

    if (!key) {
      return res.status(400).json({ message: 'Key is required' });
    }

    // Check if setting already exists
    const existingSetting = await models.Setting.findOne({ where: { key } });
    if (existingSetting) {
      return res.status(409).json({ message: 'Setting already exists' });
    }

    const setting = await models.Setting.create({
      key,
      value: value || '',
      description,
      type: type || 'string',
      isPublic: isPublic || false
    });

    res.status(201).json({
      message: 'Setting created successfully',
      setting
    });
  } catch (error) {
    console.error('Error creating setting:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value, description, isPublic } = req.body;

    const setting = await models.Setting.findOne({ where: { key } });

    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }

    if (value !== undefined) setting.value = value;
    if (description !== undefined) setting.description = description;
    if (isPublic !== undefined) setting.isPublic = isPublic;

    await setting.save();

    res.json({
      message: 'Setting updated successfully',
      setting
    });
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteSetting = async (req, res) => {
  try {
    const { key } = req.params;

    const setting = await models.Setting.findOne({ where: { key } });

    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }

    await setting.destroy();

    res.json({ message: 'Setting deleted successfully' });
  } catch (error) {
    console.error('Error deleting setting:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};