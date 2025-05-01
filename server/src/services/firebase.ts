import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, getDoc, addDoc, updateDoc, doc, query, where, orderBy, limit, Timestamp, serverTimestamp } from 'firebase/firestore';
import { HelpRequest, KnowledgeEntry, Stats } from '../../../shared/types/index.js';
import logger from '../utils/logger.js';

// Initialize Firebase
let db: ReturnType<typeof getFirestore>;

export const initializeFirebase = () => {
  try {
    // Check if we're using emulator
    const useEmulator = process.env.USE_FIREBASE_EMULATOR === 'true';
    
    // Firebase configuration
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID
    };

    // If any required config is missing in production, throw error
    if (!useEmulator) {
      Object.entries(firebaseConfig).forEach(([key, value]) => {
        if (!value) {
          throw new Error(`Firebase config missing: ${key}`);
        }
      });
    }

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);

    // Connect to emulator if needed
    if (useEmulator) {
      logger.info('Using Firebase Emulator');
      // Implement emulator connection here if needed
    }

    logger.info('Firebase initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Firebase', error);
    throw error;
  }
};

// Requests collection operations
export const getRequests = async (): Promise<HelpRequest[]> => {
  try {
    const requestsCollection = collection(db, 'requests');
    const requestsQuery = query(requestsCollection, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(requestsQuery);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate().toISOString() || new Date().toISOString(),
        responseTimestamp: data.responseTimestamp?.toDate().toISOString(),
      } as HelpRequest;
    });
  } catch (error) {
    logger.error('Error getting requests', error);
    throw error;
  }
};

export const getPendingRequests = async (): Promise<HelpRequest[]> => {
  try {
    const requestsCollection = collection(db, 'requests');
    const requestsQuery = query(
      requestsCollection,
      where('status', '==', 'pending'),
      orderBy('timestamp', 'asc')
    );
    const snapshot = await getDocs(requestsQuery);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate().toISOString() || new Date().toISOString(),
        responseTimestamp: data.responseTimestamp?.toDate().toISOString(),
      } as HelpRequest;
    });
  } catch (error) {
    logger.error('Error getting pending requests', error);
    throw error;
  }
};

export const getRequestById = async (id: string): Promise<HelpRequest | null> => {
  try {
    const requestDoc = doc(db, 'requests', id);
    const snapshot = await getDoc(requestDoc);
    
    if (!snapshot.exists()) {
      return null;
    }
    
    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data,
      timestamp: data.timestamp?.toDate().toISOString() || new Date().toISOString(),
      responseTimestamp: data.responseTimestamp?.toDate().toISOString(),
    } as HelpRequest;
  } catch (error) {
    logger.error(`Error getting request with ID: ${id}`, error);
    throw error;
  }
};

export const createRequest = async (request: Omit<HelpRequest, 'id'>): Promise<string> => {
  try {
    const requestsCollection = collection(db, 'requests');
    const docRef = await addDoc(requestsCollection, {
      ...request,
      timestamp: serverTimestamp(),
    });
    
    logger.info(`Created new request with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    logger.error('Error creating request', error);
    throw error;
  }
};

export const updateRequest = async (id: string, update: Partial<HelpRequest>): Promise<void> => {
  try {
    const requestDoc = doc(db, 'requests', id);
    
    // If updating to resolved status, add response timestamp
    const updateData = update.status === 'resolved' 
      ? { ...update, responseTimestamp: serverTimestamp() }
      : update;
      
    await updateDoc(requestDoc, updateData);
    logger.info(`Updated request with ID: ${id}`);
  } catch (error) {
    logger.error(`Error updating request with ID: ${id}`, error);
    throw error;
  }
};

// Knowledge base operations
export const getKnowledgeEntries = async (): Promise<KnowledgeEntry[]> => {
  try {
    const knowledgeCollection = collection(db, 'knowledge');
    const knowledgeQuery = query(knowledgeCollection, orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(knowledgeQuery);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
      } as KnowledgeEntry;
    });
  } catch (error) {
    logger.error('Error getting knowledge entries', error);
    throw error;
  }
};

export const createKnowledgeEntry = async (entry: Omit<KnowledgeEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const knowledgeCollection = collection(db, 'knowledge');
    const docRef = await addDoc(knowledgeCollection, {
      ...entry,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    logger.info(`Created new knowledge entry with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    logger.error('Error creating knowledge entry', error);
    throw error;
  }
};

export const updateKnowledgeEntry = async (id: string, update: Partial<KnowledgeEntry>): Promise<void> => {
  try {
    const knowledgeDoc = doc(db, 'knowledge', id);
    await updateDoc(knowledgeDoc, {
      ...update,
      updatedAt: serverTimestamp(),
    });
    logger.info(`Updated knowledge entry with ID: ${id}`);
  } catch (error) {
    logger.error(`Error updating knowledge entry with ID: ${id}`, error);
    throw error;
  }
};

// Stats operations
export const getStats = async (): Promise<Stats> => {
  try {
    const requestsCollection = collection(db, 'requests');
    const allRequestsSnapshot = await getDocs(requestsCollection);
    const pendingRequestsQuery = query(requestsCollection, where('status', '==', 'pending'));
    const pendingRequestsSnapshot = await getDocs(pendingRequestsQuery);
    const resolvedRequestsQuery = query(requestsCollection, where('status', '==', 'resolved'));
    const resolvedRequestsSnapshot = await getDocs(resolvedRequestsQuery);
    
    const totalRequests = allRequestsSnapshot.size;
    const pendingRequests = pendingRequestsSnapshot.size;
    const resolvedRequests = resolvedRequestsSnapshot.size;
    
    const responseRate = totalRequests > 0 
      ? (resolvedRequests / totalRequests) * 100 
      : 0;
    
    // Calculate average response time
    let totalResponseTime = 0;
    let responsesWithTime = 0;
    
    resolvedRequestsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.timestamp && data.responseTimestamp) {
        const timestamp = data.timestamp.toDate();
        const responseTimestamp = data.responseTimestamp.toDate();
        totalResponseTime += responseTimestamp.getTime() - timestamp.getTime();
        responsesWithTime++;
      }
    });
    
    const avgResponseTime = responsesWithTime > 0 
      ? totalResponseTime / responsesWithTime 
      : undefined;
    
    return {
      totalRequests,
      pendingRequests,
      resolvedRequests,
      responseRate,
      avgResponseTime
    };
  } catch (error) {
    logger.error('Error getting stats', error);
    throw error;
  }
}; 