import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050608] text-white">

      {/* =====================================================
          AMBIENT LIGHT
      ===================================================== */}

      <div className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-emerald-950/70 blur-[150px]" />

      <div className="pointer-events-none absolute right-[-150px] top-20 h-[500px] w-[500px] rounded-full bg-purple-950/70 blur-[160px]" />

      <div className="pointer-events-none absolute bottom-[-200px] left-[30%] h-[500px] w-[500px] rounded-full bg-blue-950/70 blur-[170px]" />

      <div className="pointer-events-none absolute left-[45%] top-[35%] h-72 w-72 rounded-full bg-violet-950/40 blur-[150px]" />

      {/* subtle ambient light spots */}

      <div className="
        pointer-events-none
        absolute left-[18%] top-[18%]
        h-32 w-32
        rounded-full
        bg-emerald-500/10
        blur-[70px]
      " />

      <div className="
        pointer-events-none
        absolute right-[20%] top-[55%]
        h-40 w-40
        rounded-full
        bg-violet-500/10
        blur-[80px]
      " />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-5 sm:px-8">

        {/* =================================================
            NAVBAR
        ================================================= */}

        <nav className="
          flex items-center justify-between

          rounded-[26px]

          border
          border-white/[0.09]

          bg-white/[0.035]

          px-5
          py-3

          shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.35),0_25px_70px_rgba(0,0,0,0.35)]

          backdrop-blur-3xl
        ">

          {/* Logo */}

          <Link
            to="/"
            className="flex items-center gap-3"
          >

            <div className="
              relative
              flex h-9 w-9
              items-center justify-center

              rounded-xl

              border
              border-emerald-300/20

              bg-gradient-to-br
              from-emerald-800
              to-emerald-950

              text-sm
              font-black
              text-emerald-200

              shadow-[inset_2px_2px_5px_rgba(255,255,255,0.12),inset_-3px_-4px_7px_rgba(0,0,0,0.65),0_8px_25px_rgba(16,185,129,0.12)]
            ">
              L
            </div>

            <span className="
              text-xl
              font-bold
              tracking-tight
            ">
              LOKOL
            </span>

          </Link>

          {/* Navigation */}

          <div className="flex items-center gap-2 sm:gap-4">

            <Link
              to="/login"
              className="
                rounded-xl
                px-4 py-2.5

                text-sm
                font-medium

                text-white/55

                transition

                hover:bg-white/[0.05]
                hover:text-white
              "
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="
                rounded-2xl

                border
                border-emerald-400/20

                bg-gradient-to-br
                from-emerald-800
                to-emerald-950

                px-4
                py-2.5

                text-sm
                font-bold
                text-emerald-100

                shadow-[inset_2px_2px_5px_rgba(255,255,255,0.12),inset_-4px_-5px_8px_rgba(0,0,0,0.65),0_10px_30px_rgba(16,185,129,0.12)]

                transition

                hover:-translate-y-0.5

                hover:border-emerald-300/30
              "
            >
              Sign Up
            </Link>

          </div>

        </nav>

        {/* =================================================
            HERO
        ================================================= */}

        <section className="
          grid
          min-h-[700px]
          items-center
          gap-16
          py-20

          lg:grid-cols-2
        ">

          {/* HERO CONTENT */}

          <div className="max-w-2xl">

            {/* Badge */}

            <div className="
              mb-7
              inline-flex
              items-center
              gap-2

              rounded-full

              border
              border-white/[0.09]

              bg-white/[0.035]

              px-4
              py-2

              text-xs
              font-medium
              text-white/50

              shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]

              backdrop-blur-2xl
            ">

              <span className="
                h-1.5
                w-1.5
                rounded-full

                bg-emerald-400

                shadow-[0_0_12px_rgba(52,211,153,0.8)]
              " />

              Discover people around you

            </div>

            {/* Heading */}

            <h1 className="
              text-6xl

              font-black

              leading-[0.92]

              tracking-[-0.055em]

              sm:text-7xl

              lg:text-8xl
            ">

              Your world is

              <span className="
                mt-2
                block

                bg-gradient-to-r
                from-emerald-500
                via-purple-500
                to-blue-500

                bg-clip-text

                text-transparent
              ">
                closer.
              </span>

            </h1>

            {/* Description */}

            <p className="
              mt-8

              max-w-xl

              text-base

              leading-7

              text-white/40

              sm:text-lg
            ">
              LOKOL is a location-based social space that
              helps you discover people around you, share
              your status, and connect with what's happening
              nearby.
            </p>

            {/* CTA */}

            <div className="
              mt-9
              flex
              flex-wrap
              items-center
              gap-4
            ">

              <Link
                to="/signup"
                className="
                  group

                  flex
                  items-center
                  gap-3

                  rounded-2xl

                  border
                  border-emerald-400/20

                  bg-gradient-to-br
                  from-emerald-800
                  to-emerald-950

                  px-6
                  py-4

                  font-bold
                  text-emerald-100

                  shadow-[inset_3px_3px_7px_rgba(255,255,255,0.12),inset_-5px_-6px_10px_rgba(0,0,0,0.7),0_18px_40px_rgba(16,185,129,0.14)]

                  transition

                  hover:-translate-y-1

                  hover:border-emerald-300/30

                  hover:shadow-[inset_3px_3px_7px_rgba(255,255,255,0.15),inset_-5px_-6px_10px_rgba(0,0,0,0.7),0_22px_50px_rgba(16,185,129,0.2)]
                "
              >

                Get Started

                <span className="
                  text-lg
                  transition-transform
                  group-hover:translate-x-1
                ">
                  →
                </span>

              </Link>

              <Link
                to="/login"
                className="
                  rounded-2xl

                  border
                  border-white/[0.09]

                  bg-white/[0.035]

                  px-6
                  py-4

                  text-sm
                  font-medium

                  text-white/55

                  shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]

                  backdrop-blur-2xl

                  transition

                  hover:bg-white/[0.07]
                  hover:text-white
                "
              >
                I already have an account
              </Link>

            </div>

            {/* Small information */}

            <div className="
              mt-8
              flex
              items-center
              gap-3

              text-xs
              text-white/25
            ">

              <div className="flex -space-x-2">

                <div className="
                  h-7
                  w-7
                  rounded-full

                  border-2
                  border-[#050608]

                  bg-emerald-800

                  shadow-[inset_1px_1px_3px_rgba(255,255,255,0.15)]
                " />

                <div className="
                  h-7
                  w-7
                  rounded-full

                  border-2
                  border-[#050608]

                  bg-purple-900

                  shadow-[inset_1px_1px_3px_rgba(255,255,255,0.15)]
                " />

                <div className="
                  h-7
                  w-7
                  rounded-full

                  border-2
                  border-[#050608]

                  bg-blue-900

                  shadow-[inset_1px_1px_3px_rgba(255,255,255,0.15)]
                " />

              </div>

              <span>
                Built for real-world connections.
              </span>

            </div>

          </div>

          {/* =================================================
              RADAR GLASS CARD
          ================================================= */}

          <div className="
            relative
            flex
            items-center
            justify-center
          ">

            {/* Outer glow */}

            <div className="
              pointer-events-none
              absolute

              h-96
              w-96

              rounded-full

              bg-purple-600/10

              blur-[100px]
            " />

            {/* Glass card */}

            <div className="
              relative

              w-full
              max-w-lg

              rotate-2

              rounded-[2.5rem]

              border
              border-white/[0.10]

              bg-white/[0.035]

              p-5

              shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.4),0_35px_100px_rgba(0,0,0,0.5)]

              backdrop-blur-[35px]

              transition
              duration-500

              hover:rotate-0
            ">

              {/* Inner glass */}

              <div className="
                rounded-[2rem]

                border
                border-white/[0.06]

                bg-black/20

                p-5

                shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]

                backdrop-blur-2xl
              ">

                {/* Header */}

                <div className="
                  flex
                  items-center
                  justify-between
                ">

                  <div>

                    <p className="
                      text-[10px]
                      font-bold
                      tracking-[0.2em]
                      text-white/25
                    ">
                      LOKOL RADAR
                    </p>

                    <h2 className="
                      mt-1
                      text-xl
                      font-bold
                    ">
                      People nearby
                    </h2>

                  </div>

                  <div className="
                    flex
                    items-center
                    gap-2

                    rounded-full

                    border
                    border-emerald-400/10

                    bg-emerald-500/5

                    px-3
                    py-1.5

                    text-[10px]
                    font-bold
                    text-emerald-400
                  ">

                    <span className="
                      h-1.5
                      w-1.5
                      rounded-full

                      bg-emerald-400

                      shadow-[0_0_10px_rgba(52,211,153,0.8)]
                    " />

                    LIVE

                  </div>

                </div>

                {/* Radar */}

                <div className="
                  relative

                  mx-auto
                  my-10

                  flex

                  h-80
                  w-80

                  items-center
                  justify-center
                ">

                  {/* Rings */}

                  <div className="
                    absolute

                    h-32
                    w-32

                    rounded-full

                    border
                    border-emerald-400/10

                    bg-emerald-400/[0.015]

                    shadow-[inset_0_0_30px_rgba(16,185,129,0.04)]
                  " />

                  <div className="
                    absolute

                    h-52
                    w-52

                    rounded-full

                    border
                    border-purple-400/10

                    bg-purple-400/[0.01]
                  " />

                  <div className="
                    absolute

                    h-72
                    w-72

                    rounded-full

                    border
                    border-blue-400/10
                  " />

                  {/* Center clay */}

                  <div className="
                    relative
                    z-10

                    flex
                    h-16
                    w-16

                    items-center
                    justify-center

                    rounded-2xl

                    border
                    border-emerald-400/20

                    bg-gradient-to-br
                    from-emerald-700
                    to-emerald-950

                    text-[10px]
                    font-black
                    text-emerald-200

                    shadow-[inset_3px_3px_7px_rgba(255,255,255,0.13),inset_-5px_-6px_10px_rgba(0,0,0,0.75),0_15px_35px_rgba(16,185,129,0.18)]
                  ">
                    YOU
                  </div>

                  {/* Green clay user */}

                  <div className="
                    absolute
                    left-10
                    top-24

                    flex
                    h-12
                    w-12

                    items-center
                    justify-center

                    rounded-2xl

                    border
                    border-emerald-400/20

                    bg-gradient-to-br
                    from-emerald-700
                    to-emerald-950

                    text-sm
                    font-bold
                    text-emerald-200

                    shadow-[inset_3px_3px_6px_rgba(255,255,255,0.12),inset_-4px_-4px_8px_rgba(0,0,0,0.75),0_10px_25px_rgba(16,185,129,0.12)]
                  ">
                    U
                  </div>

                  {/* Purple clay user */}

                  <div className="
                    absolute
                    right-12
                    top-14

                    flex
                    h-12
                    w-12

                    items-center
                    justify-center

                    rounded-2xl

                    border
                    border-purple-400/20

                    bg-gradient-to-br
                    from-purple-700
                    to-purple-950

                    text-sm
                    font-bold
                    text-purple-200

                    shadow-[inset_3px_3px_6px_rgba(255,255,255,0.12),inset_-4px_-4px_8px_rgba(0,0,0,0.75),0_10px_25px_rgba(147,51,234,0.14)]
                  ">
                    A
                  </div>

                  {/* Blue clay user */}

                  <div className="
                    absolute
                    bottom-12
                    left-20

                    flex
                    h-12
                    w-12

                    items-center
                    justify-center

                    rounded-2xl

                    border
                    border-blue-400/20

                    bg-gradient-to-br
                    from-blue-700
                    to-blue-950

                    text-sm
                    font-bold
                    text-blue-200

                    shadow-[inset_3px_3px_6px_rgba(255,255,255,0.12),inset_-4px_-4px_8px_rgba(0,0,0,0.75),0_10px_25px_rgba(37,99,235,0.14)]
                  ">
                    R
                  </div>

                  {/* Violet clay user */}

                  <div className="
                    absolute
                    bottom-16
                    right-12

                    flex
                    h-12
                    w-12

                    items-center
                    justify-center

                    rounded-2xl

                    border
                    border-violet-400/20

                    bg-gradient-to-br
                    from-violet-700
                    to-violet-950

                    text-sm
                    font-bold
                    text-violet-200

                    shadow-[inset_3px_3px_6px_rgba(255,255,255,0.12),inset_-4px_-4px_8px_rgba(0,0,0,0.75),0_10px_25px_rgba(124,58,237,0.14)]
                  ">
                    S
                  </div>

                </div>

                {/* Bottom glass */}

                <div className="
                  flex
                  items-center
                  justify-between

                  rounded-2xl

                  border
                  border-white/[0.07]

                  bg-white/[0.025]

                  px-4
                  py-3

                  shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]

                  backdrop-blur-xl
                ">

                  <div>

                    <p className="
                      text-lg
                      font-bold
                    ">
                      12
                    </p>

                    <p className="
                      text-xs
                      text-white/25
                    ">
                      people nearby
                    </p>

                  </div>

                  <div className="
                    rounded-xl

                    border
                    border-white/[0.06]

                    bg-white/[0.035]

                    px-3
                    py-2

                    text-xs
                    text-white/35
                  ">
                    Live location
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            FEATURES
        ================================================= */}

        <section className="pb-24">

          <div className="mb-10">

            <p className="
              text-[10px]
              font-bold
              tracking-[0.25em]
              text-white/25
            ">
              WHY LOKOL
            </p>

            <h2 className="
              mt-3

              max-w-xl

              text-4xl
              font-bold

              tracking-tight

              sm:text-5xl
            ">
              What's happening

              <span className="text-white/25">
                {" "}around you?
              </span>
            </h2>

          </div>

          <div className="
            grid
            gap-5

            md:grid-cols-3
          ">

            {/* Emerald clay */}

            <div className="
              group

              rounded-[2rem]

              border
              border-emerald-400/10

              bg-gradient-to-br
              from-emerald-800/90
              to-emerald-950

              p-7

              text-emerald-100

              shadow-[inset_5px_5px_12px_rgba(255,255,255,0.1),inset_-7px_-8px_14px_rgba(0,0,0,0.75),0_25px_60px_rgba(16,185,129,0.08)]

              transition

              hover:-translate-y-2
              hover:border-emerald-400/20
            ">

              <div className="
                mb-12

                flex
                h-12
                w-12

                items-center
                justify-center

                rounded-2xl

                border
                border-emerald-300/10

                bg-emerald-700/40

                text-lg

                shadow-[inset_2px_2px_5px_rgba(255,255,255,0.12),inset_-3px_-3px_6px_rgba(0,0,0,0.6)]
              ">
                ⌖
              </div>

              <h3 className="text-2xl font-bold">
                Discover Nearby
              </h3>

              <p className="
                mt-3

                text-sm
                leading-6

                text-emerald-100/45
              ">
                Find people around your location and
                discover what's happening nearby.
              </p>

            </div>

            {/* Purple clay */}

            <div className="
              group

              rounded-[2rem]

              border
              border-purple-400/10

              bg-gradient-to-br
              from-purple-800/90
              to-purple-950

              p-7

              text-purple-100

              shadow-[inset_5px_5px_12px_rgba(255,255,255,0.1),inset_-7px_-8px_14px_rgba(0,0,0,0.75),0_25px_60px_rgba(147,51,234,0.08)]

              transition

              hover:-translate-y-2
              hover:border-purple-400/20
            ">

              <div className="
                mb-12

                flex
                h-12
                w-12

                items-center
                justify-center

                rounded-2xl

                border
                border-purple-300/10

                bg-purple-700/40

                text-lg

                shadow-[inset_2px_2px_5px_rgba(255,255,255,0.12),inset_-3px_-3px_6px_rgba(0,0,0,0.6)]
              ">
                ◉
              </div>

              <h3 className="text-2xl font-bold">
                Share Your Status
              </h3>

              <p className="
                mt-3

                text-sm
                leading-6

                text-purple-100/45
              ">
                Leave a note and let people nearby know
                what you're doing.
              </p>

            </div>

            {/* Blue clay */}

            <div className="
              group

              rounded-[2rem]

              border
              border-blue-400/10

              bg-gradient-to-br
              from-blue-800/90
              to-blue-950

              p-7

              text-blue-100

              shadow-[inset_5px_5px_12px_rgba(255,255,255,0.1),inset_-7px_-8px_14px_rgba(0,0,0,0.75),0_25px_60px_rgba(37,99,235,0.08)]

              transition

              hover:-translate-y-2
              hover:border-blue-400/20
            ">

              <div className="
                mb-12

                flex
                h-12
                w-12

                items-center
                justify-center

                rounded-2xl

                border
                border-blue-300/10

                bg-blue-700/40

                text-lg

                shadow-[inset_2px_2px_5px_rgba(255,255,255,0.12),inset_-3px_-3px_6px_rgba(0,0,0,0.6)]
              ">
                ✦
              </div>

              <h3 className="text-2xl font-bold">
                Connect Locally
              </h3>

              <p className="
                mt-3

                text-sm
                leading-6

                text-blue-100/45
              ">
                Turn the people around you into meaningful
                local connections.
              </p>

            </div>

          </div>

        </section>

        {/* =================================================
            CTA
        ================================================= */}

        <section className="
          mb-10

          flex
          flex-col

          items-start
          justify-between

          gap-8

          rounded-[2rem]

          border
          border-white/[0.08]

          bg-white/[0.035]

          p-8

          shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.4),0_30px_80px_rgba(0,0,0,0.4)]

          backdrop-blur-3xl

          sm:p-10

          md:flex-row
          md:items-center
        ">

          <div>

            <p className="
              text-[10px]
              font-bold
              tracking-[0.25em]
              text-white/25
            ">
              READY?
            </p>

            <h2 className="
              mt-3

              text-3xl
              font-bold

              tracking-tight

              sm:text-4xl
            ">
              Start discovering

              <span className="text-white/25">
                {" "}your LOKOL.
              </span>
            </h2>

            <p className="
              mt-3

              text-sm
              text-white/30
            ">
              Create your account and see who's around you.
            </p>

          </div>

          <Link
            to="/signup"
            className="
              flex
              shrink-0
              items-center
              gap-3

              rounded-2xl

              border
              border-emerald-400/20

              bg-gradient-to-br
              from-emerald-800
              to-emerald-950

              px-6
              py-4

              font-bold
              text-emerald-100

              shadow-[inset_3px_3px_7px_rgba(255,255,255,0.12),inset_-5px_-6px_10px_rgba(0,0,0,0.7),0_15px_35px_rgba(16,185,129,0.14)]

              transition

              hover:-translate-y-1
            "
          >
            Create Account
            <span>→</span>
          </Link>

        </section>

        {/* Footer */}

        <footer className="
          flex
          flex-col

          items-center
          justify-between

          gap-3

          border-t
          border-white/[0.05]

          py-8

          text-xs
          text-white/20

          sm:flex-row
        ">

          <span>
            © 2026 LOKOL
          </span>

          <span>
            Discover locally. Connect naturally.
          </span>

        </footer>

      </div>
    </div>
  );
}

export default HomePage;
