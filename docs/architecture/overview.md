# Architecture de Lemon Tree

Le desktop suit quatre couches. `domain` contient les concepts et invariants sans dépendance technique. `application` orchestre les cas d’usage et définit les ports. `infrastructure` fournit les adaptateurs, dont les données de démonstration puis SQLite. `presentation` contient React, ses composants et ses view models.

Le sens des dépendances est `presentation → application → domain`. L’infrastructure dépend des ports internes et les implémente. React et Tauri ne sont jamais importés par le domaine.

Les cas d’usage sont testés unitairement avec des fakes déterministes. Les tests de présentation vérifient les parcours essentiels sans remplacer les tests métier.
