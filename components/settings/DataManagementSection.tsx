"use client";

import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { SettingsGroup } from "@/components/settings/SettingsGroup";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { ConfirmDialog } from "@/components/settings/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import {
  exportBackup,
  importBackup,
  readFileAsJSON,
  validateBackup,
  BackupValidationError,
  type BackupPayload,
} from "@/lib/backup";

export function DataManagementSection() {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [pendingBackup, setPendingBackup] = useState<BackupPayload | null>(null);

  async function handleExport() {
    setIsExporting(true);
    try {
      await exportBackup();
      showToast("Резервная копия сохранена");
    } catch {
      showToast("Не удалось создать копию", "error");
    } finally {
      setIsExporting(false);
    }
  }

  function handleRestoreClick() {
    fileInputRef.current?.click();
  }

  async function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const raw = await readFileAsJSON(file);
      const payload = validateBackup(raw);
      setPendingBackup(payload);
    } catch (error) {
      const message =
        error instanceof BackupValidationError ? error.message : "Не удалось прочитать файл";
      showToast(message, "error");
    }
  }

  async function handleConfirmImport() {
    if (!pendingBackup) return;
    setIsImporting(true);
    try {
      await importBackup(pendingBackup);
      showToast("Данные восстановлены из копии");
    } catch {
      showToast("Не удалось восстановить данные", "error");
    } finally {
      setIsImporting(false);
      setPendingBackup(null);
    }
  }

  return (
    <>
      <SettingsGroup
        title="Управление данными"
        footer="Резервная копия сохраняется как JSON-файл на твоё устройство. Восстановление полностью заменит текущие данные."
      >
        <SettingsRow
          icon={<Download size={15} />}
          iconColor="var(--accent-blue)"
          label="Создать резервную копию"
          onClick={handleExport}
          loading={isExporting}
        />
        <SettingsRow
          icon={<Upload size={15} />}
          iconColor="var(--accent-green)"
          label="Восстановить из копии"
          onClick={handleRestoreClick}
          loading={isImporting}
          isLast
        />
      </SettingsGroup>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleFileSelected}
      />

      <ConfirmDialog
        open={pendingBackup !== null}
        title="Восстановить данные?"
        message="Текущие данные будут удалены и заменены содержимым резервной копии. Это действие необратимо."
        confirmLabel="Продолжить"
        destructive
        onConfirm={handleConfirmImport}
        onCancel={() => setPendingBackup(null)}
      />
    </>
  );
}
