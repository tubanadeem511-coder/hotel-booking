import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { supabase } from "./supabase.js";

const C = createContext();

export const useStore = () => useContext(C);

const ld = (k, d) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? d;
  } catch {
    return d;
  }
};

const sv = (k, v) => localStorage.setItem(k, JSON.stringify(v));

const today = (n = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export const nights = (a, b) =>
  Math.round((new Date(b) - new Date(a)) / 864e5);

export function Store({ children }) {
  const [user, setUser] = useState(ld("sy_user", null));

  const [search, setSearch] = useState(
    ld("sy_search", {
      dest: "",
      cin: today(7),
      cout: today(9),
      adults: 2,
      children: 0,
      rooms: 1,
      work: false,
    })
  );

  const [favs, setFavs] = useState(ld("sy_favs", []));

  const [bookings, setBookings] = useState(
    ld("sy_bookings", [])
  );

  const [toast, setToast] = useState(null);
  const [pending, setPending] = useState(null);

  const notify = useCallback((m, t = "ok") => {
    setToast({ m, t });
    setTimeout(() => setToast(null), 3200);
  }, []);

  /* --------------------------------
     LOCAL STORAGE
  -------------------------------- */

  useEffect(() => {
    sv("sy_search", search);
  }, [search]);

  useEffect(() => {
    sv("sy_favs", favs);
  }, [favs]);

  useEffect(() => {
    sv("sy_bookings", bookings);
  }, [bookings]);

  useEffect(() => {
    sv("sy_user", user);
  }, [user]);

  /* --------------------------------
     GET CURRENT SUPABASE USER
  -------------------------------- */

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;

      if (u) {
        setUser({
          id: u.id,
          email: u.email,
          name: u.user_metadata?.name || u.email,
        });
      }
    });
  }, []);

  /* --------------------------------
     REGISTER
  -------------------------------- */

  const register = async (name, email, pw) => {
    if (
      !name.trim() ||
      !/\S+@\S+\.\S+/.test(email) ||
      pw.length < 6
    ) {
      throw new Error(
        "Enter a name, a valid email and a password of 6+ characters."
      );
    }

    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pw,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        const { error: userError } = await supabase
          .from("users")
          .insert({
            id: data.user.id,
            name,
            email,
          });

        if (userError) {
          console.error(
            "User database sync failed:",
            userError.message
          );
        }

        setUser({
          id: data.user.id,
          email,
          name,
        });
      }

      return;
    }

    const us = ld("sy_users", []);

    if (us.find((u) => u.email === email)) {
      throw new Error(
        "An account with this email already exists."
      );
    }

    const u = {
      id: "u" + Date.now(),
      name,
      email,
      pw,
      admin: us.length === 0,
    };

    sv("sy_users", [...us, u]);

    setUser({
      id: u.id,
      name,
      email,
      admin: u.admin,
    });
  };

  /* --------------------------------
     LOGIN
  -------------------------------- */

  const login = async (email, pw) => {
    if (supabase) {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password: pw,
        });

      if (error) {
        throw new Error("Invalid email or password.");
      }

      setUser({
        id: data.user.id,
        email: data.user.email,
        name:
          data.user.user_metadata?.name ||
          data.user.email,
      });

      return;
    }

    const u = ld("sy_users", []).find(
      (u) => u.email === email && u.pw === pw
    );

    if (!u) {
      throw new Error("Invalid email or password.");
    }

    setUser({
      id: u.id,
      name: u.name,
      email,
      admin: u.admin,
    });
  };

  /* --------------------------------
     LOGOUT
  -------------------------------- */

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }

    setUser(null);
    notify("Signed out");
  };

  /* --------------------------------
     FAVORITES
  -------------------------------- */

  const toggleFav = async (id) => {
    setFavs((f) =>
      f.includes(id)
        ? f.filter((x) => x !== id)
        : [...f, id]
    );

    if (supabase && user) {
      if (favs.includes(id)) {
        await supabase
          .from("favorites")
          .delete()
          .match({
            user_id: user.id,
            hotel_id: id,
          });
      } else {
        await supabase
          .from("favorites")
          .insert({
            user_id: user.id,
            hotel_id: id,
          });
      }
    }
  };

  /* --------------------------------
     ADD BOOKING
  -------------------------------- */

  const addBooking = async (b) => {
    // Save locally first
    setBookings((x) => [b, ...x]);

    // User must be logged in
    if (!supabase || !user) {
      notify(
        "Please login before making a booking.",
        "error"
      );
      return;
    }

    // Calculate guests
    const guests =
      b.guests ??
      ((b.adults || 0) + (b.children || 0));

    // Save booking to Supabase
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        hotel_id: b.hotelId,
        check_in: b.cin,
        check_out: b.cout,
        guests: guests,
        booking_status:
          b.status || "confirmed",
      })
      .select()
      .single();

    if (error) {
      console.error(
        "Supabase booking sync failed:",
        error.message
      );

      notify(
        "Booking was not saved to Supabase.",
        "error"
      );

      return;
    }

    console.log(
      "Booking successfully saved:",
      data
    );

    notify(
      "Booking saved successfully!",
      "ok"
    );
  };

  /* --------------------------------
     CANCEL BOOKING
  -------------------------------- */

  const cancel = async (id) => {
    setBookings((x) =>
      x.map((b) =>
        b.id === id
          ? {
              ...b,
              status: "Cancelled",
            }
          : b
      )
    );

    if (supabase && user) {
      const { error } = await supabase
        .from("bookings")
        .update({
          booking_status: "Cancelled",
        })
        .eq("id", id);

      if (error) {
        console.error(
          "Cancel booking failed:",
          error.message
        );
      }
    }
  };

  return (
    <C.Provider
      value={{
        user,
        search,
        setSearch,

        favs,
        toggleFav,

        bookings: bookings.filter(
          (b) => b.userId === user?.id
        ),

        allBookings: bookings,

        addBooking,
        cancel,

        register,
        login,
        logout,

        toast,
        notify,

        pending,
        setPending,
      }}
    >
      {children}
    </C.Provider>
  );
}