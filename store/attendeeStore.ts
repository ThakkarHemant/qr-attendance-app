// store/attendeeStore.ts

import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { create } from 'zustand';
import { db } from '../lib/firebase'; // ✅ FIXED PATH

type Attendee = {
  name: string;
  event_id: string;
  isPresent: boolean;
};

type State = {
  attendees: Attendee[];
  setAttendees: (newAttendees: Attendee[]) => void;
  fetchAttendees: () => Promise<void>;
  markAttended: (event_id: string) => Promise<void>;
};

export const useAttendeeStore = create<State>((set, get) => ({
  attendees: [],

  // ✅ SET DATA
  setAttendees: (newAttendees) => set({ attendees: newAttendees }),

  // ✅ FETCH FROM FIRESTORE
  fetchAttendees: async () => {
    try {
      const snapshot = await getDocs(collection(db, "events"));

      const attendees: Attendee[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();

        return {
          name: data.name,
          event_id: data.event_id,
          isPresent: data.isPresent ?? false,
        };
      });

      set({ attendees });
    } catch (err) {
      console.error('❌ Failed to fetch attendees:', err);
    }
  },

  // ✅ MARK ATTENDANCE (QR USE)
  markAttended: async (event_id: string) => {
    const attendee = get().attendees.find((a) => a.event_id === event_id);

    if (!attendee) {
      alert("❌ Invalid QR Code");
      return;
    }

    if (attendee.isPresent) {
      alert("⚠️ Already marked");
      return;
    }

    try {
      // 🔥 Update Firestore
      await updateDoc(doc(db, "events", event_id), {
        isPresent: true,
      });

      // 🔥 Update local state
      set((state) => ({
        attendees: state.attendees.map((a) =>
          a.event_id === event_id ? { ...a, isPresent: true } : a
        ),
      }));

      alert(`✅ Attendance marked for ${attendee.name}`);
    } catch (err) {
      console.error(`❌ Failed to mark ${event_id}:`, err);
    }
  },
}));