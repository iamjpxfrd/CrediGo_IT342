import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AlertModal = ({ open, title, message, onClose, type = 'info' }) => {
  // Color by type
  const color = type === 'error' ? 'text-red-400' : type === 'success' ? 'text-green-400' : 'text-credigo-accent';

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-credigo-input-bg/95 backdrop-blur-sm border border-gray-700/50 text-credigo-light">
        <AlertDialogHeader>
          <AlertDialogTitle className={color}>{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={onClose}
            className="bg-credigo-accent text-credigo-dark font-semibold hover:bg-credigo-accent/90"
          >
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertModal;
