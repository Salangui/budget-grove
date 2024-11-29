import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./useAuth";

export const useProfile = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!user) return null;
      
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (existingProfile) return existingProfile;
      
      if (!existingProfile && !fetchError) {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{ id: user.id }])
          .select()
          .single();
        
        if (createError) {
          toast({
            title: "Erreur",
            description: "Impossible de créer votre profil. Veuillez réessayer.",
            variant: "destructive"
          });
          throw createError;
        }
        
        return newProfile;
      }
      
      if (fetchError) throw fetchError;
      return null;
    },
    enabled: !!user,
    retry: false
  });
};