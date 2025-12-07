# 🚀 Deploy to GitHub Pages - Step by Step Guide

## Prerequisites
- GitHub account
- Git installed on your computer

## Step 1: Update GitHub Username

Open `package.json` and replace `YOUR_GITHUB_USERNAME` with your actual GitHub username:

```json
"homepage": "https://YOUR_GITHUB_USERNAME.github.io/maunas-parivar",
```

For example, if your GitHub username is `arshkhan`, change it to:
```json
"homepage": "https://arshkhan.github.io/maunas-parivar",
```

## Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository name: `maunas-parivar`
4. Description: "Kshatriya Maunas Parivar Community Website"
5. Keep it **Public** (required for free GitHub Pages)
6. **DO NOT** initialize with README (we already have files)
7. Click **"Create repository"**

## Step 3: Connect Local Repository to GitHub

Copy the commands shown on GitHub after creating the repo, or run these:

```bash
cd C:\Users\Arsh\Desktop\Maunas\maunas-parivar

# Add all files to git
git add .

# Commit the changes
git commit -m "Initial commit - Kshatriya Maunas Parivar website"

# Add GitHub remote (replace YOUR_GITHUB_USERNAME)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/maunas-parivar.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 4: Deploy to GitHub Pages

Once your code is on GitHub, run:

```bash
npm run deploy
```

This command will:
1. Build your React app for production
2. Create a `gh-pages` branch
3. Deploy the build folder to GitHub Pages

## Step 5: Enable GitHub Pages (if needed)

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (in left sidebar)
3. Under "Source", ensure it's set to deploy from `gh-pages` branch
4. Click **Save** if you made changes

## Step 6: Access Your Live Website

Your website will be live at:
```
https://YOUR_GITHUB_USERNAME.github.io/maunas-parivar
```

Note: It may take 2-5 minutes for the site to go live after first deployment.

## 🔄 Updating Your Website

Whenever you make changes:

```bash
# 1. Save your changes in code editor

# 2. Add changes to git
git add .

# 3. Commit with a message
git commit -m "Update website content"

# 4. Push to GitHub
git push

# 5. Deploy the updates
npm run deploy
```

## 📋 Quick Commands Reference

```bash
# Check git status
git status

# View commit history
git log --oneline

# Create a new branch
git checkout -b feature-name

# Switch back to main branch
git checkout main

# Pull latest changes
git pull

# Deploy to GitHub Pages
npm run deploy
```

## ⚠️ Troubleshooting

### Issue: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/maunas-parivar.git
```

### Issue: "gh-pages not found"
```bash
npm install --save-dev gh-pages
```

### Issue: GitHub Pages not showing
- Wait 5 minutes after deployment
- Check Settings → Pages is enabled
- Ensure repository is Public
- Clear browser cache

### Issue: Routes not working on refresh
Add a `404.html` in public folder that redirects to index.html (for GitHub Pages SPA support)

## 🎯 Custom Domain (Optional)

To use your own domain (e.g., maunasparivar.com):

1. Buy a domain from any provider
2. Add CNAME file in `public` folder:
   ```
   maunasparivar.com
   ```
3. Update package.json homepage:
   ```json
   "homepage": "https://maunasparivar.com",
   ```
4. Configure DNS settings at your domain provider:
   - Add A records pointing to GitHub IPs
   - Or add CNAME record pointing to YOUR_GITHUB_USERNAME.github.io
5. In GitHub Settings → Pages, add your custom domain
6. Deploy: `npm run deploy`

## ✅ Success Checklist

- [ ] Updated GitHub username in package.json
- [ ] Created GitHub repository
- [ ] Pushed code to GitHub
- [ ] Ran `npm run deploy`
- [ ] Verified website is live
- [ ] Tested all pages and navigation
- [ ] Tested on mobile devices

## 🔗 Useful Links

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Create React App Deployment Guide](https://create-react-app.dev/docs/deployment/#github-pages)
- [Custom Domain Setup](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

---

**Need Help?** 
- Check GitHub repository Settings → Pages
- Ensure all commands run without errors
- Verify package.json has correct homepage URL

🎉 **Your website will be live in minutes!**
