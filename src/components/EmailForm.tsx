import { Form, Input } from "antd";

function EmailForm() {
  return (
    <Form
      className="w-[512px]"
      layout={"vertical"}
      autoComplete="off"
      variant={"filled"}
      colon={false}
    >
      {/* Subject */}
      <Form.Item name="subject" label="Subject">
        <Input placeholder="Enter email subject" />
      </Form.Item>

      {/* Description */}
      <Form.Item name={"description"} label="Description">
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
