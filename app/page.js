import Hero from "./_components/Hero";
import ProductsList from "./_components/ProductsList";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <div>
      <Hero />

      <div className="p-10 md:px-36 lg:px-48">
        <ProductsList />
      </div>

      <Footer />
    </div>
  );
}
