// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://vujreabbtnfidvpztpvl.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1anJlYWJidG5maWR2cHp0cHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4OTAzNDksImV4cCI6MjA0ODQ2NjM0OX0.0WLqGgqpeefUzvFcXCL-utKg8LogX8f4xrRdfVbXEjE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);