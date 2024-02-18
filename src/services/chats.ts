import { supabaseDeskai } from '@/lib/supabase/db';

export const getAllRooms = async () => {
  const { data, error } = await supabaseDeskai
    .from('chat_room')
    .select('*')
    .order('id', { ascending: true });

  return { data: data ? data : [], error };
};

export const getSomeRooms = async (skip: number, limit: number) => {
  const { data, error } = await supabaseDeskai
    .from('chat_room')
    .select('*')
    .order('id', { ascending: true })
    .range(skip, limit);

  return { data: data ? data : [], error };
};

export const insertRooms = async (title: string) => {
  const {
    data: { user },
  } = await supabaseDeskai.auth.getUser();

  const { data: data1, error: error1 } = await supabaseDeskai
    .from('chat_room')
    .insert([
      {
        title: title,
      },
    ])
    .eq('user_id', user?.id)
    .order('id', { ascending: true })
    .select('*');

  if (error1) {
    return;
  }

  // console.log(data1);

  const { data, error } = await supabaseDeskai
    .from('user_chat_room')
    .insert([
      {
        chat_room_id: data1[0].id,
      },
    ]);

  return { data, error };
};

export const getUserRooms = async () => {
  const {
    data: { user },
  } = await supabaseDeskai.auth.getUser();

  const { data, error } = await supabaseDeskai
    .from('user_chat_room')
    .select('*')
    .eq('user_id', user?.id);

  return { data: data ? data : [], error };
};

export const getUserRoomsId = async () => {
  const {
    data: { user },
  } = await supabaseDeskai.auth.getUser();

  const { data, error } = await supabaseDeskai
    .from('user_chat_room')
    .select('chat_room_id')
    .eq('user_id', user?.id);

  return { data: data ? data : [], error };
};

export const insertUserToRooms = async (chat_room_id: number) => {
  const {
    data: { user },
  } = await supabaseDeskai.auth.getUser();

  const { data } = await supabaseDeskai
    .from('user_chat_room')
    .select('*')
    .eq('user_id', user?.id)
    .eq('chat_room_id', chat_room_id);

  if (data?.length === 0) {
    await supabaseDeskai.from('user_chat_room').insert([
      {
        chat_room_id: chat_room_id,
      },
    ]);
  } else {
    console.log('이미 들어가 있는 방 입니다.');
  }
};
