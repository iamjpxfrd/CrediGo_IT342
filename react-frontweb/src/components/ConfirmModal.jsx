import ConfirmDialog from '@/components/ui/confirm-dialog';

const ConfirmModal = ({ open, title, message, onConfirm, onCancel, confirmText = "Confirm", confirmVariant = "default" }) => {
  return (
    <ConfirmDialog
      open={open}
      setOpen={() => onCancel()}
      title={title}
      description={message}
      onConfirm={onConfirm}
      confirmText={confirmText}
      cancelText="Cancel"
      confirmVariant={confirmVariant}
    />
  );
};

export default ConfirmModal;
