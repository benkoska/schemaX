import React, { useEffect } from 'react';
import SchemaXLogo from '@/assets/logo_light.svg';
import SchemaXDarkLogo from '@/assets/logo_dark.svg';
import { examples } from './examples-data/examples-data';
import { ExampleCard } from './example-card';
import { useTheme } from '@/hooks/use-theme';
import { LocalConfigProvider } from '@/context/local-config-context/local-config-provider';
import { StorageProvider } from '@/context/storage-context/storage-provider';
import { ThemeProvider } from '@/context/theme-context/theme-provider';

const ExamplesPageComponent: React.FC = () => {
    const { effectiveTheme } = useTheme();
    useEffect(() => {
        document.title = 'SchemaX - Example Database Diagrams & Schemas';
    }, []);

    return (
        <section className="flex w-screen flex-col bg-background">
            <nav className="flex h-12 flex-row items-center justify-between border-b px-4">
                <div className="flex flex-1 justify-start gap-x-3">
                    <div className="flex items-center font-primary">
                        <a
                            href="https://schemax.io"
                            className="cursor-pointer"
                            rel="noreferrer"
                        >
                            <img
                                src={
                                    effectiveTheme === 'light'
                                        ? SchemaXLogo
                                        : SchemaXDarkLogo
                                }
                                alt="schemaX"
                                className="h-4 max-w-fit"
                            />
                        </a>
                    </div>
                </div>
                <div className="group flex flex-1 flex-row items-center justify-center"></div>
                <div className="hidden flex-1 justify-end sm:flex"></div>
            </nav>
            <div className="flex flex-col px-3 pt-3 text-center md:px-28 md:text-left">
                <h1 className="font-primary text-2xl font-bold">Examples</h1>
                <h2 className="mt-1 font-primary text-base text-muted-foreground">
                    A collection of examples to help you get started with
                    SchemaX.
                </h2>
                <div className="mt-6 grid grid-flow-row grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {examples.map((example) => (
                        <ExampleCard key={example.id} example={example} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export const ExamplesPage: React.FC = () => (
    <LocalConfigProvider>
        <StorageProvider>
            <ThemeProvider>
                <ExamplesPageComponent />
            </ThemeProvider>
        </StorageProvider>
    </LocalConfigProvider>
);
