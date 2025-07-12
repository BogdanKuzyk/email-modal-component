import { Form, Input, AutoComplete, Space } from "antd";

function EmailForm() {
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
        <AutoComplete placeholder="Enter email" />
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
