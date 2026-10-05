function AuthorPage() {
  const author = {
    name: "DNVSS UDAY",
    role: "Software Engineer | Full-Stack Developer",
    email: import.meta.env.VITE_AUTHOR_EMAIL,
    github: import.meta.env.VITE_AUTHOR_GITHUB,
    linkedin: import.meta.env.VITE_AUTHOR_LINKEDIN,
    portfolio: import.meta.env.VITE_AUTHOR_PORTFOLIO,
  };

  const skillGroups = [
    {
      title: "Programming",
      color: "purple",
      skills: [
        "Python",
        "JavaScript",
        "C",
        "SQL",
      ],
    },
    {
      title: "Frontend",
      color: "blue",
      skills: [
        "React",
        "Vite",
        "HTML",
        "CSS",
        "Tailwind CSS",
        "React Router",
        "Zustand",
      ],
    },
    {
      title: "Backend",
      color: "emerald",
      skills: [
        "FastAPI",
        "Pydantic",
        "SQLAlchemy",
        "REST APIs",
        "JWT",
        "WebSockets",
        "gRPC",
        "Axios",
        "Fetch API",
      ],
    },
    {
      title: "Databases & Data",
      color: "orange",
      skills: [
        "MongoDB",
        "PyMongo",
        "Redis",
        "SQLite",
        "Pandas",
        "Excel",
      ],
    },
    {
      title: "Data Analytics",
      color: "cyan",
      skills: [
        "Power BI",
        "Tableau",
        "Looker Studio",
        "Data Visualization",
        "KPI Analysis",
      ],
    },
    {
      title: "DevOps & Infrastructure",
      color: "red",
      skills: [
        "Git",
        "GitHub",
        "Docker",
        "Docker Compose",
        "Linux",
        "Ubuntu",
        "Nginx",
        "HTTPS / TLS",
        "Certbot",
        "VPS",
        "Cloud VM",
        "Vercel",
        "AWS",
      ],
    },
    {
      title: "Cloud & Services",
      color: "pink",
      skills: [
        "Cloudinary",
        "Vercel",
        "Cloud Deployment",
        "Environment Configuration",
      ],
    },
  ];

  const projects = [
    {
      title: "LOKOL",
      type: "Real-Time Location-Based Social Platform",
      description:
        "A real-time platform that allows users to discover people around them through location-aware status notes.",
      stack:
        "React, Vite, Tailwind CSS, Zustand, FastAPI, MongoDB, Redis, WebSockets, JWT, gRPC, Cloudinary, Docker, Nginx",
      color: "purple",
    },
    {
      title: "Blog Post Management System",
      type: "Full-Stack Web Application",
      description:
        "A full-stack application for creating and managing blog posts with authentication and protected resources.",
      stack:
        "React, FastAPI, SQLAlchemy, JWT, SQLite",
      color: "blue",
    },
    {
      title: "Inventory Management System",
      type: "Full-Stack Application",
      description:
        "An application designed to manage inventory data through a web-based interface and backend APIs.",
      stack:
        "React, FastAPI, SQLAlchemy, SQLite",
      color: "emerald",
    },
    {
      title: "Supply Chain Analytics",
      type: "Business Intelligence Project",
      description:
        "A Power BI analytics project focused on supply-chain performance and operational KPIs.",
      stack:
        "Power BI, Excel, Data Analysis, KPI Visualization",
      color: "orange",
    },
  ];

  const colorMap = {
    purple: {
      border: "border-purple-400/10",
      bg: "bg-purple-800/20",
      icon: "bg-purple-700/40",
      text: "text-purple-100",
      muted: "text-purple-100/40",
    },
    blue: {
      border: "border-blue-400/10",
      bg: "bg-blue-800/20",
      icon: "bg-blue-700/40",
      text: "text-blue-100",
      muted: "text-blue-100/40",
    },
    emerald: {
      border: "border-emerald-400/10",
      bg: "bg-emerald-800/20",
      icon: "bg-emerald-700/40",
      text: "text-emerald-100",
      muted: "text-emerald-100/40",
    },
    orange: {
      border: "border-orange-400/10",
      bg: "bg-orange-800/20",
      icon: "bg-orange-700/40",
      text: "text-orange-100",
      muted: "text-orange-100/40",
    },
    cyan: {
      border: "border-cyan-400/10",
      bg: "bg-cyan-800/20",
      icon: "bg-cyan-700/40",
      text: "text-cyan-100",
      muted: "text-cyan-100/40",
    },
    red: {
      border: "border-red-400/10",
      bg: "bg-red-800/20",
      icon: "bg-red-700/40",
      text: "text-red-100",
      muted: "text-red-100/40",
    },
    pink: {
      border: "border-pink-400/10",
      bg: "bg-pink-800/20",
      icon: "bg-pink-700/40",
      text: "text-pink-100",
      muted: "text-pink-100/40",
    },
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white">

      {/* Background */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="
          absolute
          left-[-10%]
          top-[-10%]
          h-[420px]
          w-[420px]
          rounded-full
          bg-purple-600/[0.08]
          blur-[130px]
        " />

        <div className="
          absolute
          right-[-10%]
          top-[20%]
          h-[420px]
          w-[420px]
          rounded-full
          bg-blue-600/[0.07]
          blur-[140px]
        " />

        <div className="
          absolute
          bottom-[-10%]
          left-[30%]
          h-[420px]
          w-[420px]
          rounded-full
          bg-emerald-500/[0.05]
          blur-[140px]
        " />

      </div>


      <main className="
        relative
        mx-auto
        max-w-6xl
        px-5
        py-10
        sm:px-8
      ">

        {/* HERO */}

        <section className="mb-16">

          <p className="
            text-[10px]
            font-bold
            uppercase
            tracking-[0.25em]
            text-purple-300/50
          ">
            The Developer
          </p>

          <div className="
            mt-5
            flex
            flex-col
            gap-8
            md:flex-row
            md:items-end
            md:justify-between
          ">

            <div>

              <h1 className="
                text-4xl
                font-black
                tracking-tight
                sm:text-6xl
              ">
                {author.name}
              </h1>

              <p className="
                mt-4
                text-lg
                text-white/40
              ">
                {author.role}
              </p>

              <p className="
                mt-6
                max-w-2xl
                text-sm
                leading-7
                text-white/35
              ">
                Software engineer focused on building modern,
                scalable and real-time applications across the
                frontend, backend and infrastructure layers.
              </p>

            </div>


            <div className="
              flex
              h-24
              w-24
              shrink-0
              items-center
              justify-center
              rounded-[2rem]
              border
              border-purple-400/10
              bg-gradient-to-br
              from-purple-800/90
              to-purple-950
              text-3xl
              font-black
              text-purple-100
              shadow-[
                inset_5px_5px_12px_rgba(255,255,255,0.1),
                inset_-7px_-8px_14px_rgba(0,0,0,0.75)
              ]
            ">
              U
            </div>

          </div>

        </section>


        {/* ABOUT */}

        <section className="mb-16">

          <div className="
            rounded-[2rem]
            border
            border-white/[0.07]
            bg-white/[0.025]
            p-7
            backdrop-blur-2xl
          ">

            <p className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-white/20
            ">
              About
            </p>

            <h2 className="
              mt-2
              text-2xl
              font-bold
            ">
              Building from idea to deployment
            </h2>

            <p className="
              mt-5
              max-w-4xl
              text-sm
              leading-7
              text-white/40
            ">
              I work across the full software development lifecycle —
              from designing interfaces and APIs to databases,
              real-time communication, authentication, cloud services
              and deployment infrastructure.
            </p>

            <p className="
              mt-4
              max-w-4xl
              text-sm
              leading-7
              text-white/40
            ">
              My current work combines React-based frontend
              development with Python backend engineering,
              real-time systems, databases and DevOps practices.
              LOKOL is one of the projects where these technologies
              come together into a single production-oriented system.
            </p>

          </div>

        </section>


        {/* SKILLS */}

        <section className="mb-16">

          <p className="
            text-[10px]
            font-bold
            uppercase
            tracking-[0.2em]
            text-white/20
          ">
            Skills
          </p>

          <h2 className="
            mt-2
            text-2xl
            font-bold
          ">
            Technical expertise
          </h2>

          <div className="
            mt-6
            grid
            gap-4
            sm:grid-cols-2
          ">

            {skillGroups.map((group) => {

              const colors = colorMap[group.color];

              return (
                <div
                  key={group.title}
                  className={`
                    rounded-[2rem]
                    border
                    ${colors.border}
                    ${colors.bg}
                    p-6
                  `}
                >

                  <div className="
                    flex
                    items-center
                    gap-3
                  ">

                    <div className={`
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      border
                      ${colors.border}
                      ${colors.icon}
                      text-sm
                      shadow-[inset_2px_2px_5px_rgba(255,255,255,0.12),inset_-3px_-3px_6px_rgba(0,0,0,0.6)]
                    `}>
                      ✦
                    </div>

                    <h3 className={`
                      text-lg
                      font-bold
                      ${colors.text}
                    `}>
                      {group.title}
                    </h3>

                  </div>


                  <div className="
                    mt-5
                    flex
                    flex-wrap
                    gap-2
                  ">

                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className={`
                          rounded-lg
                          border
                          ${colors.border}
                          bg-black/20
                          px-3
                          py-1.5
                          text-[10px]
                          font-semibold
                          ${colors.muted}
                        `}
                      >
                        {skill}
                      </span>
                    ))}

                  </div>

                </div>
              );
            })}

          </div>

        </section>


        {/* PROJECTS */}

        <section className="mb-16">

          <p className="
            text-[10px]
            font-bold
            uppercase
            tracking-[0.2em]
            text-white/20
          ">
            Selected Work
          </p>

          <h2 className="
            mt-2
            text-2xl
            font-bold
          ">
            Projects
          </h2>

          <div className="
            mt-6
            grid
            gap-4
            md:grid-cols-2
          ">

            {projects.map((project) => {

              const colors = colorMap[project.color];

              return (
                <article
                  key={project.title}
                  className={`
                    rounded-[2rem]
                    border
                    ${colors.border}
                    ${colors.bg}
                    p-7
                    transition
                    hover:-translate-y-1
                  `}
                >

                  <div className={`
                    inline-flex
                    rounded-full
                    border
                    ${colors.border}
                    bg-black/20
                    px-3
                    py-1
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-wider
                    ${colors.muted}
                  `}>
                    {project.type}
                  </div>

                  <h3 className="
                    mt-5
                    text-2xl
                    font-bold
                  ">
                    {project.title}
                  </h3>

                  <p className="
                    mt-3
                    text-sm
                    leading-6
                    text-white/35
                  ">
                    {project.description}
                  </p>

                  <p className="
                    mt-5
                    text-[10px]
                    leading-5
                    text-white/20
                  ">
                    {project.stack}
                  </p>

                </article>
              );
            })}

          </div>

        </section>


        {/* CONTACT */}

        <section className="mb-10">

          <div className="
            rounded-[2rem]
            border
            border-white/[0.07]
            bg-white/[0.025]
            p-7
          ">

            <p className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-white/20
            ">
              Contact
            </p>

            <h2 className="
              mt-2
              text-2xl
              font-bold
            ">
              Let's connect
            </h2>

            <p className="
              mt-3
              text-sm
              text-white/35
            ">
              Interested in the project, collaboration or opportunities?
            </p>


            <div className="
              mt-7
              flex
              flex-wrap
              gap-3
            ">

              {author.email && (
                <a
                  href={`mailto:${author.email}`}
                  className="
                    rounded-xl
                    border
                    border-purple-400/10
                    bg-purple-700/20
                    px-4
                    py-3
                    text-xs
                    font-semibold
                    text-purple-100/60
                    transition
                    hover:bg-purple-700/30
                    hover:text-purple-100
                  "
                >
                  Email
                </a>
              )}

              {author.github && (
                <a
                  href={author.github}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    rounded-xl
                    border
                    border-white/[0.08]
                    bg-white/[0.04]
                    px-4
                    py-3
                    text-xs
                    font-semibold
                    text-white/50
                    transition
                    hover:bg-white/[0.08]
                    hover:text-white
                  "
                >
                  GitHub
                </a>
              )}

              {author.linkedin && (
                <a
                  href={author.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    rounded-xl
                    border
                    border-blue-400/10
                    bg-blue-700/20
                    px-4
                    py-3
                    text-xs
                    font-semibold
                    text-blue-100/60
                    transition
                    hover:bg-blue-700/30
                    hover:text-blue-100
                  "
                >
                  LinkedIn
                </a>
              )}

              {author.portfolio && (
                <a
                  href={author.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    rounded-xl
                    border
                    border-emerald-400/10
                    bg-emerald-700/20
                    px-4
                    py-3
                    text-xs
                    font-semibold
                    text-emerald-100/60
                    transition
                    hover:bg-emerald-700/30
                    hover:text-emerald-100
                  "
                >
                  Portfolio
                </a>
              )}

            </div>

          </div>

        </section>


        <footer className="
          border-t
          border-white/[0.06]
          pt-7
          text-center
        ">
          <p className="text-xs text-white/20">
            Built by {author.name}
          </p>

          <p className="mt-1 text-[10px] text-white/10">
            LOKOL · Full-Stack · Real-Time · Cloud · DevOps
          </p>
        </footer>

      </main>
    </div>
  );
}

export default AuthorPage;