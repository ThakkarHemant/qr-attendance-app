// context/AttendanceContext.tsx
import React, { createContext, useContext, useState } from 'react';

type Entry = {
  regno: string;
  roll: string;
};

const AttendanceContext = createContext<{
  entries: Entry[];
  addEntry: (entry: Entry) => void;
}>({
  entries: [],
  addEntry: () => {},
});

export const useAttendance = () => useContext(AttendanceContext);

export const AttendanceProvider = ({ children }: { children: React.ReactNode }) => {
  const [entries, setEntries] = useState<Entry[]>([]);

  const addEntry = (entry: Entry) => {
    setEntries((prev) => [...prev, entry]);
  };

  return (
    <AttendanceContext.Provider value={{ entries, addEntry }}>
      {children}
    </AttendanceContext.Provider>
  );
};
