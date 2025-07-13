import { useState, useEffect } from "react";
import { Button, Space, Form, message } from "antd";
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
  const [valid, setValid] = useState<boolean>(false);

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

  useEffect(() => {
    //Reset validation when modal closed
    if (!modalOpen) {
      setValid(false);
      return;
    }

    //Validate form and set Submit disable state
    form
      .validateFields(["subject", "description"], { validateOnly: true })
      .then(() => {
        if (recipients.length > 0) {
          setValid(true);
        } else {
          setValid(false);
        }
      })
      .catch(() => {
        setValid(false);
      });
  }, [values, recipients, form, modalOpen]);

  //Events

  const onEmailModalOpen = (): void => {
    setModalOpen(true);
  };

  const onEmailModalClose = (): void => {
    setModalOpen(false);
    form.resetFields();
  };

  const onSubmit = (): void => {
    //Extract from values
    const { subject, description } = values;

    setLoading(true);

    //Simulate post request
    setTimeout(() => {
      //Log form data
      console.log({
        Recipirents: recipients,
        Subject: subject,
        Description: description,
      });

      setLoading(false);
      //Show succes message
      setShowSuccess(true);
      //Reset form fields
      form.resetFields();
      //Close modal after submmition
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
        title={"Customers Contact Form"}
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
              disabled={loading || !valid}
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
