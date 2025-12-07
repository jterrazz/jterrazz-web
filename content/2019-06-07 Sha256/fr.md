![](assets/thumbnail.jpg)

# Le hachage en C : plongée au cœur de SHA-256 et MD5

Vous êtes-vous déjà demandé ce qui protège réellement votre vie numérique ? De vos transactions bancaires à vos mots de passe, les héros méconnus de cette sécurité sont les fonctions de hachage cryptographique. Aujourd'hui, je lève le voile sur deux poids lourds du domaine : MD5 et SHA-256. Et nous n'allons pas nous contenter de théorie — nous allons mettre les mains dans le cambouis avec du code C.

J'ai même mis à disposition un dépôt GitHub contenant l'implémentation complète. Prêt à monter en compétence sur la cryptographie ? C'est parti.

[Explorez l'univers fascinant des fonctions de hachage sur notre dépôt GitHub](https://github.com/jterrazz/42-ssl-md5?source=post_page-----78c17e657794--------------------------------)

## Les fonctions cryptographiques : les gardiennes silencieuses de votre vie numérique

Imaginez les fonctions cryptographiques comme un bouclier invisible de l'univers numérique. Elles travaillent constamment dans l'ombre pour :

- **Garantir l'intégrité des données**, en s'assurant que les fichiers et messages que vous envoyez et recevez sont exactement conformes à l'original.
- **Vérifier les mots de passe de manière sécurisée**, sans jamais stocker le texte en clair.
- Alimenter la **"preuve de travail"** (proof of work), fondamentale pour les cryptomonnaies comme Bitcoin et Ethereum.
- Permettre les **signatures numériques**, l'équivalent en ligne d'une signature juridiquement contraignante.

Ces puissances numériques prennent n'importe quelle entrée que vous leur soumettez — un simple caractère ou un fichier volumineux — et la condensent en une chaîne de caractères de longueur fixe appelée *hash* (empreinte). C'est comme créer une empreinte digitale unique pour vos données.

- **MD5** produit un hash de 128 bits (soit 32 caractères hexadécimaux).
- **SHA-256** génère un hash de 256 bits (64 caractères hexadécimaux).

![Visualisation d'une fonction de hachage](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*aZh9gQlawdGcwSrCO0KOeA.png)

### Les super-pouvoirs d'une bonne fonction de hachage

Une fonction de hachage de qualité possède plusieurs propriétés clés qui en font un véritable couteau suisse cryptographique :

1. **Déterminisme** : Même entrée, même sortie. À chaque fois, sans exception.
2. **Rapidité** : Elles sont conçues pour la performance, calculant les empreintes en un éclair.
3. **Irréversibilité** : Impossible de retrouver l'entrée à partir du hash. C'est un sens unique.
4. **Résistance aux collisions** : Il est pratiquement impossible de trouver deux entrées différentes produisant le même hash.
5. **Effet avalanche** : Modifiez un seul bit de l'entrée, et le hash de sortie change de façon radicale et imprévisible.

## Le match : MD5 contre SHA-256

### MD5 : le vétéran fatigué (qui devrait prendre sa retraite)

MD5 fut un cheval de bataille en son temps, mais son heure est passée. Des vulnérabilités significatives ont été découvertes, notamment face aux "attaques par collision", où des entrées différentes peuvent produire le même hash. Cela le disqualifie pour tout usage lié à la sécurité.

Alors, où peut-on encore croiser MD5 ?

- Comme simple somme de contrôle pour vérifier l'intégrité d'un fichier contre une corruption accidentelle.
- Dans des systèmes anciens ou des applications non critiques où seule la vitesse compte.

**En résumé : n'utilisez pas MD5 pour la sécurité.** C'est comme se présenter à un duel avec un couteau face à des fusils.

### SHA-256 : le standard moderne

SHA-256 fait partie de la famille SHA-2, conçue par la NSA pour succéder à SHA-1 (lui aussi vulnérable). C'est aujourd'hui le standard de l'industrie pour un large éventail d'applications.

SHA-256 est considéré comme sûr car :

- Inverser le hash pour retrouver l'entrée originale est calculatoirement irréalisable.
- Il offre une forte résistance aux collisions, rendant extrêmement difficile de trouver deux entrées avec le même hash.

Cependant, malgré ses atouts, je ne recommanderais pas d'utiliser SHA-256 "brut" pour stocker des mots de passe. Sa rapidité même peut le rendre vulnérable aux attaques par force brute. Pour le hachage de mots de passe, des algorithmes plus lents et plus complexes comme Bcrypt ou Scrypt sont préférables.

## Sous le capot : comment la magie opère

### Étape 1 : préparer le message

Avant qu'une fonction de hachage puisse opérer sa magie, le message d'entrée doit être préparé et complété selon une formule stricte :

1. Le message est découpé en **blocs de 512 bits**.
2. Un bit '1' est ajouté à la fin du message.
3. Des bits '0' sont ajoutés jusqu'à ce que la longueur du message soit à 64 bits d'un multiple de 512.
4. Les 64 bits finaux servent à stocker la longueur du message original.

![Formatage du message](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*6Lplvsky40XwCE3zBhsjOA.png)
_La taille du message formaté doit être un multiple de 512 bits_

Voici comment construire ce message formaté en C :

```c
unsigned char *build_msg(const char *msg, size_t msg_len, size_t formatted_msg_len, bool is_little_endian)
{
    unsigned char  *formatted_msg;
    size_t         cursor;

    if (!(formatted_msg = malloc(formatted_msg_len)))
        return (NULL);

    ft_memcpy(formatted_msg, msg, msg_len);
    formatted_msg[msg_len] = 0b10000000;
    cursor = msg_len + 1;

    while (cursor < formatted_msg_len - 8)
        formatted_msg[cursor++] = 0;

    *(uint64_t *)(formatted_msg + formatted_msg_len - 8) =
        is_little_endian ? (8 * msg_len) : ft_bswap_uint64(8 * msg_len);

    return (formatted_msg);
}
```

Pour obtenir la longueur du message formaté, on peut utiliser une astuce élégante avec les opérations bit à bit pour aligner la longueur sur un multiple de 'X' octets :

```c
aligned = (nb + (X - 1)) & ~(X - 1);
```

Dans notre code, cela donne quelque chose comme :

```c
#define DEC(x) (x - 1)

// Blocs de 512 bits
#define MD5_CHUNK_SIZE 64

// +1 pour le '1' ajouté
// +8 pour la taille sur 64 bits
#define MD5_CHUNKS_SIZE(len) ((len + 1 + 8 + DEC(MD5_CHUNK_SIZE)) & \
~DEC(MD5_CHUNK_SIZE))
#define MD5_CHUNK_COUNT(len) (MD5_CHUNKS_SIZE(len) / MD5_CHUNK_SIZE)

formatted_msg_len = CHUNK_SIZE * CHUNK_COUNT;
```

### Le duel big-endian contre little-endian

Avant d'aller plus loin, un mot sur l'endianness (boutisme). Il s'agit de l'ordre dans lequel les octets sont stockés en mémoire.

- **Little-endian** : L'octet de poids faible est stocké en premier.
- **Big-endian** : L'octet de poids fort vient en premier.

[Plongez plus profondément dans le terrier de l'endianness](https://medium.com/@nonuruzun/little-big-endian-dc9abe36270?source=post_page-----78c17e657794--------------------------------)

Pour passer de l'un à l'autre, on peut utiliser une fonction d'inversion d'octets :

```c
uint64_t  ft_bswap_uint64(uint64_t x)
{
    x = ((x << 8) & 0xFF00FF00FF00FF00ULL) | ((x >> 8) & 0x00FF00FF00FF00FFULL);
    x = ((x << 16) & 0xFFFF0000FFFF0000ULL) | ((x >> 16) &
        0x0000FFFF0000FFFFULL);

    return (x << 32) | (x >> 32);
}
```

Cette fonction réarrange les octets selon un motif d'expansion astucieux.

![Réarrangement des octets](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*i8YyrTUB3CcCpwK2PacC5g.png)

### Étape 2 : la boucle de traitement principale

C'est ici que le travail de fond s'effectue. Les deux algorithmes traitent le message par blocs de 512 bits, mais utilisent un nombre différent de tampons internes :

- MD5 : 4 tampons de 32 bits
- SHA-256 : 8 tampons de 32 bits

Ces tampons sont initialisés avec des valeurs spécifiques puis mis à jour au fil d'une série de tours (rounds). Chaque tour implique un mélange complexe d'opérations bit à bit, d'additions modulaires et de fonctions non linéaires personnalisées.

Pour ceux qui veulent explorer les entrailles des algorithmes :

- [Analyse approfondie de MD5](https://en.wikipedia.org/wiki/MD5?source=post_page-----78c17e657794--------------------------------#Pseudocode)
- [SHA-256 expliqué en détail](https://en.wikipedia.org/wiki/SHA-2?source=post_page-----78c17e657794--------------------------------#Pseudocode)

Ou consultez directement le code C :

- [Implémentation SHA-256](https://github.com/jterrazz/42-ssl-md5/blob/master/src/ft_sha256/sha256.c)
- [Implémentation MD5](https://github.com/jterrazz/42-ssl-md5/blob/master/src/ft_md5/md5.c)

### Le grand final : assembler le hash

Une fois tous les blocs traités, les valeurs finales des tampons sont concaténées pour former le hash.

```c
char *build_hash(uint32_t *buffers, size_t buffer_count, bool is_little_endian)
{
    char      *hash;
    char      *hash_tmp;
    size_t    buffer_i;
    uint32_t  buffer;

    buffer_i = 0;

    if (!(hash = ft_strnew(buffer_count * 8)))
        return (NULL);

    while (buffer_i < buffer_count) {
        buffer = is_little_endian ? ft_bswap_uint32(buffers[buffer_i]) : buffers[buffer_i];

        if (!(hash_tmp = ft_uitoa_base_len(buffer, 16, 'a', 8)))
            return (NULL);

        ft_strncpy(hash + (buffer_i * 8), hash_tmp, 8);
        free(hash_tmp);
        buffer_i++;
    }

    return (hash);
}
```

Une dernière particularité pour MD5 : ses tampons sont au format little-endian, ils doivent donc être inversés avant d'être convertis en chaîne hexadécimale finale.

```c
uint32_t ft_bswap_uint32(uint32_t x)
{
    x = ((x << 8) & 0xFF00FF00) | ((x >> 8) & 0x00FF00FF);

    return (x << 16) | (x >> 16);
}
```

## Un peu perdu ?

Si les détails de SHA-256 vous semblent un peu denses, pas d'inquiétude. J'ai trouvé un excellent guide pas à pas qui décortique tout cela.

- [Guide SHA-256 étape par étape](https://docs.google.com/spreadsheets/d/1mOTrqckdetCoRxY5QkVcyQ7Z0gcYIH-Dc0tu7t9f7tw/edit?source=post_page-----78c17e657794--------------------------------#gid=2107569783)

## Pour conclure

Voilà, vous avez fait le tour des fonctions de hachage cryptographique. Vous avez découvert leur utilité, pourquoi elles sont essentielles à la sécurité numérique, et même comment les construire de zéro.

Le monde de la cryptographie ne reste jamais immobile. Ce qui est sécurisé aujourd'hui pourrait être vulnérable demain. Continuez à apprendre, à expérimenter, et peut-être serez-vous celui qui construira la prochaine génération d'algorithmes sécurisés.

Et n'oubliez pas de jouer avec le code du dépôt GitHub. Il n'y a pas meilleure façon d'apprendre qu'en pratiquant.

Bon hachage !
