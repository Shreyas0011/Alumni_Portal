import mongoose from 'mongoose';

const { Schema } = mongoose;

/* ── Users: every account that can sign in to Overall360 ─────────────── */
const userSchema = new Schema(
  {
    email: { type: String, lowercase: true, trim: true, unique: true, sparse: true },
    institutionalId: { type: String, trim: true, unique: true, sparse: true },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ['superadmin', 'admin', 'professor', 'student', 'alumni'],
      required: true,
    },
    passwordHash: { type: String },
    profileStatus: { type: String, default: 'approved' },
    batch: String,
    branch: String,
    lastLogin: Date,
  },
  { timestamps: true, versionKey: false }
);
userSchema.index({ role: 1 });

export const User = mongoose.model('User', userSchema);

/* ── Portal data collections ─────────────────────────────────────────────
   Each list the app keeps (alumni, events, posts…) is its own collection.
   Documents keep the app's string `id` plus an `_order` field so lists come
   back in the same order the UI saved them. The schemas are flexible
   (strict: false) because profile shapes vary between registration forms. */
const listSchema = () =>
  new Schema(
    {
      id: { type: String, required: true, unique: true, index: true },
      _order: { type: Number, index: true },
    },
    { strict: false, versionKey: false, timestamps: true }
  );

export const LIST_COLLECTIONS = {
  achievements: mongoose.model('Achievement', listSchema(), 'achievements'),
  posts: mongoose.model('Post', listSchema(), 'posts'),
  pendingProfiles: mongoose.model('PendingProfile', listSchema(), 'pending_profiles'),
  alumniList: mongoose.model('Alumnus', listSchema(), 'alumni'),
  broadcasts: mongoose.model('Broadcast', listSchema(), 'broadcasts'),
  events: mongoose.model('Event', listSchema(), 'events'),
  notifications: mongoose.model('Notification', listSchema(), 'notifications'),
  birthdayLogs: mongoose.model('BirthdayLog', listSchema(), 'birthday_logs'),
};

/* ── Settings: single-document values (automation config, wish ledger) ── */
const settingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed },
  },
  { versionKey: false, timestamps: true, minimize: false }
);
export const Setting = mongoose.model('Setting', settingSchema, 'settings');

export const SETTING_KEYS = ['automationSettings', 'wishedAlumni'];
