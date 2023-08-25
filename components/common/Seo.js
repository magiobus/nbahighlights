import { NextSeo } from "next-seo";

//EDIT ME PLEASE
const data = {
  siteName: "nbahighlights.fun",
  title: "nbahighlights.fun",
  description:
    "Upload your full game videos and get the best highlights of your favorite players",
  url: "https://nbahighlights.fun",
  imageUrl: "",
  twitter: "@magiobus",
};

const Seo = ({
  subtitle,
  description = data.description,
  url = data.url,
  imageUrl = data.imageUrl,
}) => {
  const title = subtitle ? `${data.title} | ${subtitle}` : `${data.title}`;
  return (
    <NextSeo
      title={title}
      description={description}
      openGraph={{
        url: url,
        locale: "es",
        title: title,
        description: description,
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: title,
          },
        ],
        site_name: data.siteName,
      }}
      twitter={{
        handle: data.twitter,
        site: data.twitter,
        cardType: "summary_large_image",
      }}
    />
  );
};

export default Seo;
