"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { User, Category, SubCategory, Categories } from "@/types"; // ✅ import from your type.d.ts

interface ModalProviderProps {
  children: React.ReactNode;
}

export type ModalData = {
  user?: User;
  category?: Category;
  subCategory?: SubCategory;
  categories?: Categories;
};

type ModalContextType = {
  data: ModalData;
  isOpen: boolean;
  openModal: (
    modal: React.ReactNode,
    fetchData?: () => Promise<Partial<ModalData>>
  ) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType>({
  data: {},
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ModalData>({});
  const [showingModal, setShowingModal] = useState<React.ReactNode>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const openModal = async (
    modal: React.ReactNode,
    fetchData?: () => Promise<Partial<ModalData>>
  ) => {
    if (modal) {
      if (fetchData) {
        setData(await fetchData());
      }
      setShowingModal(modal);
      setIsOpen(true);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setData({});
    setShowingModal(null);
  };

  if (!isMounted) return null;

  return (
    <ModalContext.Provider value={{ data, isOpen, openModal, closeModal }}>
      {children}
      {showingModal}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);

export default ModalProvider;
