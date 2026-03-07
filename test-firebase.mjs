import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyDZ7Y5Tg0nRttdAZGUdW8uOzRG-4XbA5Ns',
    authDomain: 'docugallery-app-8d54a.firebaseapp.com',
    projectId: 'docugallery-app-8d54a',
    storageBucket: 'docugallery-app-8d54a.firebasestorage.app',
    messagingSenderId: '387632739364',
    appId: '1:387632739364:web:8d71a74ed15dd6104e54b1'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('✅ Firebase initialized OK\n');

async function check() {
    // Test 1: Query public projects (no auth needed by rules)
    try {
        const q = query(collection(db, 'projects'), where('accessLevel', 'in', ['public', 'private']));
        const snap = await getDocs(q);
        console.log(`📁 PROJECTS (public+private query): ${snap.docs.length} documents found`);
        if (snap.docs.length > 0) {
            snap.docs.slice(0, 3).forEach(d => {
                const data = d.data();
                console.log(`   - [${data.accessLevel || 'NO_ACCESS_LEVEL'}] ${data.title}`);
            });
        }
    } catch (e) {
        console.error('❌ Projects query error:', e.message);
    }

    // Test 2: Query all projects (no auth)
    try {
        const snap = await getDocs(collection(db, 'projects'));
        console.log(`\n📁 PROJECTS (all, no filter): ${snap.docs.length} documents found`);
        snap.docs.slice(0, 3).forEach(d => {
            const data = d.data();
            console.log(`   - [${data.accessLevel || 'NO_ACCESS_LEVEL'}] ${data.title}`);
        });
    } catch (e) {
        console.error('❌ Projects (all) error:', e.message);
    }

    // Test 3: Count projects without accessLevel
    try {
        const snap = await getDocs(collection(db, 'projects'));
        const noAccessLevel = snap.docs.filter(d => !d.data().accessLevel);
        console.log(`\n⚠️  Projects WITHOUT accessLevel field: ${noAccessLevel.length}`);
        if (noAccessLevel.length > 0) {
            console.log('   ↳ These documents are INVISIBLE to guest users!');
        }
    } catch (e) {
        console.error('Error checking accessLevel:', e.message);
    }

    process.exit(0);
}

check();
