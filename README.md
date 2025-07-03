# WebDesignBlueprint Project

## Running the Project Locally

This project is a static website served using a development server with live reload for better development experience.

### Prerequisites

- Node.js and npm installed on your system.

### Steps to Run

1. Open a terminal in the `WebDesignBlueprint` directory.
2. Install the dependencies by running:
   ```
   npm install
   ```
3. Start the development server with live reload:
   ```
   npm start
   ```
4. The project will be served at [http://localhost:5000](http://localhost:5000) and will automatically reload when you make changes to HTML, CSS, or JS files.

### Existing Python Server

Previously, the project was served using a Python HTTP server with the command:
```
python3 -m http.server 5000
```
This is still available but does not support live reload.

### Notes

- The live-server watches the following directories and files for changes:
  - `css/`
  - `js/`
  - `components/`
  - All `.html` files in the root directory.

- Make sure to keep your Node.js dependencies up to date by running `npm install` when necessary.

Enjoy developing with live reload!

## Deploying to Netlify

This project can be easily deployed to Netlify as a static site.

### Steps to Deploy

1. Create a new site on [Netlify](https://www.netlify.com/) and connect your Git repository containing this project.
2. In the site settings, set the **Publish directory** to the root directory (`.`).
3. No build command is necessary since this is a static site.
4. Deploy the site and enjoy your live website!

