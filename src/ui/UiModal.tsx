import { Modal, Row } from "antd";

export interface UiModalProps {
  readonly open: boolean;
  readonly title: string | React.ReactNode;
  readonly children?: React.ReactNode;
  readonly onCancel: () => void;
  readonly actions: React.ReactNode;
}

function UiModal(props: UiModalProps) {
  return (
    <Modal
      open={props.open}
      title={props.title}
      onCancel={props.onCancel}
      centered
      maskClosable={false}
      destroyOnHidden
      footer={<Row className="flex justify-end pt-3">{props.actions}</Row>}
    >
      {props.children}
    </Modal>
  );
}

export default UiModal;
