import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

async function buscar() {
    const textBuscat = input.value.toLowerCase().trim();
    if (textBuscat.length < 2) { results.innerHTML = ""; return; }

    try {
        const querySnapshot = await getDocs(collection(db, "obres"));
        results.innerHTML = "";
        let trobat = false;

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const nom = data.nom || "";
            const resum = data.resum || "";
            const font = data.font || "Retalls de Sitges";
            
            // --- SOLUCIÓ DEFINITIVA PER ALS ENLLAÇOS ---
            // Busquem en tots els noms possibles: link, url, enllaç...
            let linkBrut = data.link || data.url || data.enllaç || ""; 
            let linkFinal = "";
            
            if (linkBrut) {
                linkFinal = linkBrut.toString().trim();
                if (linkFinal !== "" && !linkFinal.startsWith('http')) {
                    linkFinal = 'https://' + linkFinal;
                }
            }

            if (nom.toLowerCase().includes(textBuscat) || resum.toLowerCase().includes(textBuscat)) {
                trobat = true;
                const card = document.createElement('div');
                card.className = 'response-card';
                
                // Si finalment hem trobat un link, posem el "Llegir més"
                const botoHTML = (linkFinal && linkFinal !== "") 
                    ? `<a href="${linkFinal}" target="_blank" rel="noopener noreferrer" style="color:var(--accent); text-decoration:none; font-weight:600;">Llegir més ↗</a>` 
                    : `<span style="color:gray; font-size:0.8rem;">(Sense enllaç a la font)</span>`;

                card.innerHTML = `
                    <h2 style="font-size:1.8rem; margin-bottom:1rem; color:white">${nom}</h2>
                    <p style="line-height:1.7; color:#e2e8f0; margin-bottom:1.5rem">${resum}</p>
                    <div class="source-link" style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--card-border); pt:1rem;">
                        <span style="font-size:0.9rem; color:var(--text-secondary)">Font: ${font}</span>
                        ${botoHTML}
                    </div>
                `;
                results.appendChild(card);
            }
        });
    } catch (e) { console.error("Error Firebase:", e); }
}

input.addEventListener('input', buscar);
