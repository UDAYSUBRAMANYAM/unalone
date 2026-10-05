import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuthStore from "../store/authStore";
import { connectLocationSocket } from "../api/LocationApi";

import UserCard from "../components/UserCard";
import MyUserCard from "../components/MyUserCard";

const API_URL = import.meta.env.VITE_APP_API_URL;


// ==================================================
// GET CURRENT USER NOTE
// ==================================================

async function getMyNote(token) {
  const response = await fetch(`${API_URL}/notes/my_note`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 404) {
    return {
      exists: false,
      note: null,
    };
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to get note");
  }

  const data = await response.json();

  return {
    exists: true,
    note: data.note ?? null,
  };
}


// ==================================================
// UPDATE / SAVE NOTE
// PUT ONLY
// ==================================================

async function saveUserNote(token, note) {
  const response = await fetch(`${API_URL}/notes/me`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      note,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to save note");
  }

  return response.json();
}


// ==================================================
// DELETE NOTE
// ==================================================

async function deleteUserNote(token) {
  const response = await fetch(`${API_URL}/notes/me`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to delete note");
  }

  return true;
}


// ==================================================
// LOCATION PAGE
// ==================================================

function LocationPage() {
  const navigate = useNavigate();

  const token = useAuthStore((state) => state.token);

  const username = useAuthStore(
    (state) => state.username || "You"
  );

  const [location, setLocation] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [myNote, setMyNote] = useState(null);

  const [status, setStatus] = useState(
    "Preparing location service..."
  );

  const [error, setError] = useState(null);


  // ==================================================
  // NOTE + LOCATION SERVICE
  // ==================================================

  useEffect(() => {
    if (!token) {
      setError("Authentication token not found.");
      setStatus("Authentication required");
      return;
    }

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setStatus("Location unavailable");
      return;
    }

    let ws = null;
    let watchId = null;
    let cancelled = false;


    // ==================================================
    // LOAD NOTE
    // ==================================================

    const initializeNote = async () => {
      try {
        setStatus("Checking your note...");

        const result = await getMyNote(token);

        if (cancelled) return false;

        setMyNote({
          note: result.note,
        });

        return true;

      } catch (err) {
        console.error("NOTE LOAD ERROR:", err);

        if (!cancelled) {
          setError("Could not check your note.");
          setStatus("Note service unavailable");
        }

        return false;
      }
    };


    // ==================================================
    // START LOCATION
    // ==================================================

    const startLocationService = async () => {
      const noteReady = await initializeNote();

      if (cancelled || !noteReady) {
        return;
      }

      setStatus("Connecting to location service...");

      ws = connectLocationSocket(token);


      // ==================================================
      // WEBSOCKET OPEN
      // ==================================================

      ws.onopen = () => {
        if (cancelled) return;

        setStatus("Location service connected");

        watchId = navigator.geolocation.watchPosition(
          (position) => {
            if (cancelled) return;

            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };

            setLocation(coords);

            if (
              ws &&
              ws.readyState === WebSocket.OPEN
            ) {
              ws.send(
                JSON.stringify({
                  lat: coords.latitude,
                  lng: coords.longitude,
                })
              );

              setStatus(
                "Location sent. Searching nearby users..."
              );
            }
          },

          (locationError) => {
            if (cancelled) return;

            console.error(
              "LOCATION ERROR:",
              locationError
            );

            setError(
              `${locationError.code}: ${locationError.message}`
            );

            setStatus("Unable to get location");
          },

          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      };


      // ==================================================
      // BACKEND RESPONSE
      // ==================================================

      ws.onmessage = (event) => {
        if (cancelled) return;

        try {
          const data = JSON.parse(event.data);

          if (data.type === "nearby_users") {
            const users = data.users || [];

            const normalizedUsers = users.map((user) => ({
              ...user,

              note:
                user.note === null ||
                user.note === undefined ||
                user.note === ""
                  ? null
                  : user.note,
            }));

            setNearbyUsers(normalizedUsers);
            setStatus("Location updated");
          }

        } catch (err) {
          console.error(
            "INVALID WEBSOCKET RESPONSE:",
            err
          );
        }
      };


      // ==================================================
      // WEBSOCKET ERROR
      // ==================================================

      ws.onerror = (event) => {
        if (cancelled) return;

        console.error("WEBSOCKET ERROR:", event);

        setError("WebSocket connection error.");
        setStatus("Connection error");
      };


      // ==================================================
      // WEBSOCKET CLOSED
      // ==================================================

      ws.onclose = (event) => {
        console.log(
          "WEBSOCKET DISCONNECTED:",
          event.code,
          event.reason
        );

        if (!cancelled) {
          setStatus(
            "Location service disconnected"
          );
        }
      };
    };


    startLocationService();


    // ==================================================
    // CLEANUP
    // ==================================================

    return () => {
      cancelled = true;

      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }

      if (ws) {
        if (
          ws.readyState === WebSocket.OPEN ||
          ws.readyState === WebSocket.CONNECTING
        ) {
          ws.close();
        }

        ws = null;
      }
    };

  }, [token]);


  // ==================================================
  // MAP POSITIONS
  // ==================================================

  const mapUsers = useMemo(() => {
    if (!nearbyUsers.length) {
      return [];
    }

    const points = nearbyUsers.map((user) => {
      const relative =
        user.relative_location ||
        user.relativeLocation ||
        user.location ||
        {
          lat:
            user.lat ??
            user.latitude ??
            0,

          lng:
            user.lng ??
            user.longitude ??
            0,
        };

      const lat = Number(
        relative.lat ??
        relative.latitude ??
        0
      );

      const lng = Number(
        relative.lng ??
        relative.longitude ??
        0
      );

      return {
        user,
        lat,
        lng,
      };
    });


    const maxDistance = Math.max(
      ...points.map(
        (point) =>
          Math.sqrt(
            point.lat * point.lat +
            point.lng * point.lng
          )
      ),
      0.00001
    );


    return points.map((point) => {
      const normalizedX =
        point.lng / maxDistance;

      const normalizedY =
        point.lat / maxDistance;

      const x = Math.max(
        12,
        Math.min(
          88,
          50 - normalizedX * 36
        )
      );

      const y = Math.max(
        16,
        Math.min(
          84,
          50 + normalizedY * 32
        )
      );

      return {
        ...point,
        x,
        y,
      };
    });

  }, [nearbyUsers]);


  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050508] text-white">

      {/* ==================================================
          BACKGROUND
      ================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div
          className="
            absolute
            left-[-10%]
            top-[-10%]
            h-[420px]
            w-[420px]
            rounded-full
            bg-purple-600/[0.08]
            blur-[130px]
          "
        />

        <div
          className="
            absolute
            right-[-10%]
            top-[20%]
            h-[420px]
            w-[420px]
            rounded-full
            bg-blue-600/[0.07]
            blur-[140px]
          "
        />

        <div
          className="
            absolute
            bottom-[-10%]
            left-[30%]
            h-[420px]
            w-[420px]
            rounded-full
            bg-emerald-500/[0.05]
            blur-[140px]
          "
        />

      </div>


      {/* ==================================================
          MAIN
      ================================================== */}

      <div
        className="
          relative
          mx-auto
          min-h-screen
          max-w-[1500px]
          px-4
          py-5
          sm:px-6
          lg:px-8
        "
      >

        {/* ==================================================
            HEADER
        ================================================== */}

        <header
          className="
            mb-5
            flex
            items-center
            justify-between
            rounded-[1.5rem]
            border
            border-white/[0.07]
            bg-white/[0.035]
            px-4
            py-3
            backdrop-blur-2xl
            shadow-[inset_3px_3px_8px_rgba(255,255,255,0.035),inset_-5px_-6px_12px_rgba(0,0,0,0.55),0_15px_40px_rgba(0,0,0,0.25)]
          "
        >

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() => navigate("/landing_page")}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.08]
                bg-white/[0.04]
                text-white/60
                transition-all
                hover:-translate-x-0.5
                hover:bg-white/[0.08]
                hover:text-white
              "
            >
              ←
            </button>

            <div>

              <div className="text-lg font-black tracking-tight text-white">
                LOKOL
              </div>

              <div
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.2em]
                  text-white/25
                "
              >
                Nearby
              </div>

            </div>

          </div>


          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-white/[0.08]
              bg-white/[0.04]
              px-3
              py-2
              text-xs
              font-semibold
              text-white/60
              transition-all
              hover:border-purple-400/20
              hover:bg-purple-400/[0.06]
              hover:text-white
            "
          >
            <span
              className="
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-lg
                bg-purple-500/[0.10]
                text-purple-300
              "
            >
              ◉
            </span>

            Profile
          </button>

        </header>


        {/* ==================================================
            STATUS
        ================================================== */}

        <div
          className="
            mb-5
            flex
            items-center
            gap-3
            rounded-2xl
            border
            border-white/[0.06]
            bg-white/[0.025]
            px-4
            py-3
            backdrop-blur-xl
          "
        >

          <span
            className={`
              h-2
              w-2
              rounded-full
              ${
                error
                  ? "bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.7)]"
                  : "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]"
              }
            `}
          />

          <span className="text-xs text-white/45">
            {status}
          </span>

          {nearbyUsers.length > 0 && (
            <span
              className="
                ml-auto
                text-[10px]
                font-medium
                text-white/25
              "
            >
              {nearbyUsers.length} nearby
            </span>
          )}

        </div>


        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div
            className="
              mb-5
              rounded-2xl
              border
              border-red-400/10
              bg-red-500/[0.05]
              px-4
              py-3
              text-xs
              text-red-300/75
            "
          >
            {error}
          </div>
        )}


        {/* ==================================================
            MAIN GRID
        ================================================== */}

        <main
          className="
            grid
            gap-5
            lg:grid-cols-[minmax(0,1fr)_380px]
          "
        >

          {/* ==================================================
              NEARBY AREA
          ================================================== */}

          <section className="min-w-0">

            <div
              className="
                relative
                min-h-[620px]
                overflow-hidden
                rounded-[2rem]
                border
                border-white/[0.08]
                bg-white/[0.025]
                backdrop-blur-2xl
                shadow-[inset_5px_5px_14px_rgba(255,255,255,0.035),inset_-7px_-8px_18px_rgba(0,0,0,0.65),0_25px_60px_rgba(0,0,0,0.30)]
              "
            >

              {/* ==================================================
                  AREA HEADER
              ================================================== */}

              <div
                className="
                  absolute
                  left-6
                  right-6
                  top-6
                  z-30
                  flex
                  items-start
                  justify-between
                "
              >

                <div>

                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.2em]
                      text-white/25
                    "
                  >
                    LOKOL Nearby
                  </p>

                  <h2
                    className="
                      mt-1
                      text-xl
                      font-bold
                      text-white/90
                    "
                  >
                    People around you
                  </h2>

                  <p
                    className="
                      mt-1
                      text-[11px]
                      text-white/25
                    "
                  >
                    Discover people nearby through their notes.
                  </p>

                </div>


                <div
                  className="
                    rounded-full
                    border
                    border-emerald-400/15
                    bg-emerald-400/[0.05]
                    px-3
                    py-1.5
                    text-[10px]
                    font-semibold
                    text-emerald-300/70
                  "
                >
                  {nearbyUsers.length} PEOPLE
                </div>

              </div>


              {/* ==================================================
                  LIGHT EFFECTS
              ================================================== */}

              <div
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-1/2
                  h-[420px]
                  w-[420px]
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-purple-500/[0.025]
                  blur-[100px]
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  bottom-[-100px]
                  left-[-80px]
                  h-[300px]
                  w-[300px]
                  rounded-full
                  bg-emerald-500/[0.025]
                  blur-[100px]
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  right-[-80px]
                  top-[20%]
                  h-[300px]
                  w-[300px]
                  rounded-full
                  bg-blue-500/[0.025]
                  blur-[100px]
                "
              />


              {/* ==================================================
                  NEARBY USERS
              ================================================== */}

              {mapUsers.map(({ user, x, y }) => (
                <div
                  key={
                    user.user_id ||
                    user.userid ||
                    user.id ||
                    user.username
                  }
                  className="
                    absolute
                    z-20
                    w-[190px]
                    -translate-x-1/2
                    -translate-y-1/2
                    transition-all
                    duration-700
                    ease-out
                  "
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                  }}
                >

                  <UserCard
                    username={
                      user.username ||
                      user.user_id ||
                      "LOKOL User"
                    }
                    note={user.note}
                  />

                </div>
              ))}


              {/* ==================================================
                  EMPTY STATE
              ================================================== */}

              {nearbyUsers.length === 0 && (
                <div
                  className="
                    absolute
                    bottom-16
                    left-1/2
                    z-20
                    -translate-x-1/2
                    whitespace-nowrap
                    rounded-full
                    border
                    border-white/[0.06]
                    bg-black/25
                    px-4
                    py-2
                    text-[10px]
                    text-white/30
                    backdrop-blur-xl
                  "
                >
                  Searching for people around you...
                </div>
              )}

            </div>

          </section>


          {/* ==================================================
              RIGHT SIDE
          ================================================== */}

          <aside
            className="
              flex
              min-w-0
              flex-col
              gap-4
            "
          >

            {/* ==================================================
                MY NOTE
            ================================================== */}

            <MyUserCard
              username={username}

              note={myNote?.note ?? null}

              noteExists={
                myNote?.note !== null &&
                myNote?.note !== undefined
              }

              onUpdate={async (note) => {
                const result =
                  await saveUserNote(
                    token,
                    note
                  );

                setMyNote({
                  note: result.note ?? note,
                });

                return result;
              }}

              onDelete={async () => {
                await deleteUserNote(token);

                setMyNote({
                  note: null,
                });
              }}
            />


            {/* ==================================================
                LOCATION INFORMATION
                MOVED ABOVE PEOPLE AROUND YOU
            ================================================== */}

            {location && (
              <div className="flex gap-2">

                <div
                  className="
                    flex-1
                    rounded-xl
                    border
                    border-white/[0.06]
                    bg-white/[0.025]
                    px-3
                    py-2
                    text-[10px]
                    text-white/30
                    backdrop-blur-xl
                  "
                >
                  LAT{" "}

                  <span className="text-white/55">
                    {location.latitude.toFixed(5)}
                  </span>
                </div>


                <div
                  className="
                    flex-1
                    rounded-xl
                    border
                    border-white/[0.06]
                    bg-white/[0.025]
                    px-3
                    py-2
                    text-[10px]
                    text-white/30
                    backdrop-blur-xl
                  "
                >
                  LNG{" "}

                  <span className="text-white/55">
                    {location.longitude.toFixed(5)}
                  </span>
                </div>

              </div>
            )}


            {/* ==================================================
                NEARBY HEADER
            ================================================== */}

            <div
              className="
                flex
                items-end
                justify-between
                px-1
              "
            >

              <div>

                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-white/20
                  "
                >
                  Nearby
                </p>

                <h2
                  className="
                    mt-1
                    text-lg
                    font-bold
                    text-white/80
                  "
                >
                  People around you
                </h2>

              </div>


              <span
                className="
                  rounded-full
                  border
                  border-purple-400/10
                  bg-purple-500/[0.05]
                  px-2.5
                  py-1
                  text-[10px]
                  text-purple-300/60
                "
              >
                {nearbyUsers.length}
              </span>

            </div>


            {/* ==================================================
                USER LIST
            ================================================== */}

            <div
              className="
                flex
                max-h-[620px]
                flex-col
                gap-3
                overflow-y-auto
                pr-1
                [scrollbar-width:thin]
                [scrollbar-color:rgba(255,255,255,0.08)_transparent]
              "
            >

              {nearbyUsers.length === 0 ? (

                <div
                  className="
                    rounded-[1.5rem]
                    border
                    border-white/[0.06]
                    bg-white/[0.025]
                    px-5
                    py-8
                    text-center
                    backdrop-blur-xl
                  "
                >

                  <div
                    className="
                      mx-auto
                      mb-3
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-2xl
                      bg-purple-500/[0.07]
                      text-xl
                    "
                  >
                    ◌
                  </div>

                  <p
                    className="
                      text-sm
                      font-medium
                      text-white/40
                    "
                  >
                    Nobody nearby yet
                  </p>

                  <p
                    className="
                      mt-1
                      text-[11px]
                      text-white/20
                    "
                  >
                    LOKOL is searching around you.
                  </p>

                </div>

              ) : (

                nearbyUsers.map((user, index) => (
                  <UserCard
                    key={
                      user.user_id ||
                      user.userid ||
                      user.id ||
                      `${user.username}-${index}`
                    }
                    username={
                      user.username ||
                      user.user_id ||
                      "LOKOL User"
                    }
                    note={user.note}
                  />
                ))

              )}

            </div>

          </aside>

        </main>

      </div>

    </div>
  );
}


export default LocationPage;