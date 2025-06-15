import Divider from "@/components/common/Divider";
import DropdownMenu from "@/components/common/DropdownMenu";
import FormWrapper from "@/components/common/FormWrapper";
import GalleryCard from "@/components/common/card/gallery-card";
import Table from "@/components/common/table";
import GalleryForm from "@/components/form/dwelling/gallery";
import useFetch from "@/hooks/useFetch";
import {
  create,
  modify,
  remove,
  update,
} from "@/lib/services/dwelling/gallery";
import { remove as removePrice } from "@/lib/services/dwelling/price";
import { useEffect, useRef, useState } from "react";
import PriceForm from "../price";
import { useTranslations } from "next-intl";
import ConfirmModal from "@/components/common/ConfirmModal";

import SortableList, { SortableItem } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move";
import ImageUploader from "@/components/common/ImageUploader";
import ImageFormTwo from "../gallery/form2";
import MultipleImageUploader from "@/components/common/MultipleImageUploader";
import PriceForm2 from "../price/form2";

const GalleryStepWrapper = ({
  formId,
  onSuccess,
  locale,
  translation = false,
  pics = 1,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState({
    id: null,
    type: null,
  });
  const [images, setImages] = useState(null);
  const tGallery = useTranslations("galleries");
  const tPrice = useTranslations("prices");
  const [selected2, setSelected2] = useState(null);
  const formRef = useRef();

  const handleExternalSubmit = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };

  const { data, isLoading, reFetch } = useFetch({
    keys: ["dwelling", formId],
    url: `/api/dwellings/${formId}`,
    query: {
      populate: ["prices", "galleries.image"],
      sort: ["galleries.order:asc"],
    },
  });

  const handleDelete = async () => {
    setLoading(true);

    if (selected.type === "GALLERY") {
      const res = await remove(
        selected.id,
        tGallery("messages.delete-success")
      );

      if (res) {
        reFetch();
      }
    } else {
      const res = await removePrice(
        selected.id,
        tPrice("messages.delete-success")
      );

      if (res) {
        reFetch();
      }
    }

    setOpen(false);
    setLoading(false);
  };

  useEffect(() => {
    if (data?.galleries) {
      setImages(data?.galleries);
    }
  }, [data?.galleries]);

  const handleCreateGallery = async () => await modify(formId, { images }, "");
  const totalPrices = data?.prices?.map((i) => i.type) || [];

  return (
    <div>
      <Divider title={tPrice("title")} />

      <PriceForm2
        ref={formRef}
        assignedType={totalPrices}
        formData={{
          ...selected2,
          dwelling: formId,
        }}
        onSuccess={() => {
          reFetch();
        }}
        data={data?.prices}
      />

      <ConfirmModal
        title={"Delete Item"}
        message={"Are you sure you want to delete this item?"}
        open={open}
        onCancel={(value) => {
          setOpen(false);
        }}
        onSuccess={handleDelete}
        isLoading={loading}
      />

      <Divider
        title={`${tGallery("title")} - ${images?.length || 0} / ${pics || 0}`}
      />

      <span className="text-brand">
        {tGallery("info") + ` (${pics || 0}) ` + tGallery("info2")}
      </span>

      <GalleryList
        t={tGallery}
        items={images}
        setItems={(items) => {
          setImages(items);
        }}
        pics={pics}
        onSuccess={() => reFetch()}
        total={data?.galleries?.length || 0}
        onDelete={(id) => {
          setSelected({
            id,
            type: "GALLERY",
          });
          setOpen(true);
        }}
      />

      <div className="modal-footer">
        <button
          className="col-auto button -sm bg-blue-1 text-white ml-10"
          onClick={() => {
            onSuccess && onSuccess();
            handleCreateGallery();
            handleExternalSubmit();
          }}
        >
          {tGallery("create")}
        </button>
      </div>
    </div>
  );
};

export default GalleryStepWrapper;

const GalleryList = ({
  t,
  items,
  setItems,
  formId,
  onSuccess,
  onDelete,
  pics,
  isLoading,
  total,
}) => {
  return (
    <div className="row ">
      <MultipleImageUploader
        onUpload={(values) => setItems(values)}
        value={items}
        error=""
        label={t("upload")}
        name={"images"}
        onDelete={onSuccess}
        limit={pics}
      />
    </div>
  );
};

const PriceList = ({ t, items, formId, onSuccess, isLoading, onDelete }) => {
  if (!formId || isLoading) return null;

  const tType = useTranslations("accommodation-types");

  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const columns = [
    {
      Header: t("table.title"),
      Cell: (item) => (
        <span className="text-brand">{item?.amount || 0} zł</span>
      ),
    },
    {
      Header: t("table.type"),
      Cell: (item) => (
        <span className="capitalize">{tType(item?.type) || "N/A"}</span>
      ),
    },
    {
      Header: t("table.guest"),
      Cell: (item) => <span>{item?.guest || 0}</span>,
    },
    {
      Header: t("table.rooms"),
      Cell: (item) => <span>{item?.total || 0}</span>,
    },
    {
      Header: t("table.min_stay"),
      Cell: (item) => <span>{item?.min_stay || 0}</span>,
    },
    {
      Header: t("table.option"),
      Cell: (item) => (
        <DropdownMenu
          options={[
            {
              label: t("edit"),
              value: "edit",
              icon: "fluent:edit-16-filled",
              onClick: () => {
                setOpen((prev) => ({ ...prev, edit: true }));
                setSelected(item);
              },
            },
            {
              label: t("delete"),
              value: "delete",
              icon: "fluent:delete-16-filled",
              onClick: () => {
                onDelete(item?.id);
              },
            },
          ]}
        />
      ),
    },
  ];

  const totalPrices = items?.map((i) => i.type) || [];

  return (
    <div className="row">
      <PriceForm2
        assignedType={totalPrices}
        formData={{
          ...selected,
          dwelling: formId,
        }}
        onSuccess={() => {
          setOpen(false);
          setSelected(null);
          onSuccess && onSuccess();
        }}
        data={items}
      />

      {/* <Table
        bordered
        columns={columns}
        data={items}
        isLoading={isLoading}
        fullHeight={false}
      /> */}
    </div>
  );
};
