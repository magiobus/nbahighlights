import Link from "next/link";
const Hero = ({ children }) => {
  return (
    <div className="text-center">
      <Link href="/">
        <a>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            NBASearch 🏀
          </h1>
        </a>
      </Link>
      {children}
    </div>
  );
};

export default Hero;
