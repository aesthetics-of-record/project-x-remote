import { supabase } from '@/lib/supabase/db';
import { useEffect } from 'react';
import { useAtom } from 'jotai'
import { userAtom } from '@/lib/jotai/store';


const useUserWithRefresh = () => {
  const [user, setUser] = useAtom(userAtom)

  const refreshUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', user!.id);

    if (user)
      setUser({
        ...user,
        display_name: data![0].display_name,
        avatar_url: data![0].avatar_url,
      });
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return { user, refreshUser };
};

export default useUserWithRefresh;
