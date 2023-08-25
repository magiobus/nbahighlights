/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */

import MainLayout from "@/components/layouts/MainLayout";
import Image from "next/image";

export default function Terms() {
  return (
    <MainLayout className="min-h-screen bg-white">
      <div className="flex w-full  items-center justify-center bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
        <div className="flex max-w-3xl flex-col items-center justify-center  text-center">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">
            Terms and Conditions
          </h2>
          <section className="mb-8">
            <p className="">
              These Terms and Conditions of Use ( &quot;Terms &quot;) govern the
              access and use of the website nbahighlights.fun (
              &quot;NBAHighlights &quot;, &quot;we &quot; or &quot;our&quot;).
              By using nbahighlights.fun, you agree to comply with these Terms.
            </p>

            <p className="my-4">
              NBAHighlights.fun is a neutral search engine designed to help
              users find and access NBA game highlights on YouTube.
              NBAHighlights.fun does not host or distribute any game highlights
              itself. The game highlights content remains hosted on YouTube and
              belongs to its respective creators.
            </p>

            <p className="my-4">
              You may only use nbahighlights.fun for lawful purposes and agree
              not to use it in any way that violates these Terms.
              NBAHighlights.fun does not take responsibility for how users
              utilize the information obtained through the service, nor for the
              consequences of such use. We will also not be liable for any
              direct, indirect, incidental, special, consequential or exemplary
              damages resulting from the use or inability to use the service.
            </p>

            <p className="my-4">
              {" "}
              It is prohibited to use the service for unlawful, defamatory,
              fraudulent, misleading, threatening, harassing, abusive, vulgar,
              obscene, racially or ethnically offensive purposes, or in any
              other way that violates these Terms or applicable laws. In case of
              non-compliance, we reserve the right to terminate your access to
              the service. You agree not to use nbahighlights.fun in any manner
              that could damage, disable, overburden, or impair the service, or
              interfere with any other party&apos;s use and enjoyment of the
              service.
            </p>

            <p className="my-4">
              By using nbahighlights.fun, you agree to allow us to collect your
              email address and name through Google sign-in. We collect this
              information for statistical purposes and to inform you about
              related products or services offered by the owner of
              NBAHighlights.fun. By signing in and using our site, you consent
              to receive promotional and marketing communications related to our
              products and services.
            </p>

            <p>
              We reserve the right to modify these Terms at any time. If we make
              changes, we will post the updated version on nbahighlights.fun. By
              continuing to use our service after changes are made, you agree to
              comply with the revised Terms.
            </p>

            <p className="my-4">Thank you for using nbahighlights.fun!</p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
