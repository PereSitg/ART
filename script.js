import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// He afegit addDoc aquí per poder pujar les dades
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// --- NOVA FUNCIÓ PER ELIMINAR ACCENTS ---
const netejarText = (text) => {
    if (!text) return "";
    return text.toString()
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
};

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
                    <div class="source-link" style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--card-border); pt:1rem;">
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

input.addEventListener('input', buscar);

// --- FUNCIÓ D'IMPORTACIÓ DEL BLOC 1 (Només per carregar dades) ---
async function importarBloc1() {
    const bloc1 = [
        { nom: "Ramon Casas. La modernitat anhelada", resum: "Exposició central del centenari de Maricel sobre el gran mestre del modernisme.", font: "Museus de Sitges", link: "https://museusdesitges.cat/ca/exposicions/ramon-casas-la-modernidad-anhelada" },
        { nom: "Miquel Utrillo i les arts", resum: "Una crònica de la polièdrica activitat de Miquel Utrillo com a crític i promotor.", font: "Museus de Sitges", link: "https://museusdesitges.cat/ca/noticies/el-museu-de-maricel-rep-lobra-sitges-al-segle-xx-de-miquel-utrillo" },
        { nom: "L'elogi del dibuix", resum: "Exposició sobre la Col·lecció Manuel Puig centrada en la bellesa i tècnica del dibuix.", font: "Museus de Sitges", link: "https://museusdesitges.cat/ca/exposicions/lelogi-del-dibuix-la-colleccio-manuel-puig" },
        { nom: "L’Amic de les Arts (1926-1929)", resum: "Una mirada a l'avantguarda de Sitges a través d'aquesta mítica revista cultural.", font: "Museus de Sitges", link: "https://museusdesitges.cat/ca/exposicions/lamic-de-les-arts-art-i-poesia-sitges-1926-1929" },
        { nom: "La figura emmarcada", resum: "Obres singulars de la col·lecció Casacuberta Marsans al Palau de Maricel.", font: "Museus de Sitges", link: "https://museusdesitges.cat/ca/exposicions/la-figura-emmarcada-obres-singulars-de-la-colleccio-casacuberta-marsans" },
        { nom: "Peter Stämpfli: In the wind", resum: "Mostra de l'obra contemporània de l'artista suís vinculat a Sitges.", font: "Museus de Sitges", link: "https://museusdesitges.cat/ca/exposicions/wind-de-peter-stampfli" },
        { nom: "Models de bellesa", resum: "Recull de l'antic Museu de Reproduccions Artístiques al Museu de Maricel.", font: "Museus de Sitges", link: "https://museusdesitges.cat/ca/exposicions/models-de-bellesa-lantic-museu-de-reproduccions-artistiques" },
        { nom: "La Col·lecció Bertrán", resum: "La memòria d'un llegat familiar amb obres mestres del barroc i el renaixement.", font: "Museus de Sitges", link: "https://museusdesitges.cat/ca/exposicions/exposicio-la-colleccio-bertran-la-memoria-dun-llegat-familiar" },
        { nom: "Rusiñol vist per Picasso", resum: "La relació i influència mútua entre Santiago Rusiñol i Pablo Picasso.", font: "Museus de Sitges", link: "https://museusdesitges.cat/ca/exposicions/rusinol-vist-picasso" },
        { nom: "Atrapar la llum", resum: "Mirades al vidre català contemporani. Una mostra de transparències i color.", font: "Museus de Sitges", link: "https://museusdesitges.cat/ca/exposicions/atrapar-la-llum-mirades-al-vidre-catala-contemporani" }
    ];

    try {
        for (const obra of bloc1) {
            await addDoc(collection(db, "obres"), obra);
        }
        alert("Bloc 1 d'exposicions importat correctament!");
    } catch (e) {
        console.error("Error en la importació:", e);
    }
}

// Activa la següent línia per carregar les dades, després esborra-la o comenta-la
importarBloc1();
