import Navbar from "../components/layout/navbar";
import Hero from "../components/home/hero";
import SearchBar from "../components/home/searchbar";
import CategorySection from "../components/home/categorysection";
import LatestLost from "../components/latestlost/latestlost";
import LatestFound from "../components/latestfound/latestfound";
import Stats from "../components/stats/stats";
import Testimonials from "../components/testimonials/testimonials";
import HowItWorks from "../components/howitworks/howitworks";
import Faq from "../components/faq/faq";
import Cta from "../components/cta/cta";
import Footer from "../components/footer/footer";
import ProgressBar from "../components/progressbar/progressbar";
import BackToTop from "../components/backtotop/backtotop";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <SearchBar />
      <CategorySection />
      <LatestLost />
      <LatestFound />
      <Stats />
      <Testimonials />
      <HowItWorks />
      <Faq />
      <Cta />
      <Footer />
      <ProgressBar />
      <BackToTop />
    </>
  );
}