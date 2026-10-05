import { NavLink } from "react-router-dom";

function Navbar() {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Login", path: "/login" },
    { name: "Sign Up", path: "/signup" },
    { name: "Author", path: "/author" },
  ];

  return (
    <nav
      className="
        fixed
        left-1/2
        top-5
        z-50
        w-[calc(100%-2rem)]
        max-w-6xl
        -translate-x-1/2

        rounded-2xl

        border
        border-white/[0.08]

        bg-black/40
        backdrop-blur-2xl

        shadow-[
          inset_3px_3px_8px_rgba(255,255,255,0.035),
          inset_-5px_-6px_12px_rgba(0,0,0,0.65),
          0_20px_50px_rgba(0,0,0,0.3)
        ]
      "
    >
      <div
        className="
          flex
          items-center
          justify-between

          px-5
          py-3
        "
      >
        {/* Logo */}
        <NavLink
          to="/"
          className="
            text-lg
            font-black
            tracking-tight
            text-white
          "
        >
          LOKOL
        </NavLink>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `
                rounded-xl
                px-4
                py-2

                text-xs
                font-semibold

                transition-all
                duration-200

                ${
                  isActive
                    ? `
                      border
                      border-purple-400/15
                      bg-purple-700/30
                      text-purple-100
                      shadow-[inset_2px_2px_5px_rgba(255,255,255,0.08),inset_-3px_-3px_6px_rgba(0,0,0,0.6)]
                    `
                    : `
                      border
                      border-transparent
                      text-white/45
                      hover:bg-white/[0.05]
                      hover:text-white/80
                    `
                }
              `
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
