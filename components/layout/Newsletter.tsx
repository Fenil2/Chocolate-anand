"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState, type FormEvent } from "react";
import { easeMelt } from "@/components/motion/variants";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const id = useId();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) return setError("Enter your email address.");
    if (!EMAIL.test(value)) return setError("That email looks incomplete. Check for a missing @ or domain.");
    setError(null);
    setDone(true);
  };

  return (
    <div>
      <p className="display text-2xl">Letters from the melt</p>
      <p className="mt-2 max-w-sm text-sm text-beige/75">New bars and small indulgences, now and then.</p>
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.p
            key="done"
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: easeMelt }}
            className="mt-6 border-l-2 border-copper pl-3 text-sm text-beige"
          >
            Thanks — {email.trim()} is noted. Sign-ups aren’t connected in this preview, so no email has been sent.
          </motion.p>
        ) : (
          <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -6 }} className="mt-6">
            <label htmlFor={id} className="mb-2 block text-xs text-beige/80">
              Email address
            </label>
            <div className="flex border-b border-ivory/30 focus-within:border-gold">
              <input
                id={id}
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-err` : undefined}
                placeholder="you@example.com"
                className="h-12 min-w-0 flex-1 bg-transparent text-ivory placeholder:text-beige/35 focus:outline-none"
              />
              <button type="submit" className="px-2 text-[0.75rem] tracking-[0.14em] uppercase hover:text-gold">
                Subscribe
              </button>
            </div>
            {error && (
              <p id={`${id}-err`} className="mt-2 text-xs text-[#e7a48a]">
                {error}
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
