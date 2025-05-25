"use client";

import ConfirmModal from "@/components/common/ConfirmModal";
import CustomerCard from "./customerCard-v2";
import Divider from "@/components/common/Divider";
import Modal from "@/components/common/Modal";
import ProfileForm from "@/components/form/profile";
import PasswordForm from "@/components/form/profile/password";
import PaymentMethodForm from "@/components/form/profile/payment-method";
import PasswordVerifiedForm from "@/components/form/profile/verifiedPassword";
import { url } from "@/config";
import useFetch from "@/hooks/useFetch";
import { remove, update } from "@/lib/services/user";
import axios from "axios";
import { CircleDashed, Edit, Lock, Trash } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useState } from "react";
import ProfileInfo from "./profileInfo";
import ProfileEdit from "./profileEdit";

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
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (data) {
      setIsBusiness(data?.businessAccount || false);
    }
  }, [isLoading, data]);

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

  if (isLoading) {
    return (
      <div className="tw:max-h-[calc(100dvh-100px)] tw:overflow-y-auto overflow-x-hidden tw:md:mx-4 tw:mt-[70px]">
        {/* basic information card */}
        <div className="tw:py-4 tw:md:py-8 tw:rounded-lg tw:bg-white tw:shadow-md tw:px-4 tw:md:px-10">
          <div className="tw:flex tw:justify-center tw:items-center tw:h-[60dvh]">
            <CircleDashed className="tw:animate-spin tw:w-6 tw:h-6 tw:text-gray-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tw:max-h-[calc(100dvh-100px)] tw:overflow-y-auto overflow-x-hidden tw:md:mx-4 tw:mt-[70px]">
      {/* basic information card */}
      <div className="tw:py-4 tw:md:py-8 tw:rounded-lg tw:bg-white tw:shadow-md tw:px-4 tw:md:px-10">
        <>
          {!isEditing && (
            <ProfileInfo
              data={data}
              isBusiness={isBusiness}
              setIsBusiness={setIsBusiness}
              reFetch={reFetch}
              setEditing={setIsEditing}
              t={t}
            />
          )}

          {isEditing && (
            <ProfileEdit
              data={data}
              onSubmit={() => {}}
              onCancel={() => {}}
              reFetch={reFetch}
              isBusiness={isBusiness}
              setEditing={setIsEditing}
              t={t}
            />
          )}

          <div className="tw:col-span-2 tw:flex tw:justify-between tw:items-center">
            <CustomerCard
              customer={session?.stripe_customer_id}
              locale={locale}
            />
          </div>

          {/* <Divider side="center" title={t("messages.auth")} /> */}

          <div className="tw:flex tw:flex-col tw:gap-4 tw:w-full tw:border tw:border-[#D8E0ED] tw:p-4 tw:mt-8 ">
            <h2 className="tw:text-lg tw:font-semibold tw:mb-4 tw:pb-4 tw:border-b tw:border-b-[#FE475B] tw:text-[#FE475B]">
              Danger Zone:
            </h2>

            <div className="tw:flex tw:gap-4">
              {/* {session?.provider === "credentials" && (
                <button
                  className="tw:mb-2 tw:bg-orange-500 tw:text-white tw:px-4 tw:py-2 tw:rounded-md tw:w-max tw:font-medium tw:flex tw:items-center"
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
              )} */}

              <button
                className="tw:mr-4 tw:mb-2 tw:bg-[#FE475B] tw:text-white tw:px-4 tw:py-2 tw:rounded-md tw:w-max tw:font-medium tw:flex tw:items-center"
                onClick={() =>
                  setOpen({
                    delete: true,
                    deleteConfirm: false,
                    password: false,
                  })
                }
              >
                <Trash className="tw-inline tw:mr-2" />
                {t("control-panel.deleteAccount")}
              </button>
            </div>
          </div>
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
