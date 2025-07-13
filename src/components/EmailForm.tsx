import { useEffect, useState } from "react";
import { Form, Input, AutoComplete, Space, Tag, Alert, Button } from "antd";
import type { FormInstance } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import type { Option } from "./EmailForm.default";
import { getCustomers } from "../repository/data.repository";

interface EmailFormProps {
  readonly form: FormInstance;
  readonly trackRecipients: (recipients: string[]) => void;
}
function EmailForm(props: EmailFormProps) {
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  //Lifecycle
  useEffect(() => {
    props.trackRecipients(selectedEmails);
  }, [selectedEmails]);

  //Events
  const onEmailSearch = (inputValue: string): void => {
    setError(false);
    getCustomers()
      .then((data) => {
        const filteredOptions: Option[] = data.filter((item) => {
          const { value } = item;
          return value
            .toLocaleLowerCase()
            .startsWith(inputValue.toLocaleLowerCase());
        });

        setOptions(filteredOptions);
      })
      .catch(() => {
        setError(true);
      });
  };

  const onEmailSelect = (value: string): void => {
    //Check to not have doublicated emails
    if (!selectedEmails.includes(value)) {
      setSelectedEmails((prev) => [...prev, value]);
    }
  };

  const onEmailDelete = (value: string): void => {
    const filteredEmails = selectedEmails.filter((email) => email !== value);
    setSelectedEmails(filteredEmails);
  };

  const onAddAllCustomers = (): void => {
    setLoading(true);

    getCustomers()
      .then((data) => {
        const emails = data.map((customer) => customer.value);
        setSelectedEmails(emails);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  };

  const onRemoveAllCustomers = (): void => {
    setSelectedEmails([]);
  };

  return (
    <>
      {/* Form */}
      <Form
        form={props.form}
        className="w-full"
        layout={"vertical"}
        autoComplete="off"
        variant={"filled"}
        colon={false}
      >
        {/* Email */}
        <Form.Item
          name={"email"}
          label={"Email"}
          rules={[
            {
              validator: (_, value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value || emailRegex.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Please enter a valid email address")
                );
              },
            },
          ]}
        >
          <AutoComplete
            placeholder="Enter email"
            onSearch={onEmailSearch}
            onSelect={onEmailSelect}
            options={options}
          />
        </Form.Item>

        {/*Recipients email list */}
        <Form.Item label="Recipients List">
          <Space
            className="border border-gray-300 rounded-md h-[130px] p-2 w-full  overflow-y-auto flex-wrap "
            align="start"
          >
            {!selectedEmails.length && (
              <p className="text-gray-400 select-none">No emails selected</p>
            )}
            {selectedEmails.map((email) => (
              <Tag
                key={email}
                closable
                onClose={() => onEmailDelete(email)}
                closeIcon={<CloseOutlined />}
                className="select-none "
              >
                {email}
              </Tag>
            ))}
          </Space>
        </Form.Item>

        {/* Email action buttons */}
        <Space className="mb-2 flex-wrap">
          <Button type="primary" onClick={onAddAllCustomers} loading={loading}>
            Add All
          </Button>
          <Button onClick={onRemoveAllCustomers}>Remove All</Button>
        </Space>

        {/* Subject */}
        <Form.Item
          name="subject"
          label="Subject"
          rules={[
            {
              required: true,
              message: "Email subject is required",
            },
          ]}
        >
          <Input placeholder="Enter email subject" />
        </Form.Item>

        {/* Description */}
        <Form.Item
          name={"description"}
          label="Description"
          rules={[
            {
              required: true,
              min: 10,
              message: "Please enter minimum 10 characters  ",
            },
          ]}
        >
          <Input.TextArea
            showCount
            minLength={10}
            maxLength={800}
            placeholder="Enter the body of the email"
            className="h-[120px]"
          />
        </Form.Item>
      </Form>

      {/* Error Message */}
      {error && (
        <Alert
          className="mb-2"
          message="Something went wrong while fetching emails, please try again"
          type="error"
        />
      )}
    </>
  );
}

export default EmailForm;
