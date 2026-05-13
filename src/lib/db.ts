import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot,
  increment,
  query,
  orderBy,
  where,
  serverTimestamp
} from "firebase/firestore";

export interface OrderData {
  items: any[];
  total: number;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    landmark?: string;
    city: string;
    state: string;
    zip: string;
    customerId?: string | null;
  };
  status: string;
}

export const saveOrder = async (order: OrderData) => {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...order,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving order:", error);
    throw error;
  }
};

export const updateProductStock = async (productId: string, amount: number) => {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
      stock: increment(-amount)
    });
  } catch (error) {
    console.error("Error updating stock:", error);
  }
};

export const updateOrderStatusInDb = async (orderId: string, status: string) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status });
  } catch (error) {
    console.error("Error updating order status:", error);
  }
};

export const subscribeToOrders = (callback: (orders: any[]) => void) => {
  const q = query(collection(db, "orders"));
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    callback(orders);
  }, (error) => {
    console.error("Admin Orders Error:", error);
    callback([]);
  });
};

export const saveUserProfile = async (userId: string, data: any) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, data);
  } catch (error: any) {
    // If doc doesn't exist, use setDoc instead (handled by updateDoc fail if we want to be simple, but let's just use setDoc with merge)
    const { setDoc } = await import("firebase/firestore");
    await setDoc(doc(db, "users", userId), data, { merge: true });
  }
};

export const getUserProfile = (userId: string, callback: (data: any) => void) => {
  return onSnapshot(doc(db, "users", userId), (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    } else {
      callback(null);
    }
  });
};

export const subscribeToCustomerOrders = (userId: string, email: string, callback: (orders: any[]) => void) => {
  // We use the most reliable nested query first, as that is the current standard
  const q = query(collection(db, "orders"), where("customer.customerId", "==", userId));
  
  const unsub = onSnapshot(q, (snap) => {
    const orders = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      .sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    callback(orders);
  }, (err) => {
    // If the standard query fails or returns nothing, we try the root level query
    const qRoot = query(collection(db, "orders"), where("customerId", "==", userId));
    onSnapshot(qRoot, (snap) => {
      const orders = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      callback(orders);
    });
  });

  return unsub;
};
