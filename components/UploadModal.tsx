'use client';

import { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import uniqid from 'uniqid';
import useUploadModal from '@/hooks/useUploadModal';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import { useUser } from '@/hooks/useUser';
import { BounceLoader } from 'react-spinners';

const UploadModal = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const uploadModal = useUploadModal();
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();
  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: '',
      title: '',
      song: null,
      image: null,
    },
  });
  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);
      const songFile = values.song?.[0];
      const imageFile = values.image?.[0];

      if (!imageFile || !songFile || !user) {
        toast.error('Missing fields');
        return;
      }
      const uniqueid = uniqid();

      // Upload track
      const { data: songData, error: songError } = await supabaseClient.storage
        .from('songs')
        .upload(`song-${values.title}-${uniqueid}`, songFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (songError) {
        setIsLoading(false);
        return toast.error('Failed track upload');
      }

      // Upload image
      const { data: imageData, error: imageError } =
        await supabaseClient.storage
          .from('images')
          .upload(`image-${values.title}-${uniqueid}`, imageFile, {
            cacheControl: '3600',
            upsert: false,
          });

      if (imageError) {
        setIsLoading(false);
        return toast.error('Failed image upload');
      }

      const { error: supabaseError } = await supabaseClient
        .from('songs')
        .insert({
          user_id: user.id,
          title: values.title,
          author: values.author,
          song_path: songData.path,
          image_path: imageData.path,
        });

      if (supabaseError) {
        setIsLoading(false);
        toast.error(supabaseError.message);
      }

      router.refresh();
      setIsLoading(false);
      toast.success('Track uploaded successfully');
      reset();
      uploadModal.onClose();
    } catch (error) {
      toast.error('Something went wrong. Try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title='Add track'
      description='Upload a mp3 file'
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-y-4'>
        <Input
          id='title'
          disabled={isLoading}
          placeholder='Track title'
          {...register('title', { required: true })}
        />
        <Input
          id='author'
          disabled={isLoading}
          placeholder='Artist'
          {...register('author', { required: true })}
        />
        <div>
          <div className='pb-3'>Select a track</div>
          <Input
            id='song'
            type='file'
            disabled={isLoading}
            accept='.mp3'
            {...register('song', { required: true })}
          />
        </div>
        <div>
          <div className='pb-3'>Select cover art</div>
          <Input
            id='image'
            type='file'
            disabled={isLoading}
            accept='image/*'
            {...register('image', { required: true })}
          />
        </div>
        <Button disabled={isLoading} type='submit'>
          Upload
        </Button>
        {isLoading && (
          <BounceLoader
            className='flex flex-col gap-y-4'
            size={15}
            color='#22c55e'
          />
        )}
      </form>
    </Modal>
  );
};

export default UploadModal;
