# 🩸 Blood Bank Management System

A modern, full-stack web application for managing blood donations, inventory tracking, and blood requests with a beautiful glass-morphism UI.

## 🌟 Features

### Public Features
- **Donor Registration** - Citizens can register as blood donors with complete details
- **Blood Request System** - Patients/hospitals can request specific blood types
- **Real-time Availability Check** - Instantly check blood stock availability
- **Live Statistics Dashboard** - View total donors, available units, and pending requests

### Admin Features
- **Secure Authentication** - JWT-based admin login system
- **Dashboard Overview** - Comprehensive stats with expiring blood alerts
- **Blood Stock Management** - Track individual blood bags with collection/expiry dates
- **Request Management** - Approve, reject, or fulfill blood requests
- **Donor Database** - Complete donor records with search functionality
- **Inventory Actions** - Mark blood units as used, expired, or dispose them

## 🛠️ Tech Stack

**Frontend:**
- Pure HTML5, CSS3 (Glass-morphism design)
- Vanilla JavaScript (ES6+)
- Responsive design
- Dynamic API integration

**Backend:**
- Node.js + Express.js
- MySQL database
- JWT authentication
- RESTful API architecture

**DevOps:**
- Docker & Docker Compose
- Nginx (frontend serving)
- Multi-container orchestration

## 📁 Project Structure

```
blood-bank-system/
├── frontend/
│   ├── index.html              # Homepage
│   ├── donor-register.html     # Donor registration
│   ├── request-blood.html      # Blood request form
│   ├── login.html              # Admin login
│   ├── admin-dashboard.html    # Admin panel
│   ├── css/
│   │   └── styles.css          # Global styles
│   ├── js/
│   │   ├── main.js             # Public pages logic
│   │   └── admin.js            # Admin dashboard logic
│   ├── Dockerfile              # Frontend container
│   └── nginx.conf              # Nginx configuration
├── backend/
│   ├── server.js               # Express server
│   ├── config/
│   │   └── db.js               # MySQL connection pool
│   ├── routes/
│   │   ├── auth.js             # Authentication routes
│   │   ├── donors.js           # Donor management
│   │   ├── requests.js         # Blood request routes
│   │   └── stock.js            # Stock management
│   ├── init.sql                # Database schema
│   ├── Dockerfile              # Backend container
│   └── .env.example            # Environment template
├── docker-compose.yml          # Docker orchestration
└── DEPLOYMENT.md               # Deployment guide
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose installed
- Git

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd blood-bank-system
   ```

2. **Set up environment:**
   ```bash
   cp backend/.env.example backend/.env
   ```
   Edit `backend/.env` and configure:
   - Database credentials
   - JWT secret

3. **Start the application:**
   ```bash
   docker-compose up -d --build
   ```

4. **Access the application:**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000
   - Default login: `admin@bloodbank.com` / `admin123`

## 🐳 Production Deployment

### Using Portainer

1. **Prepare environment file:**
   ```bash
   cp backend/.env.example backend/.env
   # Edit with production values
   ```

2. **In Portainer:**
   - Navigate to **Stacks** → **Add stack**
   - Name: `blood-bank-system`
   - Choose **Web editor** or **Repository**
   - Paste `docker-compose.yml` content
   - Deploy

3. **Post-deployment:**
   - Change default admin password
   - Set up SSL/TLS (recommended)
   - Configure backups for `db_data` volume

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 📊 Database Schema

**Tables:**
- `users` - Admin user accounts
- `donors` - Registered blood donors
- `blood_stock` - Individual blood bag inventory
- `blood_requests` - Patient/hospital blood requests

Schema auto-initializes via `backend/init.sql` on first run.

## 🔒 Security Features

- JWT-based authentication
- Environment variable configuration
- MySQL prepared statements (SQL injection prevention)
- CORS enabled for cross-origin requests
- Password protection for admin routes

## 🎨 UI/UX Highlights

- **Glass-morphism Design** - Modern frosted glass effect
- **Gradient Backgrounds** - Dark theme with vibrant accents
- **Responsive Layout** - Works on mobile, tablet, and desktop
- **Floating Labels** - Smooth form input animations
- **Real-time Feedback** - Instant validation and status updates

## 📡 API Endpoints

### Public Routes
```
GET  /api/stats                        - Homepage statistics
POST /api/donors                       - Register new donor
POST /api/requests                     - Create blood request
GET  /api/availability?group=<type>    - Check blood availability
```

### Admin Routes (Require JWT Token)
```
POST /api/auth/login                   - Admin login
GET  /api/admin/overview               - Dashboard stats
GET  /api/admin/stock                  - List blood inventory
GET  /api/admin/requests               - List all requests
GET  /api/admin/donors                 - List all donors
POST /api/admin/stock/:id/mark-used    - Mark blood as used
POST /api/admin/stock/:id/mark-expired - Mark blood as expired
DELETE /api/admin/stock/:id            - Delete blood bag
POST /api/admin/requests/:id/:action   - approve/reject/fulfill
```

## 🔧 Environment Variables

```env
NODE_ENV=production
PORT=3000
DB_HOST=db
DB_PORT=3306
DB_USER=blood_user
DB_PASS=your_secure_password
DB_NAME=blood_bank
JWT_SECRET=your_jwt_secret
```

## 🐛 Troubleshooting

**Backend can't connect to database:**
- Verify `DB_HOST=db` in `.env`
- Check MySQL container health
- Ensure database initialized correctly

**Frontend API errors:**
- Backend must be running on port 3000
- Check browser console for CORS issues
- Verify API URL configuration

**Docker build fails:**
- Clear Docker cache: `docker system prune -a`
- Rebuild: `docker-compose up --build --force-recreate`

## 📝 License

This project is open source and available for educational purposes.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📧 Support

For issues or questions, please open an issue in the repository.

---

**Built with ❤️ for saving lives through efficient blood management**