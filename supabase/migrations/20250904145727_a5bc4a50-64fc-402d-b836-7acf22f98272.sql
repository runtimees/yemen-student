-- Fix function search path security issues
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.get_request_by_number(text) SET search_path = public;