import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050608] text-white">

      {/* =====================================================
          AMBIENT BACKGROUND
      ====================================================== */}

      {/* Emerald */}

      <div
        className="
          pointer-events-none
          absolute
          -left-52
          top-[-120px]
          h-[520px]
          w-[520px]
          rounded-full
          bg-emerald-950/50
          blur-[170px]
        "
      />

      {/* Purple */}

      <div
        className="
          pointer-events-none
          absolute
          right-[-180px]
          top-[5%]
          h-[520px]
          w-[520px]
          rounded-full
          bg-purple-950/50
          blur-[180px]
        "
      />

      {/* Blue */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-[-220px]
          left-[30%]
          h-[500px]
          w-[500px]
          rounded-full
          bg-blue-950/40
          blur-[180px]
        "
      />

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-screen
          w-full
          max-w-5xl
          flex-col
          px-5
          py-10
          sm:px-8
          sm:py-14
        "
      >

        {/* =================================================
            HEADER
        ================================================== */}

        <header className="mb-10 text-center sm:mb-14">

          {/* Logo */}

          <div
            className="
              mx-auto
              mb-6
              flex
              h-16
              w-16
              items-center
              justify-center

              rounded-[1.4rem]

              border
              border-emerald-400/20

              bg-gradient-to-br
              from-emerald-800
              via-emerald-900
              to-[#06130f]

              text-2xl
              font-black
              text-emerald-200

              shadow-[inset_5px_5px_10px_rgba(255,255,255,0.12),inset_-7px_-8px_14px_rgba(0,0,0,0.75),0_20px_45px_rgba(16,185,129,0.12)]
            "
          >
            L
          </div>

          {/* Small heading */}

          <p
            className="
              mb-3
              text-[10px]
              font-bold
              tracking-[0.4em]
              text-emerald-400/50
            "
          >
            YOUR LOCAL WORLD
          </p>

          <h1
            className="
              text-4xl
              font-black
              tracking-tight
              sm:text-5xl
            "
          >
            LOKOL
          </h1>

          <p
            className="
              mx-auto
              mt-4
              max-w-md
              text-sm
              leading-relaxed
              text-white/35
              sm:text-base
            "
          >
            Connect with people around you.
            Discover what's happening in your local world.
          </p>

        </header>

        {/* =================================================
            FEATURE CARDS
        ================================================== */}

        <main className="mx-auto w-full max-w-3xl space-y-5">

          {/* =================================================
              LOKOL FRIENDS — ACTIVE
          ================================================== */}

          <button
            className="
              group
              relative
              w-full
              overflow-hidden

              rounded-[2rem]

              border
              border-emerald-400/20

              bg-gradient-to-br
              from-emerald-950/70
              via-[#081411]/80
              to-[#050807]

              p-5
              text-left

              shadow-[inset_5px_5px_12px_rgba(255,255,255,0.055),inset_-8px_-9px_16px_rgba(0,0,0,0.75),0_25px_60px_rgba(0,0,0,0.35)]

              backdrop-blur-3xl

              transition-all
              duration-300

              hover:-translate-y-1
              hover:border-emerald-300/30

              hover:shadow-[inset_5px_5px_12px_rgba(255,255,255,0.07),inset_-8px_-9px_16px_rgba(0,0,0,0.75),0_30px_70px_rgba(16,185,129,0.10)]

              active:translate-y-0

              sm:p-6
            "
            onClick={() => navigate("/location")}
          >

            {/* Hover light */}

            <div
              className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-48
                w-48
                rounded-full
                bg-emerald-500/[0.07]
                blur-[70px]
                transition
                duration-500
                group-hover:bg-emerald-400/[0.12]
              "
            />

            <div className="relative flex items-center gap-5">

              {/* Icon */}

              <div
                className="
                  flex
                  h-16
                  w-16
                  shrink-0
                  items-center
                  justify-center

                  rounded-[1.3rem]

                  border
                  border-emerald-400/20

                  bg-gradient-to-br
                  from-emerald-800
                  to-emerald-950

                  text-2xl

                  shadow-[inset_4px_4px_8px_rgba(255,255,255,0.10),inset_-5px_-6px_10px_rgba(0,0,0,0.7),0_12px_25px_rgba(16,185,129,0.10)]

                  transition
                  duration-300

                  group-hover:scale-105
                "
              >
                📍
              </div>

              {/* Content */}

              <div className="min-w-0 flex-1">

                <div className="flex items-center gap-2">

                  <h2
                    className="
                      text-lg
                      font-bold
                      text-white
                      sm:text-xl
                    "
                  >
                    LOKOL Friends
                  </h2>

                  <span
                    className="
                      rounded-full
                      border
                      border-emerald-400/15
                      bg-emerald-400/[0.06]
                      px-2
                      py-0.5
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-emerald-300/70
                    "
                  >
                    Active
                  </span>

                </div>

                <p
                  className="
                    mt-1.5
                    max-w-xl
                    text-sm
                    leading-relaxed
                    text-white/35
                  "
                >
                  Connect to the location service and discover
                  people around you.
                </p>

                <span
                  className="
                    mt-3
                    inline-flex
                    items-center
                    gap-1.5
                    text-[11px]
                    font-medium
                    text-emerald-400/70
                  "
                >
                  <span className="text-emerald-400">
                    ●
                  </span>

                  Location service available
                </span>

              </div>

              {/* Arrow */}

              <div
                className="
                  hidden
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center

                  rounded-full

                  border
                  border-white/[0.07]

                  bg-white/[0.025]

                  text-lg
                  text-white/30

                  transition-all
                  duration-300

                  group-hover:translate-x-1
                  group-hover:border-emerald-400/20
                  group-hover:text-emerald-300/70

                  sm:flex
                "
              >
                →
              </div>

            </div>

          </button>

          {/* =================================================
              FRIENDS — DISABLED
          ================================================== */}

          <button
            className="
              group
              w-full

              cursor-not-allowed

              rounded-[2rem]

              border
              border-white/[0.06]

              bg-white/[0.025]

              p-5
              text-left

              opacity-60

              shadow-[inset_4px_4px_10px_rgba(255,255,255,0.025),inset_-6px_-7px_12px_rgba(0,0,0,0.6)]

              backdrop-blur-3xl

              sm:p-6
            "
            disabled
          >

            <div className="flex items-center gap-5">

              {/* Icon */}

              <div
                className="
                  flex
                  h-16
                  w-16
                  shrink-0
                  items-center
                  justify-center

                  rounded-[1.3rem]

                  border
                  border-purple-400/[0.08]

                  bg-gradient-to-br
                  from-purple-950
                  to-[#08060d]

                  text-2xl
                  grayscale-[0.3]

                  shadow-[inset_4px_4px_8px_rgba(255,255,255,0.04),inset_-5px_-6px_10px_rgba(0,0,0,0.7)]
                "
              >
                👥
              </div>

              {/* Content */}

              <div className="min-w-0 flex-1">

                <div className="flex items-center gap-2">

                  <h2 className="text-lg font-bold text-white/75 sm:text-xl">
                    Friends
                  </h2>

                  <span
                    className="
                      rounded-full
                      border
                      border-purple-400/10
                      bg-purple-400/[0.04]
                      px-2
                      py-0.5
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-purple-300/45
                    "
                  >
                    Soon
                  </span>

                </div>

                <p
                  className="
                    mt-1.5
                    text-sm
                    leading-relaxed
                    text-white/25
                  "
                >
                  Manage and connect with your LOKOL friends.
                </p>

                <span
                  className="
                    mt-3
                    inline-block
                    text-[11px]
                    font-medium
                    text-purple-300/35
                  "
                >
                  Coming soon
                </span>

              </div>

              <div
                className="
                  hidden
                  text-lg
                  text-white/10
                  sm:block
                "
              >
                →
              </div>

            </div>

          </button>

          {/* =================================================
              PROFILE — DISABLED
          ================================================== */}

          <button
            className="
              group
              w-full

              cursor-not-allowed

              rounded-[2rem]

              border
              border-white/[0.06]

              bg-white/[0.025]

              p-5
              text-left

              opacity-60

              shadow-[inset_4px_4px_10px_rgba(255,255,255,0.025),inset_-6px_-7px_12px_rgba(0,0,0,0.6)]

              backdrop-blur-3xl

              sm:p-6
            "
            disabled
          >

            <div className="flex items-center gap-5">

              {/* Icon */}

              <div
                className="
                  flex
                  h-16
                  w-16
                  shrink-0
                  items-center
                  justify-center

                  rounded-[1.3rem]

                  border
                  border-blue-400/[0.08]

                  bg-gradient-to-br
                  from-blue-950
                  to-[#05080d]

                  text-2xl
                  grayscale-[0.3]

                  shadow-[inset_4px_4px_8px_rgba(255,255,255,0.04),inset_-5px_-6px_10px_rgba(0,0,0,0.7)]
                "
              >
                👤
              </div>

              {/* Content */}

              <div className="min-w-0 flex-1">

                <div className="flex items-center gap-2">

                  <h2 className="text-lg font-bold text-white/75 sm:text-xl">
                    Profile
                  </h2>

                  <span
                    className="
                      rounded-full
                      border
                      border-blue-400/10
                      bg-blue-400/[0.04]
                      px-2
                      py-0.5
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-blue-300/45
                    "
                  >
                    Soon
                  </span>

                </div>

                <p
                  className="
                    mt-1.5
                    text-sm
                    leading-relaxed
                    text-white/25
                  "
                >
                  Manage your profile and personal information.
                </p>

                <span
                  className="
                    mt-3
                    inline-block
                    text-[11px]
                    font-medium
                    text-blue-300/35
                  "
                >
                  Coming soon
                </span>

              </div>

              <div
                className="
                  hidden
                  text-lg
                  text-white/10
                  sm:block
                "
              >
                →
              </div>

            </div>

          </button>

        </main>

        {/* =================================================
            FOOTER
        ================================================== */}

        <footer
          className="
            mt-auto
            pt-12
            text-center
          "
        >
          <p
            className="
              text-[10px]
              font-medium
              tracking-[0.25em]
              text-white/15
            "
          >
            LOKOL • CONNECT LOCALLY
          </p>
        </footer>

      </div>

    </div>
  );
}

export default LandingPage;
