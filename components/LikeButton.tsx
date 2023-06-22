'use client';

import { useSessionContext } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import toast from 'react-hot-toast';

import useAuthModal from '@/hooks/useAuthModal';
import { useUser } from '@/hooks/useUser';

interface LikeButtonProps {
  songId: string;
}
const LikeButton: React.FC<LikeButtonProps> = ({ songId }) => {
  const router = useRouter();
  const { supabaseClient } = useSessionContext();
  const authModal = useAuthModal();
  const { user } = useUser();

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const fetchData = async () => {
      const { data, error } = await supabaseClient
        .from('liked_songs')
        .select('*')
        .eq('user_id', user.id)
        .eq('song_id', songId)
        .single();
      if (!error && data) {
        setIsLiked(true);
      }
    };
    fetchData();
  }, [songId, supabaseClient, user?.id]);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const handleLike = async () => {
    if (!user) {
      return authModal.onOpen();
    }

    if (isLiked) {
      const { error } = await supabaseClient
        .from('liked_songs')
        .delete()
        .eq('user_id', user.id)
        .eq('song_id', songId);
      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(false);
      }
    } else {
      const { error } = await supabaseClient.from('liked_songs').insert({
        user_id: user.id,
        song_id: songId,
      });
      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(true);
      }
    }
    router.refresh();
  };
  return (
    <button
      className='cursor-pointer hover:opacity-75 transition hover:scale-250 '
      onClick={handleLike}
    >
      <Icon
        color={isLiked ? '#22c55e' : 'white'}
        className='h-full w-full min-w-[1.5rem] min-h-[1.5rem] hover:drop-shadow-glow hover:bounce '
      />
    </button>
  );
};

export default LikeButton;
