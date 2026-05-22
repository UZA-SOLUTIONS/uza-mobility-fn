import { Hero } from '@/components/marketing/hero';
import { siteConfig } from '@/config/site';

export default function LandingPage() {
  return <Hero title={siteConfig.name} description={siteConfig.description} />;
}
