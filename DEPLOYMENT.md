# Blood Bank Management System - Production Deployment

## Project Location

All project files must be placed at:
```
/Hdd/Hari/Projects/bloodbank_system
```

The directory structure should be:
```
/Hdd/Hari/Projects/bloodbank_system/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── init.sql
│   ├── .env
│   └── ...
└── frontend/
    ├── Dockerfile
    └── ...
```

## Quick Start with Portainer

1. **Copy project files to the server:**
   ```bash
   # Copy the entire project to the server path
   cp -r . /Hdd/Hari/Projects/bloodbank_system/
   ```

2. **Prepare environment file:**
   ```bash
   cp /Hdd/Hari/Projects/bloodbank_system/backend/.env.example \
      /Hdd/Hari/Projects/bloodbank_system/backend/.env
   ```
   Edit `backend/.env` and set secure values:
   - `DB_PASS` - database password (must match MYSQL_PASSWORD in compose)
   - `JWT_SECRET` - random secure string for JWT signing

3. **Deploy in Portainer:**
   - Navigate to **Stacks** → **Add stack**
   - Name: `blood-bank-system`
   - Build method: **Web editor** (paste docker-compose.yml) or **Repository** (if using Git)
   - Deploy the stack

4. **Access the application:**
   - Frontend: `http://<your-host>:8086`
   - Backend API: `http://<your-host>:8087`
   - Login: `admin@bloodbank.com` / `admin123`

5. **Database:**
   - Schema auto-initializes via `init.sql` on first run
   - Data persists in `db_data` volume
   - To reset: remove volume in Portainer

## Production Checklist

- [ ] Copy all project files to `/Hdd/Hari/Projects/bloodbank_system`
- [ ] Change all default passwords in `docker-compose.yml` and `backend/.env`
- [ ] Set strong `JWT_SECRET` in `backend/.env`
- [ ] Configure reverse proxy (nginx/Traefik) for HTTPS
- [ ] Set up backup strategy for `db_data` volume
- [ ] Review and adjust resource limits if needed
- [ ] Enable MySQL port only if external access needed (commented by default)

## Updating the Stack

In Portainer:
1. Edit the stack configuration
2. Click **Update the stack**
3. Enable **Re-pull and redeploy**

## Troubleshooting

**Backend can't connect to DB:**
- Check `DB_HOST=db` in backend/.env
- Verify MySQL healthcheck is passing
- Check logs: Stacks → blood-bank-system → db → Logs

**Frontend shows connection errors:**
- API calls use port 8087 for the backend
- Check backend is running and healthy
- Verify CORS is enabled in backend

**Database not initializing:**
- Verify `init.sql` exists at `/Hdd/Hari/Projects/bloodbank_system/backend/init.sql`
- View db logs for errors
- Ensure volume is empty on first run
