
export default {
  locales: ['fr-FR'],
  messages: {
    comment: {
      constraints: {
        author_email: 'Cette valeur n\'est pas une adresse email valide.',
        author_name: 'Votre nom doit faire au moins 2 caractères',
        body: 'Votre commentaire doit faire au moins 2 caractères',
      },
      count_no_nb: '{count, plural, =0{commentaire} one{commentaire} other{commentaires}}',
      create_account_reason_1: 'valider que vous n\'êtes pas un robot une bonne fois pour toutes',
      create_account_reason_2: 'modifier/supprimer vos commentaires',
      create_account_reason_3: 'lier vos commentaires à votre profil',
      edited: 'édité le',
      email_info: 'Pour valider que vous n\'êtes pas un robot.',
      list: '{num, plural, =0{0 commentaire} one{# commentaire} other{# commentaires}}',
      more: 'Voir plus de commentaires',
      public_name: 'Votre nom sera rendu public sur la plateforme.',
      publish: 'Publier un commentaire',
      report: {
        reported: 'Signalé',
        submit: 'Signaler',
      },
      submit: 'Commenter',
      submit_error: 'Désolé, un problème est survenu lors de l\'ajout de votre commentaire.',
      submit_success: 'Merci ! Votre commentaire a bien été ajouté.',
      trashed: {
        label: 'Dans la corbeille',
      },
      update: {
        button: 'Modifier',
      },
      vote: {
        remove: 'Annuler mon vote',
        submit: 'D\'accord',
      },
      why_create_account: 'Pourquoi créer un compte ?',
      with_my_account: 'Commenter avec mon compte',
      without_account: 'Commenter sans créer de compte',
      write: 'Ecrire un commentaire...',
    },
    source: {
      add: 'Créer une source',
      body: 'Description *',
      constraints: {
        body: 'Le contenu de la source doit faire au moins 2 caractères.',
        category: 'Veuillez choisir un type pour soumettre une source',
        link: 'Cette valeur n\'est pas une URL valide.',
        title: 'Le titre de la source doit faire au moins 2 caractères.',
      },
      infos: 'Merci d\'examiner les sources existantes en premier lieu afin de ne pas soumettre de doublon. Vous pouvez voter pour celles existantes !',
      link: 'Lien *',
      title: 'Titre *',
      type: 'Type *',
    },
    argument: {
      constraints: {
        max: 'Les avis sont limités à 2000 caractères. Soyez plus concis ou publiez une nouvelle proposition.',
        min: 'Le contenu doit faire au moins 3 caractères.',
      },
      filter: {
        no: 'Trier les arguments contre',
        simple: 'Trier les avis',
        yes: 'Trier les arguments pour',
      },
      no: {
        add: 'Ajouter un argument contre',
        list: '{num, plural, =0{0 argument contre} one{# argument contre} other{# arguments contre}}',
      },
      simple: {
        add: 'Déposer un avis',
        list: '{num, plural, =0{0 avis} one{# avis} other{# avis}}',
      },
      yes: {
        add: 'Ajouter un argument pour',
        list: '{num, plural, =0{0 argument pour} one{# argument pour} other{# arguments pour}}',
      },
    },
    opinion: {
      add_new_source: 'Proposer une source',
      add_new_version: 'Proposer une modification',
      add_new_version_infos: 'Merci d\'examiner les modifications existantes en premier lieu afin de ne pas soumettre de doublon. Vous pouvez voter pour celles existantes !',
      appendices: {
        hide: 'Masquer {title}.',
        show: 'Afficher {title}',
      },
      body: 'Proposition',
      body_help: 'Rédigez votre proposition',
      constraints: {
        body: 'Le contenu de la proposition doit faire au moins 2 caractères.',
        title: 'Le titre de la proposition doit faire au moins 2 caractères.',
      },
      diff: {
        infos: 'Les ajouts en vert et les suppressions en rouge',
        title: 'Modification(s) proposée(s)',
        tooltip: 'Voir les modifications',
      },
      header: {
        article: 'Article',
        opinion: 'Proposition',
        version: 'Modification',
      },
      link: {
        add_new: 'Ajouter une proposition liée',
        constraints: {
          type: 'Veuillez choisir un type pour soumettre une proposition liée.',
        },
        help: {
          body: 'Rédigez votre proposition',
          title: 'Quel est l\'objet de votre proposition ?',
          type: 'Quel est le type de votre proposition ?',
        },
        info: 'Votre proposition sera liée à :',
        infos: 'Merci d\'examiner les propositions existantes en premier lieu afin de ne pas soumettre de doublon. Vous pouvez voter pour celles existantes !',
        opinion: 'Proposition liée :',
        type: 'Type de proposition*',
      },
      no_new_link: 'Aucune proposition liée',
      no_new_source: 'Aucune source proposée',
      no_new_version: 'Aucune modification proposée',
      progress: {
        done: '{num, plural, =0{0 vote favorable} one{# vote favorable} other{# votes favorables}}.',
        left: '{left, plural, =0{0 nécessaire} one{# nécessaire} other{# nécessaires}} pour atteindre {max}.',
        reached: 'Cette proposition a atteint le seuil avec {with, plural, =0{0 vote} one{# vote} other{# votes}}.',
      },
      ranking: {
        articles: 'Top {max} des articles',
        opinions: 'Top {max} des propositions',
        versions: 'Top {max} des modifications',
      },
      request: {
        create_vote: {
          success: 'Merci ! Votre vote a bien été pris en compte.',
        },
        delete_vote: {
          success: 'Votre vote a bien été supprimé.',
        },
        failure: 'Une erreur est survenue, veuillez réessayer.',
      },
      title: 'Titre*',
      title_help: 'Quel est l\'objet de votre proposition ?',
      type: 'Type de proposition*',
      type_help: 'Quel est le type de votre proposition ?',
      version: {
        body: 'Modification *',
        body_error: 'Vous devez modifier le contenu de la proposition d\'origine pour pouvoir proposer une modification.',
        body_helper: 'Modifiez le texte',
        comment: 'Explication',
        comment_helper: 'Expliquez pourquoi vous souhaitez apporter ces modifications',
        confirm: 'En modifiant ma contribution, je comprends que tous les votes qui lui sont associés seront réinitialisés.',
        confirm_error: 'Vous devez confirmer la perte de vos votes pour continuer.',
        filter: 'Trier les modifications',
        title: 'Titre *',
        title_error: 'Le titre doit contenir au moins 2 caractères.',
      },
      version_comment: 'Explication',
      version_parent: 'Modification de : ',
    },
    proposal: {
      add: 'Faire une proposition',
      body: 'Description',
      constraints: {
        body: 'La description de la proposition doit faire au moins 2 caractères.',
        district: 'Sélectionnez un quartier',
        theme: 'Sélectionnez un thème',
        title: 'Le titre de la proposition doit faire au moins 2 caractères.',
      },
      count: '{num, plural, =0{0 projet} one{# projet} other{# projets}}',
      delete: {
        confirm: 'Voulez-vous vraiment supprimer la proposition "{title}" ?',
      },
      description: 'Description',
      district: 'Quartier',
      empty: 'Aucune proposition',
      infos: {
        header: '{user} {theme, select, no {le {createdDate}} other {dans {themeLink}, le {createdDate}}}',
      },
      no_status: 'Aucun statut',
      select: {
        district: 'Sélectionnez un quartier',
        theme: 'Sélectionnez un thème',
      },
      theme: 'Theme',
      title: 'Titre',
      vote: {
        body: 'Commentaire',
        body_placeholder: 'Pourquoi soutenez-vous ce projet ? (optionnel)',
        count: '{num, plural, =0{0 vote} one{# vote} other{# votes}}',
        email: 'Adresse électronique',
        name: 'Nom',
        private: 'Rendre mon soutien anonyme',
        vote_with_my_account: 'Soutenir avec mon compte',
      },
    },
    vote: {
      aria_label: {
        mitige: 'Souhaitez-vous déclarer être mitigé sur cette proposition ?',
        nok: 'Souhaitez-vous déclarer ne pas être d\'accord avec cette proposition ?',
        ok: 'Souhaitez-vous déclarer être d\'accord avec cette proposition ?',
      },
      aria_label_active: {
        mitige: 'Vous avez déclaré être mitigé sur cette proposition',
        nok: 'Vous avez déclaré n\'être pas d\'accord avec cette proposition',
        ok: 'Vous avez déclaré être d\'accord avec cette proposition',
      },
      cancel: 'Annuler mon vote',
      date: 'Date',
      form: 'Formulaire de vote',
      mitige: 'Mitigé',
      nok: 'Pas d\'accord',
      ok: 'D\'accord',
      popover: {
        body: 'Vous devez être connecté pour réaliser cette action.',
        login: 'Connexion',
        signin: 'Inscription',
        title: 'Connectez-vous pour contribuer',
      },
      votes: 'Votes',
    },
    share: {
      facebook: 'Facebook',
      googleplus: 'Google+',
      link: 'Lien de partage',
      mail: 'Email',
      twitter: 'Twitter',
    },
    editor: {
      url: 'Visiter l\'URL',
      size: {
        small: 'Petit',
        normal: 'Normal',
        large: 'Grand',
      },
      list: 'Liste ordonnée',
      bullet: 'Liste',
      align: {
        title: 'Aligner',
        left: 'Gauche',
        center: 'Centrer',
        right: 'Droite',
        justify: 'Justifier',
      },
      link: 'Lien',
      image: 'Image',
    },
    global: {
      advanced_filters: 'Filtres avancés',
      all_required: 'Tous les champs sont obligatoires.',
      answer: 'Répondre',
      arguments: '{num, plural, =0{0 argument} one{# argument} other{# arguments}}',
      back: 'Retour',
      cancel: 'Annuler',
      change: 'Changer',
      close: 'Fermer',
      comment: 'Commentaire',
      comments: '{num, plural, =0{0 commentaire} one{# commentaire} other{# commentaires}}',
      constraints: {
        notBlank: 'Cette valeur ne doit pas être vide',
      },
      content: 'Contenu',
      done: 'Terminé',
      edit: 'Modifier',
      edited: 'édité le',
      edited_on: 'Édité le {updated}',
      filter_comments: 'Les plus commentés',
      filter_favorable: 'Les plus favorables',
      filter_last: 'Les plus récents',
      filter_old: 'Les plus anciens',
      filter_popular: 'Les plus populaires',
      filter_votes: 'Les plus votés',
      fullname: 'Nom complet *',
      hidden_email: 'Adresse électronique (cachée) *',
      insert: 'Insérer',
      link: 'Lien',
      links: '{num, plural, =0{0 proposition liée} one{# proposition liée} other{# propositions liées}}',
      loading: 'Chargement...',
      login: 'Connexion',
      more: 'Voir plus',
      name: 'Nom ',
      preview: 'Aperçu',
      publish: 'Publier',
      read_more: 'Afficher la suite',
      remove: 'Supprimer',
      report: {
        reported: 'Signalé',
        submit: 'Signaler',
      },
      select: 'Choisir une valeur',
      select_district: 'Quartier',
      select_status: 'Statut',
      select_theme: 'Thème',
      select_type: 'Type de contributeur',
      share: 'Partager',
      simple_arguments: '{num, plural, =0{0 avis} one{# avis} other{# avis}}',
      sources: '{num, plural, =0{0 source} one{# source} other{# sources}}',
      title: 'Titre',
      versions: '{num, plural, =0{0 modification} one{# modification} other{# modifications}}',
      votes: '{num, plural, =0{0 vote} one{# vote} other{# votes}}',
      votes_evolution: 'évolution des votes',
    },
  },
};
