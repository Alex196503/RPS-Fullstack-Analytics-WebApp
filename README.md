### A fullstack web app that turns the classic Rock-Paper-Scissors game into a data-driven experience. It features user authentication, real-time match tracking, and a performance dashboard to analyze your gameplay stats.

# Key features:
* **User Authentication**: Secure login and registration with JWT-based sessions.
* **Core Game Logic**: Play the classic Rock-Paper-Scissors game with real-time score tracking alongside the advanced mode with lizard and spock.
* **Performance Analytics**: A dashboard to track your match history and overall win/loss ratios.
* **Data Management**: Import and export your match history using CSV files.
* **Profile Customization**: Upload and update your profile picture, hosted via Cloudinary.
* **Data Persistence**: All game results and user data are permanently saved to a MongoDB database.
* **Integration testing**: Includes test suites to verify core game logic and API functionality.
* **Containerization**: Fully containerized using Docker and Docker Compose for consistent development and deployment environments.

# Technologies:

* **Frontend**: React (with React Router v7), TypeScript, Vite, and TailwindCSS.
* **Backend**: Node.js, Express, and TypeScript.
* **Database**: MongoDB with Mongoose.
* **Services**: Cloudinary (for image hosting).
* **Tooling**: Docker & Docker Compose for environment setup and testing suites.
* **Testing**: Vitest, React Testing Library (RTL), jest-dom, and Supertest for API testing.

# Setup & Instalation:

1. Clone this repository: `git clone https://github.com/Alex196503/RPS-Fullstack-Analytics-WebApp.git`.
2. Configure environment variables. Create a .env file in the project root (or specific /frontend and /backend folders) and set the required keys:
    - JWT_SECRET=your_super_secret_key
    - MONGODB_URI=mongodb://localhost:27017/rps_analytics
    - VITE_API_URL=http://localhost:5000`
3. Run with Docker Compose: ``docker-compose up --build``
4. Access the app:
   * **Frontend**: http://localhost:3000
   * **Backend**: http://localhost:5000

# Troubleshooting : Local Port Dev Conflicts
When running via Docker Compose, you might encounter a fetch failed (ECONNREFUSED) error during Server-Side Rendering (SSR).

Why it happens: In local development, your browser/Vite reads the physical .env file from the host, which usually defaults to localhost:5000. However, inside a Docker container, localhost refers to the container itself, not the backend service.

The Fix: Ensure your VITE_API_URL is set to http://server:5000 when running inside the Docker network.

# Important note: 

Please note that while the application is fully functional in a local environment (including Docker), you may encounter issues when deploying to cloud services like Render.
Due to strict browser security policies regarding Third-Party Cookies (SameSite restrictions), the authentication cookies may be blocked when the frontend and backend are hosted on different domains. Currently, the application is optimized for local/containerized execution where this cross-domain restriction does not apply.

# Project status:

* **Status**: Completed
* **Author**: Moldovan Alex-Cristian
