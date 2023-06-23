'use client';

import * as RadixSlider from '@radix-ui/react-slider';

interface SliderProps {
  value?: number;
  onChange?: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ value = 0.6, onChange }) => {
  const handleChange = (newValue: number[]) => {
    onChange?.(newValue[0]);
  };

  return (
    <RadixSlider.Root
      className='relative flex items-center select-none touch-none w-full h-10 group'
      defaultValue={[1]}
      value={[value]}
      onValueChange={handleChange}
      max={1}
      step={0.01}
      aria-label='Volume'
    >
      <RadixSlider.Track className='bg-neutral-600 relative grow rounded-full h-[3px] '>
        <RadixSlider.Range className='absolute  bg-white group-hover:bg-green-500 rounded-full h-full' />
      </RadixSlider.Track>
      <RadixSlider.Thumb
        className='sliderthumb transition-none hover:scale-105 invisible group-hover:visible'
        aria-label='Volume'
      />
    </RadixSlider.Root>
  );
};

export default Slider;
