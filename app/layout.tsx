import { Figtree, Varela_Round } from 'next/font/google';

import getSongsByUserId from '@/actions/getSongsByUserId';
import getActiveProductsWithPrices from '@/actions/getActiveProductsWithPrices';
import ModalProvider from '@/providers/ModalProvider';
import SupabaseProvider from '@/providers/SupabaseProvider';
import UserProvider from '@/providers/UserProvider';
import ToasterProvider from '@/providers/ToasterProvider';
import Sidebar from '@/components/Sidebar';
import Player from '@/components/Player';
import './globals.css';

const font = Figtree({ subsets: ['latin'] });
// const font = Varela_Round({ subsets: ['latin'], weight: '400' });

export const revalidate = 0;

export const metadata = {
  title: 'Spotify - Music for everyone',
  description: 'Created with 💖',
  icons: {
    icon: {
      url: '/favicon-32x32.png',
      type: 'image/png',
    },
    shortcut: { url: '/favicon-32x32.png', type: 'image/png' },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userSongs = await getSongsByUserId();
  const products = await getActiveProductsWithPrices();

  return (
    <html lang='en'>
      <body className={font.className}>
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider products={products} />
            <Sidebar songs={userSongs}>{children}</Sidebar>
            <Player />
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
