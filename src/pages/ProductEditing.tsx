import React, { useState, useEffect, useCallback } from "react";
import { Button, Card, Flex, Input, notification, message, Spin } from "antd";
import { Product, ProductVersion } from "../types";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import TextArea from "antd/es/input/TextArea";
import { Controller, useForm } from "react-hook-form";
import VersionModal from "../modals/VersionModal";

const ProductAdmin: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [apiNotification, contextHolder] = notification.useNotification();
  const [product, setProduct] = useState<Product | null>(null);
  const [modal, setModal] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<ProductVersion | null>(null);
  const [versions, setVersions] = useState<ProductVersion[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { handleSubmit, control, reset } = useForm<Product>();

  const getProduct = useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.getProduct(Number(id));
      setProduct(result);
      setVersions(result?.versions);
      reset(result);
      return result;
    } catch (error) {
      console.error("Error fetching product:", error);
      message.error("Failed to load product. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id, reset]);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  const openNotification = (title: string, description: string) => {
    apiNotification.success({
      message: title,
      description: <p>{description}</p>,
      placement: "topRight",
    });
  };

  const onSubmit = async (data: Product) => {
    try {
      setLoading(true);
      const result = await api.editProduct(product?.id!, data);
      if (result) {
        setProduct(result);
        openNotification("Success", "Changes saved successfully!");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      message.error("Failed to update product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onVersionSubmit = async (data: ProductVersion) => {
    try {
      setLoading(true);
      if (selectedVersion) {
        await api.editVersion(data);
        openNotification("Success", "Version updated successfully");
      } else {
        const result = await api.createVersion({
          ...data,
          productId: product?.id!,
        });
        setVersions(result);
        openNotification("Success", "New version created successfully");
      }
      setModal(false);
      await getProduct();
    } catch (error) {
      console.error("Error submitting version:", error);
      message.error("Failed to submit version. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteVersion = async (versionId: number) => {
    try {
      setLoading(true);
      await api.deleteVersion(versionId);
      await getProduct();
      openNotification("Success", "Version deleted successfully");
    } catch (error) {
      console.error("Error deleting version:", error);
      message.error("Failed to delete version. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const createVersion = () => {
    setSelectedVersion(null);
    setModal(true);
  };

  const editVersion = (version: ProductVersion) => {
    setSelectedVersion(version);
    setModal(true);
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <>
      {contextHolder}
      <VersionModal
        modal={modal}
        setModal={setModal}
        version={selectedVersion}
        onSubmit={onVersionSubmit as any}
      />
      <Card loading={loading}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex vertical gap={20}>
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <Input
                  size="large"
                  placeholder="Title"
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <TextArea
                  showCount
                  placeholder="Product description"
                  style={{ height: 120, resize: "none" }}
                  {...field}
                />
              )}
            />
            <Button htmlType="submit" size="large" type="primary" loading={loading}>
              Save
            </Button>
            <h1>Versions</h1>
            <Button size="large" type="primary" onClick={createVersion}>
              Create version
            </Button>
            {versions?.map((version) => (
              <Card key={version.id}>
                <Flex vertical gap={10}>
                  <h1>{version.version}</h1>
                  <Flex gap={10}>
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => editVersion(version)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      danger
                      onClick={() => deleteVersion(version.id)}
                    >
                      Delete
                    </Button>
                  </Flex>
                </Flex>
              </Card>
            ))}
          </Flex>
        </form>
      </Card>
    </>
  );
};

export default ProductAdmin;
