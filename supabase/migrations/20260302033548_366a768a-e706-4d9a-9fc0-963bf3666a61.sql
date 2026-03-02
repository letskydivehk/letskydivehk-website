-- Reduce anonymous booking token expiration from 24 hours to 4 hours
ALTER TABLE public.bookings ALTER COLUMN token_expires_at SET DEFAULT (now() + interval '4 hours');