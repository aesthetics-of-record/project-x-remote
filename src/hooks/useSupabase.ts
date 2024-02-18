import { useState, useEffect } from 'react';

//supaCall calls the Supabase API
const useSupabase = (
  supaCall: () => Promise<{ data: any; error: any }>
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState<any[]>([]);

  async function getData() {
    setLoading(true);
    try {
      let { data, error } = await supaCall();
      if (error) {
        setError(error);
        // Show toast with relevant error message to user
        // Log error to Airbrake or Sentry
      } else {
        setData(data);
      }
    } catch (e: any) {
      // Likely to be a network error
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, [supaCall]);

  return { loading, data, error, getData };
};

export default useSupabase;
