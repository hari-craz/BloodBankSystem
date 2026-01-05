# Blood Bank Management System - Production Deployment

## Quick Start with Portainer

1. **Prepare environment file:**
   ```bash
   cp backend/.env.example backend/.env
   ```
   Edit `backend/.env` and set secure values:
   - `DB_PASS` - database password (must match MYSQL_PASSWORD in compose)
   - `JWT_SECRET` - random secure string for JWT signing

2. **Deploy in Portainer:**
   - Navigate to **Stacks** → **Add stack**
   - Name: `blood-bank-system`
   - Build method: **Web editor** (paste docker-compose.yml) or **Repository** (if using Git)
   - Deploy the stack

3. **Access the application:**
   - Frontend: `http://<your-host>:8080`
   - Backend API: `http://<your-host>:3000`
   - Login: `admin@bloodbank.com` / `admin123`

4. **Database:**
   - Schema auto-initializes via `init.sql` on first run
   - Data persists in `db_data` volume
   - To reset: remove volume in Portainer

## Production Checklist

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
- API calls now use dynamic URLs (port 3000)
- Check backend is running and healthy
- Verify CORS is enabled in backend

**Database not initializing:**
- Check init.sql is mounted correctly
- View db logs for errors
- Ensure volume is empty on first run
