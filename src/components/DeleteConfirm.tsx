"use client";

interface DeleteConfirmProps {
  bookTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirm({
  bookTitle,
  onConfirm,
  onCancel,
}: DeleteConfirmProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-warm-800 rounded-2xl p-6 mx-4 max-w-sm w-full shadow-xl">
        <h3 className="font-heading text-lg font-bold text-warm-900 dark:text-warm-50">
          Delete Book
        </h3>
        <p className="mt-2 text-warm-600 dark:text-warm-300 text-sm">
          Are you sure you want to delete <strong>{bookTitle}</strong>? This
          action cannot be undone.
        </p>
        <div className="mt-4 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-warm-100 text-warm-700 dark:bg-warm-700 dark:text-warm-200 hover:bg-warm-200 dark:hover:bg-warm-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
