import { toast } from "sonner";

type ToastMessages = {
  loading: string;
  success: string;
  error: string;
};

type ToastCallbacks<T> = {
  onSuccess?: (data: T) => void;
  onError?: (message: string) => void;
  onFinally?: () => void;
};

export async function runWithToast<T>(
  promise: Promise<T>,
  messages: ToastMessages,
  callbacks?: ToastCallbacks<T>
): Promise<T | undefined> {
  toast.dismiss();
  const loadingId = toast.loading(messages.loading);

  try {
    const data = await promise;
    toast.dismiss(loadingId);
    toast.success(messages.success);
    callbacks?.onSuccess?.(data);
    return data;
  } catch (error) {
    toast.dismiss(loadingId);
    const message = error instanceof Error ? error.message : "Algo salió mal";
    toast.error(messages.error);
    callbacks?.onError?.(message);
    return undefined;
  } finally {
    callbacks?.onFinally?.();
  }
}
