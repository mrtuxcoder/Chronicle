require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');


connectDB();

const PORT = process.env.PORT;

if (!PORT) {
  console.error('❌ Error: PORT environment variable is not set');
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API base: http://localhost:${PORT}/api`);
});