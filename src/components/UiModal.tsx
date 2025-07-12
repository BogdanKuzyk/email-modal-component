import { Modal } from "antd";

export interface UiModalProps {
  readonly open: boolean;
  readonly title: string | React.ReactNode;
  readonly children?: React.ReactNode;
  readonly onCancel: () => void;
}

function UiModal(props: UiModalProps) {
  return (
    <Modal
      open={props.open}
      title={props.title}
      onCancel={props.onCancel}
      centered
      maskClosable={false}
      width={"auto"}
      height={"auto"}
    >
      {props.children}
    </Modal>
  );
}

export default UiModal;
