import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { HubButton } from '@/components/chrome';
import { colors, fonts, shadow } from '@/constants/theme';

type DialogRequest = {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm?: () => void;
};

type DialogContextValue = {
  alert: (title: string, message: string) => void;
  confirm: (title: string, message: string, onConfirm: () => void) => void;
};

const DialogContext = createContext<DialogContextValue | null>(null);

type AppDialogProps = {
  children: ReactNode;
};

export const AppDialog = ({ children }: AppDialogProps) => {
  const [request, setRequest] = useState<DialogRequest | null>(null);

  const handleClose = useCallback(() => {
    setRequest(null);
  }, []);

  const handleConfirm = useCallback(() => {
    const action = request?.onConfirm;
    setRequest(null);
    action?.();
  }, [request]);

  const alert = useCallback((title: string, message: string) => {
    setRequest({ title, message, confirmLabel: 'OK' });
  }, []);

  const confirm = useCallback((title: string, message: string, onConfirm: () => void) => {
    setRequest({
      title,
      message,
      confirmLabel: 'Log out',
      cancelLabel: 'Stay',
      onConfirm,
    });
  }, []);

  const value = useMemo(() => ({ alert, confirm }), [alert, confirm]);

  return (
    <DialogContext.Provider value={value}>
      {children}
      <Modal visible={request !== null} transparent animationType="fade" onRequestClose={handleClose}>
        <Pressable accessibilityLabel="Close dialog" style={styles.backdrop} onPress={handleClose}>
          <Pressable accessibilityRole="alert" style={styles.card} onPress={() => undefined}>
            <Text style={styles.title}>{request?.title}</Text>
            <Text style={styles.message}>{request?.message}</Text>
            <View style={styles.actions}>
              {request?.cancelLabel ? (
                <HubButton label={request.cancelLabel} variant="outline" onPress={handleClose} />
              ) : null}
              <HubButton
                label={request?.confirmLabel ?? 'OK'}
                variant={request?.cancelLabel ? 'danger' : 'black'}
                onPress={handleConfirm}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within AppDialog.');
  }
  return context;
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 18,
    ...shadow.float,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 20,
    textTransform: 'uppercase',
    color: colors.text,
  },
  message: {
    marginTop: 8,
    marginBottom: 16,
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    textTransform: 'none',
    color: colors.overview,
  },
  actions: {
    gap: 10,
  },
});
