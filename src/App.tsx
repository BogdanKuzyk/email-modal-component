import { useState } from "react";
import { Button } from "antd";
import "./App.css";
import UiModal from "./components/UiModal";

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
      ></UiModal>
    </>
  );
}

export default App;
