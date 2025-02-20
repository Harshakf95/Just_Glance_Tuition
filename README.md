# Just Glance Tuition Institute Website

A modern, responsive website for Just Glance Tuition Institute built with Node.js, Express, and Bootstrap.

## Features

- Responsive design
- Course catalog
- Faculty profiles
- Contact form
- Modern UI with smooth animations

## Setup Instructions

1. Install Node.js if you haven't already (https://nodejs.org)

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory (optional):
   ```
   PORT=3000
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Open your browser and visit `http://localhost:3000`

## Project Structure

- `/public`
  - `/css` - Stylesheets
  - `/js` - Client-side JavaScript
  - `/images` - Image assets
- `index.html` - Main HTML file
- `server.js` - Express server
- `package.json` - Project dependencies

## Technologies Used

- Node.js
- Express.js
- Bootstrap 5
- HTML5
- CSS3
- JavaScript

## Adding Content

### Courses
Add new courses by modifying the courses array in `/public/js/main.js`

### Faculty
Add new faculty members by modifying the faculty array in `/public/js/main.js`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
