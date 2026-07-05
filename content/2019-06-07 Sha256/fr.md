![](assets/thumbnail.jpg)

# SHA-256 et MD5 en C : implémenter des fonctions de hachage de zéro

Qu'est-ce qui protège vraiment votre vie numérique ? Vos transactions bancaires, vos mots de passe... Derrière tout ça, il y a des héros discrets : les fonctions de hachage cryptographique. Aujourd'hui, on va décortiquer deux poids lourds du domaine : MD5 et SHA-256. Et pas juste en théorie — on va coder tout ça en C.

J'ai mis l'implémentation complète sur GitHub si vous voulez fouiller. Prêt à plonger dans la crypto ? C'est parti.

[Le code complet est disponible sur GitHub](https://github.com/jterrazz/42-ssl-md5?source=post_page-----78c17e657794--------------------------------)

## Les gardiennes silencieuses du numérique

Les fonctions de hachage, c'est un peu le bouclier invisible du monde digital. Elles bossent en permanence pour :

- **Garantir l'intégrité des données** — s'assurer que ce que vous envoyez arrive intact.
- **Vérifier les mots de passe** sans jamais stocker le texte en clair.
- Faire tourner la **preuve de travail** (proof of work) des cryptomonnaies comme Bitcoin.
- Rendre possibles les **signatures numériques**, l'équivalent en ligne d'une signature légale.

Le principe : vous leur donnez n'importe quoi — un caractère, un fichier de 10 Go — et elles recrachent une chaîne de taille fixe appelée *hash*. Une sorte d'empreinte digitale de vos données.

- **MD5** : 128 bits (32 caractères hexa).
- **SHA-256** : 256 bits (64 caractères hexa).

![Visualisation d'une fonction de hachage](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*aZh9gQlawdGcwSrCO0KOeA.png)

### Ce qui fait une bonne fonction de hachage

Une fonction de hachage solide possède cinq propriétés essentielles :

1. **Déterministe** : même entrée, même sortie. Toujours.
2. **Rapide** : elle calcule les empreintes en un éclair.
3. **Irréversible** : impossible de retrouver l'entrée à partir du hash. Sens unique.
4. **Résistante aux collisions** : quasi impossible de trouver deux entrées qui donnent le même hash.
5. **Effet avalanche** : un seul bit modifié, et le hash change du tout au tout.

## Le duel : MD5 vs SHA-256

### MD5 : le vétéran sur le déclin

MD5 a fait son temps. Des failles sérieuses ont été découvertes — notamment les "attaques par collision" où deux entrées différentes produisent le même hash. Pour la sécurité, c'est rédhibitoire.

Où le croise-t-on encore ?

- Comme simple checksum pour détecter une corruption de fichier.
- Dans des vieux systèmes où seule la vitesse compte.

**Bref : MD5 pour la sécurité, c'est terminé.** Autant se pointer à un duel au couteau face à des fusils.

### SHA-256 : le standard actuel

SHA-256 appartient à la famille SHA-2, conçue par la NSA pour remplacer SHA-1 (lui aussi compromis). C'est devenu la référence de l'industrie.

Pourquoi il tient la route :

- Retrouver l'entrée à partir du hash est calculatoirement impossible.
- La résistance aux collisions est excellente.

Mais attention : SHA-256 seul n'est pas idéal pour stocker des mots de passe. Justement parce qu'il est rapide, il reste vulnérable aux attaques par force brute. Pour les mots de passe, préférez Bcrypt ou Scrypt — des algos volontairement lents.

## Sous le capot : comment ça marche

### Étape 1 : préparer le message

Avant de hacher quoi que ce soit, il faut formater le message selon des règles précises :

1. On découpe en **blocs de 512 bits**.
2. On ajoute un bit '1' à la fin.
3. On complète avec des '0' jusqu'à être à 64 bits d'un multiple de 512.
4. Les 64 derniers bits stockent la longueur du message original.

![Formatage du message](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*6Lplvsky40XwCE3zBhsjOA.png)
_La taille finale doit être un multiple de 512 bits_

Voici le code C pour construire ce message formaté :

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

Pour calculer la longueur formatée, une astuce bit à bit permet d'aligner sur un multiple de X octets :

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

### Big-endian vs little-endian

Petit aparté sur l'endianness : c'est l'ordre dans lequel les octets sont stockés en mémoire.

- **Little-endian** : l'octet de poids faible en premier.
- **Big-endian** : l'octet de poids fort en premier.

[Pour creuser le sujet](https://medium.com/@nonuruzun/little-big-endian-dc9abe36270?source=post_page-----78c17e657794--------------------------------)

Pour convertir de l'un à l'autre, une fonction d'inversion :

```c
uint64_t  ft_bswap_uint64(uint64_t x)
{
    x = ((x << 8) & 0xFF00FF00FF00FF00ULL) | ((x >> 8) & 0x00FF00FF00FF00FFULL);
    x = ((x << 16) & 0xFFFF0000FFFF0000ULL) | ((x >> 16) &
        0x0000FFFF0000FFFFULL);

    return (x << 32) | (x >> 32);
}
```

Elle réarrange les octets par permutations successives.

![Réarrangement des octets](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*i8YyrTUB3CcCpwK2PacC5g.png)

### Étape 2 : la boucle principale

C'est là que le vrai travail se fait. Les deux algos traitent le message par blocs de 512 bits, mais avec un nombre de tampons différent :

- MD5 : 4 tampons de 32 bits
- SHA-256 : 8 tampons de 32 bits

Ces tampons sont initialisés avec des valeurs précises, puis mis à jour à chaque tour (round). Chaque tour mélange opérations bit à bit, additions modulaires et fonctions non linéaires.

Pour creuser :

- [Pseudocode MD5](https://en.wikipedia.org/wiki/MD5?source=post_page-----78c17e657794--------------------------------#Pseudocode)
- [Pseudocode SHA-256](https://en.wikipedia.org/wiki/SHA-2?source=post_page-----78c17e657794--------------------------------#Pseudocode)

Ou directement le code :

- [Implémentation SHA-256](https://github.com/jterrazz/42-ssl-md5/blob/master/src/ft_sha256/sha256.c)
- [Implémentation MD5](https://github.com/jterrazz/42-ssl-md5/blob/master/src/ft_md5/md5.c)

### Étape 3 : assembler le hash

Une fois tous les blocs traités, on concatène les valeurs finales des tampons pour obtenir le hash.

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

Dernière subtilité pour MD5 : ses tampons sont en little-endian, donc il faut les inverser avant de les convertir en hexa.

```c
uint32_t ft_bswap_uint32(uint32_t x)
{
    x = ((x << 8) & 0xFF00FF00) | ((x >> 8) & 0x00FF00FF);

    return (x << 16) | (x >> 16);
}
```

## Besoin d'un coup de main ?

Si SHA-256 reste obscur, ce guide pas à pas est excellent :

- [Guide SHA-256 détaillé](https://docs.google.com/spreadsheets/d/1mOTrqckdetCoRxY5QkVcyQ7Z0gcYIH-Dc0tu7t9f7tw/edit?source=post_page-----78c17e657794--------------------------------#gid=2107569783)

## En résumé

Voilà le tour des fonctions de hachage. Leur utilité, leur fonctionnement, et comment les coder from scratch.

La crypto évolue sans cesse. Ce qui est sûr aujourd'hui peut être vulnérable demain. Continuez à apprendre, à expérimenter — peut-être que vous concevrez la prochaine génération d'algorithmes.

Et surtout, bidouillez le code sur GitHub. Rien de tel que la pratique.

Bon hachage ! 🔐
