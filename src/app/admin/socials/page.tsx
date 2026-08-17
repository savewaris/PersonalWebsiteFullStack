import { getSocialLinks } from '@/lib/data';
import SocialsClient from './SocialsClient';

export default async function SocialsPage() {
  const socials = await getSocialLinks();
  return <SocialsClient initialSocials={socials} />;
}
