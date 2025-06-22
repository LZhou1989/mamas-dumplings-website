# Mama's Dumplings - Deployment Guide

## 🚀 Quick Deploy to Render (Recommended)

### Step 1: Prepare Your Code
1. Make sure all your files are saved
2. Your code is ready for deployment with the files we just created

### Step 2: Create a GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Name it: `mamas-dumplings-website`
4. Make it **Public** (free hosting requires this)
5. Don't initialize with README (you already have files)
6. Click "Create repository"

### Step 3: Upload Your Code to GitHub
1. Open Command Prompt/Terminal in your project folder
2. Run these commands:
```bash
git init
git add .
git commit -m "Initial commit - Mama's Dumplings website"
git branch -M main
git remote add origin YOUR_GITHUB_URL
git push -u origin main
```
(Replace `YOUR_GITHUB_URL` with the URL of your new GitHub repository)

### Step 4: Deploy to Render
1. Go to [Render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub account if prompted
4. Select your `mamas-dumplings-website` repository
5. Configure the service:
   - **Name**: `mamas-dumplings`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free
6. Click "Create Web Service"
7. Wait 2-3 minutes for deployment

### Step 5: Get Your Live URL
- Render will give you a URL like: `https://mamas-dumplings.onrender.com`
- Your website is now live! 🎉

---

## 🔧 Alternative: Deploy to Heroku

### Step 1: Install Heroku CLI
1. Download from [Heroku.com](https://devcenter.heroku.com/articles/heroku-cli)
2. Install and login: `heroku login`

### Step 2: Deploy
```bash
heroku create mamas-dumplings-website
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Step 3: Open Your Site
```bash
heroku open
```

---

## 🌐 Custom Domain Setup

### Option 1: Render (Free)
1. In your Render dashboard, go to your web service
2. Click "Settings" → "Custom Domains"
3. Add your domain (e.g., `mamasdumplings.com`)
4. Update your domain's DNS settings as instructed

### Option 2: Domain Registrar
1. Buy a domain (GoDaddy, Namecheap, etc.)
2. Point DNS to your Render/Heroku URL
3. Add the domain in your hosting platform

---

## 🔒 Security & Production Checklist

### ✅ What's Already Done:
- [x] Helmet.js for security headers
- [x] CORS configured
- [x] Environment variables support
- [x] Error handling
- [x] Health check endpoint

### 🔄 Optional Improvements:
- [ ] Add real database (MongoDB Atlas, PostgreSQL)
- [ ] Integrate payment processing (Stripe)
- [ ] Add email notifications (SendGrid)
- [ ] Set up SSL certificate (automatic on Render/Heroku)
- [ ] Add monitoring and logging

---

## 🐛 Troubleshooting

### Common Issues:

**1. "Module not found" errors:**
- Make sure `package.json` has all dependencies
- Run `npm install` locally to test

**2. Port issues:**
- Your code already uses `process.env.PORT` (good!)

**3. Static files not loading:**
- Check that image paths are correct
- Verify `express.static()` is configured

**4. API calls failing:**
- Make sure your frontend uses relative URLs (e.g., `/api/products`)
- Check CORS settings

### Debug Commands:
```bash
# Check if your app runs locally
npm start

# Test the health endpoint
curl http://localhost:3000/health

# Check logs on Render/Heroku
# (Use their dashboard or CLI)
```

---

## 📞 Support

If you encounter issues:
1. Check the deployment platform's logs
2. Test locally first: `npm start`
3. Verify all files are committed to GitHub
4. Check that `package.json` has all dependencies

---

## 🎉 Success!

Once deployed, your Mama's Dumplings website will be live at:
- **Render**: `https://your-app-name.onrender.com`
- **Heroku**: `https://your-app-name.herokuapp.com`

Your website includes:
- ✅ Product catalog with filtering
- ✅ Shopping cart functionality
- ✅ User registration/login
- ✅ Order management
- ✅ Review system
- ✅ Responsive design
- ✅ Backend API

**Congratulations! Your dumpling business is now online! 🥟** 