import SocialIcon from "@/components/icons/Social";
//EDIT ME PLEASE
const copyrightLabel = `©${new Date().getFullYear()} @magiobus,  All rights reserved.`;
import Link from "next/link";
const socialLink = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/magiobus/",
    icon: "instagram",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@magiobus",
    icon: "tiktok",
  },
  {
    name: "Twitter",
    href: "https://twitter.com/magiobus",
    icon: "twitter",
  },
];

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {socialLink.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-400 hover:text-gray-500"
            >
              <div className="iconcontainer cursor-pointer w-6 h-6 text-gray-400">
                <SocialIcon type={item.icon} />
              </div>
            </a>
          ))}
        </div>
        <div className="mt-8 md:mt-0 md:order-1 flex flex-col md:flex-row space-x-2">
          <p className="text-center text-base text-gray-400">
            {copyrightLabel}
          </p>
          <Link className="hover:underline cursor-pointer" href="/terms">
            <a className="text-center text-base text-gray-400">
              Terms and Conditions
            </a>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
