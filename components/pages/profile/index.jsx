"use client";

import CustomerCard from "./customerCard-v2";
import Modal from "@/components/common/Modal";
import PasswordForm from "@/components/form/profile/password";
import PaymentMethodForm from "@/components/form/profile/payment-method";

import { url } from "@/config";
import useFetch from "@/hooks/useFetch";
import { remove } from "@/lib/services/user";
import axios from "axios";
import { CircleDashed, Key, Trash } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useState } from "react";
import ProfileInfo from "./profileInfo";
import ProfileEdit from "./profileEdit";
import GenericModal from "@/components/listing-details-v2/GenericModal";
import PasswordVerifiedForm from "./PasswordVerifyForm";

const ProfilePage = ({ locale }) => {
  const t = useTranslations("profile");
  const { data: session } = useSession();
  const [open, setOpen] = useState({
    delete: false,
    deleteConfirm: false,
    password: false,
    payment: false,
  });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isUserVerified, setIsUserVerified] = useState(false);
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
              changePassword={() => {
                setIsChangePasswordOpen(true);
              }}
              t={t}
            />
          )}

          {isEditing && (
            <ProfileEdit
              data={data}
              onSubmit={() => { }}
              onCancel={() => { }}
              reFetch={reFetch}
              isBusiness={isBusiness}
              setEditing={setIsEditing}
              t={t}
            />
          )}

          <div className="tw:col-span-2  tw:flex tw:justify-between tw:items-center">
            <CustomerCard
              customer={session?.stripe_customer_id}
              locale={locale}
            />
          </div>

          <div className="tw:flex tw:flex-col tw:gap-4 font-secondary tw:w-full tw:border tw:border-[#D8E0ED] tw:p-4 tw:mt-8 ">
            <h2 className="tw:text-lg tw:font-medium tw:mb-4 tw:pb-4 tw:border-b tw:border-b-[#FE475B] tw:text-[#FE475B]">
              {t("dangerZone")}
            </h2>

            <div className="tw:flex tw:gap-4">
              <button
                className="tw:mr-4 tw:mb-2 tw:bg-[#FE475B] tw:text-white tw:px-4 tw:py-2  tw:w-max tw:font-semibold tw:text-[14px] tw:flex tw:items-center"
                onClick={() => {
                  setIsDeleteOpen(true);
                  setIsDeleteConfirmed(false);
                }}
              >
                <Trash size={24} className="tw-inline tw:mr-2" />
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

      <GenericModal
        isOpen={isChangePasswordOpen && session?.provider === "credentials"}
        setOpen={setIsChangePasswordOpen}
      >
        <div className="tw:py-4 tw:px-6 tw:bg-white tw:rounded-lg tw:shadow-md tw:w-[90dvw] tw:md:max-w-2xl tw:flex tw:flex-col">
          <div>
            <Key className="tw:w-12 tw:h-12 tw:mb-4 tw:text-gray-500" />

            <h2 className="tw:text-lg tw:font-semibold tw:mb-4 tw:w-[80%]">
              {t("changePassword")}
            </h2>
          </div>
          <PasswordForm
            formData={data}
            onSuccess={() => {
              setIsChangePasswordOpen(false);
            }}
            cancelButton={
              <button
                className="tw:bg-white border tw:text-black tw:px-4 tw:py-2 tw:rounded-md tw:mr-2"
                onClick={() => {
                  setIsChangePasswordOpen(false);
                }}
              >
                {t("button.cancel")}
              </button>
            }
          />
        </div>
      </GenericModal>

      <GenericModal isOpen={isDeleteOpen} setOpen={setIsDeleteOpen}>
        <div className="tw:py-4 tw:px-6 tw:bg-white tw:rounded-lg tw:shadow-md tw:w-[90dvw] tw:md:max-w-2xl tw:flex tw:flex-col">
          {isDeleteConfirmed ? (
            <div>
              <img
                src="/assets/delete.png"
                alt="Delete Account"
                className="tw:w-12 tw:h-12 tw:mb-4"
              />
              <h2 className="tw:text-lg tw:font-semibold tw:mb-4 tw:w-[80%]">
                {t("confirmDelete")}
              </h2>
              <p>
                {t("confirmDeleteDescription")}
              </p>
              <PasswordVerifiedForm
                isLoading={isLoading}
                formData={data}
                cancelButton={
                  <button
                    className="tw:bg-white border tw:text-black tw:px-4 tw:py-2 tw:rounded-md tw:mr-2"
                    onClick={() => {
                      setIsDeleteOpen(false);
                      setIsDeleteConfirmed(true);
                    }}
                  >
                    {t("button.cancel")}
                  </button>
                }
                onSuccess={async () => {
                  await handleDelete();
                }}
              />
            </div>
          ) : (
            <div>
              <img
                src="/assets/delete.png"
                alt="Delete Account"
                className="tw:w-12 tw:h-12 tw:mb-4"
              />
              <h2 className="tw:text-lg tw:font-semibold tw:mb-4 tw:w-[80%]">
                {t("deleteAccount")}
              </h2>
              <p>
                {t("deleteAccountDescription")}
              </p>
            </div>
          )}
          {!isDeleteConfirmed && (
            <div className="tw:flex tw:justify-end tw:mt-4">
              <button
                className="tw:bg-white border tw:text-black tw:px-4 tw:py-2 tw:rounded-md tw:mr-2"
                onClick={() => {
                  setIsDeleteOpen(false);
                  setIsDeleteConfirmed(true);
                }}
              >
                {t("button.cancel")}
              </button>
              <button
                className="tw:bg-[#FE475B] tw:text-white tw:px-4 tw:py-2 tw:rounded-md tw:mr-2 tw:flex tw:items-center"
                onClick={async () => {
                  if (session?.provider === "credentials") {
                    if (!isDeleteConfirmed) {
                      setIsDeleteConfirmed(true);
                    }
                  } else {
                    await handleDelete();
                    setIsDeleteOpen(false);
                    setIsDeleteConfirmed(true);
                  }
                }}
              >
                <Trash className="tw:mr-2" size={16} />
                {t("button.proceed")}
              </button>
            </div>
          )}
        </div>
      </GenericModal>
    </div>
  );
};

export default ProfilePage;
