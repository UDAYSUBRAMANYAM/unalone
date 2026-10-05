function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">

        {/* HERO */}
        <section className="mb-16">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-purple-300/50">
            About LOKOL
          </p>

          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
            Discover people.
            <br />
            <span className="text-white/40">
              Connect locally.
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-7 text-white/40">
            LOKOL is a real-time location-based social application that helps
            people discover others around them through location-aware status
            notes. Instead of relying on traditional social graphs, LOKOL
            focuses on what is happening around you right now.
          </p>
        </section>


        {/* WHAT IS LOKOL */}
        <section className="mb-16">
          <div className="rounded-[2rem] border border-white/[0.07] bg-white/[0.025] p-7 backdrop-blur-2xl">

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300/50">
              The Idea
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              A location-first social experience
            </h2>

            <p className="mt-4 max-w-4xl text-sm leading-7 text-white/40">
              LOKOL allows authenticated users to share their current
              location and discover nearby users. Each user can maintain a
              short personal note that can be displayed to people nearby.
              The system continuously processes location updates and returns
              relevant nearby users in real time.
            </p>

            <p className="mt-4 max-w-4xl text-sm leading-7 text-white/40">
              The goal is to make nearby discovery simple, lightweight and
              contextual rather than building another conventional social
              network.
            </p>

          </div>
        </section>


        {/* HOW IT WORKS */}
        <section className="mb-16">

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300/50">
            How It Works
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            From location to nearby people
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-4">

            {[
              ["01", "Authenticate", "The user signs in and receives an authentication token."],
              ["02", "Share Location", "The browser obtains the user's current geographic coordinates."],
              ["03", "Real-Time Processing", "Location updates are sent to the backend through WebSocket communication."],
              ["04", "Discover", "The backend finds relevant nearby users and sends their information back in real time."],
            ].map(([number, title, description]) => (
              <div
                key={number}
                className="rounded-[1.5rem] border border-white/[0.07] bg-white/[0.025] p-6"
              >
                <span className="text-xs font-black text-purple-300/40">
                  {number}
                </span>

                <h3 className="mt-8 text-lg font-bold">
                  {title}
                </h3>

                <p className="mt-2 text-xs leading-6 text-white/35">
                  {description}
                </p>
              </div>
            ))}

          </div>
        </section>


        {/* FRONTEND */}
        <section className="mb-16">

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-300/50">
            Frontend
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Modern React application
          </h2>

          <div className="mt-6 rounded-[2rem] border border-purple-400/10 bg-gradient-to-br from-purple-800/40 to-purple-950/40 p-7">

            <p className="text-sm leading-7 text-purple-100/45">
              The LOKOL frontend is built as a modern React single-page
              application focused on responsive UI, real-time communication
              and a highly interactive location experience.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

              {[
                "React",
                "JavaScript",
                "Vite",
                "React Router",
                "Tailwind CSS",
                "Zustand",
                "Fetch API",
                "WebSocket API",
                "Geolocation API",
                "Responsive UI",
              ].map((tech) => (
                <div
                  key={tech}
                  className="rounded-xl border border-purple-300/10 bg-purple-700/20 px-4 py-3 text-xs font-semibold text-purple-100/60"
                >
                  {tech}
                </div>
              ))}

            </div>

          </div>
        </section>


        {/* BACKEND */}
        <section className="mb-16">

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300/50">
            Backend
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            API-driven Python backend
          </h2>

          <div className="mt-6 rounded-[2rem] border border-emerald-400/10 bg-gradient-to-br from-emerald-800/40 to-emerald-950/40 p-7">

            <p className="text-sm leading-7 text-emerald-100/45">
              The backend is implemented using FastAPI and provides REST APIs,
              authentication, profile management, notes and real-time
              location communication.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

              {[
                "Python",
                "FastAPI",
                "Pydantic",
                "JWT Authentication",
                "MongoDB",
                "PyMongo",
                "Redis",
                "WebSockets",
                "gRPC",
                "SQLAlchemy",
              ].map((tech) => (
                <div
                  key={tech}
                  className="rounded-xl border border-emerald-300/10 bg-emerald-700/20 px-4 py-3 text-xs font-semibold text-emerald-100/60"
                >
                  {tech}
                </div>
              ))}

            </div>

          </div>
        </section>


        {/* REAL TIME */}
        <section className="mb-16">

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300/50">
            Real-Time Architecture
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Location updates through WebSockets
          </h2>

          <div className="mt-6 rounded-[2rem] border border-blue-400/10 bg-gradient-to-br from-blue-800/40 to-blue-950/40 p-7">

            <p className="text-sm leading-7 text-blue-100/45">
              LOKOL uses WebSockets for continuous communication between the
              browser and backend. Instead of repeatedly polling the server,
              the client maintains a persistent connection and sends location
              updates whenever the browser provides new coordinates.
            </p>

            <div className="mt-6 space-y-3 text-sm text-white/45">

              <p>
                <span className="font-bold text-white/70">
                  Browser →
                </span>{" "}
                Current latitude and longitude
              </p>

              <p>
                <span className="font-bold text-white/70">
                  WebSocket →
                </span>{" "}
                Backend real-time location service
              </p>

              <p>
                <span className="font-bold text-white/70">
                  Redis →
                </span>{" "}
                Fast location and presence operations
              </p>

              <p>
                <span className="font-bold text-white/70">
                  Backend →
                </span>{" "}
                Nearby users and their notes
              </p>

              <p>
                <span className="font-bold text-white/70">
                  WebSocket →
                </span>{" "}
                Real-time response to the client
              </p>

            </div>

          </div>
        </section>


        {/* DATABASE */}
        <section className="mb-16">

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-300/50">
            Data Layer
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Persistent data + fast real-time state
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">

            <div className="rounded-[2rem] border border-orange-400/10 bg-orange-900/20 p-7">

              <h3 className="text-xl font-bold">
                MongoDB
              </h3>

              <p className="mt-3 text-sm leading-7 text-orange-100/40">
                MongoDB stores application data such as users, credentials,
                profiles and user notes.
              </p>

            </div>

            <div className="rounded-[2rem] border border-red-400/10 bg-red-900/20 p-7">

              <h3 className="text-xl font-bold">
                Redis
              </h3>

              <p className="mt-3 text-sm leading-7 text-red-100/40">
                Redis is used for high-speed real-time operations such as
                location data, presence and temporary state.
              </p>

            </div>

          </div>
        </section>


        {/* AUTH & SECURITY */}
        <section className="mb-16">

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-300/50">
            Security
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Authentication and protected resources
          </h2>

          <div className="mt-6 rounded-[2rem] border border-red-400/10 bg-red-950/30 p-7">

            <div className="grid gap-4 md:grid-cols-2">

              {[
                ["JWT", "Token-based authentication for API requests."],
                ["Protected Routes", "Authenticated resources require a valid user token."],
                ["Dependency Injection", "FastAPI dependencies are used to resolve the current user."],
                ["Environment Variables", "Secrets and service configuration are kept outside application code."],
              ].map(([title, description]) => (
                <div key={title}>
                  <h3 className="font-bold text-red-100/80">
                    {title}
                  </h3>

                  <p className="mt-1 text-xs leading-6 text-red-100/35">
                    {description}
                  </p>
                </div>
              ))}

            </div>

          </div>
        </section>


        {/* CLOUDINARY */}
        <section className="mb-16">

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink-300/50">
            Media
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Cloud-based profile images
          </h2>

          <div className="mt-6 rounded-[2rem] border border-pink-400/10 bg-pink-950/25 p-7">

            <p className="text-sm leading-7 text-pink-100/40">
              Profile pictures are uploaded to Cloudinary rather than being
              stored directly on the application server. The backend stores
              the image URL and Cloudinary public ID in MongoDB, allowing old
              profile images to be removed when users replace or delete them.
            </p>

          </div>
        </section>


        {/* DEVOPS */}
        <section className="mb-16">

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300/50">
            DevOps & Infrastructure
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Production-oriented deployment
          </h2>

          <div className="mt-6 rounded-[2rem] border border-cyan-400/10 bg-gradient-to-br from-cyan-900/30 to-blue-950/30 p-7">

            <p className="text-sm leading-7 text-cyan-100/40">
              LOKOL is designed around a deployable backend infrastructure
              rather than running entirely from a local development machine.
              The application can be containerized and deployed on a Linux
              VPS/cloud VM environment.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

              {[
                "Ubuntu Linux",
                "Docker",
                "Docker Compose",
                "Nginx",
                "HTTPS / TLS",
                "Certbot",
                "Git",
                "GitHub",
                "Cloud VM / VPS",
                "Environment Configuration",
              ].map((tech) => (
                <div
                  key={tech}
                  className="rounded-xl border border-cyan-300/10 bg-cyan-700/10 px-4 py-3 text-xs font-semibold text-cyan-100/50"
                >
                  {tech}
                </div>
              ))}

            </div>

          </div>
        </section>


        {/* ARCHITECTURE */}
        <section className="mb-16">

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">
            Architecture
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            LOKOL system architecture
          </h2>

          <div className="mt-6 rounded-[2rem] border border-white/[0.07] bg-white/[0.025] p-7">

            <div className="space-y-4 text-sm text-white/40">

              <p>
                <strong className="text-white/70">Frontend</strong>
                {" → "}
                React + Vite + Tailwind CSS
              </p>

              <p>
                <strong className="text-white/70">Authentication</strong>
                {" → "}
                JWT-based authentication
              </p>

              <p>
                <strong className="text-white/70">REST API</strong>
                {" → "}
                FastAPI
              </p>

              <p>
                <strong className="text-white/70">Real-Time Layer</strong>
                {" → "}
                WebSockets
              </p>

              <p>
                <strong className="text-white/70">Fast State</strong>
                {" → "}
                Redis
              </p>

              <p>
                <strong className="text-white/70">Persistent Data</strong>
                {" → "}
                MongoDB
              </p>

              <p>
                <strong className="text-white/70">Media Storage</strong>
                {" → "}
                Cloudinary
              </p>

              <p>
                <strong className="text-white/70">Infrastructure</strong>
                {" → "}
                Linux VPS / Cloud VM + Docker + Nginx
              </p>

            </div>

          </div>
        </section>


        {/* TECH STACK */}
        <section className="mb-16">

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">
            Technology Stack
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Built with modern web technologies
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {[
              ["Frontend", "React, Vite, JavaScript, Tailwind CSS, React Router, Zustand"],
              ["Backend", "Python, FastAPI, Pydantic, JWT"],
              ["Database", "MongoDB, Redis"],
              ["Communication", "REST APIs, WebSockets, gRPC"],
              ["Media", "Cloudinary"],
              ["Infrastructure", "Ubuntu, Docker, Docker Compose"],
              ["Web Server", "Nginx, HTTPS, Certbot"],
              ["Development", "Git, GitHub, VS Code"],
            ].map(([title, stack]) => (
              <div
                key={title}
                className="rounded-[1.5rem] border border-white/[0.07] bg-white/[0.025] p-5"
              >

                <h3 className="font-bold">
                  {title}
                </h3>

                <p className="mt-2 text-xs leading-6 text-white/30">
                  {stack}
                </p>

              </div>
            ))}

          </div>
        </section>


        {/* FOOTER */}
        <footer className="border-t border-white/[0.06] pt-8">

          <p className="text-center text-xs text-white/20">
            LOKOL — Discover what is happening around you.
          </p>

          <p className="mt-2 text-center text-[10px] text-white/10">
            Built as a real-time location-based social platform.
          </p>

        </footer>

      </div>
    </div>
  );
}

export default AboutPage;