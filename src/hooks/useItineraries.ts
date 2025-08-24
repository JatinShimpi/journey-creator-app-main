import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export interface Itinerary {
  id: string;
  title: string;
  destination: string;
  type: 'adventure' | 'leisure' | 'work';
  duration: string;
  activities: string[];
  startDate?: Date;
  endDate?: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  isFavorite?: boolean;
}

export const useItineraries = () => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setItineraries([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'itineraries'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const itinerariesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        startDate: doc.data().startDate?.toDate(),
        endDate: doc.data().endDate?.toDate(),
      })) as Itinerary[];
      
      setItineraries(itinerariesData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const createItinerary = async (itineraryData: Omit<Itinerary, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User must be authenticated');

    const docData = {
      ...itineraryData,
      userId: user.uid,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      startDate: itineraryData.startDate ? Timestamp.fromDate(itineraryData.startDate) : null,
      endDate: itineraryData.endDate ? Timestamp.fromDate(itineraryData.endDate) : null,
    };

    await addDoc(collection(db, 'itineraries'), docData);
  };

  const updateItinerary = async (id: string, updates: Partial<Itinerary>) => {
    const docRef = doc(db, 'itineraries', id);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
      startDate: updates.startDate ? Timestamp.fromDate(updates.startDate) : undefined,
      endDate: updates.endDate ? Timestamp.fromDate(updates.endDate) : undefined,
    };

    await updateDoc(docRef, updateData);
  };

  const deleteItinerary = async (id: string) => {
    await deleteDoc(doc(db, 'itineraries', id));
  };

  const toggleFavorite = async (id: string, currentFavorite: boolean) => {
    await updateItinerary(id, { isFavorite: !currentFavorite });
  };

  return {
    itineraries,
    loading,
    createItinerary,
    updateItinerary,
    deleteItinerary,
    toggleFavorite,
  };
};