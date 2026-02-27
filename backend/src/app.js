import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/error.middleware.js';

// Route Imports
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import teamRoutes from './routes/team.routes.js';
import auditRoutes from './routes/audit.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import templateRoutes from './routes/template.routes.js';
import routingRoutes from './routes/routing.routes.js';
import slaRoutes from './routes/sla.routes.js';
import settingRoutes from './routes/setting.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import leadRoutes from './routes/lead.routes.js';
import inboxRoutes from './routes/inbox.routes.js';
import aiRoutes from './routes/ai.routes.js';
import billingRoutes from './routes/billing.routes.js';
import superAdminRoutes from './routes/superAdmin.routes.js';
import adminRoutes from './routes/admin.routes.js';
import managerRoutes from './routes/manager.routes.js';
import teamLeaderRoutes from './routes/teamLeader.routes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/teams', teamRoutes);
app.use('/api/v1/audit', auditRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/templates', templateRoutes);
app.use('/api/v1/routing', routingRoutes);
app.use('/api/v1/sla', slaRoutes);
app.use('/api/v1/settings', settingRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/leads', leadRoutes);
app.use('/api/v1/inbox', inboxRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/billing', billingRoutes);
app.use('/api/v1/super-admin', superAdminRoutes);

// Special mount for user requested base URL contract
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/team-leader', teamLeaderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/inbox', inboxRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/routing', routingRoutes);
app.use('/api/sla', slaRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/audit', auditRoutes);

// Health Check
app.get('/', (req, res) => {
    res.json({ success: true, message: 'CRM API Server is running' });
});

// Global Error Handler
app.use(errorHandler);

export default app;
