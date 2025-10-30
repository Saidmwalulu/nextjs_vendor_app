// CustomModal.tsx
"use client";

import { useModal } from "@/providers/modal-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";

type Props = {
  heading?: string;
  subheading?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  maxWidth?: string;
};

const CustomModal = ({
  children,
  defaultOpen,
  subheading,
  heading,
  maxWidth,
}: Props) => {
  const { isOpen, closeModal } = useModal();

  return (
    <Dialog open={isOpen || defaultOpen} onOpenChange={closeModal} modal={false}>
  <DialogContent
    className={cn(
      "overflow-y-auto md:max-h-[700px] md:h-fit h-screen bg-card pointer-events-auto",
      maxWidth
    )}
  >
    <DialogHeader className="pb-[2px] text-left">
      {heading ? (
        <DialogTitle className="text-2xl font-bold">{heading}</DialogTitle>
      ) : (
        // ✅ Always include a DialogTitle for accessibility
        <VisuallyHidden>
          <DialogTitle>Modal</DialogTitle>
        </VisuallyHidden>
      )}

      {subheading && <DialogDescription>{subheading}</DialogDescription>}
    </DialogHeader>

    {/* ✅ children outside header, no extra padding-top */}
    <div>{children}</div>
  </DialogContent>
</Dialog>

  );
};

export default CustomModal;
