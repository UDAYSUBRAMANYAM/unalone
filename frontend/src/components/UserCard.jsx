function UserCard({ username, note }) {
  const colors = [
    {
      border: "border-emerald-400/10",
      gradient: "from-emerald-800/90 to-emerald-950",
      text: "text-emerald-100",
      iconBorder: "border-emerald-300/10",
      iconBg: "bg-emerald-700/40",
      shadow:
        "shadow-[inset_5px_5px_12px_rgba(255,255,255,0.1),inset_-7px_-8px_14px_rgba(0,0,0,0.75),0_25px_60px_rgba(16,185,129,0.08)]",
      icon: "⌖",
    },
    {
      border: "border-purple-400/10",
      gradient: "from-purple-800/90 to-purple-950",
      text: "text-purple-100",
      iconBorder: "border-purple-300/10",
      iconBg: "bg-purple-700/40",
      shadow:
        "shadow-[inset_5px_5px_12px_rgba(255,255,255,0.1),inset_-7px_-8px_14px_rgba(0,0,0,0.75),0_25px_60px_rgba(147,51,234,0.08)]",
      icon: "◉",
    },
    {
      border: "border-blue-400/10",
      gradient: "from-blue-800/90 to-blue-950",
      text: "text-blue-100",
      iconBorder: "border-blue-300/10",
      iconBg: "bg-blue-700/40",
      shadow:
        "shadow-[inset_5px_5px_12px_rgba(255,255,255,0.1),inset_-7px_-8px_14px_rgba(0,0,0,0.75),0_25px_60px_rgba(37,99,235,0.08)]",
      icon: "✦",
    },
    {
      border: "border-red-400/10",
      gradient: "from-red-800/90 to-red-950",
      text: "text-red-100",
      iconBorder: "border-red-300/10",
      iconBg: "bg-red-700/40",
      shadow:
        "shadow-[inset_5px_5px_12px_rgba(255,255,255,0.1),inset_-7px_-8px_14px_rgba(0,0,0,0.75),0_25px_60px_rgba(239,68,68,0.08)]",
      icon: "◆",
    },
  ];

  // Stable color based on username.
  // This prevents the card from randomly changing color on re-render.
  const colorIndex = username
    ? [...username].reduce(
        (sum, char) => sum + char.charCodeAt(0),
        0
      ) % colors.length
    : 0;

  const color = colors[colorIndex];

  return (
    <article
      className={`
        group
        w-full
        overflow-hidden

        rounded-[1.5rem]

        border
        ${color.border}

        bg-gradient-to-br
        ${color.gradient}

        p-4

        ${color.text}

        ${color.shadow}

        transition-all
        duration-300

        hover:-translate-y-1
      `}
    >

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex items-center gap-3">

        <div
          className={`
            flex
            h-10
            w-10
            shrink-0

            items-center
            justify-center

            rounded-xl

            border
            ${color.iconBorder}

            ${color.iconBg}

            text-sm

            ${color.shadow}
          `}
        >
          {color.icon}
        </div>


        <div className="min-w-0">

          <h3
            className="
              truncate
              text-sm
              font-bold
              text-white/90
            "
          >
            {username || "LOKOL User"}
          </h3>

          <p
            className="
              mt-0.5
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-white/30
            "
          >
            Nearby
          </p>

        </div>

      </div>


      {/* ==================================================
          NOTE
      ================================================== */}

      <div
        className="
          mt-4

          rounded-xl

          border
          border-white/[0.06]

          bg-black/[0.18]

          px-3
          py-3

          backdrop-blur-xl
        "
      >

        <p
          className="
            text-[11px]
            leading-relaxed
            text-white/65
          "
        >
          {note || "No note available"}
        </p>

      </div>

    </article>
  );
}

export default UserCard;
