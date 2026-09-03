const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes');
const entrepreneurRoutes = require('./routes/entrepreneurRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const scholarshipRoutes = require('./routes/scholarshipRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const providerRoutes = require('./routes/providerRoutes');
const sponsorshipRoutes = require('./routes/sponsorshipRoutes');
const adminRoutes = require('./routes/adminRoutes');
const aiRoutes = require('./routes/aiRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const opportunityRoutes = require('./routes/opportunityRoutes');
const adminVerificationRoutes = require('./routes/adminVerificationRoutes');
const documentRoutes = require('./routes/documentRoutes');
const trackingRoutes = require('./routes/trackingRoutes');

const app = express();

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false
}));

app.use(cors({
  origin: '*',
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ONLINE',
    product: 'Yojna दृष्टि',
    tagline: 'Discover. Apply. Track.',
    timestamp: new Date()
  });
});

// Serve Uploaded Files Statically
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/entrepreneurs', entrepreneurRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/sponsorships', sponsorshipRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/voice', aiRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/admin/verification', adminVerificationRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api', trackingRoutes);

// Static Client Serving for Production
const clientDistPath = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// 404 Handler for API
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('API Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
