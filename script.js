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
    
    let linkBrut = data.link || data.url || ""; 
    let linkFinal = "";
    
    if (linkBrut) {
        linkFinal = linkBrut.toString().trim();
        if (linkFinal !== "" && !linkFinal.startsWith('http')) {
            linkFinal = 'https://' + linkFinal;
        }
    }

    const card = document.createElement('div');
    card.className = 'response-card';
    
    const botoHTML = (linkFinal) 
        ? `<a href="${linkFinal}" target="_blank" rel="noopener noreferrer" class="btn-link">Més informació</a>` 
        : `<span style="color:gray; font-size:0.8rem;">(Sense enllaç)</span>`;

    card.innerHTML = `
        <h2 style="font-size:1.6rem; margin-bottom:1rem; color:white">${nomOriginal}</h2>
        <p style="line-height:1.6; color:#e2e8f0; margin-bottom:1.5rem; flex-grow:1;">${resumOriginal}</p>
        <div class="source-link">
            <span>Font: ${font}</span>
            ${botoHTML}
        </div>
    `;
    return card;
}

// --- FUNCIÓ PRINCIPAL DE CERCA ---
async function buscar() {
    const textBuscat = netejarText(input.value);
    
    try {
        const querySnapshot = await getDocs(collection(db, "obres"));
        results.innerHTML = "";
        let trobats = 0;

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const nomPerComparar = netejarText(data.nom);
            const resumPerComparar = netejarText(data.resum);

            // Si l'input està buit, mostrem tot (o pots limitar-ho a 6)
            if (textBuscat === "" || nomPerComparar.includes(textBuscat) || resumPerComparar.includes(textBuscat)) {
                results.appendChild(crearCard(data));
                trobats++;
            }
        });

        // Missatge si no hi ha resultats
        if (trobats === 0) {
            results.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                    <p style="font-size: 2rem; margin-bottom: 1rem;">🔍</p>
                    <p>No hem trobat cap exposició que coincideixi amb "<strong>${input.value}</strong>".</p>
                </div>
            `;
        }
    } catch (e) {
        console.error("Error Firebase:", e);
    }
}

// Escoltadors
input.addEventListener('input', buscar);

// Carregar dades en obrir la pàgina
window.addEventListener('DOMContentLoaded', buscar);
