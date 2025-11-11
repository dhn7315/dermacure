import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import SkinAnalysis from '@/components/skin-analysis';
import { DiseaseGuide } from '@/components/disease-guide';
import { SkinRoutines } from '@/components/skin-routines';
import AnimateOnScroll from '@/components/animate-on-scroll';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent overflow-x-hidden pt-[96px]">
      <Header />
      <div className="flex-1 space-y-16 md:space-y-24">
        <AnimateOnScroll>
          <SkinAnalysis />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <SkinRoutines />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <DiseaseGuide />
        </AnimateOnScroll>
      </div>
      <Footer />
    </div>
  );
}
