import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    getDocs, 
    addDoc 
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

// Inicialització de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fem que la base de dades sigui accessible des de la consola per a les importacions
window.db = db;

const input = document.getElementById('user-input');
const results = document.getElementById('result-container');

// --- FUNCIÓ PER ELIMINAR ACCENTS I NORMALITZAR TEXT ---
const netejarText = (text) => {
    if (!text) return "";
    return text.toString()
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
};

// --- FUNCIÓ DE CERCA ---
async function buscar() {
    const textBuscat = netejarText(input.value);
    
    if (textBuscat.length < 2) { 
        results.innerHTML = ""; 
        return; 
    }

    try {
        const querySnapshot = await getDocs(collection(db, "obres"));
        results.innerHTML = "";
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const nomOriginal = data.nom || "";
            const resumOriginal = data.resum || "";
            const font = data.font || "Retalls de Sitges";

            const nomPerComparar = netejarText(nomOriginal);
            const resumPerComparar = netejarText(resumOriginal);
            
            if (nomPerComparar.includes(textBuscat) || resumPerComparar.includes(textBuscat)) {
                
                let linkBrut = data.link || data.url || data.enllaç || ""; 
                let linkFinal = "";
                
                if (linkBrut) {
                    linkFinal = linkBrut.toString().trim();
                    if (linkFinal !== "" && !linkFinal.startsWith('http')) {
                        linkFinal = 'https://' + linkFinal;
                    }
                }

                const card = document.createElement('div');
                card.className = 'response-card';
                
                const botoHTML = (linkFinal && linkFinal !== "") 
                    ? `<a href="${linkFinal}" target="_blank" rel="noopener noreferrer" style="color:var(--accent); text-decoration:none; font-weight:600;">Llegir més ↗</a>` 
                    : `<span style="color:gray; font-size:0.8rem;">(Sense enllaç a la font)</span>`;

                card.innerHTML = `
                    <h2 style="font-size:1.8rem; margin-bottom:1rem; color:white">${nomOriginal}</h2>
                    <p style="line-height:1.7; color:#e2e8f0; margin-bottom:1.5rem">${resumOriginal}</p>
                    <div class="source-link" style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--card-border); padding-top:1rem;">
                        <span style="font-size:0.9rem; color:var(--text-secondary)">Font: ${font}</span>
                        ${botoHTML}
                    </div>
                `;
                results.appendChild(card);
            }
        });
    } catch (e) { 
        console.error("Error Firebase:", e); 
    }
}

// Escoltador d'esdeveniments per a l'entrada de text
input.addEventListener('input', buscar);
