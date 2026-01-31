let etudiants=JSON.parse(localStorage.getItem("etudiants")) || []

//eviter de charger la page qu on clic sur le boton pour envoyer les valeur
document.getElementById("formajout").addEventListener("submit",function(e){e.preventDefault()
//recuperer les valeur
let nom=document.getElementById("nom").value
let prenom=document.getElementById("prenom").value
let matricule=document.getElementById("matricule").value
let niveau=document.getElementById("niveau").value
let specialite=document.getElementById("specialite").value
let note=Number(document.getElementById("note").value)
//cree un objet etudiant
let etudiant={nom,prenom,matricule,niveau,specialite,note}
etudiants.push(etudiant);
localStorage.setItem("etudiants",JSON.stringify(etudiants))
ajoutEt(etudiant, etudiants.length - 1)
this.reset();
 
stat()
})

function ajoutEt(etudiant,index){
let tbody=document.querySelector("#tabet tbody")
let tr=document.createElement("tr")
tr.innerHTML=
`<td><input type="radio" name="selectStudent"  value="${index}"></input></td>
<td>${etudiant.nom}</td>
<td>${etudiant.prenom}</td>
<td>${etudiant.matricule}</td>
<td>${etudiant.niveau}</td>
<td>${etudiant.specialite}</td>
<td>${etudiant.note}</td>
`
if (etudiant.note < 10) {
        tr.style.color = "red";
    }
tbody.appendChild(tr)

}
function getselecteds(){

    let radio =document.querySelector('input[name="selectStudent"]:checked')
      if (!radio) return null;
    return parseInt(radio.value);
   
}
document.getElementById("btnsupp").addEventListener("click", () => {
    let index = getselecteds();
    if(index != null){
        // Supprimer du tableau de données
        etudiants.splice(index, 1);
        localStorage.setItem("etudiants", JSON.stringify(etudiants));

        // Vider le tbody
        let tbody = document.querySelector("#tabet tbody");
        tbody.innerHTML = "";

        // Réafficher tous les étudiants avec les nouveaux indices
        etudiants.forEach((etudiant, i) => ajoutEt(etudiant, i));

        // Réinitialiser l'index sélectionné
        index = null;
    } else {
        alert("Veuillez sélectionner un étudiant à supprimer !");
    }
});

let index=null
document.getElementById("btnmod").addEventListener("click",function(){

if(index===null){
index=getselecteds()
 if (index === null) {
            alert("Sélectionne un étudiant !");
            return;
        }

    let etudiant=etudiants[index]
    document.getElementById("nom").value=etudiant.nom
     document.getElementById("prenom").value = etudiant.prenom;
        document.getElementById("matricule").value = etudiant.matricule;
        document.getElementById("niveau").value = etudiant.niveau;
        document.getElementById("specialite").value = etudiant.specialite;
        document.getElementById("note").value = etudiant.note;
         this.textContent = "Enregistrer";
        return;
        }
 else {
       etudiants[index] = {
        nom: document.getElementById("nom").value,
        prenom: document.getElementById("prenom").value,
        matricule: document.getElementById("matricule").value,
        niveau: document.getElementById("niveau").value,
        specialite: document.getElementById("specialite").value,
        note: Number(document.getElementById("note").value)
    };

            // Mettre à jour LocalStorage
            localStorage.setItem("etudiants", JSON.stringify(etudiants));
 let tbody = document.querySelector("#tabet tbody");
    tbody.innerHTML = ""; // vider
    etudiants.forEach((etudiant, i) => ajoutEt(etudiant, i)); // réafficher

    index = null;
    this.textContent = "Modifier";
            // Recharger la page ou mettre à jour le tableau HTML dynamiquement
            document.getElementById("formajout").reset();
        }
    } 

)
function stat() {
    const filtre = document.getElementById("filtre").value;
    const niveauVal = document.getElementById("niveauFilter").value;
    const specialiteVal = document.getElementById("specialiteFilter").value;

    let filtered = etudiants;

    if (filtre === "niveau" && niveauVal) {
        filtered = etudiants.filter(e => e.niveau === niveauVal);
    } else if (filtre === "specialite" && specialiteVal) {
        filtered = etudiants.filter(e => e.specialite === specialiteVal);
    } else if (filtre === "nivsp" && niveauVal && specialiteVal) {
        filtered = etudiants.filter(e => e.niveau === niveauVal && e.specialite === specialiteVal);
    }

    // Calcul
    const total = filtered.length;
    const admis = filtered.filter(e => e.note >= 10).length;
    const ajourne = filtered.filter(e => e.note < 10).length;
    const moyenne = total ? (filtered.reduce((acc, e) => acc + e.note, 0) / total).toFixed(2) : 0;

    // Mettre à jour le HTML
    document.getElementById("admis").textContent = admis;
    document.getElementById("ajourne").textContent = ajourne;
    document.getElementById("totalEtudiant").textContent = total;
    document.getElementById("moyenne").textContent = moyenne;
}

// Afficher / cacher les filtres selon le choix
document.getElementById("filtre").addEventListener("change", function() {
    const val = this.value;

    document.getElementById("niveauFilter").style.display = (val === "niveau" || val === "nivsp") ? "inline" : "none";
    document.getElementById("specialiteFilter").style.display = (val === "specialite" || val === "nivsp") ? "inline" : "none";

    stat(); // mettre à jour dès que filtre change
});

document.getElementById("niveauFilter").addEventListener("change", stat);
document.getElementById("specialiteFilter").addEventListener("change", stat);

// Au chargement de la page
window.onload = function() {
    etudiants.forEach((e,i) => ajoutEt(e,i));
    stat();
};



document.getElementById("btnsrch").addEventListener("click", function(){
    const query = document.getElementById("search").value.toLowerCase().trim();
    let resultats = etudiants.filter(e => 
        e.nom.toLowerCase().includes(query) ||
        e.prenom.toLowerCase().includes(query) ||
        e.matricule.toLowerCase().includes(query)
    );

    // Vider le tableau et afficher les résultats
    document.querySelector("#tabet tbody").innerHTML = "";
    resultats.forEach((e,i) => ajoutEt(e,i));

    // Mettre à jour les stats pour les résultats seulement
    stat(resultats);
});





