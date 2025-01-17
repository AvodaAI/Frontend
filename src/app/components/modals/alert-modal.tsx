'use client';

import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Modal } from '../ui/modal';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  content?: JSX.Element;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  content,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;

  return (
    <Modal
      title={'Are you sure?'}
      description="This action cannot be undone."
      isOpen={isOpen}
      onClose={onClose}
    >
      {content}
      <div className="pt-6 space-x-2 flex items-center justify-end w-96">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          Continue
        </Button>
      </div>
    </Modal>
  );
};
