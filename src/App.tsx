import { useState } from "react";
import { Button, Space } from "antd";
import "./App.css";
import UiModal from "./components/UiModal";
import EmailForm from "./components/EmailForm";

function App() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  //Events
  const onEmailModalOpen = (): void => {
    setModalOpen(true);
  };

  const onEmailModalClose = (): void => {
    setModalOpen(false);
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
            <Button type="primary">Submit</Button>
          </Space>
        }
      >
        <EmailForm />
      </UiModal>
    </>
  );
}

export default App;
