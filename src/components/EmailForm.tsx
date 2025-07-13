import { useEffect, useState } from "react";
import {
  Form,
  Input,
  AutoComplete,
  Space,
  Tag,
  Alert,
  Button,
  Spin,
  Row,
} from "antd";
import type { FormInstance } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import type { Option } from "./EmailForm.default";
import { getCustomers } from "../repository/data.repository";
import { EMAIL_REGEX } from "../utils/globalVariables";

interface EmailFormProps {
  readonly form: FormInstance;
  readonly trackRecipients: (recipients: string[]) => void;
}
function EmailForm(props: EmailFormProps) {
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [emailInputValue, setEmailInputValue] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [emailLoading, setEmailLoading] = useState<boolean>(false);

  //Lifecycle

  useEffect(() => {
    //Update recipients in parent component in order to log them on submit
    props.trackRecipients(selectedEmails);
  }, [selectedEmails]);

  useEffect(() => {
    //Debounce api call for 300ms onSearch

    const timer = setTimeout(() => {
      if (emailInputValue) {
        setEmailLoading(true);
        setError(false);
        //Fetch customers Data
        getCustomers()
          .then((data) => {
            //Filter user emails based on search input Value
            const filteredOptions: Option[] = data.filter((item) => {
              const { value } = item;
              return value
                .toLocaleLowerCase()
                .startsWith(emailInputValue.toLocaleLowerCase());
            });

            //Check if input value is a correct email
            const isValidEmail = EMAIL_REGEX.test(emailInputValue);

            //Conditionaly add custom input value if it has valid formmat
            const customEmail = isValidEmail
              ? [{ label: emailInputValue, value: emailInputValue }]
              : [];

            //Update options
            setOptions([...filteredOptions, ...customEmail]);

            setEmailLoading(false);
          })
          .catch(() => {
            setEmailLoading(false);
            setError(true);
          });
      } else {
        setOptions([]);
        setEmailLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [emailInputValue]);

  //Events

  const onEmailSearch = (inputValue: string): void => {
    setEmailInputValue(inputValue);
  };

  const onEmailSelect = (value: string): void => {
    //Create unique values to not have doublicated emails
    const uniqueEmails = createUniqueValues(selectedEmails, value);
    //Reset the field after select
    props.form.resetFields(["email"]);
    //Update selected emails
    setSelectedEmails(uniqueEmails);
    //Reset options to not keep custom email inputs from previous inserts
    setOptions([]);
  };

  const onEmailDelete = (value: string): void => {
    //Filter emails in order to remove the the deleted one
    const filteredEmails = selectedEmails.filter((email) => email !== value);
    //Update selected emails
    setSelectedEmails(filteredEmails);
  };

  const onAddAllCustomers = (): void => {
    setLoading(true);

    //Fetch customers Data
    getCustomers()
      .then((data) => {
        //Extract customer emails
        const emails = data.map((customer) => customer.value);
        //Create a set to avoid duplicated values and allow to preserve previously selected emails
        const uniqueEmails = createUniqueValues(selectedEmails, emails);
        //Update selected emails
        setSelectedEmails(uniqueEmails);
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

  //Methods

  function createUniqueValues(prevValues: string[], value: string | string[]) {
    //Check if value is an array , if no the put it in an array to be able to distructure
    const inputValue = Array.isArray(value) ? value : [value];

    //Create a set of unique Values
    const uniqueValues = Array.from(new Set([...prevValues, ...inputValue]));

    return uniqueValues;
  }

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
                if (!value || EMAIL_REGEX.test(value)) {
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
            notFoundContent={
              emailLoading ? (
                <Row className="flex items-center justify-center">
                  <Spin />
                </Row>
              ) : (
                "No emails found"
              )
            }
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
