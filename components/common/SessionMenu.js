import { Transition, Menu } from "@headlessui/react";
import Link from "next/link";
import classNames from "@/utils/classNames";
import { signOut } from "next-auth/react";
import { Fragment } from "react";

/* eslint-disable @next/next/no-img-element */
const SessionMenu = ({ session }) => {
  return (
    <div className="flex items-center  ">
      {session ? (
        <Menu as="div" className="relative">
          <div>
            <Menu.Button className="flex  rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-white  focus:ring-offset-2">
              <span className="sr-only">Open user menu</span>
              {session.user.image ? (
                <img
                  className="h-8 w-8  rounded-full"
                  src={session.user.image}
                  alt=""
                />
              ) : (
                <img
                  className="h-8 w-8 rounded-full"
                  src={`https://avatars.dicebear.com/api/micah/${session.user.email}.svg?background=%23ffffff`}
                  alt=""
                />
              )}
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-40 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {session.user.roles.includes("admin") && (
                <Menu.Item>
                  {({ active }) => (
                    <Link href="/admin/dashboard">
                      <a
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Admin Dashboard
                      </a>
                    </Link>
                  )}
                </Menu.Item>
              )}

              <Menu.Item>
                {({ active }) => (
                  <Link href="/user/favorites">
                    <a
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-700"
                      )}
                    >
                      Mis Favoritos
                    </a>
                  </Link>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <Link href="/user/plans">
                    <a
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-700"
                      )}
                    >
                      Mi Plan
                    </a>
                  </Link>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <Link href="/user/profile">
                    <a
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-700"
                      )}
                    >
                      My Account
                    </a>
                  </Link>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <Link href="/stats">
                    <a
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-700"
                      )}
                    >
                      Estadisticas Globales
                    </a>
                  </Link>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <div
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block cursor-pointer px-4 py-2 text-sm text-gray-700"
                    )}
                    onClick={() => signOut()}
                  >
                    Sign out
                  </div>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      ) : (
        <></>
        // <Link href="/auth/signin">
        //   <a>Sign In </a>
        // </Link>
      )}
    </div>
  );
};

export default SessionMenu;
