import { useState, useEffect } from "react";
import { Button, Space, Form, message } from "antd";
import "./App.css";
import UiModal from "./ui/UiModal";
import EmailForm from "./components/EmailForm";
import type { CustomersEmailForm } from "./components/EmailForm.default";

function App() {
  const [form] = Form.useForm();
  const values = Form.useWatch<CustomersEmailForm>([], form);
  const [messageApi, contextHolder] = message.useMessage();
  const [recipients, setRecipients] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  //LifeCycle
  useEffect(() => {
    if (showSuccess) {
      messageApi.open({
        type: "success",
        content: "Emails successfully sent",
      });
      setShowSuccess(false);
    }
  }, [showSuccess, messageApi]);

  //Events
  const onEmailModalOpen = (): void => {
    setModalOpen(true);
  };

  const onEmailModalClose = (): void => {
    setModalOpen(false);
    form.resetFields();
  };

  const onSubmit = (): void => {
    const { subject, description } = values;

    setLoading(true);
    setTimeout(() => {
      console.log({
        Recipirents: recipients,
        Subject: subject,
        Description: description,
      });
      setLoading(false);
      setShowSuccess(true);
      form.resetFields();
      setModalOpen(false);
    }, 2000);
  };

  return (
    <>
      <Button onClick={onEmailModalOpen} type="primary">
        Open Email Modal
      </Button>

      <UiModal
        open={modalOpen}
        title={"Send Email Form"}
        onCancel={onEmailModalClose}
        actions={
          <Space>
            <Button onClick={onEmailModalClose}>Cancel</Button>
            <Button type="primary" onClick={onSubmit} loading={loading}>
              Submit
            </Button>
          </Space>
        }
      >
        <EmailForm
          form={form}
          trackRecipients={(recipients: string[]) => {
            setRecipients(recipients);
          }}
        />
      </UiModal>
      {contextHolder}
    </>
  );
}

export default App;
