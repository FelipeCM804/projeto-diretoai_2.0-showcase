
import React, { createContext, useContext, useEffect, useState } from 'react';

interface SettingsContextType {
    isClaraEnabled: boolean;
    setIsClaraEnabled: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isClaraEnabled, setIsClaraEnabled] = useState<boolean>(() => {
        const saved = localStorage.getItem('erp_clara_enabled');
        // Default to false as requested by the user
        return saved === 'true';
    });

    useEffect(() => {
        localStorage.setItem('erp_clara_enabled', String(isClaraEnabled));
    }, [isClaraEnabled]);

    return (
        <SettingsContext.Provider value={{ isClaraEnabled, setIsClaraEnabled }}>
            {children}
        </SettingsContext.Provider>
    );
};
