import { createContext } from 'react';
import { emptyFn } from '@/lib/utils';
import type { BaseAlertDialogProps } from '@/dialogs/base-alert-dialog/base-alert-dialog';
import type { TableSchemaDialogProps } from '@/dialogs/table-schema-dialog/table-schema-dialog';
import type { ImportDatabaseDialogProps } from '@/dialogs/import-database-dialog/import-database-dialog';
import type { ExportSQLDialogProps } from '@/dialogs/export-sql-dialog/export-sql-dialog';
import type { ExportImageDialogProps } from '@/dialogs/export-image-dialog/export-image-dialog';

export interface DialogContext {
    // Create diagram dialog
    openCreateDiagramDialog: () => void;
    closeCreateDiagramDialog: () => void;

    // Open diagram dialog
    openOpenDiagramDialog: () => void;
    closeOpenDiagramDialog: () => void;

    // Export SQL dialog
    openExportSQLDialog: (params: Omit<ExportSQLDialogProps, 'dialog'>) => void;
    closeExportSQLDialog: () => void;

    // Alert dialog
    showAlert: (params: BaseAlertDialogProps) => void;
    closeAlert: () => void;

    // Create relationship dialog
    openCreateRelationshipDialog: () => void;
    closeCreateRelationshipDialog: () => void;

    // Import database dialog
    openImportDatabaseDialog: (
        params: Omit<ImportDatabaseDialogProps, 'dialog'>
    ) => void;
    closeImportDatabaseDialog: () => void;

    // Change table schema dialog
    openTableSchemaDialog: (
        params: Omit<TableSchemaDialogProps, 'dialog'>
    ) => void;
    closeTableSchemaDialog: () => void;

    // Export image dialog
    openExportImageDialog: (
        params: Omit<ExportImageDialogProps, 'dialog'>
    ) => void;
    closeExportImageDialog: () => void;
}

export const dialogContext = createContext<DialogContext>({
    openCreateDiagramDialog: emptyFn,
    closeCreateDiagramDialog: emptyFn,
    openOpenDiagramDialog: emptyFn,
    closeOpenDiagramDialog: emptyFn,
    openExportSQLDialog: emptyFn,
    closeExportSQLDialog: emptyFn,
    closeAlert: emptyFn,
    showAlert: emptyFn,
    closeCreateRelationshipDialog: emptyFn,
    openCreateRelationshipDialog: emptyFn,
    openImportDatabaseDialog: emptyFn,
    closeImportDatabaseDialog: emptyFn,
    openTableSchemaDialog: emptyFn,
    closeTableSchemaDialog: emptyFn,
    openExportImageDialog: emptyFn,
    closeExportImageDialog: emptyFn,
});
