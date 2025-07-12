import { useState } from "react";
import { Form, Input, AutoComplete, Space } from "antd";
import type { Customer, Option } from "./EmailForm.default";

const URL =
  "https://686547495b5d8d0339808f5d.mockapi.io/spitogatos/api/customer-email-lookup";

function EmailForm() {
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  //Events
  const onEmailSearch = async (value: string): Promise<void> => {
    try {
      const res = await fetch(URL);
      const data: Customer[] = await res.json();

      const filteredData: Customer[] = data.filter((item) => {
        const { email } = item;
        return email.toLocaleLowerCase().startsWith(value.toLocaleLowerCase());
      });

      const inputOptions: Option[] = filteredData.map((item) => {
        return {
          id: item.id,
          label: item.email,
          value: item.email,
        };
      });

      setOptions(inputOptions);
    } catch (error) {
      console.log(error);
    }
  };

  const onEmailSelect = (value: string): void => {
    //Check to not have doublicated emails
    if (!selectedEmails.includes(value)) {
      setSelectedEmails((prev) => [...prev, value]);
    }
  };

  return (
    <Form
      className="w-[512px]"
      layout={"vertical"}
      autoComplete="off"
      variant={"filled"}
      colon={false}
    >
      {/* Email */}
      <Form.Item name={"email"} label={"Email"}>
        <AutoComplete
          placeholder="Enter email"
          onSearch={onEmailSearch}
          onSelect={onEmailSelect}
          options={options}
        />
      </Form.Item>

      <Form.Item label="Recipients List">
        <Space
          className="border border-gray-300 rounded-md h-[130px] p-2 w-full  overflow-y-auto flex-wrap"
          align="start"
        >
          placeholder
        </Space>
      </Form.Item>

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
  );
}

export default EmailForm;
