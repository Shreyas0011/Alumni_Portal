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
  jobs: mongoose.model('Job', listSchema(), 'jobs'),
  volunteering: mongoose.model('VolunteerRequest', listSchema(), 'volunteering'),
  interviews: mongoose.model('InterviewExperience', listSchema(), 'interviews'),
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

/* ── Private, per-person records (served by /api/social, never by /api/data) ── */
const opts = { timestamps: true, versionKey: false };

// Direct messages between two members (ids are portal uids)
export const Message = mongoose.model('Message', new Schema({
  from: { type: String, required: true, index: true },
  fromName: String,
  to: { type: String, required: true, index: true },
  toName: String,
  text: { type: String, required: true, maxlength: 4000 },
  read: { type: Boolean, default: false },
}, opts));

// Mentorship sessions booked with an alumnus
export const MentorSession = mongoose.model('MentorSession', new Schema({
  mentorId: { type: String, required: true, index: true },
  mentorName: String,
  menteeId: { type: String, required: true, index: true },
  menteeName: String,
  menteeRole: String,
  area: String,
  topic: String,
  note: String,
  slot: { type: Date, required: true },
  mode: { type: String, default: 'Video call' },
  status: { type: String, enum: ['requested', 'confirmed', 'declined', 'cancelled', 'completed'], default: 'requested' },
}, opts));

// Resume review requests (CV stored inline, small files only)
export const ResumeReview = mongoose.model('ResumeReview', new Schema({
  studentId: { type: String, required: true, index: true },
  studentName: String,
  field: String,
  note: String,
  fileName: String,
  fileType: String,
  fileData: String,
  status: { type: String, enum: ['open', 'in_review', 'reviewed'], default: 'open' },
  reviewerId: { type: String, index: true },
  reviewerName: String,
  feedback: String,
  rating: Number,
}, opts));

// In-app notifications for one person
export const Alert = mongoose.model('Alert', new Schema({
  userId: { type: String, required: true, index: true },
  type: String,
  title: String,
  body: String,
  link: String,
  read: { type: Boolean, default: false },
}, opts));

// Content reported by members for admin moderation
export const Report = mongoose.model('Report', new Schema({
  reporterId: String,
  reporterName: String,
  kind: { type: String, enum: ['post', 'job', 'interview'], required: true },
  itemId: { type: String, required: true },
  itemTitle: String,
  reason: String,
  status: { type: String, enum: ['open', 'dismissed', 'removed'], default: 'open' },
  resolvedBy: String,
}, opts));
