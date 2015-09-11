
export default {
    locales: ['fr-FR'],
    messages: {
        comment: {
            list: '{num, plural, =0{0 commentaire} one{# commentaire} other{# commentaires}}',
            vote: {
                submit: 'D\'accord',
                remove: 'Annuler mon vote',
            },
            report: {
                submit: 'Signaler',
                reported: 'Signalé',
            },
            update: {
                button: 'Modifier',
            },
            trashed: {
                label: 'Dans la corbeille',
            },
            constraints: {
                author_email: 'Cette valeur n\'est pas une adresse email valide.',
                author_name: 'Votre nom doit faire au moins 2 caractères',
                body: 'Votre commentaire doit faire au moins 2 caractères',
            },
            write: 'Ecrire un commentaire...',
            edited: 'édité le',
            submit_success: 'Merci ! Votre commentaire a bien été ajouté.',
            submit_error: 'Désolé, un problème est survenu lors de l\'ajout de votre commentaire.',
            more: 'Voir plus de commentaires',
            submit: 'Commenter',
            public_name: 'Votre nom sera rendu public sur la plateforme.',
            email_info: 'Pour valider que vous n\'êtes pas un robot.',
            publish: 'Publier un commentaire',
            why_create_account: 'Pourquoi créer un compte ?',
            create_account_reason_1: 'valider que vous n\'êtes pas un robot une bonne fois pour toutes',
            create_account_reason_2: 'modifier/supprimer vos commentaires',
            create_account_reason_3: 'lier vos commentaires à votre profil',
            with_my_account: 'Commenter avec mon compte',
            without_account: 'Commenter sans créer de compte',
        },
        source: {
            add: 'Créer une source',
            link: 'Lien *',
            title: 'Titre *',
            body: 'Description *',
            type: 'Type *',
            infos: 'Merci d\'examiner les sources existantes en premier lieu afin de ne pas soumettre de doublon. Vous pouvez voter pour celles existantes !',
            constraints: {
                body: 'Le contenu de la source doit faire au moins 2 caractères.',
                title: 'Le titre de la source doit faire au moins 2 caractères.',
                category: 'Veuillez choisir un type pour soumettre une source',
                link: 'Cette valeur n\'est pas une URL valide.',
            },
        },
        argument: {
            yes: {
                add: 'Ajouter un argument pour',
                list: '{num, plural, =0{0 argument pour} one{# argument pour} other{# arguments pour}}',
            },
            no: {
                add: 'Ajouter un argument contre',
                list: '{num, plural, =0{0 argument contre} one{# argument contre} other{# arguments contre}}',
            },
            simple: {
                add: 'Ajouter un avis',
                list: '{num, plural, =0{0 avis} one{# avis} other{# avis}}',
            },
            constraints: {
                min: 'Le contenu doit faire au moins 3 caractères.',
                max: 'Les avis sont limités à 2000 caractères. Soyez plus concis ou publiez une nouvelle proposition.',
            },
        },
        opinion: {
            progress_done: '{num, plural, =0{0 vote favorable} one{# vote favorable} other{# votes favorables}}.',
            progress_left: '{left, plural, =0{0 nécessaire} one{# nécessaire} other{# nécessaires}} pour atteindre {max}.',
            progress_reached: 'Cette proposition a atteint le seuil avec {with, plural, =0{0 vote} one{# vote} other{# votes}}.',
            no_new_version: 'Aucune autre version proposée',
            no_new_source: 'Aucune source proposée',
            add_new_version: 'Proposer une autre version',
            add_new_source: 'Proposer une source',
            add_new_version_infos: 'Merci d\'examiner les versions existantes en premier lieu afin de ne pas soumettre de doublon. Vous pouvez voter pour celles existantes !',
            version_comment: 'Explication',
            version: {
                title: 'Titre *',
                body: 'Autre version *',
                body_helper: 'Modifiez le texte',
                comment: 'Explication *',
                comment_helper: 'Expliquez pourquoi vous souhaitez apporter ces modifications',
                title_error: 'Le titre doit contenir au moins 2 caractères.',
                body_error: 'Vous devez modifier le contenu de la proposition d\'origine pour pouvoir proposer une version.',
            },
        },
        vote: {
            ok: 'D\'accord',
            mitige: 'Mitigé',
            nok: 'Pas d\'accord',
            cancel: 'Annuler mon vote',
            popover: {
                title: 'Connectez-vous pour contribuer',
                body: 'Vous devez être connecté pour réaliser cette action.',
                login: 'Connexion',
                signin: 'Inscription',
            },
        },
        share: {
            facebook: 'Facebook',
            twitter: 'Twitter',
            googleplus: 'Google+',
            mail: 'Email',
        },
        global: {
            report: {
                submit: 'Signaler',
                reported: 'Signalé',
            },
            votes: '{num, plural, =0{0 vote} one{# vote} other{# votes}}',
            versions: '{num, plural, =0{0 autre version} one{# autre version} other{# autres versions}}',
            sources: '{num, plural, =0{0 source} one{# source} other{# sources}}',
            simple_arguments: '{num, plural, =0{0 avis} one{# avis} other{# avis}}',
            arguments: '{num, plural, =0{0 argument} one{# argument} other{# arguments}}',
            back: 'Retour',
            content: 'Contenu',
            share: 'Partager',
            select: 'Choisir une valeur',
            more: 'Voir plus',
            publish: 'Publier',
            edited: 'édité le',
            edit: 'Modifier',
            link: 'Lien',
            cancel: 'Annuler',
            title: 'Titre',
            answer: 'Répondre',
            loading: 'Chargement...',
            login: 'Connexion',
            comment: 'Commentaire',
            name: 'Nom ',
            fullname: 'Nom complet *',
            hidden_email: 'Adresse électronique (cachée) *',
            popular: 'Les plus populaires',
            last: 'Les plus récents',
            old: 'Les plus anciens',
            all_required: 'Tous les champs sont obligatoires.',
            read_more: 'Afficher la suite',
        },
    },
};
