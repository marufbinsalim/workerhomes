"use client";

import ConfirmModal from "@/components/common/ConfirmModal";
import ControlPanel from "@/components/common/controlPanel";
import CustomerCard from "@/components/common/CustomerCard";
import Divider from "@/components/common/Divider";
import Modal from "@/components/common/Modal";
import ProfileForm from "@/components/form/profile";
import PasswordForm from "@/components/form/profile/password";
import PaymentMethodForm from "@/components/form/profile/payment-method";
import PasswordVerifiedForm from "@/components/form/profile/verifiedPassword";
import { url } from "@/config";
import useFetch from "@/hooks/useFetch";
import { remove } from "@/lib/services/user";
import axios from "axios";
import { CircleDashed, Edit, Lock } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FaToggleOff, FaToggleOn } from "react-icons/fa";

const ProfilePage = ({ locale }) => {
  const t = useTranslations("profile");
  const { data: session } = useSession();
  const [open, setOpen] = useState({
    delete: false,
    deleteConfirm: false,
    password: false,
    payment: false,
  });
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [filter, setFilter] = useState({
    key: null,
    value: "All",
  });
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data, isLoading, reFetch } = useFetch({
    keys: ["me"],
    url: "/api/users/me",
    query: {
      populate: ["address", "subscriptions"],
    },
  });

  const [isBusiness, setIsBusiness] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      if (data?.subscriptions?.length > 0) {
        for (const subscription of data?.subscriptions) {
          await axios.put(`${url}/api/stripe/cancel`, {
            subscriptionId: subscription?.stripe_subscription_id,
          });
        }
      }

      const res = await remove(data?.id, t("messages.delete-success"));
      if (res?.status === 200 || res?.status === 201) {
        signOut({
          redirect: true,
          callbackUrl: `/${locale}`,
        });
      }
      setOpen((prev) => ({ ...prev, delete: false }));
      setSelected(null);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tw:max-h-[calc(100dvh-100px)] tw:overflow-y-auto overflow-x-hidden tw:md:mx-4 tw:mt-[70px]">
      {/* basic information card */}
      <div className="tw:py-4 tw:md:py-8 tw:rounded-lg tw:bg-white tw:shadow-md tw:px-4 tw:md:px-10">
        <>
          {isBusiness === false && (
            <div className="tw:border tw:border-[#D8E0ED] tw:px-3 tw:md:px-5 tw:py-4 tw:md:py-7 tw:w-full">
              <h2 className="tw:text-lg tw:font-semibold tw:mb-4">
                Basic Information
              </h2>
              {/* Toggle Switch */}
              <div className="tw:flex tw:items-center tw:mb-6">
                <FaToggleOff
                  className="tw:text-gray-500 tw:w-6 tw:h-6"
                  onClick={() => setIsBusiness(!isBusiness)}
                />
                <label className="tw:ml-2 tw:text-sm">
                  Turn on business account
                </label>
              </div>
              {/* User Info Grid */}
              <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-y-4 tw:gap-x-8 tw:mb-6">
                <div>
                  <p className="tw:text-sm tw:text-gray-500">First Name</p>
                  <p className="tw:text-base">{data?.first_name || ""}</p>
                </div>
                <div>
                  <p className="tw:text-sm tw:text-gray-500">Last Name</p>
                  <p className="tw:text-base">{data?.last_name || ""}</p>
                </div>
                <div>
                  <p className="tw:text-sm tw:text-gray-500">Email</p>
                  <p className="tw:text-base">abrahamlincoln@gmail.com</p>
                </div>
                <div>
                  <p className="tw:text-sm tw:text-gray-500">Phone No.</p>
                  <p className="tw:text-base">{data?.phone || ""}</p>
                </div>
                <div>
                  <p className="tw:text-sm tw:text-gray-500">
                    Street & House No.
                  </p>
                  <p className="tw:text-base">D block, road 8, house</p>
                </div>
                <div>
                  <p className="tw:text-sm tw:text-gray-500">City</p>
                  <p className="tw:text-base">{data?.address?.city || ""}</p>
                </div>
                <div>
                  <p className="tw:text-sm tw:text-gray-500">Country</p>
                  <p className="tw:text-base">{data?.address?.country || ""}</p>
                </div>
                <div>
                  <p className="tw:text-sm tw:text-gray-500">Postal Code</p>
                  <p className="tw:text-base">
                    {data?.address?.zip_code || ""}
                  </p>
                </div>
                <div>
                  <p className="tw:text-sm tw:text-gray-500">Languages</p>
                  <p className="tw:text-base">
                    {data?.locale?.toUpperCase() || ""}
                  </p>
                </div>
              </div>

              <div className="tw:flex tw:gap-3">
                <button className="tw:flex tw:items-center tw:bg-orange-500 tw:text-white tw:px-4 tw:py-2 tw:rounded tw:text-sm tw:hover:bg-orange-600 tw:transition">
                  <Edit className="tw:w-4 tw:h-4 tw:mr-2" />
                  Edit
                </button>
                <button className="tw:flex tw:items-center tw:bg-white tw:text-gray-700 tw:border tw:border-gray-300 tw:px-4 tw:py-2 tw:rounded tw:text-sm tw:hover:bg-gray-100 tw:transition">
                  <Lock className="tw:w-4 tw:h-4 tw:mr-2" />
                  Change Password
                </button>
              </div>
            </div>
          )}

          <pre>{JSON.stringify(data, null, 2)}</pre>
          <ProfileForm formData={data} onSuccess={() => signOut()} />

          <Divider side="center" title={t("form.field.payment-methods")} />

          <div className="tw:col-span-2 tw:flex tw:justify-between tw:items-center">
            <CustomerCard
              customer={session?.stripe_customer_id}
              locale={locale}
            />
          </div>

          <Divider side="center" title={t("messages.auth")} />

          {session?.provider === "credentials" && (
            <button
              className="tw:inline-flex tw:items-center tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:rounded-md tw:bg-red-500 tw:text-white"
              onClick={() =>
                setOpen({
                  password: true,
                  deleteConfirm: false,
                  delete: false,
                })
              }
            >
              {t("control-panel.password")}
            </button>
          )}

          <button
            className="tw:inline-flex tw:items-center tw:px-4 tw:py-2 tw:mt-4 tw:text-sm tw:font-medium tw:rounded-md tw:bg-red-500 tw:text-white"
            onClick={() =>
              setOpen({
                delete: true,
                deleteConfirm: false,
                password: false,
              })
            }
          >
            {t("control-panel.deleteAccount")}
          </button>
        </>
      </div>

      {session?.provider === "credentials" && (
        <>
          <Modal
            open={open.password}
            setOpen={(value) => {
              setOpen({
                delete: false,
                password: false,
              });
              setSelected(null);
            }}
            title={t("messages.change")}
          >
            <PasswordForm
              formData={data}
              onSuccess={() => {
                setIsUserVerified(true);
                setOpen({
                  delete: false,
                  deleteConfirm: false,
                  password: false,
                });
              }}
            />
          </Modal>

          <Modal
            open={open.deleteConfirm}
            setOpen={(value) => {
              setOpen({
                delete: false,
                deleteConfirm: false,
                password: false,
              });
              setSelected(null);
            }}
            title={t("messages.verify-password")}
          >
            <PasswordVerifiedForm
              isLoading={isLoading}
              formData={data}
              onSuccess={async () => {
                await handleDelete();
              }}
            />
          </Modal>
        </>
      )}

      <Modal
        open={open.payment}
        setOpen={(value) => {
          setOpen({
            delete: false,
            deleteConfirm: false,
            password: false,
            payment: value,
          });
          setSelected(null);
        }}
        title={t("form.field.payment-methods")}
      >
        <PaymentMethodForm
          editData={data}
          onSuccess={() => {
            setOpen({
              delete: false,
              deleteConfirm: false,
              password: false,
              payment: false,
            });
            reFetch();
          }}
        />
      </Modal>

      <ConfirmModal
        size="lg"
        title={t("messages.delete-account")}
        open={open.delete}
        onCancel={(value) => {
          setOpen((prev) => ({ ...prev, delete: value }));
          setSelected(null);
        }}
        onSuccess={() => {
          if (session?.provider === "credentials") {
            setOpen((prev) => ({
              ...prev,
              delete: false,
              deleteConfirm: true,
            }));
          } else {
            handleDelete();
          }
        }}
        isLoading={loading}
      >
        <p>{t("messages.delete.1")}</p>
        <p className="tw:mt-2">{t("message.delete.2")}</p>
        <ul className="tw:mb-6">
          <li>
            <strong>1:</strong> {t("messages.delete.list.1")}
          </li>
          <li>
            <strong>2:</strong> {t("messages.delete.list.2")}
          </li>
          <li>
            <strong>3:</strong> {t("messages.delete.list.3")}
          </li>
        </ul>
        <p>{t("messages.delete.3")}</p>
        <p className="tw:mt-4">
          <i>{t("messages.delete.4")}</i>
        </p>
      </ConfirmModal>
    </div>
  );
};

export default ProfilePage;
