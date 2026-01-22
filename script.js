import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    getDocs 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAV8SrQ3tDiixCRwUDgC33jI8ZJzlcceZc",
  authDomain: "sitgesart.firebaseapp.com",
  projectId: "sitgesart",
  storageBucket: "sitgesart.firebasestorage.app",
  messagingSenderId: "673959867307",
  appId: "1:673959867307:web:80607c11d79db42b4918ee",
  measurementId: "G-7G51JP9CFS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const input = document.getElementById('user-input');
const results = document.getElementById('result-container');

// --- NORMALITZACIÓ DE TEXT ---
const netejarText = (text) => {
    if (!text) return "";
    return text.toString()
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
};

// --- FUNCIÓ PER PINTAR LES TARGETES ---
function crearCard(data) {
    const nomOriginal = data.nom || "";
    const resumOriginal = data.resum || "";
    const font = data.font || "Museus de Sitges";
    let enllac = data.link || data.url || data.enllaç || "";

    const card = document.createElement('div');
    card.className = 'response-card';
    
    if (enllac && !enllac.startsWith('http')) {
        enllac = 'https://' + enllac;
    }

    card.innerHTML = `
        <h2>${nomOriginal}</h2>
        <p>${resumOriginal}</p>
        <div class="source-link">
            <span>Font: ${font}</span>
            ${enllac ? `<a href="${enllac}" target="_blank" class="btn-link">Saber-ne més ↗</a>` : ''}
        </div>
    `;
    return card;
}

// --- FUNCIÓ DE CERCA ---
async function buscar() {
    // 1. Capturem el valor actual de l'input
    const valorInput = input.value.trim();
    const textBuscat = netejarText(valorInput);
    
    // 2. CORRECCIÓ: Si l'input està buit o té menys de 2 caràcters, netejem i sortim
    if (textBuscat.length < 2) {
        results.innerHTML = "";
        return; 
    }

    try {
        const querySnapshot = await getDocs(collection(db, "obres"));
        
        // Tornem a comprovar si l'usuari ha esborrat mentre esperàvem la resposta de Firebase
        if (netejarText(input.value).length < 2) {
            results.innerHTML = "";
            return;
        }

        results.innerHTML = "";
        let trobats = 0;

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const nomPerComparar = netejarText(data.nom);
            const resumPerComparar = netejarText(data.resum);

            if (nomPerComparar.includes(textBuscat) || resumPerComparar.includes(textBuscat)) {
                results.appendChild(crearCard(data));
                trobats++;
            }
        });

        if (trobats === 0) {
            results.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #94a3b8;">No hi ha resultats per a la cerca.</div>`;
        }
    } catch (e) {
        console.error("Error Firebase:", e);
    }
}

// Escoltador d'esdeveniments
input.addEventListener('input', buscar);
