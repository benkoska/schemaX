import React, { useCallback } from 'react';
import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from '@/components/menubar/menubar';
import { useChartDB } from '@/hooks/use-chartdb';
import ChartDBLogo from '@/assets/logo-light.png';
import ChartDBDarkLogo from '@/assets/logo-dark.png';
import { useDialog } from '@/hooks/use-dialog';
import { useExportImage } from '@/hooks/use-export-image';
import { databaseTypeToLabelMap } from '@/lib/databases';
import { DatabaseType } from '@/lib/domain/database-type';
import { useConfig } from '@/hooks/use-config';
import { IS_CHARTDB_IO } from '@/lib/env';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import {
    KeyboardShortcutAction,
    keyboardShortcutsForOS,
} from '@/context/keyboard-shortcuts-context/keyboard-shortcuts';
import { useHistory } from '@/hooks/use-history';
import { useTranslation } from 'react-i18next';
import { useLayout } from '@/hooks/use-layout';
import { useTheme } from '@/hooks/use-theme';
import { enMetadata } from '@/i18n/locales/en';
import { deMetadata } from '@/i18n/locales/de';
import { useLocalConfig } from '@/hooks/use-local-config';
import { DiagramName } from './diagram-name';
import { LastSaved } from './last-saved';

const languageMetadatas = [enMetadata, deMetadata];

export interface TopNavbarProps {}

export const TopNavbar: React.FC<TopNavbarProps> = () => {
    const { clearDiagramData, deleteDiagram, updateDiagramUpdatedAt } =
        useChartDB();
    const {
        openCreateDiagramDialog,
        openOpenDiagramDialog,
        openExportSQLDialog,
        openImportDatabaseDialog,
        showAlert,
        openExportImageDialog,
    } = useDialog();
    const { setTheme, theme } = useTheme();
    const { hideSidePanel, isSidePanelShowed, showSidePanel } = useLayout();
    const {
        scrollAction,
        setScrollAction,
        setShowCardinality,
        showCardinality,
        setShowDependenciesOnCanvas,
        showDependenciesOnCanvas,
    } = useLocalConfig();
    const { effectiveTheme } = useTheme();
    const { t, i18n } = useTranslation();
    const { redo, undo, hasRedo, hasUndo } = useHistory();
    const { isMd: isDesktop } = useBreakpoint('md');
    const { config, updateConfig } = useConfig();
    const { exportImage } = useExportImage();

    const createNewDiagram = () => {
        openCreateDiagramDialog();
    };

    const openDiagram = () => {
        openOpenDiagramDialog();
    };

    const exportSVG = useCallback(() => {
        exportImage('svg', 1);
    }, [exportImage]);

    const exportPNG = useCallback(() => {
        openExportImageDialog({
            format: 'png',
        });
    }, [openExportImageDialog]);

    const exportJPG = useCallback(() => {
        openExportImageDialog({
            format: 'jpeg',
        });
    }, [openExportImageDialog]);

    const openChartDBIO = useCallback(() => {
        window.location.href = 'https://chartdb.io';
    }, []);

    const exportSQL = useCallback(
        (databaseType: DatabaseType) => {
            if (databaseType === DatabaseType.GENERIC) {
                openExportSQLDialog({
                    targetDatabaseType: DatabaseType.GENERIC,
                });

                return;
            }

            if (IS_CHARTDB_IO) {
                const now = new Date();
                const lastExportsInLastHalfHour =
                    config?.exportActions?.filter(
                        (date) =>
                            now.getTime() - date.getTime() < 30 * 60 * 1000
                    ) ?? [];

                if (lastExportsInLastHalfHour.length >= 5) {
                    showAlert({
                        title: 'Export SQL Limit Reached',
                        content: (
                            <div className="flex flex-col gap-1 text-sm">
                                <div>
                                    We set a budget to allow the community to
                                    check the feature. You have reached the
                                    limit of 5 AI exports every 30min.
                                </div>
                                <div>
                                    Feel free to use your OPENAI_TOKEN, see the
                                    manual{' '}
                                    <a
                                        href="https://github.com/chartdb/chartdb"
                                        target="_blank"
                                        className="text-blue-600 hover:underline"
                                        rel="noreferrer"
                                    >
                                        here.
                                    </a>
                                </div>
                            </div>
                        ),
                        closeLabel: 'Close',
                    });
                    return;
                }

                updateConfig({
                    exportActions: [...lastExportsInLastHalfHour, now],
                });
            }

            openExportSQLDialog({
                targetDatabaseType: databaseType,
            });
        },
        [config?.exportActions, updateConfig, showAlert, openExportSQLDialog]
    );

    const renderStars = useCallback(() => {
        return (
            <iframe
                src={`https://ghbtns.com/github-btn.html?user=chartdb&repo=chartdb&type=star&size=${isDesktop ? 'large' : 'small'}&text=false`}
                width={isDesktop ? '40' : '25'}
                height={isDesktop ? '30' : '20'}
                title="GitHub"
            ></iframe>
        );
    }, [isDesktop]);

    const showOrHideSidePanel = useCallback(() => {
        if (isSidePanelShowed) {
            hideSidePanel();
        } else {
            showSidePanel();
        }
    }, [isSidePanelShowed, showSidePanel, hideSidePanel]);

    const showOrHideCardinality = useCallback(() => {
        setShowCardinality(!showCardinality);
    }, [showCardinality, setShowCardinality]);

    const showOrHideDependencies = useCallback(() => {
        setShowDependenciesOnCanvas(!showDependenciesOnCanvas);
    }, [showDependenciesOnCanvas, setShowDependenciesOnCanvas]);

    const emojiAI = '✨';

    const changeLanguage = useCallback(
        (language: string) => {
            i18n.changeLanguage(language);
        },
        [i18n]
    );

    return (
        <nav className="flex h-20 flex-col justify-between border-b px-3 md:h-12 md:flex-row md:items-center md:px-4">
            <div className="flex flex-1 justify-between gap-x-3 md:justify-normal">
                <div className="flex py-[10px] font-primary md:items-center md:py-0">
                    <a
                        href="https://chartdb.io"
                        className="cursor-pointer"
                        rel="noreferrer"
                    >
                        <img
                            src={
                                effectiveTheme === 'light'
                                    ? ChartDBLogo
                                    : ChartDBDarkLogo
                            }
                            alt="chartDB"
                            className="h-4 max-w-fit"
                        />
                    </a>
                </div>
                <div>
                    <Menubar className="border-none shadow-none">
                        <MenubarMenu>
                            <MenubarTrigger>
                                {t('menu.file.file')}
                            </MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem onClick={createNewDiagram}>
                                    {t('menu.file.new')}
                                </MenubarItem>
                                <MenubarItem onClick={openDiagram}>
                                    {t('menu.file.open')}
                                    <MenubarShortcut>
                                        {
                                            keyboardShortcutsForOS[
                                                KeyboardShortcutAction
                                                    .OPEN_DIAGRAM
                                            ].keyCombinationLabel
                                        }
                                    </MenubarShortcut>
                                </MenubarItem>
                                <MenubarItem onClick={updateDiagramUpdatedAt}>
                                    {t('menu.file.save')}
                                    <MenubarShortcut>
                                        {
                                            keyboardShortcutsForOS[
                                                KeyboardShortcutAction
                                                    .SAVE_DIAGRAM
                                            ].keyCombinationLabel
                                        }
                                    </MenubarShortcut>
                                </MenubarItem>
                                <MenubarSeparator />
                                <MenubarSub>
                                    <MenubarSubTrigger>
                                        {t('menu.file.import_database')}
                                    </MenubarSubTrigger>
                                    <MenubarSubContent>
                                        <MenubarItem
                                            onClick={() =>
                                                openImportDatabaseDialog({
                                                    databaseType:
                                                        DatabaseType.POSTGRESQL,
                                                })
                                            }
                                        >
                                            {
                                                databaseTypeToLabelMap[
                                                    'postgresql'
                                                ]
                                            }
                                        </MenubarItem>
                                        <MenubarItem
                                            onClick={() =>
                                                openImportDatabaseDialog({
                                                    databaseType:
                                                        DatabaseType.MYSQL,
                                                })
                                            }
                                        >
                                            {databaseTypeToLabelMap['mysql']}
                                        </MenubarItem>
                                        <MenubarItem
                                            onClick={() =>
                                                openImportDatabaseDialog({
                                                    databaseType:
                                                        DatabaseType.SQL_SERVER,
                                                })
                                            }
                                        >
                                            {
                                                databaseTypeToLabelMap[
                                                    'sql_server'
                                                ]
                                            }
                                        </MenubarItem>
                                        <MenubarItem
                                            onClick={() =>
                                                openImportDatabaseDialog({
                                                    databaseType:
                                                        DatabaseType.MARIADB,
                                                })
                                            }
                                        >
                                            {databaseTypeToLabelMap['mariadb']}
                                        </MenubarItem>
                                        <MenubarItem
                                            onClick={() =>
                                                openImportDatabaseDialog({
                                                    databaseType:
                                                        DatabaseType.SQLITE,
                                                })
                                            }
                                        >
                                            {databaseTypeToLabelMap['sqlite']}
                                        </MenubarItem>
                                    </MenubarSubContent>
                                </MenubarSub>
                                <MenubarSeparator />
                                <MenubarSub>
                                    <MenubarSubTrigger>
                                        {t('menu.file.export_sql')}
                                    </MenubarSubTrigger>
                                    <MenubarSubContent>
                                        <MenubarItem
                                            onClick={() =>
                                                exportSQL(DatabaseType.GENERIC)
                                            }
                                        >
                                            {databaseTypeToLabelMap['generic']}
                                        </MenubarItem>
                                        <MenubarItem
                                            onClick={() =>
                                                exportSQL(
                                                    DatabaseType.POSTGRESQL
                                                )
                                            }
                                        >
                                            {
                                                databaseTypeToLabelMap[
                                                    'postgresql'
                                                ]
                                            }
                                            <MenubarShortcut className="text-base">
                                                {emojiAI}
                                            </MenubarShortcut>
                                        </MenubarItem>
                                        <MenubarItem
                                            onClick={() =>
                                                exportSQL(DatabaseType.MYSQL)
                                            }
                                        >
                                            {databaseTypeToLabelMap['mysql']}
                                            <MenubarShortcut className="text-base">
                                                {emojiAI}
                                            </MenubarShortcut>
                                        </MenubarItem>
                                        <MenubarItem
                                            onClick={() =>
                                                exportSQL(
                                                    DatabaseType.SQL_SERVER
                                                )
                                            }
                                        >
                                            {
                                                databaseTypeToLabelMap[
                                                    'sql_server'
                                                ]
                                            }
                                            <MenubarShortcut className="text-base">
                                                {emojiAI}
                                            </MenubarShortcut>
                                        </MenubarItem>
                                        <MenubarItem
                                            onClick={() =>
                                                exportSQL(DatabaseType.MARIADB)
                                            }
                                        >
                                            {databaseTypeToLabelMap['mariadb']}
                                            <MenubarShortcut className="text-base">
                                                {emojiAI}
                                            </MenubarShortcut>
                                        </MenubarItem>
                                        <MenubarItem
                                            onClick={() =>
                                                exportSQL(DatabaseType.SQLITE)
                                            }
                                        >
                                            {databaseTypeToLabelMap['sqlite']}
                                            <MenubarShortcut className="text-base">
                                                {emojiAI}
                                            </MenubarShortcut>
                                        </MenubarItem>
                                    </MenubarSubContent>
                                </MenubarSub>
                                <MenubarSub>
                                    <MenubarSubTrigger>
                                        {t('menu.file.export_as')}
                                    </MenubarSubTrigger>
                                    <MenubarSubContent>
                                        <MenubarItem onClick={exportPNG}>
                                            PNG
                                        </MenubarItem>
                                        <MenubarItem onClick={exportJPG}>
                                            JPG
                                        </MenubarItem>
                                        <MenubarItem onClick={exportSVG}>
                                            SVG
                                        </MenubarItem>
                                    </MenubarSubContent>
                                </MenubarSub>
                                <MenubarSeparator />
                                <MenubarItem
                                    onClick={() =>
                                        showAlert({
                                            title: t(
                                                'delete_diagram_alert.title'
                                            ),
                                            description: t(
                                                'delete_diagram_alert.description'
                                            ),
                                            actionLabel: t(
                                                'delete_diagram_alert.delete'
                                            ),
                                            closeLabel: t(
                                                'delete_diagram_alert.cancel'
                                            ),
                                            onAction: deleteDiagram,
                                        })
                                    }
                                >
                                    {t('menu.file.delete_diagram')}
                                </MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem>{t('menu.file.exit')}</MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                        <MenubarMenu>
                            <MenubarTrigger>
                                {t('menu.edit.edit')}
                            </MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem onClick={undo} disabled={!hasUndo}>
                                    {t('menu.edit.undo')}
                                    <MenubarShortcut>
                                        {
                                            keyboardShortcutsForOS[
                                                KeyboardShortcutAction.UNDO
                                            ].keyCombinationLabel
                                        }
                                    </MenubarShortcut>
                                </MenubarItem>
                                <MenubarItem onClick={redo} disabled={!hasRedo}>
                                    {t('menu.edit.redo')}
                                    <MenubarShortcut>
                                        {
                                            keyboardShortcutsForOS[
                                                KeyboardShortcutAction.REDO
                                            ].keyCombinationLabel
                                        }
                                    </MenubarShortcut>
                                </MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem
                                    onClick={() =>
                                        showAlert({
                                            title: t(
                                                'clear_diagram_alert.title'
                                            ),
                                            description: t(
                                                'clear_diagram_alert.description'
                                            ),
                                            actionLabel: t(
                                                'clear_diagram_alert.clear'
                                            ),
                                            closeLabel: t(
                                                'clear_diagram_alert.cancel'
                                            ),
                                            onAction: clearDiagramData,
                                        })
                                    }
                                >
                                    {t('menu.edit.clear')}
                                </MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                        <MenubarMenu>
                            <MenubarTrigger>
                                {t('menu.view.view')}
                            </MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem onClick={showOrHideSidePanel}>
                                    {isSidePanelShowed
                                        ? t('menu.view.hide_sidebar')
                                        : t('menu.view.show_sidebar')}
                                </MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem onClick={showOrHideCardinality}>
                                    {showCardinality
                                        ? t('menu.view.hide_cardinality')
                                        : t('menu.view.show_cardinality')}
                                </MenubarItem>
                                <MenubarItem onClick={showOrHideDependencies}>
                                    {showDependenciesOnCanvas
                                        ? t('menu.view.hide_dependencies')
                                        : t('menu.view.show_dependencies')}
                                </MenubarItem>
                                <MenubarSeparator />
                                <MenubarSub>
                                    <MenubarSubTrigger>
                                        {t('menu.view.zoom_on_scroll')}
                                    </MenubarSubTrigger>
                                    <MenubarSubContent>
                                        <MenubarCheckboxItem
                                            checked={scrollAction === 'zoom'}
                                            onClick={() =>
                                                setScrollAction('zoom')
                                            }
                                        >
                                            {t('zoom.on')}
                                        </MenubarCheckboxItem>
                                        <MenubarCheckboxItem
                                            checked={scrollAction === 'pan'}
                                            onClick={() =>
                                                setScrollAction('pan')
                                            }
                                        >
                                            {t('zoom.off')}
                                        </MenubarCheckboxItem>
                                    </MenubarSubContent>
                                </MenubarSub>
                                <MenubarSeparator />
                                <MenubarSub>
                                    <MenubarSubTrigger>
                                        {t('menu.view.theme')}
                                    </MenubarSubTrigger>
                                    <MenubarSubContent>
                                        <MenubarCheckboxItem
                                            checked={theme === 'system'}
                                            onClick={() => setTheme('system')}
                                        >
                                            {t('theme.system')}
                                        </MenubarCheckboxItem>
                                        <MenubarCheckboxItem
                                            checked={theme === 'light'}
                                            onClick={() => setTheme('light')}
                                        >
                                            {t('theme.light')}
                                        </MenubarCheckboxItem>
                                        <MenubarCheckboxItem
                                            checked={theme === 'dark'}
                                            onClick={() => setTheme('dark')}
                                        >
                                            {t('theme.dark')}
                                        </MenubarCheckboxItem>
                                    </MenubarSubContent>
                                </MenubarSub>
                                <MenubarSeparator />
                                <MenubarSub>
                                    <MenubarSubTrigger>
                                        {t('menu.view.change_language')}
                                    </MenubarSubTrigger>
                                    <MenubarSubContent>
                                        {languageMetadatas.map(
                                            (metadata, index) => (
                                                <MenubarCheckboxItem
                                                    onClick={() =>
                                                        changeLanguage(
                                                            metadata.code
                                                        )
                                                    }
                                                    checked={
                                                        i18n.language ===
                                                        metadata.code
                                                    }
                                                >
                                                    {metadata.name}
                                                </MenubarCheckboxItem>
                                            )
                                        )}
                                    </MenubarSubContent>
                                </MenubarSub>
                            </MenubarContent>
                        </MenubarMenu>
                        <MenubarMenu>
                            <MenubarTrigger>
                                {t('menu.help.help')}
                            </MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem onClick={openChartDBIO}>
                                    {t('menu.help.visit_website')}
                                </MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                </div>
            </div>
            {isDesktop ? (
                <>
                    <div className="group flex flex-1 flex-row items-center justify-center">
                        <DiagramName />
                    </div>
                    <div className="hidden flex-1 items-center justify-end gap-2 sm:flex">
                        <LastSaved />
                        {renderStars()}
                    </div>
                </>
            ) : (
                <div className="flex flex-1 flex-row justify-between gap-2">
                    <div className="group flex flex-1 flex-row items-center">
                        <DiagramName />
                    </div>
                    <div className="flex items-center">
                        <LastSaved />
                    </div>
                    <div className="flex items-center">{renderStars()}</div>
                </div>
            )}
        </nav>
    );
};
