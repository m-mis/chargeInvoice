export const ButtonBlue = ({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="mt-2 inline-flex justify-center rounded-sm bg-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-80 disabled:opacity-50"
    >
      {children}
    </button>
  );
};
