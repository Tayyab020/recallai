import { useEffect, useState } from 'react';
import { validateReminderDescription, validateReminderTitle } from '../utils/validation';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Add from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import MenuItem from '@mui/material/MenuItem';
import Notifications from '@mui/icons-material/Notifications';
import Paper from '@mui/material/Paper';
import Psychology from '@mui/icons-material/Psychology';
import Schedule from '@mui/icons-material/Schedule';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import api from '../services/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useFormValidation } from '../hooks/useFormValidation';

// Material UI Components






























// Material UI Icons
import VolumeUp from '@mui/icons-material/VolumeUp';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import AccessTime from '@mui/icons-material/AccessTime';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Settings from '@mui/icons-material/Settings';
import Pause from '@mui/icons-material/Pause';
import PlayArrow from '@mui/icons-material/PlayArrow';














dayjs.extend(relativeTime);

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [quickEditMode, setQuickEditMode] = useState(null);
  const [testingSound, setTestingSound] = useState(false);

  const initialValues = {
    title: '',
    description: '',
    type: 'manual',
    priority: 'medium',
    category: 'general',
    triggerTime: dayjs().add(1, 'hour'),
    pattern: {
      frequency: 'once',
      time: '09:00'
    },
    isActive: true,
    soundEnabled: true,
    customSound: 'remind.mp3'
  };

  const validators = {
    title: validateReminderTitle,
    description: validateReminderDescription,
  };

  const { values: formData, errors, touched, handleChange, handleBlur, validateAll, setFieldValue } = useFormValidation(
    initialValues,
    validators
  );

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/reminders');
      console.log(`📊 Fetched ${response.data.reminders.length} reminders from API`);
      setReminders(response.data.reminders);
    } catch (err) {
      console.error('Fetch reminders error:', err);
      setError('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleOpenDialog = (reminder = null) => {
    if (reminder) {
      setEditingReminder(reminder);
      setFieldValue('title', reminder.title);
      setFieldValue('description', reminder.description || '');
      setFieldValue('type', reminder.type);
      setFieldValue('priority', reminder.priority);
      setFieldValue('category', reminder.category || 'general');
      setFieldValue('triggerTime', dayjs(reminder.triggerTime));
      setFieldValue('pattern', reminder.pattern || { frequency: 'once', time: '09:00' });
      setFieldValue('isActive', reminder.isActive);
      setFieldValue('soundEnabled', reminder.soundEnabled !== false);
      setFieldValue('customSound', reminder.customSound || 'remind.mp3');
    } else {
      setEditingReminder(null);
      setFieldValue('title', '');
      setFieldValue('description', '');
      setFieldValue('type', 'manual');
      setFieldValue('priority', 'medium');
      setFieldValue('category', 'general');
      setFieldValue('triggerTime', dayjs().add(1, 'hour'));
      setFieldValue('pattern', { frequency: 'once', time: '09:00' });
      setFieldValue('isActive', true);
      setFieldValue('soundEnabled', true);
      setFieldValue('customSound', 'remind.mp3');
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingReminder(null);
  };

  const handleDateTimeChange = (newValue) => {
    setFieldValue('triggerTime', newValue);
  };

  const handleQuickEdit = async (reminderId, field, value) => {
    try {
      await api.put(`/api/reminders/${reminderId}`, { [field]: value });
      await fetchReminders();
      setQuickEditMode(null);
    } catch (err) {
      console.error('Quick edit error:', err);
      setError('Failed to update reminder');
    }
  };

  const handleTestSound = async () => {
    setTestingSound(true);
    try {
      // Play the custom sound
      const audio = new Audio('/remind.mp3');
      audio.play();
      setTimeout(() => setTestingSound(false), 2000);
    } catch (err) {
      console.error('Sound test error:', err);
      setTestingSound(false);
    }
  };

  const handleExpandCard = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const handleSubmit = async () => {
    if (!validateAll()) {
      setError('Please fix the validation errors before submitting');
      return;
    }

    try {
      setError('');

      const reminderData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        priority: formData.priority,
        category: formData.category,
        triggerTime: formData.triggerTime,
        pattern: formData.pattern,
        isActive: formData.isActive,
        soundEnabled: formData.soundEnabled,
        customSound: formData.customSound,
      };

      if (editingReminder) {
        await api.put(`/api/reminders/${editingReminder._id}`, reminderData);
      } else {
        await api.post('/api/reminders', reminderData);
      }

      await fetchReminders();
      handleCloseDialog();
    } catch (err) {
      console.error('Save reminder error:', err);
      setError(err.response?.data?.message || 'Failed to save reminder');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/reminders/${id}`);
      await fetchReminders();
    } catch (err) {
      console.error('Delete reminder error:', err);
      setError('Failed to delete reminder');
    }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      await api.put(`/api/reminders/${id}`, { isActive: !isActive });
      await fetchReminders();
    } catch (err) {
      console.error('Toggle reminder error:', err);
      setError('Failed to update reminder');
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'success',
      medium: 'warning',
      high: 'error'
    };
    return colors[priority] || 'default';
  };

  const getTypeIcon = (type) => {
    const icons = {
      manual: <Schedule />,
      pattern: <Notifications />,
      'ai-suggested': <Psychology />
    };
    return icons[type] || <Schedule />;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Reminders
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Reminder
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {reminders.length === 0 ? (
        <Card>
          <CardContent>
            <Box textAlign="center" py={4}>
              <Notifications sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No reminders yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create reminders to help you stay on track with your daily routines and goals.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
              >
                Create First Reminder
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Reminder Statistics */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="primary.main">
                    {reminders.filter(r => r.isActive).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {reminders.filter(r => dayjs(r.triggerTime).isAfter(dayjs())).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upcoming
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main">
                    {reminders.filter(r => dayjs(r.triggerTime).isBefore(dayjs()) && r.isActive).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Overdue
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="text.secondary">
                    {reminders.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <Grid container spacing={3}>
            {reminders.map((reminder) => {
              const isOverdue = dayjs(reminder.triggerTime).isBefore(dayjs());
              const isPast = dayjs(reminder.triggerTime).isBefore(dayjs());

              return (
                <Grid item xs={12} md={6} lg={4} key={reminder._id}>
                  <Card
                    elevation={reminder.isActive ? 3 : 1}
                    sx={{
                      border: '2px solid',
                      borderColor: isOverdue && reminder.isActive
                        ? 'error.main'
                        : reminder.isActive
                          ? 'primary.main'
                          : 'divider',
                      transition: 'all 0.3s ease',
                      opacity: reminder.isActive ? 1 : 0.7,
                      backgroundColor: isOverdue && reminder.isActive ? 'error.light' : 'background.paper'
                    }}
                  >
                    <CardContent>
                      {/* Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                          <Avatar sx={{ bgcolor: getPriorityColor(reminder.priority) + '.main', mr: 1, width: 32, height: 32 }}>
                            {getTypeIcon(reminder.type)}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                              {reminder.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {reminder.category || 'General'}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Test Sound">
                            <IconButton
                              size="small"
                              onClick={handleTestSound}
                              disabled={testingSound}
                            >
                              <VolumeUp />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(reminder)}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(reminder._id)}
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      {/* Description */}
                      {reminder.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.4 }}>
                          {reminder.description}
                        </Typography>
                      )}

                      {/* Alarm Time - Editable */}
                      <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTime sx={{ mr: 1, color: 'primary.main' }} />
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                Next Alarm
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {dayjs(reminder.triggerTime).format('MMM D, YYYY h:mm A')}
                              </Typography>
                            </Box>
                          </Box>
                          <Tooltip title="Edit Time">
                            <IconButton
                              size="small"
                              onClick={() => setQuickEditMode(reminder._id)}
                              color="primary"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        </Box>

                        {/* Time remaining */}
                        <Box sx={{ mt: 1 }}>
                          <Typography
                            variant="caption"
                            color={isOverdue ? 'error.main' : 'primary.main'}
                            fontWeight={isOverdue ? 600 : 400}
                          >
                            {dayjs(reminder.triggerTime).isAfter(dayjs())
                              ? `In ${dayjs(reminder.triggerTime).fromNow(true)}`
                              : `⚠️ Overdue by ${dayjs().to(dayjs(reminder.triggerTime), true)}`
                            }
                          </Typography>
                        </Box>
                      </Paper>

                      {/* Tags */}
                      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
                        <Chip
                          label={reminder.priority}
                          color={getPriorityColor(reminder.priority)}
                          size="small"
                          variant="filled"
                        />
                        <Chip
                          label={reminder.pattern?.frequency || 'once'}
                          variant="outlined"
                          size="small"
                          icon={<Schedule />}
                        />
                        <Chip
                          label={reminder.type}
                          variant="outlined"
                          size="small"
                        />
                        {reminder.soundEnabled && (
                          <Chip
                            label="Sound"
                            variant="outlined"
                            size="small"
                            icon={<VolumeUp />}
                            color="success"
                          />
                        )}
                      </Stack>

                      {/* Controls */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={reminder.isActive}
                              onChange={() => handleToggleActive(reminder._id, reminder.isActive)}
                              size="small"
                              color="primary"
                            />
                          }
                          label={
                            <Typography variant="body2" fontWeight={500}>
                              {reminder.isActive ? 'Active' : 'Inactive'}
                            </Typography>
                          }
                        />

                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleExpandCard(reminder._id)}
                          endIcon={<ExpandMore sx={{
                            transform: expandedCard === reminder._id ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s'
                          }} />}
                        >
                          Details
                        </Button>
                      </Box>

                      {/* Expanded Details */}
                      {expandedCard === reminder._id && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Reminder Details
                          </Typography>

                          <List dense>
                            <ListItem>
                              <ListItemText
                                primary="Created"
                                secondary={dayjs(reminder.createdAt).format('MMM D, YYYY h:mm A')}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText
                                primary="Last Triggered"
                                secondary={reminder.lastTriggered
                                  ? dayjs(reminder.lastTriggered).format('MMM D, YYYY h:mm A')
                                  : 'Never'
                                }
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText
                                primary="Trigger Count"
                                secondary={reminder.triggerCount || 0}
                              />
                            </ListItem>
                            {reminder.pattern?.frequency !== 'once' && (
                              <ListItem>
                                <ListItemText
                                  primary="Recurrence"
                                  secondary={`${reminder.pattern.frequency} at ${reminder.pattern.time}`}
                                />
                              </ListItem>
                            )}
                          </List>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}

      {/* Add/Edit Reminder Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Settings />
            {editingReminder ? 'Edit Reminder' : 'Create New Reminder'}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Basic Info */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, mb: 1, color: 'primary.main' }}>
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                helperText={errors.title || "Enter a descriptive title for your reminder"}
                error={touched.title && !!errors.title}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Category"
                >
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="health">Health</MenuItem>
                  <MenuItem value="work">Work</MenuItem>
                  <MenuItem value="personal">Personal</MenuItem>
                  <MenuItem value="medication">Medication</MenuItem>
                  <MenuItem value="appointment">Appointment</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                multiline
                rows={3}
                helperText={errors.description || `${formData.description.length}/500 characters`}
                error={touched.description && !!errors.description}
              />
            </Grid>

            {/* Timing */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, mb: 1, color: 'primary.main' }}>
                Alarm Timing
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Alarm Date & Time"
                  value={formData.triggerTime}
                  onChange={handleDateTimeChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  minDateTime={dayjs()}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Recurrence</InputLabel>
                <Select
                  name="pattern.frequency"
                  value={formData.pattern.frequency}
                  onChange={handleChange}
                  label="Recurrence"
                >
                  <MenuItem value="once">One Time Only</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Priority & Sound */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, mb: 1, color: 'primary.main' }}>
                Alert Settings
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  label="Priority"
                >
                  <MenuItem value="low">🔕 Low</MenuItem>
                  <MenuItem value="medium">🔔 Medium</MenuItem>
                  <MenuItem value="high">🚨 High</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Sound</InputLabel>
                <Select
                  name="customSound"
                  value={formData.customSound}
                  onChange={handleChange}
                  label="Sound"
                  disabled={!formData.soundEnabled}
                >
                  <MenuItem value="remind.mp3">Custom Reminder</MenuItem>
                  <MenuItem value="beep">System Beep</MenuItem>
                  <MenuItem value="chime">Chime</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
                <FormControlLabel
                  control={
                    <Switch
                      name="soundEnabled"
                      checked={formData.soundEnabled}
                      onChange={handleChange}
                    />
                  }
                  label="Sound Enabled"
                />
                <Tooltip title="Test Sound">
                  <IconButton
                    onClick={handleTestSound}
                    disabled={!formData.soundEnabled || testingSound}
                    color="primary"
                  >
                    {testingSound ? <Pause /> : <PlayArrow />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>

            {/* Status */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {formData.isActive ? 'Active' : 'Inactive'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formData.isActive
                        ? 'Reminder will trigger at the scheduled time'
                        : 'Reminder is paused and will not trigger'
                      }
                    </Typography>
                  </Box>
                }
                sx={{ mt: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" size="large">
            {editingReminder ? 'Update Reminder' : 'Create Reminder'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Quick Edit Time Dialog */}
      <Dialog
        open={quickEditMode !== null}
        onClose={() => setQuickEditMode(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Quick Edit Alarm Time</DialogTitle>
        <DialogContent>
          {quickEditMode && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="New Alarm Time"
                value={dayjs(reminders.find(r => r._id === quickEditMode)?.triggerTime)}
                onChange={(newValue) => {
                  if (newValue) {
                    handleQuickEdit(quickEditMode, 'triggerTime', newValue.toISOString());
                  }
                }}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                minDateTime={dayjs()}
              />
            </LocalizationProvider>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuickEditMode(null)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Reminders;
