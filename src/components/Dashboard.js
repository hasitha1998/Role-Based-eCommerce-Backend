import React, { useEffect, useState } from 'react';
import { Box, H2, H5, Button, Input, MessageBox } from '@adminjs/design-system';

const Settings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [editMode, setEditMode] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings');
      const data = await response.json();
      setSettings(data.settings || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', content: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (settingId) => {
    setEditMode({ ...editMode, [settingId]: true });
  };

  const handleCancel = (settingId) => {
    setEditMode({ ...editMode, [settingId]: false });
    fetchSettings();
  };

  const handleChange = (settingId, newValue) => {
    setSettings(settings.map(setting => 
      setting.id === settingId ? { ...setting, value: newValue } : setting
    ));
  };

  const handleSave = async (settingId) => {
    try {
      setSaving(true);
      const setting = settings.find(s => s.id === settingId);
      
      const response = await fetch(`/api/settings/${setting.key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: setting.value })
      });

      if (response.ok) {
        setMessage({ type: 'success', content: 'Setting saved successfully!' });
        setEditMode({ ...editMode, [settingId]: false });
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving setting:', error);
      setMessage({ type: 'error', content: 'Failed to save setting' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleAddNew = async () => {
    const key = prompt('Enter setting key (e.g., site_name):');
    if (!key) return;

    const value = prompt('Enter setting value:');
    const description = prompt('Enter description (optional):');

    try {
      setSaving(true);
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key,
          value,
          description,
          type: 'string',
          isPublic: false
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', content: 'Setting created successfully!' });
        fetchSettings();
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error('Failed to create');
      }
    } catch (error) {
      console.error('Error creating setting:', error);
      setMessage({ type: 'error', content: 'Failed to create setting' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box padding="xxl">
        <H2>Settings</H2>
        <Box marginTop="lg">Loading settings...</Box>
      </Box>
    );
  }

  return (
    <Box padding="xxl">
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="xl">
        <div>
          <H2>System Settings</H2>
          <Box marginTop="sm" color="grey60">
            Configure your application settings
          </Box>
        </div>
        <Button variant="primary" onClick={handleAddNew} disabled={saving}>
          + Add New Setting
        </Button>
      </Box>

      {message && (
        <MessageBox
          variant={message.type}
          message={message.content}
          onClose={() => setMessage(null)}
          style={{ marginBottom: '20px' }}
        />
      )}

      <Box bg="white" borderRadius="default" boxShadow="card">
        {settings.length === 0 ? (
          <Box padding="xl" textAlign="center" color="grey60">
            No settings found. Click "Add New Setting" to create one.
          </Box>
        ) : (
          <Box>
            {settings.map((setting) => (
              <Box
                key={setting.id}
                padding="lg"
                borderBottom="default"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box flex="1">
                  <Box display="flex" alignItems="center" gap="sm" marginBottom="sm">
                    <H5 marginBottom="0">{setting.key}</H5>
                    {setting.isPublic && (
                      <Box
                        as="span"
                        fontSize="sm"
                        bg="primary"
                        color="white"
                        padding="xs"
                        borderRadius="default"
                      >
                        Public
                      </Box>
                    )}
                    <Box
                      as="span"
                      fontSize="sm"
                      bg="grey20"
                      color="grey80"
                      padding="xs"
                      borderRadius="default"
                    >
                      {setting.type}
                    </Box>
                  </Box>
                  
                  {setting.description && (
                    <Box fontSize="sm" color="grey60" marginBottom="sm">
                      {setting.description}
                    </Box>
                  )}

                  {editMode[setting.id] ? (
                    <Box marginTop="sm">
                      <Input
                        value={setting.value || ''}
                        onChange={(e) => handleChange(setting.id, e.target.value)}
                        placeholder="Enter value"
                        width="100%"
                      />
                    </Box>
                  ) : (
                    <Box
                      fontSize="default"
                      fontWeight="bold"
                      color="grey100"
                      marginTop="sm"
                    >
                      {setting.value || <em style={{ color: '#999' }}>Not set</em>}
                    </Box>
                  )}
                </Box>

                <Box display="flex" gap="sm" marginLeft="lg">
                  {editMode[setting.id] ? (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSave(setting.id)}
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        variant="text"
                        size="sm"
                        onClick={() => handleCancel(setting.id)}
                        disabled={saving}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleEdit(setting.id)}
                    >
                      Edit
                    </Button>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Box marginTop="xl" padding="lg" bg="grey20" borderRadius="default">
        <H5>Common Settings</H5>
        <Box marginTop="sm" fontSize="sm" color="grey80">
          <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>
            <li><strong>site_name</strong> - Your website name</li>
            <li><strong>site_logo</strong> - URL to your logo image</li>
            <li><strong>contact_email</strong> - Support contact email</li>
            <li><strong>maintenance_mode</strong> - Enable/disable maintenance (true/false)</li>
            <li><strong>currency</strong> - Default currency (USD, EUR, etc.)</li>
            <li><strong>items_per_page</strong> - Default pagination limit</li>
            <li><strong>enable_registration</strong> - Allow new user registration (true/false)</li>
          </ul>
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;