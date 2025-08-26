# Guide d'inscription aux cours d'escalade - CAF La Roche-Bonneville

Site web interactif pour guider les adhérents dans le processus de licence et d'inscription aux cours d'escalade.

## 🎯 Objectifs

- Simplifier le processus d'inscription pour les adhérents
- Réduire les erreurs et questions récurrentes  
- Offrir un parcours personnalisé selon le profil (nouveau/ancien adhérent)
- Assurer que tous les adhérents ont une licence valide avant les cours

## ✨ Fonctionnalités

- **Parcours guidé étape par étape** avec indicateur de progression
- **Personnalisation** selon le statut de l'adhérent (nouveau vs renouvellement)
- **Validation en temps réel** des informations saisies
- **Sauvegarde automatique** de la progression (localStorage)
- **Messages d'état clairs** pour chaque étape du processus
- **Design responsive** adapté mobile/tablette/desktop
- **Vérification de la date** (alerte si tentative avant le 1er septembre)

## 🚀 Déploiement sur GitHub Pages

### Option 1 : Via l'interface GitHub

1. Créez un nouveau repository sur GitHub
2. Uploadez tous les fichiers du projet
3. Allez dans Settings → Pages
4. Source : Deploy from a branch
5. Branch : main (ou master) / folder: / (root)
6. Cliquez sur Save
7. Le site sera disponible à : `https://[votre-username].github.io/[nom-du-repo]/`

### Option 2 : Via Git

```bash
# Initialiser git si pas déjà fait
git init

# Ajouter tous les fichiers
git add .

# Commit initial
git commit -m "Initial commit: Site inscription cours escalade"

# Ajouter le remote
git remote add origin https://github.com/[votre-username]/[nom-du-repo].git

# Push vers GitHub
git push -u origin main

# Ensuite activez GitHub Pages dans les settings du repo
```

## 📁 Structure du projet

```
tuto-licence-cours-escalade/
├── index.html      # Page principale
├── style.css       # Styles CSS
├── script.js       # Logique JavaScript
└── README.md       # Documentation
```

## 🎨 Design

Le site utilise :
- **Couleurs** : Bleu principal (#2563eb), vert secondaire (#10b981)
- **Police** : Inter (Google Fonts)
- **Icônes** : SVG inline pour performance optimale
- **Animations** : Transitions CSS fluides

## 💡 Utilisation

1. L'utilisateur arrive sur le site
2. Répond aux questions de qualification (place attribuée ? licence précédente ?)
3. Suit les instructions personnalisées pour la licence
4. Met à jour sa pré-inscription avec son numéro de licence
5. Reçoit une confirmation visuelle de la réussite

## 🔧 Personnalisation

Pour adapter le site à vos besoins :

### Modifier les URLs
Dans `index.html`, recherchez et remplacez :
- Les liens vers le site du club
- Les URLs de création/renouvellement de licence

### Modifier les couleurs
Dans `style.css`, modifiez les variables CSS :
```css
:root {
    --primary-color: #2563eb;  /* Couleur principale */
    --secondary-color: #10b981; /* Couleur secondaire */
    /* etc. */
}
```

### Modifier les textes
Directement dans `index.html`, adaptez les contenus selon vos besoins spécifiques.

## 📱 Compatibilité

- ✅ Chrome, Edge, Firefox, Safari (dernières versions)
- ✅ Mobile responsive (iOS/Android)
- ✅ Tablettes
- ✅ Impression optimisée

## 🤝 Support

Pour toute question technique, contactez les responsables du site du CAF La Roche-Bonneville.

## 📄 Licence

Développé pour le CAF La Roche-Bonneville - 2024