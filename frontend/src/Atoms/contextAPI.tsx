import { createContext, useContext, useState, useEffect } from "react";
interface ElectionProgressContextType {
    electionProgress: boolean;
    updateElectionProgress: (value: boolean) => void;
}
const ElectionProgressContext = createContext<ElectionProgressContextType | undefined>(undefined);

export const ElectionProgressProvider = ({ children }: { children: React.ReactNode }) => {
    const [electionProgress, setElectionProgress] = useState<boolean>(() => {
        return JSON.parse(localStorage.getItem("electionProgress") || "false");
    });

    const updateElectionProgress = (value: boolean) => {
        setElectionProgress(value);
        localStorage.setItem("electionProgress", JSON.stringify(value));
    };

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "electionProgress") {
                setElectionProgress(JSON.parse(event.newValue || "false"));
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <ElectionProgressContext.Provider value={{ electionProgress, updateElectionProgress }}>
            {children}
        </ElectionProgressContext.Provider>
    );
};


// Custom hook to use ElectionProgress context
export const useElectionProgress = (): ElectionProgressContextType => {
    const context = useContext(ElectionProgressContext);
    if (!context) {
        throw new Error("useElectionProgress must be used within an ElectionProgressProvider");
    }
    return context;
};


interface HasVotedContextType {
    hasVoted: boolean;
    updateHasVoted: (value: boolean) => void;
}

const HasVotedContext = createContext<HasVotedContextType | undefined>(undefined);

export const HasVotedProvider = ({ children }: { children: React.ReactNode }) => {
    const [hasVoted, setHasVoted] = useState<boolean>(() => {
        return JSON.parse(localStorage.getItem("hasVoted") || "false");
    });

    const updateHasVoted = (value: boolean) => {
        setHasVoted(value);
        localStorage.setItem("hasVoted", JSON.stringify(value));
    };

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "hasVoted") {
                setHasVoted(JSON.parse(event.newValue || "false"));
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <HasVotedContext.Provider value={{ hasVoted, updateHasVoted }}>
            {children}
        </HasVotedContext.Provider>
    );
};

// Custom hook to use HasVoted context
export const useHasVoted = (): HasVotedContextType => {
    const context = useContext(HasVotedContext);
    if (!context) {
        throw new Error("useHasVoted must be used within a HasVotedProvider");
    }
    return context;
};


