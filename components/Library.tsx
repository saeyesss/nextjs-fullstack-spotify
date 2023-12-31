import { TbPlaylist } from 'react-icons/tb';
import { AiOutlinePlus } from 'react-icons/ai';
import useAuthModal from '@/hooks/useAuthModal';
import useUploadModal from '@/hooks/useUploadModal';
import { useUser } from '@/hooks/useUser';
import useOnPlay from '@/hooks/useOnPlay';
import useSubscribeModal from '@/hooks/useSubscribeModal';
import MediaItem from './MediaItem';
import { Song } from '@/types';

interface LibraryProps {
  songs: Song[];
}

const Library: React.FC<LibraryProps> = ({ songs }) => {
  const authModal = useAuthModal();
  const uploadModal = useUploadModal();
  const { user, subscription } = useUser();
  const subscribeModal = useSubscribeModal();

  const onPlay = useOnPlay(songs);

  const onClick = () => {
    if (!user) {
      return authModal.onOpen();
    }
    if (!subscription) {
      return subscribeModal.onOpen();
    }
    return uploadModal.onOpen();
  };

  return (
    <div className='flex flex-col'>
      <div className='flex items-center justify-between px-5 py-4'>
        <div className='inline-flex items-center gap-x-2'>
          <TbPlaylist className='text-neutral-400' size={26} />
          <p className='font-medium text-neutral-400 text-md'>Your Library</p>
        </div>
        <AiOutlinePlus
          onClick={onClick}
          size={20}
          className='text-neutral-400 cursor-pointer hover:text-white transition
        '
        />
      </div>
      {user ? (
        <div className='flex flex-col gap-y-2 mt-4 px-3'>
          {songs.map((item) => (
            <MediaItem
              onClick={(id: string) => onPlay(id)}
              key={item.id}
              data={item}
            >
              {item.title}
            </MediaItem>
          ))}
        </div>
      ) : (
        <div className='flex items-center justify-center py-14'>
          <p className='font-medium text-neutral-700 text-md'>
            Login to see your songs
          </p>
        </div>
      )}
    </div>
  );
};

export default Library;
