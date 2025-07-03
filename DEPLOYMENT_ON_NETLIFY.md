# Deployment Instructions for WebDesignBlueprint on Netlify

This project is a static website and can be deployed easily on Netlify.

## Netlify Configuration

The `netlify.toml` file is configured as follows:

```toml
[build]
  publish = "."
  command = ""

[dev]
  port = 5000
  publish = "."
```

- The `publish` directory is set to the root of the project folder, which contains the static HTML, CSS, JS files.
- There is no build command since this is a static site without a build step.

## Steps to Deploy on Netlify

1. **Create a Netlify Account**  
   If you don't have one, sign up at [https://www.netlify.com/](https://www.netlify.com/).

2. **Connect Your Git Repository**  
   - Push your project to a Git repository (GitHub, GitLab, or Bitbucket).
   - In Netlify, click "New site from Git".
   - Connect your Git provider and select the repository.
   - Netlify will detect the `netlify.toml` configuration automatically.
   - Since there is no build command, leave the build command empty.
   - Set the publish directory to `.` (root).

3. **Manual Drag and Drop (Alternative)**  
   - Zip the contents of the `WebDesignBlueprint` folder.
   - Go to Netlify app dashboard.
   - Click "Sites" > "Add new site" > "Deploy manually".
   - Drag and drop the zipped folder or the extracted folder contents.

4. **Access Your Site**  
   After deployment, Netlify will provide a URL where your site is live.

## Development Server

For local development, you can use the existing `live-server` setup:

```bash
npm install
npm start
```

This will start a local server at port 5000 and watch for changes.

---

If you need any further customization or assistance, feel free to ask.
