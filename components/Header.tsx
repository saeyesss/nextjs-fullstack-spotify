'use client';

import { useRouter } from 'next/navigation';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { twMerge } from 'tailwind-merge';
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx';
import { AiOutlinePlus } from 'react-icons/ai';
import { BiSearch } from 'react-icons/bi';
import { FaUserAlt } from 'react-icons/fa';
import { HiHome } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

import { useUser } from '@/hooks/useUser';
import useAuthModal from '@/hooks/useAuthModal';
import useUploadModal from '@/hooks/useUploadModal';
import Button from './Button';
import usePlayer from '@/hooks/usePlayer';

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const authModal = useAuthModal();
  const router = useRouter();
  const uploadModal = useUploadModal();
  const player = usePlayer();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  const onClick = () => {
    if (!user) {
      return authModal.onOpen();
    }
    // TODO: check for subscription
    return uploadModal.onOpen();
  };
  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    player.reset();
    router.refresh();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged out');
    }
  };
  return (
    <div
      className={twMerge(
        `h-fit
        bg-gradient-to-b
        from-emerald-800
        p-6`
      )}
    >
      <div className='flex w-full mb-4 items-center justify-between'>
        <div
          className='
        hidden
        md:flex
        gap-x-2
        items-center
        '
        >
          <button
            onClick={() => router.back()}
            className='rounded-full
            bg-black
            flex
            items-center
            justify-center
            cursor-pointer
            hover:opacity-75
            transition'
          >
            <RxCaretLeft size={35} className='text-white' />
          </button>
          <button
            onClick={() => router.forward()}
            className='rounded-full
            bg-black
            flex
            items-center
            justify-center
            cursor-pointer
            hover:opacity-75
            transition'
          >
            <RxCaretRight size={35} className='text-white' />
          </button>
        </div>
        <div className='flex md:hidden gap-x-2 items-center'>
          <button
            onClick={() => router.push('/')}
            className='
              rounded-full
              p-2
              bg-white
              flex
              items-center
              justify-center
              cursor-pointer
              hover:opacity-75
              transition
            '
          >
            <HiHome className='text-black' size={20} />
          </button>
          <button
            onClick={() => router.push('/search')}
            className='
            flex
              rounded-full
              p-2
              bg-white
              items-center
              justify-center
              cursor-pointer
              hover:opacity-75
              transition
            '
          >
            <BiSearch className='text-black' size={20} />
          </button>
          <button
            onClick={onClick}
            className='
              rounded-full
              p-2
              bg-white
              flex
              items-center
              justify-center
              cursor-pointer
              hover:opacity-75
              transition
            '
          >
            <AiOutlinePlus className='text-black' size={20} />
          </button>
        </div>
        <div className='flex justify-between items-center gap-x-4'>
          {user ? (
            <div className='flex gap-x-4 items-center'>
              <Button onClick={handleLogout} className='bg-white px-6 py-2'>
                Logout
              </Button>
              <Button
                onClick={() => router.push('/account')}
                className='bg-white'
              >
                <FaUserAlt />
              </Button>
            </div>
          ) : (
            <>
              <div>
                <Button
                  onClick={authModal.onOpen}
                  className='bg-transparent text-neutral-300 font-medium '
                >
                  Sign up
                </Button>
              </div>
              <div>
                <Button
                  onClick={authModal.onOpen}
                  className='bg-white px-6 py-2'
                >
                  Log in
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;
