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

  //Lifecycle
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
      {/* Open modal button */}
      <Button onClick={onEmailModalOpen} type="primary">
        Open Email Modal
      </Button>

      {/* Modal */}
      <UiModal
        open={modalOpen}
        title={"Send Email Form"}
        onCancel={onEmailModalClose}
        actions={
          <Space>
            <Button onClick={onEmailModalClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={onSubmit}
              loading={loading}
              disabled={loading}
            >
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

      {/* Success Message */}
      {contextHolder}
    </>
  );
}

export default App;
